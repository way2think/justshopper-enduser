import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack, TextField } from "@mui/material";
import StarRating from "./StarRating";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  "@media only screen and (min-width: 320px) and (max-width: 600px)": {
    width: "350px",
  },
};
const save = {
  background: "#dc3237",
  color: "#fff",
  fontFamily: "Poppins",
  "&:hover": {
    background: "#dc3237",
    color: "#fff",
  },
};
const cancel = {
  border: "1px solid #dc3237",
  color: "#dc3237",
  fontFamily: "Poppins",
  "&:hover": {
    border: "1px solid #dc3237",
    color: "#dc3237",
  },
};

export default function ReviewModal({
  title,
  open,
  review: existingReview,
  handleClose,
  handleCreateNewReview,
  handleUpdateReview,
  productName,
  productColor,
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    // console.log("existingReview: ", existingReview);
    if (existingReview) {
      setRating(existingReview.rating);
      setReview(existingReview.review);
    }
  }, [existingReview]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            variant="h5"
            component="h2"
          >
            {title}
          </Typography>
          <hr />
          <StarRating rating={rating} setRating={setRating} />
          <TextField
            multiline
            rows={3}
            label="Description*"
            fullWidth
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <Stack
            spacing={2}
            direction="row"
            justifyContent="end"
            alignItems="center"
            className="mt-4"
          >
            {existingReview ? (
              <>
                <Button
                  variant="contained"
                  sx={save}
                  onClick={() =>
                    handleUpdateReview({
                      rating,
                      review,
                      productName,
                      productColor,
                    })
                  }
                >
                  Update Review
                </Button>
                <Button variant="outlined" sx={cancel} onClick={handleClose}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={save}
                  onClick={() =>
                    handleCreateNewReview({
                      rating,
                      review,
                      productName,
                      productColor,
                    })
                  }
                >
                  Save
                </Button>
                <Button variant="outlined" sx={cancel} onClick={handleClose}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
