const User = require("../models/user");

// Render Sign In Page
exports.renderSignin = (req, res) => {
  return res.render("signin");
};

// Render Sign Up Page
exports.renderSignup = (req, res) => {
  return res.render("signup");
};

// Handle Sign In
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndgenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Incorrect Email Or Password" });
  }
};

// Handle Logout
exports.logout = (req, res) => {
  res.clearCookie("token").redirect("/");
};

// Handle Sign Up
exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect("/");
};
