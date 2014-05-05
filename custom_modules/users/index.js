// Users module.

var redis = require("redis");
var client = redis.createClient();
var Users = {};

/**
 * Method to create a user.
 */
Users.create = function(user, req, res) {
	// Fetching the current userid.
	var user_count = client.get('users:uids', function(err, count) {
		if (err) {
			return -1;
		}
		return count;
	});

	// If a user is
	if (!this.isExisting(user)) {
		client.incr("users:uids");
		user_count += 1;
		client.set("users:user:" + user.phone + ":name", user.username);
		client.set("users:user:" + user.phone + ":phone", user.phone);
		res.render('./user/register', {
			message : "You are registered successfully."
		});
	} else {
		res.render('./user/register', {
			error : "Entered phone number is already registered."
		});
	}
}

/**
 * Method checking if user exists.
 */
Users.isExisting = function(user) {
	return true;
}

Users.setCurrentUser = function(userPhone) {
	
}

/**
 * Method gets current user.
 */
Users.getCurrentUser = function() {
	return '9650594146';
}

module.exports = Users;