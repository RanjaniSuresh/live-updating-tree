var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var db = require('./models/db');

var io = require('socket.io')(http);	//creating a socket instance
var feed;


io.on('connection',function(socket) {	//listen for new socket connections
  feed = require('./models/feeds')(socket);	
});


//adding the controllers
var dbModel = new db();
/**
  Setting up the database and creating table.
*/
dbModel.setupDb();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/view'));
app.use(require('./controllers'));

http.listen(3000, function(){
  console.log('listening on port 3000');
});