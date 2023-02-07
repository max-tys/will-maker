// https://expressjs.com/
const express = require('express');
const app = express();

// Populate req.body 
app.use(express.urlencoded({ extended: true }))

// Set the public folder
app.use(express.static(__dirname + '/public'));

// Use the EJS templating engine
app.set('view engine', 'ejs');

// All routes are defined in routes.js
const router =  require('./routes/routes');
app.use(router);

app.listen(3000, () => console.log(`Server running on port 3000 at ${(new Date()).toTimeString()}.`));