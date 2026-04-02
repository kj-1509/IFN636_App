const chai     = require('chai');
const sinon    = require('sinon');
const mongoose = require('mongoose');
const Thread   = require('../models/Thread');
const {
  createThread,
  getThreads,
  getThread,
  updateThread,
  deleteThread,
} = require('../controllers/threadController');
const { expect } = chai;

describe('Thread Controller', () => {

  
  describe('createThread', () => {

    it('thread created', async () => {
      const req = {
        body: {
          title:   'Test Title',
          content: 'Test content',
          topic:   'Tech',
        },
        user: { id: 'KelseyTest' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'create').resolves({
        _id:     'thread123',
        title:   'Test Title',
        content: 'Test content',
        topic:   'Tech',
        author:  'KelseyTest',
      });

      await createThread(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      Thread.create.restore();
    });

  });

  
  describe('getThreads', () => {

    it('sreturn all threads', async () => {
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

      Thread.find.restore();
    });

  });

  
  describe('getThread', () => {

    it('404 thread not found', async () => {
      const req = { params: { id: 'nonexistent123' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json:   sinon.stub(),
      };

      sinon.stub(Thread, 'findById').returns({
        populate: sinon.stub().returnsThis(),
        populate: sinon.stub().resolves(null),
      });

      await getThread(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Thread not found' })).to.be.true;

      Thread.findById.restore();
    });

  });

  
  describe('updateThread', () => {

    it('403 user is not the author', async () => {
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
      });

      await updateThread(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'unauthorised' })).to.be.true;

      Thread.findById.restore();
    });

  });

  
  describe('deleteThread', () => {

    it('404 thread not found', async () => {
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

      Thread.findById.restore();
    });

  });

});