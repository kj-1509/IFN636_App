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

  describe('createThread', () => {
    it('should create a thread successfully', async () => {
      const req = {
        body: { title: 'Test Thread', content: 'Test content', topic: 'Tech' },
        user: { id: 'user123' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'create').resolves({
        _id: 'thread123', title: 'Test Thread',
        content: 'Test content', topic: 'Tech', author: 'user123',
      });

      await createThread(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe('getThreads', () => {
    it('should return all threads', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      const sortStub     = sinon.stub().resolves([]);
      const populateStub = sinon.stub().returns({ sort: sortStub });
      sinon.stub(Thread, 'find').returns({ populate: populateStub });

      await getThreads(req, res);
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe('getThread', () => {
    it('should return 404 if thread not found', async () => {
      const req = { params: { id: 'nonexistent123' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      // Mock the full populate chain to return null
      sinon.stub(Thread, 'findById').callsFake(() => {
        return {
          populate: () => ({
            populate: () => Promise.resolve(null)
          })
        };
      });

      await getThread(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('updateThread', () => {
    it('should return 404 if thread not found', async () => {
      const req = {
        params: { id: 'nonexistent' },
        body:   { title: 'Updated' },
        user:   { id: 'user123' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'findById').resolves(null);

      await updateThread(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });

    it('should return 403 if user is not the author', async () => {
      const req = {
        params: { id: 'thread123' },
        body:   { title: 'Updated' },
        user:   { id: 'differentUser' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'findById').resolves({
        _id:     'thread123',
        title:   'Old title',
        content: 'Old content',
        topic:   'Tech',
        author:  { toString: () => 'originalUser' },
      });

      await updateThread(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });
  });

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
    });

    it('should return 403 if user is not the author', async () => {
      const req = {
        params: { id: 'thread123' },
        user:   { id: 'differentUser', role: 'user' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'findById').resolves({
        _id:      'thread123',
        author:   { toString: () => 'originalUser' },
        deleteOne: sinon.stub().resolves(),
      });

      await deleteThread(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });
  });

});