//setting up express
const express = require('express');
const mongoose = require('mongoose');
const session = require('client-sessions');
const app = express();
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
app.use(session({
  cookieName: 'session',
  secret: '24919mcioenmjc224919mcioenmjc2iupfjfe',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));
//loading the controllers
const Articles = require('./controllers/Articles');
var article = new Articles(app);
//starting the server
app.listen(3000);
