var express = require('express');

// Fancy Express Web Server
// All of my "static" web pages are in the public folder
var app = express();
app.use(express.static(__dirname + '/public'));
var port = process.env.PORT || 3000;
var webServer = app.listen(port);

