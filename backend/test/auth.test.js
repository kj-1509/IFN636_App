const chai    = require('chai');
const sinon   = require('sinon');
const User    = require('../models/User');
const bcrypt  = require('bcryptjs');
const { register, login } = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {

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
      sinon.stub(User, 'create').resolves({ name: 'Test User', email: 'test@buzz.com' });

      await register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
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

      await register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Email already registered' })).to.be.true;
    });

  });

  describe('login', () => {

    it('should return 400 if user not found', async () => {
      const req = {
        body: { email: 'wrong@buzz.com', password: 'password123' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves(null);

      await login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;
    });

    it('should return 400 if password is wrong', async () => {
      const req = {
        body: { email: 'test@buzz.com', password: 'wrongpassword' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves({ email: 'test@buzz.com', password: 'hashedpassword' });
      sinon.stub(bcrypt, 'compare').resolves(false);

      await login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;
    });

  });

});