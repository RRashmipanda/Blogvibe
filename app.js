const express=require("express");
const path=require("path")
const mongoose=require("mongoose");
const cookieParser = require('cookie-parser');
require('dotenv').config();



const app = express();

// Serve static files
app.use(express.static("public"));

const Blog=require('./models/blog')

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const { checkForAutheticationCookie } = require("./middlewares/authentication");


const PORT=process.env.PORT



mongoose.connect( `${process.env.MONGODB_URI}`)
.then((e)=> console.log("mongodb connected"))


app.set("view engine","ejs")
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAutheticationCookie("token"));
app.use(express.static(path.resolve('./public')))


app.get("/", async(req,res) =>{
    const allBlogs=await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs:allBlogs,
    });
});

app.use("/user",userRoutes )
app.use("/blog",blogRoutes)


app.listen(PORT, ()=> console.log(`Server Started at PORT: ${PORT}`))