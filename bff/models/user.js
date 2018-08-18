/**
 * Model for user collection
 * @module server/models/user
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
