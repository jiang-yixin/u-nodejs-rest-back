const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const UserController = require('../controllers/user');

describe('Auth Controller', function () {
    before(function (done) {
        mongoose
            .connect(
                'mongodb+srv://yjiang:5HDK2vdWnsJwNri2@cluster0-3fkqz.mongodb.net/test-messages?retryWrites=true'
            )
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(() => {
                done();
            });
    });

    it('should send a response with a valid user status for an existing user', function (done) {
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            }
        };
        UserController.getStatus(req, res, () => { }).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new.');
            done();
        });
    });

    after(function (done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});
