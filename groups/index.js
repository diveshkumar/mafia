// groups module.

var redis = require("redis");
var client = redis.createClient();

var Groups = {};

/**
 * Method to create a group.
 */
Groups.create = function(group, req, res) {
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
		client.set("groups:group:" + group.group + ":name", group.group);

		res.redirect("http://localhost:3000/groups");

	} else {
		res.render('./groups/create', {
			error : "Group is already exists."
		});
	}
}

/**
 * Method fetching existing groups.
 */
Groups.getGroups = function() {
	
}

/**
 * Method checking if group exists.
 */
Groups.isExisting = function(group) {
	return false;
}

module.exports = Groups;