'use strict';

describe('Start From Filter', function () {

  var startFromFilter;
  var $log;

  beforeEach(module('ne'));

  beforeEach(inject(function (_$log_, _startFromFilter_) {
    startFromFilter = _startFromFilter_;
    $log = _$log_;
  }));

  describe('Invalid inputs', function () {

    it('should return the input when the input is a string', function () {
      expect(startFromFilter('string')).to.equal('string');
    });

    it('should return the input when the input is a boolean', function () {
      expect(startFromFilter(true)).to.be.true();
      expect(startFromFilter(false)).to.be.false();
    });

    it('should $log a warning when the filter is used with something other than an array', function () {
      var spy = sinon.spy($log, 'warn');

      startFromFilter('string');

      expect(spy).to.have.been.calledWith('startFrom filter should be used with an array.');
    });

  });

  describe('Valid Input', function () {
    var arrayInput;

    beforeEach(function () {
      arrayInput = [1, 2, 3, 4, 5];
    });

    it('should NOT $log a warning when the filter is used with an array', function () {
      var spy = sinon.spy($log, 'warn');

      startFromFilter(arrayInput);

      expect(spy).to.have.not.been.calledWith('startFrom filter should be used with an array.');
    });

    it('should return the input when no start value is provided', function () {
      expect(startFromFilter(arrayInput)).to.deep.equal(arrayInput);
    });

    it('should return a subset of the input', function () {
      expect(startFromFilter(arrayInput, 3)).to.deep.equal([4, 5]);
    });

  });

});