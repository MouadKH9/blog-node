// Loading the modules
const mongoose = require('mongoose');

// Making a schema and a model for our documents
let articleModel = mongoose.model('Article',new mongoose.Schema({
  title: String,
  article: String,
  author: String,
  views: Number,
  date: String,
  image: String
}));
let userModel = mongoose.model('User',new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  level:{
      type: String,
      default: "reader"
  }
}));

module.exports.articleModel = articleModel;
module.exports.userModel = userModel;

// Connecting to the database
module.exports.connect = function(){
  mongoose.connect('mongodb://mouadkh:eminem99@ds121382.mlab.com:21382/myblog-db',{ useNewUrlParser: true });
}

// Adding an article to the DB
module.exports.addArticle = (data)=>{
  let newArticle = articleModel(data);
  newArticle.save((err)=>{
    if(err) throw err;
    console.log("Saved!");
  });
}
