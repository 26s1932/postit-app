import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/PostModel.js";
import dotenv from "dotenv";


dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

const connectString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@postitcluster.iib6g.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=PostITCluster`
mongoose.connect(connectString);

app.listen(process.env.PORT, () => {console.log('You are Connected')})


//app post for register
app.post("/registerUser", async(req,res) => {
    try{
        const user = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          await user.save()
          res.send({user:user, msg:"User data saved successfully"})
    }
    catch(error){
        res.status(500).json({error:"An error occurred"})
   }    
})


//Express Post route for login
app.post("/login", async(req,res) => {
    try{
        const{email, password} = req.body;
        const user = await UserModel.findOne({email:email})
        if(!user){
            res.send({msg:"Could not find the user"})
        }
        else if(user.password !== password){
            res.send({msg:"Authentication Faild"})
        }
        else{
            res.send({user:user, msg:"Login Successful!"})
        }
    }
    catch(error){
        res.status(500).json({msg:"Unexpected error occured"})
    }
})

//POST API-logout
app.post("/logout", async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  });
  

//POST API - savePost
app.post("/savePost", async (req, res) => {
    try {
      const postMsg = req.body.postMsg;
      const email = req.body.email;
  
      const post = new PostModel({
        postMsg: postMsg,
        email: email,
      });
  
      await post.save();
      res.send({ post: post, msg: "Added." });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  });


 //GET API - getPost
app.get("/getPosts", async (req, res) => {
  try {
    // Fetch all posts from the "PostModel" collection, sorted by createdAt in descending order
    const posts = await PostModel.find({}).sort({ createdAt: -1 });

    const countPost = await PostModel.countDocuments({});

    res.send({ posts: posts, count: countPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
  




