"use strict";
var rethinkdb = require('rethinkdb');
var db = require('./db');
var async = require('async');
var dbModel = new db();

class treeView {
    //adding a new factory into the DB
    addNewFactory(treeData,callback){
    async.waterfall([
      function(callback) {
       // var treeObject = new db();
        dbModel.connectToDb(function(err,connection) {
          if(err) {
            return callback(true,"Error connecting to database");
          }
          callback(null,connection);
        });
      },
      function(connection,callback) {
        var childNodes = new Array(treeData.number_of_children);
        for(var i=0;i<treeData.number_of_children;i++){
            childNodes[i]=Math.floor(Math.random() * (treeData.upper_bound - treeData.lower_bound + 1) + treeData.lower_bound);
        }   
        rethinkdb.table('tree').insert({           
           "name": treeData.name,
            "upper_bound": treeData.upper_bound,
            "lower_bound": treeData.lower_bound,
            "number_of_children": treeData.number_of_children,          
            "children": childNodes
            
        }).run(connection,function(err,result) {
          connection.close();
          if(err) {
            return callback(true,"Error happens while adding new factory");
          }
          console.log(result);                  
          callback(null,result);
        });             
        }    
    ],function(err,data) {
      callback(err === null ? false : true,data);
    });
    }
    
    //updating the factory
    updateFactory(treeData,callback){
      console.log("Update");
      console.log(treeData);
      async.waterfall([
      function(callback) {
       // var treeObject = new db();
        dbModel.connectToDb(function(err,connection) {
          if(err) {
            return callback(true,"Error connecting to database");
          }
          callback(null,connection);
        });
      },
      function(connection,callback) {
        rethinkdb.table('tree').get(treeData.id).run(connection,function(err,result) {
          if(err) {           
            return callback(true,"Error fetching data from database");
          }
            if(result.name != treeData.name){
              result.name = treeData.name;
            }             
            result.lower_bound = treeData.lower_bound;        
            result.upper_bound = treeData.upper_bound;
            if(treeData.number_of_children>15){
                return callback(true, "The number of children should not exceed 15");
            }       
            result.number_of_children = treeData.number_of_children;    
            for(var val = 0; val<treeData.number_of_children;val++){
                result.children[val] = Math.floor(Math.random() * (treeData.upper_bound - treeData.lower_bound + 1) + treeData.lower_bound);
            }            
            rethinkdb.table('tree').get(treeData.id).update(result).run(connection,function(err,result) {
            connection.close();
            if(err) {
              return callback(true,"Error updating the name");
            }
            callback(null,result);
          });       
        });
      }
      ],function(err,data) {
      callback(err === null ? false : true,data);
    });
    }
    
    //displaying the factory values
    getFactory(callback){
        async.waterfall([
        function(callback) {       
            dbModel.connectToDb(function(err,connection) {
                if(err) {
                    return callback(true,"Error connecting to database");
                }
                callback(null,connection);
            });
        },
        function(connection,callback) {
            rethinkdb.table('tree').run(connection,function(err,cursor) {
                connection.close();
                if(err) {
                    return callback(true,"Error fetching data from database");
                }
                cursor.toArray(function(err, result) {
                    if(err) {
                        return callback(true,"Error reading cursor");
                    }
                    callback(null,result);
                    //console.log(result);            
                });
            });
        }
    ],function(err,data) {
        callback(err === null ? false : true,data);
    });   
  }
  //deleting the factory values
  deleteFactory(treeData,callback){
    //console.log("deleteFactory");
    //console.log(treeData);
      async.waterfall([
      function(callback) {       
        dbModel.connectToDb(function(err,connection) {
          if(err) {
            return callback(true,"Error connecting to database");
          }
          callback(null,connection);
        });
      },
      function(connection,callback) {
        rethinkdb.table('tree').get(treeData.id).delete().run(connection,function(err,result) {
          connection.close();
          if(err) {
            return callback(true,"Error while deleting a factory");
          }
          callback(null,result);
        });
      }
    ],function(err,data) {
      callback(err === null ? false : true,data);
    });   
  }
  
  
}

module.exports = new treeView();