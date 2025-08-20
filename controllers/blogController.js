const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

// Render Add Blog Page
exports.renderAddBlog = (req, res) => {
  return res.render("addBlog", { user: req.user });
};

// Create Blog
exports.createBlog = async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
};


// Get Single Blog with Comments
exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  return res.render("readblog", { user: req.user, blog, comments });
};


// Add Comment
exports.addComment = async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
};

