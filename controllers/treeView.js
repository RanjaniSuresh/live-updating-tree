var express = require('express');
var router = express.Router();
var treeModel = require('../models/treeView');

router.route('/')
  .get(function(req,res) {
    
	 treeModel.getFactory(function(err,treeResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : treeResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : treeResponse});
    });
  })
  .post(function(req,res) {
   
	var obj = treeModel.addNewFactory(req.body,function(err,treeResponse) {
		if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : treeResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success","data" : treeResponse});
    });
  })
  .put(function(req,res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type' );

	 treeModel.updateFactory(req.body,function(err,treeResponse) {
      if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : treeResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : treeResponse});
    });
  })
  .delete(function(req,res){
	  //code to delete a factory.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type' );
    //console.log("Controller");
    //console.log(req);
	  treeModel.deleteFactory(req.body,function(err,treeResponse){
		   if(err) {
        return res.json({"responseCode" : 1, "responseDesc" : treeResponse});
      }
      res.json({"responseCode" : 0, "responseDesc" : "Success", "data" : treeResponse});
    });
  });

module.exports = router;