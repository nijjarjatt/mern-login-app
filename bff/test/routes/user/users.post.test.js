/**
 * Tests for project-upload endpoints
 * @module server/tests/routes/project-upload.post
 */

//Package imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;

//Utils, Models and Misc imports
const User = require('../../../models/user');
const userUtils = require('../../test-utils/user/user');

//File globals
const mockgoose = new Mockgoose(mongoose);
const removeUser = userUtils.removeUser;
const objectId = mongodb.ObjectID;
const should = chai.should();

let server, superTest;

chai.use(chaiHttp);

//Initialisation before every test
beforeEach(() => {
	samplePassword = "jhkwdhfkh";
});

//Initialisation at the start of all tests
before((done) => {
	mockgoose.prepareStorage().then(function() {
		mongoose.createConnection('mongodb://localhost:27017/login');
		server = require('../../../server/index');
		superTest = require('supertest')(server);
		done();
	});
});

//Finalisation at the end of all tests
after((done) => {
	mockgoose.helper.reset().then((err) => {
		if (err) {
			return done(err);
		}
		done();
	});
});

describe('POST /users endpoint', () => {
	it("should expect 'password' to be a required parameter", (done) => {
		//Request body
		let requestDataBody = {
			"username": "test@test.com"
		};

		superTest
			.post('/users')					// Calling the endpoint
			.send(requestDataBody)			// Setting request body
			.expect(400)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});

	it("should expect 'password' to be a required parameter of type string", (done) => {
		//Request body
		let requestDataBody = {
			"username": "test@test.com",
			"password": 2222
		};

		superTest
			.post('/users')					// Calling the endpoint
			.send(requestDataBody)			// Setting request body
			.expect(400)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});

	it("should expect 'username' to be a required parameter", (done) => {
		//Request body
		let requestDataBody = {
			"password": "test123"
		};

		superTest
			.post('/users')					// Calling the endpoint
			.send(requestDataBody)			// Setting request body
			.expect(400)
			.end((err) => {
				if (err) return done(err);
				done();
				});
	});

	it("should expect 'username' to be a required parameter of type string", (done) => {
		//Request body
		let requestDataBody = {
			"username": 123,
			"password": "test123"
		};

		superTest
			.post('/users')					// Calling the endpoint
			.send(requestDataBody)			// Setting request body
			.expect(400)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});

	it("should create a user if valid username and password are provided as the body parameters", (done) => {
		//Request body
		let requestDataBody = {
			"username": "bob",
			"password": "test123"
		};

		superTest
			.post('/users')					// Calling the endpoint
			.send(requestDataBody)			// Setting request body
			.expect(201)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});

	it('should return a 400 if user already exists', (done) => {
		let id = new objectId();
		let samplePassword = "jhkwdhfkh";
		//Request body
		let authenticateRequestNody = {
			"username": 'test',
			"password": samplePassword
		};
		//Sample user to save
		let sampleUser = {
			username: "test",
			_id: id,
			password: samplePassword
		};
		let user = new User(sampleUser);

		//Saving user to mockgoose
		user.save((err) => {
			if (err) {
				done(err);
			}

			//Start of the test
			superTest
				.post('/users')							// Calling the endpoint
				.send(authenticateRequestNody)			// Setting request body

				.expect(400)
				.end((outErr, res) => {
					// Removing the mockgoose document
					removeUser(User, sampleUser,  (innerErr) => {
						if (outErr) {
							return done(outErr);
						}

						if (innerErr) {
							return done(outErr);
						}

						//Test assertions
						res.body.should.be.instanceof(Object);
						res.body.errorCode.should.be.equal(400);

						done();
					});
				});
		});
	});
});
