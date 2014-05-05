
/*
 * GET users listing.
 */
var user = require('../users');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.register = function(req, res){
  res.render("./user/register");
};
exports.save = function(req, res){
  // Creating a user.
  user.create(req.body, req, res);
};