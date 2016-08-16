'use strict';

describe('Search Config', function () {
  var $location;
  var $rootScope;
  var $state;
  var $templateCache;

  beforeEach(module('ne.views.SearchModule'));

  beforeEach(inject(function (_$location_, _$rootScope_, _$state_, _$templateCache_) {
    $location = _$location_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $templateCache = _$templateCache_;

    mockTemplate('modules/views/search/templates/search.html');
  }));

  function goTo(url) {
    $location.url(url);
    $rootScope.$digest();
  }

  function mockTemplate(templateRoute, tmpl) {
    $templateCache.put(templateRoute, tmpl || templateRoute);
  }

  it('should load the search state', function () {
    goTo('/search?query');
    expect($state.current.name).to.equal('search');
  });

});