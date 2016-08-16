'use strict';

describe('The renameTypeWatchlist filter', function () {

  var $filter;

  beforeEach(module('ne.views.WatchListModule'));

  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_;
  }));

  it('should rename patents', function () {
    var result = $filter('renameTypeWatchlist')('patents');

    expect(result).to.equal('patent');
  });

  it('should rename posts', function () {
    var result = $filter('renameTypeWatchlist')('posts');

    expect(result).to.equal('post');
  });

  it('should rename wos', function () {
    var result = $filter('renameTypeWatchlist')('wos');

    expect(result).to.equal('article');
  });

  it('should not rename unknownType', function () {
    var result = $filter('renameTypeWatchlist')('unknownType');

    expect(result).to.equal('unknownType');
  });
});
