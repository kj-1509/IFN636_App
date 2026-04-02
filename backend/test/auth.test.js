const chai   = require('chai');
const sinon  = require('sinon');
const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const { registerUser, loginUser } = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {

    it('should create a new user successfully', async () => {
      const req = {
        body: { name: 'Test User', email: 'test@buzz.com', password: 'password123' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
      sinon.stub(User, 'create').resolves({
        name: 'Test User', email: 'test@buzz.com'
      });

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
    });

    it('should return 400 if email already exists', async () => {
      const req = {
        body: { name: 'Test User', email: 'test@buzz.com', password: 'password123' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves({ email: 'test@buzz.com' });

      await registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

  });

});