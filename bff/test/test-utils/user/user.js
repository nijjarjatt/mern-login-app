/**
 * User Utils for tests
 * @module server/tests/utils/user/user
 */

/**
 * @function removeUserByEmail
 * removes user from mongoose db
 * @param {Object} User - User model
 * @param {Object} sampleUser - User object
 * @param {Function} callback - Function to call after removal
 */
let removeUser = (User, sampleUser, callback) => {
	User.remove({ username: sampleUser.username }, (err) => {
		if (err) {
			return callback(err);
		}

		callback();
	});
};

module.exports = {
	removeUser: removeUser
};
