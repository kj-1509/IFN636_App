const chai    = require('chai');
const sinon   = require('sinon');
const Thread  = require('../models/Thread');
const {
  createThread,
  getThreads,
  getThread,
  updateThread,
  deleteThread,
} = require('../controllers/threadController');
const { expect } = chai;

describe('Thread Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  // Create
  describe('createThread', () => {

    it('should create a thread successfully', async () => {
      const req = {
        body: {
          title:   'Test Thread',
          content: 'Test content',
          topic:   'Tech',
        },
        user: { id: 'user123' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'create').resolves({
        _id:     'thread123',
        title:   'Test Thread',
        content: 'Test content',
        topic:   'Tech',
        author:  'user123',
      });

      await createThread(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

  });

  // Read all
  describe('getThreads', () => {

    it('should return all threads', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'find').returns({
        populate: sinon.stub().returnsThis(),
        sort:     sinon.stub().resolves([
          { title: 'Thread 1', topic: 'Tech' },
          { title: 'Thread 2', topic: 'Gaming' },
        ]),
      });

      await getThreads(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

  });

  // Read one
  describe('getThread', () => {

    it('should return 404 if thread not found', async () => {
  const req = { params: { id: 'nonexistent123' } };
  const res = {
    status: sinon.stub().returnsThis(),
    json:   sinon.stub(),
  };

  sinon.stub(Thread, 'findById').returns({
    populate: sinon.stub().returns({
      populate: sinon.stub().resolves(null),
    }),
  });

  await getThread(req, res);

  expect(res.status.calledWith(404)).to.be.true;
  expect(res.json.calledWith({ message: 'Thread not found' })).to.be.true;  
});

});

  // Update
  describe('updateThread', () => {

    it('should return 403 if user is not the author', async () => {
  const req = {
    params: { id: 'thread123' },
    body:   { title: 'Updated title' },
    user:   { id: 'differentUser' },
  };
  const res = {
    status: sinon.stub().returnsThis(),
    json:   sinon.stub(),
  };

  sinon.stub(Thread, 'findById').resolves({
    _id:    'thread123',
    author: { toString: () => 'originalUser' },
    title:  'Old title',
  });

  await updateThread(req, res);

  expect(res.status.calledWith(403)).to.be.true;
  expect(res.json.calledWith({ message: 'Not authorised' })).to.be.true;
});

  // Delete
  describe('deleteThread', () => {

    it('should return 404 if thread not found', async () => {
      const req = {
        params: { id: 'nonexistent123' },
        user:   { id: 'user123', role: 'user' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'findById').resolves(null);

      await deleteThread(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Thread not found' })).to.be.true;
    });

  });

});
});