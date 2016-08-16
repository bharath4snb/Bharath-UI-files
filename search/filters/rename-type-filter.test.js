'use strict';

describe('The test filter', function () {

  var $filter;

  beforeEach(module('ne.views.SearchModule'));

  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_;
  }));

  it('should rename wos', function () {
    var result = $filter('renameType')('wos');

    expect(result).to.equal('article');
  });

  it('should rename patents', function () {
    var result = $filter('renameType')('patents');

    expect(result).to.equal('patent');
  });

  it('should rename people', function () {
    var result = $filter('renameType')('people');

    expect(result).to.equal('person');
  });

  it('should rename posts', function () {
    var result = $filter('renameType')('posts');

    expect(result).to.equal('post');
  });
});
