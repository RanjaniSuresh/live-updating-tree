var rethinkdb = require('rethinkdb');
var db = require('./db');
var treeObject = new db();
module.exports = function(socket) {
  treeObject.connectToDb(function(err,connection) {		//creating a new DB connection
  if(err) {
    return callback(true,"Error connecting to database");
  }
  
  rethinkdb.table('tree').changes().run(connection,function(err,cursor) {		//listening to changes in the values
    if(err) {
      console.log(err);
    }    
    cursor.each(function(err,row) {                                   //pass a callback to cursor     
      if(Object.keys(row).length > 0) {
         console.log("Emitting changeFeed: " + JSON.stringify(row));
         if(row.new_val == null){
          socket.broadcast.emit("changeFeed",{"id" : row.old_val.id,"name" : null,    //send a new message to the client
          "upper_bound":null, "lower_bound":null, 
          "number_of_children":null, "children":null});
        }
        else{
        socket.broadcast.emit("changeFeed",{"id" : row.new_val.id,"name" : row.new_val.name, 		//send a new message to the client
		   "upper_bound":row.new_val.upper_bound, "lower_bound":row.new_val.lower_bound, 
		   "number_of_children":row.new_val.number_of_children, "children":row.new_val.children});
      }
      }
    });
  });
  }); 
};