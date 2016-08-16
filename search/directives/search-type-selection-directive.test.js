'use strict';
describe('Search type selection directive', function() {
  var $compile;
  var $rootScope;
  var $controller;
  var $scope;
  var elem;
  var defaultTemplate = '<search-type-selector type-change="applyChanges" search-type="searchType" query-counters="queryCounters" is-busy="busy"> </search-type-selector>';

  beforeEach(module('ne.views.SearchModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      SEARCH_TYPE_ENDPOINT: {
        ALL: '/search',
        ARTICLES: '/wos/search',
        PATENTS: '/patents/search',
        PEOPLE: '/people/search',
        POSTS: '/posts/search'
      }
    });

    $provide.service('Analytics', function () {
      var trackEvent = function () {
        return;
      };

      return {
        trackEvent: trackEvent
      };
    });
  }));

  beforeEach(function() {
    inject(function(_$rootScope_, _$compile_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      elem = compileDirective(defaultTemplate, $scope);
      $controller = elem.controller('searchTypeSelector');
    });
  });

  function compileDirective(template, scope) {
     var elm = angular.element(template);
     elm = $compile(elm)(scope);
     scope.$apply();
     return elm;
   }

  describe('External Template Import', function() {
     it('should include the HTML from the template', function () {
       var elm = compileDirective(defaultTemplate, $scope);
       expect(elm.find('li').length).to.equal(5);
     });
   });

  describe('Ensures controller functions work', function() {
     it('expects updatesearchType to return when searchType === value', function() {
       $controller.searchType = 'value';
       var returnVal = $controller.updateSearchType('value');
       expect(returnVal).to.be.an('undefined');
     });
     it('expects typeChange when not busy', function() {
       $controller.typeChange = function() {
         return;
       };
       var spy = sinon.spy($controller, 'typeChange');
       $controller.searchType = 'other val';
       $controller.isBusy = false;
       $controller.updateSearchType('val');
       expect(spy).to.have.been.called();
     });
   });
});
