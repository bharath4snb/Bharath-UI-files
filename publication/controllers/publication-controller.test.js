'use strict';

describe('Record View Controller', function () {
  var scope;
  var httpBackend;
  var searchServiceGet;
  var statisticsGet;
  var stateParams;
  var $controller;
  var $q;
  var Analytics;
  var deferred;
  var CONFIG;
  var citationWatchListService;
  var socialDeferred;
  var RvUtil;

  beforeEach(module('ne.views.PublicationModule'));
  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      CEL: {
        url: 'http://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=TEST&SrcAuth=TestPartner&DestLinkType=FullRecord&DestApp=CEL',
        srcUrl: '&SrcURL=',
        srcDesc: '&SrcDesc=Back+to+Project+Neon',
        UT: '&UT='
      }
    });
    $provide.provider('Analytics', function () {

      this.$get = function () {
        var trackEvent = function (category, action) {
          angular.noop(category, action);
        };

        return {
          trackEvent: trackEvent
        };
      };
    });
    $provide.service('searchServiceGet', function ($q) {
      var get = function () {
        var deferred = $q.defer();
        return deferred.promise;
      };

      var getById = function () {
        deferred = $q.defer();
        return deferred.promise;
      };

      return {
        get: get,
        getById: getById
      };
    });

    $provide.constant('ListId', '1');
    $provide.service('statisticsGet', function ($q) {
      var get = function () {
        var deferred = $q.defer();
        deferred.resolve([{commentCount: 1}]);
        return deferred.promise;
      };
      return {
        get: get
      };

    });
    $provide.service('citationWatchListService', function ($q) {
      var watch = sinon.stub();

      var isWatching = function () {
        var deferred = $q.defer();
        return deferred.promise;
      };

      return {
        add: watch,
        isWatching: isWatching
      };
    });

    $provide.service('socialShareCounter', function ($q) {
      return {
        getTwitterCount: function() {
          socialDeferred = $q.defer();
          return socialDeferred.promise;
        },
        getFacebookCount: function() {
          socialDeferred = $q.defer();
          return socialDeferred.promise;
        },
        getLinkedInCount: function() {
          socialDeferred = $q.defer();
          return socialDeferred.promise;
        }
      };
    });

    $provide.service('RvUtil', function () {
      return {
        parse: function() {
          angular.noop();
        }
      };
    });
  }));
  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _CONFIG_, _$stateParams_, _searchServiceGet_, _$controller_, _$q_, _Analytics_, _statisticsGet_, _citationWatchListService_, _RvUtil_) {
    scope = _$rootScope_.$new();
    httpBackend = _$httpBackend_;
    stateParams = _$stateParams_;
    statisticsGet = _statisticsGet_;
    searchServiceGet = _searchServiceGet_;
    $controller = _$controller_;
    $q = _$q_;
    CONFIG = _CONFIG_;
    Analytics = _Analytics_;
    citationWatchListService = _citationWatchListService_;
    RvUtil = _RvUtil_;
  }));

  describe('RV controller tests', function () {
    beforeEach(inject(function () {
      scope.auth = {
        hasLogin: false
      };
      stateParams.id = 'test';
      $controller('RvCtrl', {
        $scope: scope,
        $stateParams: stateParams,
        searchServiceGet: searchServiceGet,
        $q: $q,
        Analytics: Analytics,
        statisticsGet: statisticsGet,
        CONFIG: CONFIG
      });
    }));
    it('make sure scope id is equal to stateparms id', function () {
      expect(scope.id).to.equal(stateParams.id);
    });
    it('make sure showrecord is default to false', function () {
      expect(scope.showRecord).to.equal(false);
    });

    // @TODO Refactor this test to add value to the suite.
    xit('make sure the promise gets called correctly, show record will be true', function () {
      //jshint ignore: start
      var data = readJSON('mock/get-details-byid.mock.json');
      deferred.resolve(data);
      //jshint ignore: end
      scope.$apply();
      expect(scope.showRecord).to.equal(true);
      expect(scope.WosURL).to.equal('http://gateway.webofknowledge.com/gateway/Gateway.cgi?GWVersion=2&SrcApp=TEST&SrcAuth=TestPartner&DestLinkType=FullRecord&DestApp=CEL&UT=WOS:000075757800011&SrcURL=http%3A%2F%2Fserver%2F&SrcDesc=Back+to+Project+Neon');
    });

    it('make sure WosURL is hidden when no data sent', function () {
      //jshint ignore: start
      var data = {};
      deferred.resolve(data);
      //jshint ignore: end
      scope.$apply();
      expect(scope.record).to.be.undefined();
      expect(scope.WosURL).to.be.undefined();
    });

    it('Make sure statistics are gotten correctly', function () {
      scope.$apply();
      expect(scope.commentCount).to.equal(1);
    });

  });

  describe('RV controller when auth exists', function () {
    var spy;
    beforeEach(inject(function () {
      scope.auth = {
        hasLogin: true
      };
      spy = sinon.spy(Analytics, 'trackEvent');
      $controller('RvCtrl', {
        $scope: scope,
        $stateParams: stateParams,
        searchServiceGet: searchServiceGet,
        $q: $q,
        Analytics: Analytics
      });
    }));
    it('expect Analytics to be called when we are authed', function () {
      //jshint ignore: start
      var data = readJSON('mock/get-details-byid.mock.json');
      deferred.resolve(data);
      //jshint ignore: end
      scope.$apply();
      expect(spy).to.have.been.called();
    });
  });
});
