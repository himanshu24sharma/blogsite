
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();
mongoose.connect(process.env.MONGO_URL);


const homeStartingContent = "All Blogs";
const postSchema=new mongoose.Schema({
  title:String,
  content:String,
  genre:String
});

const Post=new mongoose.model("Post",postSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.render("index");
});

app.get("/compose",function(req,res){
  res.render("compose")
})

app.get("/home",function(req,res){
  Post.find({}).then(function(posts){
    res.render("home", {

      startingContent: homeStartingContent,
 
      posts: posts
 
      });
 
  })
})

app.post("/compose", function(req, res){
  const post = new Post ({

    title: req.body.postTitle,
 
    content: req.body.postBody,
    genre: _.capitalize (req.body.postGenre)
 
  });

  post.save();
  res.redirect("/");


});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId}).then(function(post){
    res.render("post", {

      title: post.title,

      genre: post.genre,
 
      content: post.content
 
    });
})

});

app.get("/:customGenre",function(req,res){
  const customGenre=_.capitalize(req.params.customGenre);
    Post.find({genre:customGenre}).then(function(foundList){
      if(foundList.length!=0){
        res.render("home", {
          startingContent:"Genre- "+customGenre,
          posts: foundList
     
          });
        }
      else{
        res.send("<h1>Genre Doesnt Exist</h1>");
      }
    })
  
})

app.listen(3001, function() {
    console.log("Server started on port 3001");
  });
