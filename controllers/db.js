// Loading the modules
const mongoose = require('mongoose');

// Making a schema and a model for our documents
var articleModel = mongoose.model('Article',new mongoose.Schema({
  title: String,
  article: String,
  author: String,
  views: Number,
  date: String,
  image: String
}));

module.exports.articleModel = articleModel;

// Connecting to the database
module.exports.connect = function(){
  mongoose.connect('mongodb://mouadkh:eminem99@ds121382.mlab.com:21382/myblog-db',{ useNewUrlParser: true });
}

// Adding an article to the DB
module.exports.addArticle = function(data){
  var newArticle = articleModel(data);
  newArticle.save((err)=>{
    if(err) throw err;
    console.log("Saved!");
  });
}
