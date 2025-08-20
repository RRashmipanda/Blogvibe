const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const blogController = require("../controllers/blogController");

const router = Router();

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// Routes
router.get("/add-new", blogController.renderAddBlog);
router.get("/:id", blogController.getBlogById);
router.post("/comment/:blogId", blogController.addComment);
router.post("/", upload.single("coverImage"), blogController.createBlog);

module.exports = router;
