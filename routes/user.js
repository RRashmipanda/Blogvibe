const {Router} =require("express");
const User = require("../models/user");

const router = Router();




router.get("/signin",(req,res) =>{
    return res.render("signin");
});




router.get("/signup" , (req,res) =>{
    return res.render("signup");
});


router.post("/signin",async (req,res) =>{
    const {email,password} = req.body; 
    try{
    const token= await User.matchPasswordAndgenerateToken(email,password);
    // console.log("token", token);
    return res.cookie("token",token).redirect("/");
    
    }catch(error) {
        return res.render("signin",{
            error: "Incorrect Email Or Password",
        })
    }
});

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: User Sign-in
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       302:
 *         description: Redirects to homepage with a token cookie on success.
 *       200:
 *         description: Incorrect Email or Password (renders signin page with error)
 */

router.post('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/");
})

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout the currently authenticated user
 *     tags:
 *       - User
 *     description: Clears the authentication token cookie and redirects to the homepage.
 *     responses:
 *       302:
 *         description: Successfully logged out and redirected to the homepage.
 *       500:
 *         description: Server error while attempting to logout.
 */


router.post("/signup", async(req,res) =>{
    const {fullName,email,password} =req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});
 
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: User registered successfully, redirected to homepage.
 */


module.exports=router;