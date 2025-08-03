const {Router} =require("express");
const multer = require('multer');
const path=require("path")

const Blog =require('../models/blog')
const Comment= require("../models/comment")

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    },
  })

  const upload = multer({ storage: storage })

// page render
router.get("/add-new", (req,res)  =>{
    return res.render('addBlog',{
        user: req.user,
    })
})




router.get("/:id", async(req,res) =>{
  const blog = await Blog.findById(req.params.id).populate('createdBy');
 const comments = await Comment.find({blogId: req.params.id}).populate('createdBy');
  return res.render("readblog", {
    user:req.user,
    blog,
    comments,
  });
});

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get details of a single blog post along with its comments.
 *     tags:
 *       - Blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the blog post.
 *         schema:
 *           type: string
 *           example: 664812fc4dd2ac347fb55f12
 *     responses:
 *       200:
 *         description: Returns a rendered blog details page with comments.
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Server error while fetching blog post.
 */


router.post("/comment/:blogId", async(req,res) =>{
   await Comment.create({
     content: req.body.content,
     blogId: req.params.blogId,
     createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

/**
 * @swagger
 * /blog/comment/{blogId}:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags:
 *       - Comment
 *     description: Adds a comment to the specified blog post. Requires the user to be authenticated.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a great post!
 *     responses:
 *       302:
 *         description: Comment added successfully. Redirects to the blog detail page.
 *       400:
 *         description: Bad request — missing or invalid comment content.
 *       500:
 *         description: Server error while adding the comment.
 */




router.post("/", upload.single("coverImage"),async (req,res)  =>{
   const {title,body} = req.body
  const blog=await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`
   });
    return res.redirect(`/blog/${blog._id}`);
});

/**
 * @swagger
 * /blog/:
 *   post:
 *     summary: Create a new blog post
 *     tags:
 *       - Blog
 *     description: Creates a new blog post with a title, body, cover image, and the currently authenticated user as the author.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - coverImage
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog Post
 *               body:
 *                 type: string
 *                 example: This is the content of my first blog post.
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       302:
 *         description: Blog created successfully. Redirects to the created blog's page.
 *       400:
 *         description: Bad request — missing required fields or invalid file.
 *       500:
 *         description: Server error while creating the blog.
 */


module.exports=router;