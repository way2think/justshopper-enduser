import { onAuthStateChanged } from "firebase/auth";
import {
  sendPasswordResetEmail,
  signOutUser,
  signinWithEmailAndPassword,
  signupWithEmailAndPassword,
} from "../services/firebase-auth-http";
import {
  createObjectByParam,
  getObjectByParam,
} from "../services/firestore-http";
import { api } from "./api";
import { auth as firebaseAuth } from "../config/firebase";
import { setUser, setUserLogout } from "../store/userSlice";

const collectionId = "user";

export const auth = api.injectEndpoints({
  endpoints: (build) => ({
    createUserWithEmailAndPassword: build.mutation({
      queryFn: async ({ email, password, userDetail }) => {
        const result = await signupWithEmailAndPassword(email, password);
        const user = result.data;
        if (user) {
          return await createObjectByParam(collectionId, user.uid, userDetail);
        } else {
          // it will return {data: null, error: error object}
          return result;
        }
      },
    }),
    signInWithEmailAndPassword: build.mutation({
      queryFn: async ({ email, password }) => {
        const result = await signinWithEmailAndPassword(email, password);
        const user = result.data;
        if (user) {
          // return await getObjectByParam(collectionId, user.uid);
          return user;
        } else {
          return result;
        }
      },
    }),
    sendPasswordResetEmail: build.mutation({
      queryFn: async ({ email }) => {
        return await sendPasswordResetEmail(email);
      },
    }),
    signOutUser: build.mutation({
      queryFn: async (args, api) => {
        await signOutUser();
        api.dispatch(setUserLogout());
      },
    }),
    onAuthListener: build.query({
      queryFn: async () => ({ data: null }),
      onCacheEntryAdded: async (
        _,
        {
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
          dispatch,
          getState,
        }
      ) => {
        // _ as 1st param, it requried to get 2nd param, but not using, so kept as _
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
              const userDet = await getObjectByParam(collectionId, user.uid);
              if (userDet.data) {
                console.log("user: ", userDet.data);
                // const {
                //   id,
                //   name,
                //   email,
                //   phone,
                //   role,
                //   favourite,
                //   saved_address,
                // } = userDet.data;
                const updatedUser = {
                  ...userDet.data,
                  isAuthenticated: true,
                };
                dispatch(setUser(updatedUser));
                updateCachedData((draft) => updatedUser);
              } else {
                return userDet.error;
              }
            } else {
              console.log("User logged out or not yet logged in");
            }
          });
        } catch (error) {
          console.log("error in tables subscription!", error);
          throw new Error("Something went wrong with tables.");
        }

        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
  }),
});

export const {
  useCreateUserWithEmailAndPasswordMutation,
  useSignInWithEmailAndPasswordMutation,
  useSendPasswordResetEmailMutation,
  useSignOutUserMutation,
  useOnAuthListenerQuery,
} = auth;
