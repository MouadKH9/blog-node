const mongoose = require('mongoose');

var articleModel = mongoose.model('Article',new mongoose.Schema({
  title: String,
  article: String,
  author: String,
  views: Number,
  date: String,
  image: String
}));
module.exports.articleModel = articleModel;
module.exports.connect = function(){
  mongoose.connect('mongodb://mouadkh:eminem99@ds121382.mlab.com:21382/myblog-db',{ useNewUrlParser: true });
}
module.exports.getArticles = function(){
  articleModel.find({},(err,result)=>{
    if (err) throw err;
    return result;
  })
}
module.exports.addArticle = function(data){
  var newArticle = articleModel(data);
  newArticle.save((err)=>{
    if(err) throw err;
    console.log("Saved!");
  });
}
