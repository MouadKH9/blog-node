// Loading the modules
const mongoose = require("mongoose");

let settingsId = "5b829ae2e7179a43f9acd0c2";

// Making a schema and a model for our documents
let articleModel = mongoose.model(
  "Article",
  new mongoose.Schema({
    title: String,
    article: String,
    author: String,
    views: Number,
    date: String,
    image: String
  })
);
let userModel = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    date: String,
    password: String,
    level: {
      type: String,
      default: "reader"
    }
  })
);
let settingsModel = mongoose.model(
  "Settings",
  new mongoose.Schema({
    name: String,
    owner_email: String,
    logo: String
  })
);

module.exports.articleModel = articleModel;
module.exports.userModel = userModel;
module.exports.settingsId = settingsId;
module.exports.settingsModel = settingsModel;
module.exports.mongoose = mongoose;

// Connecting to the database
module.exports.connect = function() {
  return mongoose.connect(
    "mongodb://mouadkh:eminem99@ds121382.mlab.com:21382/myblog-db",
    { useNewUrlParser: true }
  );
};

// Adding an article to the DB
module.exports.addArticle = data => {
  let newArticle = articleModel(data);
  newArticle.save(err => {
    if (err) throw err;
  });
};
