import { onAuthStateChanged } from "firebase/auth";
import {
  sendPasswordResetEmail,
  signOutUser,
  signinWithEmailAndPassword,
  signupWithEmailAndPassword,
  updateUserPassword,
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
        // console.log("resulttt----", result);

        const user = result.data;
        if (user) {
          // return await getObjectByParam(collectionId, user.uid);
          return {
            data: "success",
            error: null,
          };
        } else {
          return {
            data: "failed",
            error: result.error,
          };
        }
      },
    }),
    sendPasswordResetEmail: build.mutation({
      queryFn: async ({ email }) => {
        return await sendPasswordResetEmail(email);
      },
    }),
    updatePassword: build.mutation({
      queryFn: async ({ password }) => {
        return await updateUserPassword(password);
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
            // console.log("user: ", user.accessToken);
            if (user) {
              const userDet = await getObjectByParam(collectionId, user.uid);
              // console.log("userDet: ", userDet);
              if (userDet.data) {
                const updatedUser = {
                  ...userDet.data,
                  isAuthenticated: true,
                  accessToken: user.accessToken,
                };
                dispatch(setUser(updatedUser));
                // dispatch(setAuthUser(user));
                updateCachedData((draft) => updatedUser);
              } else {
                await signOutUser(); // no user found then signout, possibly admin
                updateCachedData((draft) => "no record found");
              }
            } else {
              console.log("User logged out or not yet logged in");
              updateCachedData((draft) => "unauthenticated");
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
  useUpdatePasswordMutation,
  useSignOutUserMutation,
  useOnAuthListenerQuery,
} = auth;
