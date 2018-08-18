/**
 * Routes for user
 * @module server/routes/users
 */

//Package imports
const joi = require('joi');
const bodyParser = require('body-parser');
const express = require("express");

//Utils, Models and Misc imports
const User = require('../../models/user');

//File globals
const router = express.Router();
const jsonParser = bodyParser.json();

/**
 * @api {post} /users PostUser
 * @apiVersion 1.1.0
 * @apiName User
 * @apiDescription Creates a user
 *
 * @apiParam {String} username Mandatory Username
 * @apiParam {String} password Mandatory Password
 *
 * @apiSuccess (201) {Object} response Response object
 * @apiSuccess (201) {String} response.id User Id
 *
 * @apiError (400, 401, 500) {Object} response Error response
 * @apiError (400, 401, 500) {Boolean} response.success Error status flag
 * @apiError (400, 401, 500) {String} response.message Error message
 * @apiError (400, 401, 500) {Number} response.errorCode Status code
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 OK
 * {
 *  "id": "592dd6e2179e152020565b94",
 * }
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 OK
 * {
 *  "message": "Unauthorised",
 *  "errorCode": 401
 * }
 */
router.post('/users', jsonParser, (req, res) => {
	//Schema for body param validation
	let bodySchema = joi.object().keys({
		username: joi.string().required(),
		password: joi.string().required()
	});

	//Validate the input in body params, if invalid, throw 400 error
	joi.validate(req.body, bodySchema, (err) => {
		if (err) {
			let messageDetail = '';

			if ((err.details || []).length > 0 && err.details[0].message) {
				messageDetail = err.details[0].message;
			}

			return res.status(400).send({
				errorCode: 500,
				message: messageDetail
			});
		} else {
			checkUserByName(req.body.username).then(() => {
				createNewUser(req.body.username, req.body.password).then((user) => {
					return res.status(201).send({"id": user._id});
				}, () => {
					return res.status(500).send({
						errorCode: 500,
						message: 'Internal Server Error'
					});
				});
			}, () => res.status(400).send({
					errorCode: 400,
					message: 'Bad Request'
				})
			);
		}
	});
});

/**
 * @function checkUserByName
 * Checks user by name
 * @param {Object} req Request Promise Object
 * @returns {Object} promise Promise Object
 */
const checkUserByName = (name) => {
	return new Promise((resolve, reject) => {
		// find the user
		User.findOne({
			username: name
		}, function(err, user) {
			if (err || user) {
				return reject();
			}
			return resolve();
		});
	});
};

/**
 * @function createNewUser
 * Creates new user
 * @param {String} name User name
 * @param {String} password Password
 * @returns {Object} promise Promise Object
 */
const createNewUser = (name, password) => {
	return new Promise((resolve, reject) => {
		const userToSave = {
			username: name,
			password: password
		};

		User.create(userToSave, (err, newUser) => {
			if (err) return reject();

			return resolve(newUser);
		});
	});
};

module.exports = router;

