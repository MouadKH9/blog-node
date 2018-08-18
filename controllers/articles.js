// Loading the modules
const bodyParser = require('body-parser');
const session = require('client-sessions');
const db = require('./db');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Exporting the whole class
module.exports = class Articles{

  constructor(app) {
    // Connecting to the database
    db.connect();

    // Setting the routes
    app.get('/',(req,res)=>{
      db.articleModel.find({},(err,result)=>{
        if(err) throw err;
        res.render('home',{articles:result});
      });
    });

    app.get('/article/:title',(req,res)=>{
      let title = req.params.title;
      title = title.replace(/\s+/g, '-').toLowerCase();
      if(title=='new'){
        res.render('article-new');
      }else{
        db.articleModel.find({},(err,result)=>{
          if (err) throw err;
          let found = false;
          result.forEach((el)=>{
            let tmp = el.title;
            tmp = tmp.replace(/\s+/g, '-').toLowerCase();
            if (tmp == title) {
              res.render('article',{data:el});
              found = true;
            }
          });
          if(!found) res.render('404');
        });
      }
    });

    app.post('/article',urlencodedParser,(req,res)=>{
      if (!req.body) return res.sendStatus(400);
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth()+1; //January is 0!
      let yyyy = today.getFullYear();

      if(dd<10) {
        dd = '0'+dd
      }

      if(mm<10) {
        mm = '0'+mm
      }

      today = dd + '-' + mm + '-' + yyyy;
      var data = {
        title: req.body.title,
        article:req.body.article,
        author:req.body.author,
        views: 0,
        date: today,
        image: "https://via.placeholder.com/200x200"
      }
      db.addArticle(data);
      res.send("200");
    });

    app.get('/login',(req,res)=>{
      res.render('login');
    });
  }

}
