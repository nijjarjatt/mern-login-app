/**
 * Routes for authentication
 * @module server/routes/authentication
 */

//Package imports
const express = require('express');
const joi = require('joi');
const bodyParser = require('body-parser');

//Utils, Models and Misc imports
const User = require('../../models/user');

//File globals
const router = express.Router();
const jsonParser = bodyParser.json();
const joiValidationOptions = {
	language: {
		any: {
			required: '{{key}} is required'
		}
	}
};

/**
 * @api {post} /authenticate Authenticate
 * @apiVersion 1.0.0
 * @apiName Authenticate
 * @apiDescription Authenticate a user against provided username and password
 *
 * @apiParam {String} username Mandatory Username
 * @apiParam {String} password Mandatory Password
 *
 * @apiSuccess (200) {Object} response Success response
 * @apiSuccess (200) {String} response.message Success message
 * @apiSuccess (200) {Number} response.successCode Status code
 *
 * @apiError (401, 400) {Object} response Error response
 * @apiError (401, 400) {Boolean} response.success Error status flag
 * @apiError (401, 400) {String} response.message Error message
 * @apiError (401, 400) {Number} response.errorCode Status code
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "message": "Authorised",
 *   "successCode": 200,
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 OK
 *  {
 *   "message": "Unauthorised",
 *   "errorCode": 401
 *  }
 */
router.post('/authenticate', jsonParser, (req, res) => {
	let bodySchema = joi.object().keys({
		username: joi.string().required(),
		password: joi.string().required()
	});

	// Validate the input, if invalid, throw 400 error
	joi.validate(req.body, bodySchema, joiValidationOptions,  (error) => {
		if (error) {
			let messageDetail = '', errorMsg;

			if ((error.details || []).length > 0 && error.details[0].message) {
				messageDetail = error.details[0].message;
			}

			res.status(400).send({errorCode: 400, message: messageDetail});
		} else {
			authenticateUser(req).then((success) => {
				res.status(success.successCode).send(success);
			}, (error) => {
				res.status(error.errorCode).send(error);
			});
		}
	});
});

/**
 * @function authenticateUser
 * Parses the authenticate request, validates and send the response
 * @param {Object} req Request Promise Object
 * @returns {Object} promise Promise Object
 */
const authenticateUser = (req) => {
	return new Promise((resolve, reject) => {
		// find the user
		User.findOne({
			username: req.body.username,
			password: req.body.password
		}, function(err, user) {
			if (err || !user) {
				rejectWithUnauthorisedError(reject);
			}
			return resolve({
				successCode: 200,
				message: "Authorised"
			});
		});
	});
};

/**
 * @function rejectWithUnauthorisedError
 * Rejects the request with a unauthenticated error
 * @param {Function} reject Reject function
 * @returns {Function} reject Reject function
 */
const rejectWithUnauthorisedError = (reject) => {
	return reject({
		message: 'Not Authorised',
		errorCode: 401
	});
};

module.exports = router;
