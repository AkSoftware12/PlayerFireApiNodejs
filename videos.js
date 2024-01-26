const express = require("express");
const router = express.Router();
const { validationResult, body, param, query } = require("express-validator");
const videoController = require("../controllers/videos");
const multer = require("multer"); // Import multer
const { validate } = require("../middlewares/validations"); // Import the validation middleware

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/videos"); // Set the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Set the file name
  },
});
const video = multer({ storage });

// Create a new task
router.post(
  "/create/videos",
  video.array("video", 15),
  [
    body("category").notEmpty().withMessage("category is required"),
    // Add more validation rules for other fields as needed
    body("video").custom((value, { req }) => {
      if (!req.files.length) {
        throw new Error("Video file is required.");
      }
      return true; // Return true if the file is valid
    }),
  ],
  validate,
  videoController.createVideos
);

// List all tasks
router.get("/get/videos", videoController.listVideos);

//category wise listings
router.post(
  "/categoryListings",
  [body("category").notEmpty().withMessage("category is required")],
  validate,
  videoController.categoryListings
);

router.post(
  "/create/short/videos",
  video.array("video", 15),
  [
    body("video").custom((value, { req }) => {
      if (!req.files.length) {
        throw new Error("Video file is required.");
      }
      return true; // Return true if the file is valid
    }),
  ],
  validate,
  videoController.createShortVideos
);
router.post("/get/short/videos", videoController.listShortVideos);
router.post("/get/category/names", videoController.listCategoryNames);
module.exports = router;
