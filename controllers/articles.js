// Loading the modules
const bodyParser = require('body-parser');
const db = require('./db');

let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Exporting the whole class
module.exports = class Articles{

constructor(app) {
// Connecting to the database
db.connect();

app.use((req,res,next)=>{
  if(!req.session.username){
    if(req.cookies.username){
      req.session.username = req.cookies.username;
    }
  }
  next();
});

// Setting the routes
app.get('/',(req,res) => {
  db.articleModel.find({},(err,result)=>{
    if(err) throw err;
    res.render('home',{
      session:req.session,
      articles:result
    });
  });
});

app.get('/article/:title',(req,res) => {
  let title = req.params.title;
  title = title.replace(/\s+/g, '-').toLowerCase();
  if(title=='new'){
    res.render('article-new',{session:req.session});
    console.log(req.session.id);
  }else{
    db.articleModel.find({},(err,result)=>{
      if (err) throw err;
      let found = false;
      result.forEach((el)=>{
        let tmp = el.title;
        tmp = tmp.replace(/\s+/g, '-').toLowerCase();
        if (tmp == title) {
          res.render('article',{session:req.session,data:el});
          found = true;
        }
      });
      if(!found) res.render('404');
    });
  }
});

app.post('/article',urlencodedParser,(req,res) => {
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
  let data = {
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

app.get('/login',(req,res) => {
  if (req.session.email) {
    res.redirect('/');
  }else{
    res.render('login',{session:req.session});
  }
});

app.get('/signup',(req,res) => {
  if (req.session.email) {
    res.redirect('/');
  }else{
    res.render('signup',{session:req.session});
  }
});

app.post('/login',urlencodedParser,(req,res) => {
  let data = req.body;
  console.log(data);
  db.userModel.findOne({email:data.email}, (err,user) => {
    if(err) throw err;
    if(user && user.password === data.password){
      req.session.email = user.email;
      req.session.username = user.username;
      req.session.level = user.level;
      if(data.stay === 'on'){
        res.cookie("username",user.username,{
          maxAge:1000 * 60 * 60 * 24,
          httpOnly: true
        });
      }
      res.redirect('/');
    }else{
      res.render('login',{error:true});
    }
  });
});

app.post('/signup',urlencodedParser ,(req,res) => {
  let tmp = new db.userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  tmp.save((err)=>{
    if(err) throw err;
    req.session.email = req.body.email;
    req.session.username = req.body.username;
    req.session.level = "reader";
    res.redirect('/');
  });
});

app.get('/logout',(req,res) => {
  if(req.session.username) req.session.destroy();
  if(req.cookies.username) res.clearCookie("username");
  res.redirect(req.get('Referrer'));
});
}
}
