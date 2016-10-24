const express = require('express');
const app = express();

// Set up the pug view engine
app.set('views', './app/views');
app.set('view engine', 'pug');

// Start server on port 3000
app.listen(3000, function() {
  console.log("Server started.");
});

// Serve static assets from "public"
app.use(express.static('public'));

// Serve templates
app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/admin', function(req, res) {
  res.render('admin', {});
});
