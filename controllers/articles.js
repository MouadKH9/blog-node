// Loading the modules
const bodyParser = require("body-parser");
const db = require("./db");
const helpers = require("./helpers");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const app = require("../app").app;

let urlencodedParser = bodyParser.urlencoded({ extended: false });

// Exporting the whole class
class Controller {
  setApp() {
    // Connecting to the database
    db.connect();

    app.set("view engine", "ejs");
    var store = new MongoDBStore({
      uri: "mongodb://mouadkh:eminem99@ds121382.mlab.com:21382/myblog-db",
      collection: "mySessions"
    });
    // Set up the session
    app.use(
      session({
        name: "cookie-name",
        secret: "shhht",
        saveUninitialized: true,
        resave: true,
        store: store
      })
    );
    app.use(cookieParser());
  }
  setApi() {
    app.get("/api/articles", (req, res) => {
      db.articleModel
        .find()
        .sort({ _id: "desc" })
        .exec((err, result) => {
          if (err) throw err;
          res.send(result);
        });
    });

    app.get("/api/article/:title", (req, res) => {
      let title = req.params.title;
      title = helpers.trimString(title);
      db.articleModel.find({}, (err, result) => {
        if (err) throw err;
        let found = false;
        result.forEach(el => {
          let tmp = el.title;
          tmp = helpers.trimString(tmp);
          if (tmp === title) {
            res.send(el);
            found = true;
          }
        });
        if (!found) res.send({ error: true });
      });
    });

    app.post("/api/deleteArticle/:id", urlencodedParser, (req, res) => {
      if (!req.body) return false;
      let ok = true;
      db.articleModel.deleteOne({ _id: req.body.id }, err => {
        if (err) ok = false;
        res.send({ ok: ok });
      });
    });

    app.post("/api/article/add", urlencodedParser, (req, res) => {
      if (!req.body) return res.sendStatus(400);

      let data = {
        title: req.body.title,
        article: req.body.article,
        author: req.session.username,
        views: 0,
        date: helpers.getCurrentDate(),
        image: "https://via.placeholder.com/200x200"
      };
      db.addArticle(data);
      res.send({ ok: true });
    });

    app.post("/api/deleteUser/:id", urlencodedParser, (req, res) => {
      if (!req.body) return false;
      let ok = true;
      db.userModel.deleteOne({ _id: req.body.id }, err => {
        if (err) ok = false;
        res.send({ ok: ok });
      });
    });

    app.post("/api/editUser", urlencodedParser, (req, res) => {
      if (!req.body) console.log("error");
      else {
        db.userModel.findByIdAndUpdate(
          req.body.id,
          { level: req.body.newLevel },
          err => {
            if (err) throw err;
          }
        );
      }
    });
  }
  setRoutes() {
    app.use((req, res, next) => {
      if (!req.session.username) {
        if (req.cookies.username) {
          req.session.username = req.cookies.username;
        }
      }
      next();
    });
    app.use((req, res, next) => {
      db.settingsModel.findById(db.settingsId, (err, settings) => {
        if (err) next(err);
        else {
          req.session.settings = settings;
          next();
        }
      });
    });
    app.get("/", (req, res) => {
      fetch("http://localhost:3000/api/articles")
        .then(articles => articles.json())
        .then(articles => {
          res.render("home", {
            session: req.session,
            articles: articles
          });
        });
    });

    app.get("/article/:title", (req, res) => {
      let title = req.params.title;
      fetch("http://localhost:3000/api/article/" + title)
        .then(article => article.json())
        .then(article => {
          if (article.error) {
            res.render("404");
          } else {
            res.render("article", { session: req.session, data: article });
          }
        });
    });

    app.get("/login", (req, res) => {
      if (req.session.email) {
        res.redirect("/");
      } else {
        res.render("login", { session: req.session });
      }
    });

    app.get("/signup", (req, res) => {
      if (req.session.email) {
        res.redirect("/");
      } else {
        res.render("signup", { session: req.session });
      }
    });

    app.post("/login", urlencodedParser, (req, res) => {
      let data = req.body;
      db.userModel.findOne({ email: data.email }, (err, user) => {
        if (err) throw err;
        if (user && user.password === data.password) {
          req.session.email = user.email;
          req.session.username = user.username;
          req.session.level = user.level;
          if (data.stay === "on") {
            res.cookie("username", user.username, {
              maxAge: 1000 * 60 * 60 * 24,
              httpOnly: true
            });
          }
          res.redirect("/");
        } else {
          res.render("login", { error: true });
        }
      });
    });

    app.post("/signup", urlencodedParser, (req, res) => {
      let tmp = new db.userModel({
        username: req.body.username,
        email: req.body.email,
        date: helpers.getCurrentDate(),
        password: req.body.password
      });
      tmp.save(err => {
        if (err) throw err;
        req.session.email = req.body.email;
        req.session.username = req.body.username;
        req.session.level = "reader";
        res.redirect("/");
      });
    });

    app.get("/logout", (req, res) => {
      if (req.session.username) req.session.destroy();
      if (req.cookies.username) res.clearCookie("username");
      res.redirect(req.get("Referrer"));
    });

    app.get("/admin", (req, res) => {
      res.render("admin/template", {
        session: req.session,
        panel: "dashboard",
        data: {}
      });
      // if (req.session.level) {
      //   if (req.session.level != "reader") {
      //     res.render("admin", { session: req.session, panel:"dashboard" });
      //   } else {
      //     res.render("access", { session: req.session });
      //   }
      // } else {
      //   res.render("404", { session: req.session });
      // }
    });
    app.get("/admin/:panel", (req, res) => {
      switch (req.params.panel) {
        case "dashboard":
          res.render("admin/template", {
            session: req.session,
            panel: req.params.panel,
            data: {}
          });
          break;
        case "articles":
          db.articleModel
            .find()
            .sort({ _id: "desc" })
            .exec((err, articles) => {
              if (err) throw err;
              res.render("admin/template", {
                session: req.session,
                panel: req.params.panel,
                data: articles
              });
            });
          break;
        case "add-article":
          res.render("admin/template", {
            session: req.session,
            panel: req.params.panel,
            data: {}
          });
          break;
        case "users":
          db.userModel
            .find()
            .sort({ _id: "desc" })
            .exec((err, users) => {
              if (err) throw err;
              res.render("admin/template", {
                session: req.session,
                panel: req.params.panel,
                data: users
              });
            });
          break;
        case "settings":
          break;
        default:
          res.render("404");
      }
      // if (req.session.level) {
      //   if (req.session.level != "reader") {
      //     res.render("admin", { session: req.session, panel:"dashboard" });
      //   } else {
      //     res.render("access", { session: req.session });
      //   }
      // } else {
      //   res.render("404", { session: req.session });
      // }
    });
  }
}
module.exports = Controller;
