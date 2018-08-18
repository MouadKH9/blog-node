// Loading modules
const express = require('express');
const mongoose = require('mongoose');


// Setting up the app
const app = express();

app.set('view engine','ejs');
app.use('/assets',express.static('assets'));

// Loading the controller
const Articles = require('./controllers/Articles');
var article = new Articles(app);


//starting the server
app.listen(3000,()=>console.log("Started the server at " + 3000));
