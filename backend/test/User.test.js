const chai     = require('chai');
const sinon    = require('sinon');
const mongoose = require('mongoose');
const User     = require('../models/User');
const { register, login } = require('../controllers/authController');
const { expect } = chai;

describe('Auth Controller', () => {

  
  describe('register', () => {

    it('new user created', async () => {
      const req = {
        body: {
          name:     'Test User',
          email:    'test@buzz.com',
          password: 'password123',
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves({ name: 'Test User', email: 'test@buzz.com' });

      await register(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      User.findOne.restore();
      User.create.restore();
    });

    it('400 email already exists', async () => {
      const req = {
        body: {
          name:     'Test User',
          email:    'test@buzz.com',
          password: 'password123',
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves({ email: 'test@buzz.com' });

      await register(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Email already registered' })).to.be.true;

      User.findOne.restore();
    });

  });

  
  describe('login', () => {

    it('400 user not found', async () => {
      const req = {
        body: {
          email:    'wrong@email.com',
          password: 'password123',
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(User, 'findOne').resolves(null);

      await login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Invalid email or password' })).to.be.true;

      User.findOne.restore();
    });

  });

});