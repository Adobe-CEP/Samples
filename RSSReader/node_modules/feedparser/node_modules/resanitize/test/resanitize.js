describe('resanitize', function (){
  var assert = require('assert')
    , resanitize = require('../');
  describe('feedsportal', function () {
    it('should strip feedsportal ads', function () {
      var item = require('./fixtures/feedsportal.json');
      assert.equal(resanitize(item.original), item.expected);
    });
  });
  describe('unsafe elements', function () {
    it('should strip unsafe elements', function () {
      var item = require('./fixtures/unsafeElements.json');
      assert.equal(resanitize(item.original), item.expected);
    });
  });
  describe('unsafe attributes', function () {
    it('should strip unsafe attributes', function () {
      var items = require('./fixtures/unsafeAttributes.json');
      items.forEach(function (item) {
        assert.equal(resanitize(item.original), item.expected);
      });
    });
  });
  describe('comments', function () {
    it('should strip comments', function () {
      var items = require('./fixtures/comments.json');
      items.forEach(function (item) {
        assert.equal(resanitize.stripComments(item.original), item.expected);
      });
    });
  });
});