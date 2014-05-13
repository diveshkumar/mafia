// groups module.

var redis = require("redis");
var client = redis.createClient();
var users = require('../users') || {};
var myGroups = [];
var Groups = Groups || {};

Groups = (function(Groups, $user) {
	var i = 0;
	var currentUser = $user.getCurrentUser();

	return {
		getGroups : function(req, req, callback) {
			var self = this;
			// Getting all keys for a user
			client.smembers('groups:' + $user.user.phone, function(err, data) {
        callback(data);
			});

			//return self.groups;
		},
		getGroupInfo : function(groupId, callback) {
			// Getting all members related to a specific group.
			dbKey = 'groups:' + $user.user.phone + ':' + groupId + ':members';
      client.smembers(dbKey, function(err, data) {
        callback(data);
			});

		},
		create : function(group, req, res) {
			// Fetching the current groupid.
			var group_count = client.get('groups:gids', function(err, count) {
				if (err) {
					return -1;
				}
				return count;
			});

			// If a group is
			if (!this.isExisting(group)) {
				client.incr("groups:gids");
				group_count += 1;
				console.log(group);
				client.set("groups:group:" + group.group + ":name",
								group.group);

				res.redirect("http://localhost:3000/groups");

			} else {
				res.render('./groups/create', {
					error : "Group is already exists."
				});
			}
		}
	}

	return functions;

})(this, users);

module.exports = Groups;