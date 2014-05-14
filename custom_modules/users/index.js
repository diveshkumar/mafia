// Users module.

var redis = require("redis");
var client = redis.createClient();

/**
 * Method to create a user.
 */
var Users = {
    me: [],
	create: function(user, req, res) {
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
		}
		else {
			res.render('./user/register', {
				error : "Entered phone number is already registered."
			});
		}
	},
	setCurrentUser: function(userPhone) {
	},
	getUserByKey : function(key) {
		var redisKey = 'user:' + (key||'') + ':information';
		var User = '';
		var custom = '';
		self = this;
		client.hgetall(redisKey, function(err, data) {
			self.userunique = data;
		});
		return self.userunique;

	},
	getCurrentUser: function() {
		var localStorage = '';
		var userKey = '9650594146';
		var redisKey = 'user:' + (userKey||'') + ':information';
		var self = this;

		client.hgetall(redisKey, function(err, data) {
			self.user = data;
		});

		return self.user;
	}

};


module.exports = Users;