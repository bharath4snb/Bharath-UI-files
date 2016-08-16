'use strict';
describe('Search Results Directive', function() {
  var $compile;
  var $rootScope;
  var $controller;
  var $scope;
  var elem;

  var defaultTemplate = '<ne-search-results results="searchResults" render="render" load-more="getMore" is-busy="busy"></ne-search-results>';

  beforeEach(module('ne.views.SearchModule'));
  beforeEach(module('modules/views/search/templates/search-results.html'));
  beforeEach(module('modules/views/search/templates/results-metrics.html'));

  beforeEach(function() {
    inject(function(_$rootScope_, _$compile_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      elem = compileDirective(defaultTemplate, $scope);
      $controller = elem.controller('neSearchResults');
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
       expect(elm.find('div').length).to.equal(1);
     });
   });

  describe('Controller functions', function() {
    it('should expect loadMore called when getMore called', function() {
      $controller.loadMore = function() {
        return true;
      };
      var spy = sinon.spy($controller, 'loadMore');
      $controller.getMore();
      expect(spy).to.be.called();
    });
  });
});
