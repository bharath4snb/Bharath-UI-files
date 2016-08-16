'use strict';
describe('Sort Search Results Directive', function() {
  var $compile;
  var $rootScope;
  var $controller;
  var $scope;
  var elem;

  var defaultTemplate = '<ne-search-sort on-sort="sortChanged" agg-type="searchType" button-text="sortText" order-filter="orderBy"> </ne-search-sort>';

  beforeEach(module('ne.views.SearchModule'));
  beforeEach(module('modules/views/search/templates/search-dropdown.html'));

  beforeEach(function() {
    inject(function(_$rootScope_, _$compile_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = _$rootScope_.$new();
      elem = compileDirective(defaultTemplate, $scope);
      $controller = elem.controller('neSearchSort');
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
     it('expects sortElements to call onSort', function() {
       $controller.onSort = function() {
         return;
       };
       var spy = sinon.spy($controller, 'onSort');
       $controller.sortElements();
       expect(spy).to.have.been.called();
     });
   });
});
