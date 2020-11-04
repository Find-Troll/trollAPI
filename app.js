var express = require('express');
var app = express();
const cors = require('cors')
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.use('/api/user', require('./userRoutes/user'))
app.use('/api/match', require('./userRoutes/match'))
app.use(cors());
app.listen(4000, async function () {
    console.log('Successfully Connected');
  });
