'use strict';
describe('Aggregate Directive', function() {
  var $scope;
  var $controller;
  var searchServiceGet;
  var FIELDS;
  var $log;
  var $compile;
  var $rootScope;
  var defaultTemplate = '<ne-aggregates aggregates="aggs" agg-type="aggType" on-refine="getSearchResults"></ne-aggregates>';
  var UidService;

  beforeEach(module('ne.views.SearchModule'));

  beforeEach(module('modules/views/search/templates/aggregate-template.html'));

  beforeEach(module(function ($provide) {
    $provide.constant('FIELDS', {
      AGGREGATIONS: {
        articles: {
          docs: {val: 'normdoctype.normdoctypenavigator', display: 'Documents'},
          authors: {val: 'authorsrefine.authorsnavigator', display: 'Authors'},
          category: {val: 'category.categorynavigator', display: 'Category'},
          institutions: {val: 'institution.institutionnavigator', display: 'Institutions'}
        },
        people: {

        },
        patents: {

        }

      }
    });

    $provide.service('statisticsGet', function ($q) {
      var get = function () {
        return $q.defer().promise;
      };

      return {
        get: get
      };
    });
    $provide.service('Analytics', function () {
      var trackEvent = function () {
        return;
      };

      return {
        trackEvent: trackEvent
      };
    });
    $provide.value('startFromFilter', function() {
      return;
    });
    $provide.service('searchServiceGet', function($q) {
      var bucket = [];
      var get = function() {
          var defer = $q.defer();
          var data = [{total: '10,000' }];
          defer.resolve(data);

          return defer.promise;
        };
      var getAggragates = function() {
        return $q.defer().promise;
      };

      var getRefines = function() {
          return bucket;
        };

      var resetRefines = function() {
        return;
      };
      var setFilter = function() {
        return;
      };

      var setRefines = function() {
        return;
      };

      var toggleRefines = function(item) {
        var idx = bucket.indexOf(item);
        if (idx > -1) {
          bucket.splice(idx, 1);
        } else {
          bucket.push(item);
        }
      };

      function createFilter() {
        return;
      }
      var setQuery = function() {
        return;
      };

      var getQuery = function() {
        return 'test';
      };

      var getFilter = function() {
        return 'mock';
      };
      return {
        get: get,
        getAggragates: getAggragates,
        getRefines: getRefines,
        toggleRefines: toggleRefines,
        setQuery: setQuery,
        setFilter: setFilter,
        getQuery: getQuery,
        getFilter: getFilter,
        createFilter: createFilter,
        setRefines: setRefines,
        resetRefines: resetRefines
      };
    });
    $provide.service('UidService', function () {
      return {
        getUid: angular.noop
      };
    });
  }));

  beforeEach(function() {
      inject(function(_FIELDS_, _$rootScope_, _searchServiceGet_, _$log_, _$controller_, _$compile_, _UidService_) {
        FIELDS = _FIELDS_;
        $log = _$log_;
        searchServiceGet = _searchServiceGet_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        UidService = _UidService_;
      });
    });

  function compileDirective(template, scope) {
    var elm = angular.element(template);
    $compile(elm)(scope);
    scope.$apply();
    return elm;
  }

  describe('External Template Import', function() {
    it('should include the HTML from the template', function () {
      var elm = compileDirective(defaultTemplate, $scope);
      expect(elm.find('accordion').length).to.equal(1);
    });
  });

  describe('Aggregate Directive logic tests', function() {
    var spy;
    var spy1;
    var spy2;
    var scope;
    var elem;

    beforeEach(inject(function () {
      spy = sinon.spy(searchServiceGet, 'toggleRefines');
      spy1 = sinon.spy(searchServiceGet, 'getFilter');
      spy2 = sinon.spy(searchServiceGet, 'getQuery');

      elem = compileDirective(defaultTemplate, $scope);
      $rootScope.$digest();
      $controller = elem.controller('neAggregates');

      scope = elem.isolateScope();
    }));

    it('expect search service, toggle refines to be called when dir toggle is called', function() {
      $controller.aggType = 'articles';
      $controller.onRefine = function() { return;};
      $controller.toggleRefines(1, FIELDS.AGGREGATIONS.articles.docs);
      expect(spy).to.have.been.called();
    });

    it('expect calling the getAggragates function to work correctly', function() {
      $controller.getAggragates(1, 'mock');
      expect(spy1).to.have.been.called();
      expect(spy2).to.have.been.called();
    });
    it('expects praseResponseOpts to work correctly', function() {
      $controller.aggregates = {
        'normdoctype.normdoctypenavigator_filter': {
           'normdoctype.normdoctypenavigator': {
             buckets: [{
               key: 1
             }]
           }
         },
        'authorsrefine.authorsnavigator_filter': {
           'authorsrefine.authorsnavigator': {
             buckets: [{
               key: 1
             }]
           },
         },
        'category.categorynavigator_filter': {
           'category.categorynavigator': {
             buckets: [{
               key: 1
             }]
           }
         },
        'institution.institutionnavigator_filter': {
           'institution.institutionnavigator': {
             buckets: [{
               key: 1
             }]
           }
         }
      };

      $controller.aggType = 'articles';
      scope.$apply();
      expect($controller.aggs).to.not.be.undefined();
    });
  });

  describe('Toggle refine filters on search view', function () {

    var firstFilter;
    var secondFilter;

    beforeEach(function() {
      var elem = compileDirective(defaultTemplate, $scope);
      $rootScope.$digest();
      $controller = elem.controller('neAggregates');

      /* jshint ignore:start */
      // jscs:disable
      $controller.aggregates = {
        'first_filter': {
          value: 'filter',
          count: 1700
        },
        'second_filter': {
          value: 'filter-2',
          count: 100
        }
      };

      firstFilter = $controller.aggregates.first_filter;
      secondFilter = $controller.aggregates.second_filter;
      // jscs:enable
      /* jshint ignore:end */
    });


    it('Should add an open property to the opened filter and set it to true', function() {

      var testFilter = {
        name: 'first'
      };

      $controller.saveOpenFilter(testFilter);
      expect(firstFilter).to.not.be.undefined();
      expect(firstFilter.open).to.equal(true);
    });

    it('Should add open property to every other filter and set it to true', function() {

      var testFilter = {
        name: 'first'
      };

      $controller.saveOpenFilter(testFilter);

      expect(secondFilter.open).to.not.be.undefined();
      expect(secondFilter.open).to.equal(false);
    });

    it('Should toggle the open property everytime the user open and closes the filter', function() {

      var testFilter = {
        name: 'first'
      };

      $controller.saveOpenFilter(testFilter);

      expect(firstFilter.open).to.equal(true);

      $controller.saveOpenFilter(testFilter);

      expect(firstFilter.open).to.equal(false);

      $controller.saveOpenFilter(testFilter);

      expect(firstFilter.open).to.equal(true);
    });

    it('Should toggle the open property only in the appropiate filter', function() {

      var testFilter = {
        name: 'first'
      };

      var testFilter2 = {
        name: 'second'
      };

      $controller.saveOpenFilter(testFilter);

      expect(firstFilter.open).to.equal(true);
      expect(secondFilter.open).to.equal(false);

      $controller.saveOpenFilter(testFilter2);

      expect(firstFilter.open).to.equal(true);
      expect(secondFilter.open).to.equal(true);

      $controller.saveOpenFilter(testFilter);

      expect(firstFilter.open).to.equal(false);
      expect(secondFilter.open).to.equal(true);
    });
  });

});
