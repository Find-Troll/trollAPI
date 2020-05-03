var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.use('/api/user', require('./userRoutes/user'))
app.use('/api/match', require('./userRoutes/match'))

app.listen(4000, async function () {
    console.log('Successfully Conneted');
  });
