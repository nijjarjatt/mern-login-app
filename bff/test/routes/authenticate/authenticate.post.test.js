/**
 * Tests for authenticate endpoints
 * @module server/tests/routes/authenticate.get
 */

//Package imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;

//Config imports

//Utils, Models and Misc imports
const User = require('../../../models/user');
const userUtils = require('../../test-utils/user/user');

//File globals
const objectId = mongodb.ObjectID;
const removeUser = userUtils.removeUser;
const mockgoose = new Mockgoose(mongoose);
const should = chai.should();
let server, superTest;

chai.use(chaiHttp);

//Initialisation at the start of all tests
before((done) => {
	mockgoose.prepareStorage().then(() => {
		console.log('Mockgoose is now ready');

		mongoose.createConnection('mongodb://localhost:27017/login');
		server = require('../../../server/index');
		superTest = require('supertest')(server);

		done();
	}, (err) => {
		console.log('Failed to prepare Mockgoose');
		console.log(err);

		done(err);
	});
});

//Finalisation at the end of all tests
after((done) => {
	console.log('Cleaning up after tests');

	mockgoose.helper.reset().then((err) => {
		if (err) {
			return done(err);
		}
		done();
	});
});

describe('POST /authenticate endpoint', () => {
	it("should expect 'password' to be a required parameter", (done) => {
		//Request body
		let requestDataBody = {
			"username": "test@test.com"
		};

		//Start of the test
		superTest
			.post('/authenticate')					// Calling the endpoint
			.send(requestDataBody)					// Setting request body
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

		//Start of the test
		superTest
			.post('/authenticate')					// Calling the endpoint
			.send(requestDataBody)					// Setting request body
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

		//Start of the test
		superTest
			.post('/authenticate')					// Calling the endpoint
			.send(requestDataBody)					// Setting request body
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

		//Start of the test
		superTest
			.post('/authenticate')					// Calling the endpoint
			.send(requestDataBody)					// Setting request body
			.expect(400)
			.end((err) => {
				if (err) return done(err);
				done();
			});
	});

	it('should validate a invalid username and send a 401 response', (done) => {
		let id = new objectId();
		let samplePassword = "jhkwdhfkh";
		//Request body
		let authenticateRequestNody = {
			"username": id + '@test.com',
			"password": samplePassword
		};
		//Sample user to save
		let sampleUser = {
			username: "test",
			_id: id,
			password: samplePassword,
		};
		let user = new User(sampleUser);

		//Saving user to mockgoose
		user.save((err) => {
			if (err) {
				done(err);
			}

			//Start of the test
			superTest
				.post('/authenticate')					// Calling the endpoint
				.send(authenticateRequestNody)			// Setting request body

				.expect(401)
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
						res.body.errorCode.should.be.equal(401);
						res.body.message.should.be.equal('Not Authorised');

						done();
					});
				});
		});
	});

	it('should validate a invalid password and send a 401 response', (done) => {
		let id = new objectId();
		let samplePassword = "jhkwdhfkh";
		//Request body
		let authenticateRequestNody = {
			"username": id + '@test.com',
			"password": samplePassword + 's'
		};
		//Sample user to save
		let sampleUser = {
			username: "test",
			_id: id,
			password: samplePassword,
		};
		let user = new User(sampleUser);

		//Saving user to mockgoose
		user.save((err) => {
			if (err) {
				done(err);
			}

			//Start of the test
			superTest
				.post('/authenticate')					// Calling the endpoint
				.send(authenticateRequestNody)			// Setting request body

				.expect(401)
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
						res.body.errorCode.should.be.equal(401);
						res.body.message.should.be.equal('Not Authorised');

						done();
					});
				});
		});
	});

	it('should accept a valid username and password and return success', (done) => {
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
				.post('/authenticate')					// Calling the endpoint
				.send(authenticateRequestNody)			// Setting request body

				.expect(200)
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
						res.body.successCode.should.be.equal(200);

						done();
					});
				});
		});
	});
});
