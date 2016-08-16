//jscs:disable
//jshint ignore: start
'use strict';

describe('Search Controller', function () {
  var scope;
  var $controller;
  var SearchService;
  var $httpBackend;
  var $q;
  var $rootScope;
  var Analytics;
  var CONFIG;
  var $log;
  var stateParams;
  var state;
  var spy;
  var statisticsGet;
  var UserFollowService;
  var NotificationMock;
  var ScreenSize;
  var UserProfileService;
  var SessionFactory;
  var ENGLISH;

  beforeEach(module('ne.views.SearchModule'));
  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      SEARCH_ENDPOINT: '/api/v2search',
      DETAILS_ENDPOINT: '/api/details',
      AGGREGATE_ENDPOINT: '/api/v2search'
    });
    $provide.value('ENGLISH', {
      profile: {
        search: {
          results: {
            load: {
              more: 'Load {{n}} more'
            }
          }
        }
      },
      search: {
        results: {
          load: {
            more: 'Load {{n}} more'
          }
        }
      }
    });
    $provide.provider('Analytics', function () {

      this.$get = function () {
        var trackEvent = function (category, action) {
          angular.noop(category, action);
        };

        var trackEventFull = function (category, action, label, value) {
          angular.noop(category, action, label, value);
        };

        return {
          trackEvent: trackEvent,
          trackEventFull: trackEventFull
        };
      };
    });

    $provide.service('UserFollowService', function ($q) {
      return {
        follow: function() {
          return $q.defer().promise;
        },
        relationship: function() {
          return $q.defer().promise;
        },
        unfollow: function() {
          return $q.defer().promise;
        }
      };
    });
    $provide.service('UserProfileService', function ($q) {
      return {
        getImage: function() {
          return $q.defer().promise;
        }
      };
    });

    $provide.service('SearchResultsService', function ($q) {
      return {
        amend: function(data) {
          return data;
        },
        getProfiles: function() {
          return $q.defer().promise;
        }
      }
    });

    $provide.service('SearchServiceGet', function($q) {
      var bucket = [];
        var get = function() {
          var defer = $q.defer();
          var data = [{'total': "10,000" }];
          defer.resolve(data);

          return defer.promise;
        }
        var getAggragates = function() {
          return $q.defer().promise;
        };

        var getRefines = function() {
          return bucket;
        }

        var toggleRefines = function(item) {
          var idx = bucket.indexOf(item);
          if (idx > -1) {
            bucket.splice(idx, 1);
          } else {
            bucket.push(item);
          }
        }

        var setQuery = function(){
          return;
        }

        var getTypeCounters = function() {
          return $q.defer().promise;
        }

        function getFilter() {
          return '';
        }

        function getSavedSearchResult() {
          return [1,2,3,4,6,7,8,9,10,11,12];
        }

        function setRefines() {
          return;
        }
        return {
          get: get,
          getAggragates: getAggragates,
          getRefines: getRefines,
          toggleRefines: toggleRefines,
          setQuery: setQuery,
          getFilter: getFilter,
          getTypeCounters: getTypeCounters,
          setRefines: setRefines,
          getSavedSearchResult: getSavedSearchResult
        };
      });

    $provide.service('statisticsGet', function($q) {
        var get = function() {
          return $q.defer().promise;
        };

        return {
          get: get
        };
      });
      $provide.service('ScreenQuery', function($q){
        var on = function(){
          return false;
        };
        return {
          is:on,
          when: on
        };
      });

      $provide.service('SessionFactory', function () {
        return {
          userId: true
        };
      });
  }));

  beforeEach(module('ne.components.UserProfileImageModule', function ($provide) {
    $provide.constant('USER_PROFILE_IMAGE_CONFIG', {
      ENDPOINT: '/media/image',
      PLACEHOLDER: '/modules/components/user-profile-image/img/profile-placeholder.jpg'
    });
  }));

 beforeEach(inject(function (_$rootScope_, _$controller_, _SearchServiceGet_,  _$httpBackend_, _CONFIG_, _Analytics_, _$q_, _$log_, _$state_, _$stateParams_, _statisticsGet_, _UserFollowService_, _UserProfileService_, _ScreenQuery_, _ENGLISH_, _SessionFactory_) {

    scope = _$rootScope_.$new();
    $controller = _$controller_;
    SearchService = _SearchServiceGet_;
    CONFIG = _CONFIG_;
    Analytics = _Analytics_;
    $q  = _$q_;
    $log = _$log_;
    state = _$state_;
    stateParams = _$stateParams_;
    $rootScope = _$rootScope_;
    statisticsGet = _statisticsGet_;
    UserFollowService = _UserFollowService_;
    ScreenSize = _ScreenQuery_;
    ENGLISH = _ENGLISH_;
    SessionFactory = _SessionFactory_;

    NotificationMock = {
      error: function (msg) {
        angular.noop(msg);
      }
    };

    $controller('SearchController', {$scope: scope, $rootScope: $rootScope, searchServiceGet: SearchService, $modal: null, stateParams: {}, UserProfileService: UserProfileService, ENGLISH: ENGLISH, screenSize: ScreenSize, Notification: NotificationMock});
  }));

  describe('Init functions', function() {
    var scopeSpy;
    var searchGet;
    beforeEach(inject(function() {
      var ctrl =$controller('SearchController', {$scope: scope, $rootScope: $rootScope, searchServiceGet: SearchService, $modal: null, stateParams: {}, screenSize: ScreenSize, Notification: NotificationMock});
      scopeSpy = sinon.spy(ctrl, 'newSearch');
      spy = sinon.spy(SearchService, 'getAggragates');
      searchGet = sinon.spy(SearchService, 'get');
      scope.$digest();
    }));
    it('expect injections to be not undefined', function() {
      expect(angular.isArray(scope.searchResults)).to.be.ok();
    });
    it('when stateparam is set, lastQuery = stateparam, and getAggs is called', function() {
      stateParams.query = 'test';
      var ctrl = $controller('SearchController', {$scope: scope, $rootScope: $rootScope, searchServiceGet: SearchService, $modal: null, stateParams: {}, screenSize: ScreenSize, Notification: NotificationMock});
      expect(scope.lastQuery).to.equal('test');
      expect(stateParams.query).to.equal(scope.lastQuery);
      expect(scope.resetQuery).to.equal(scope.lastQuery);
    });
  });

  describe('search controller functions all work correctly', function() {
    var ctrl;
    var scopeSpy;
    beforeEach(inject(function(){
      ctrl = $controller('SearchController', {$scope: scope, $rootScope: $rootScope, searchServiceGet: SearchService, $modal: null, stateParams: {}, screenSize: ScreenSize, Notification: NotificationMock});
      scopeSpy = sinon.spy(ctrl, 'newSearch');
    }))
    it('sort function works correctly', function() {
      scope.sortChanged('test');
      expect(scope.orderBy).to.equal('test');
      expect(scopeSpy).to.have.been.called();
    });

    it('order function works', function() {
      scope.orderChanged('test');
      expect(scope.order).to.equal('test');
      expect(scopeSpy).to.have.been.called();
    });

    it('expect the getMore function to work correctly', function() {
       var spy = sinon.spy(SearchService,'get');
       scope.getMore();
       expect(spy).to.have.been.called();
    });

    it('expects clean lastQuery after getSearchResults is called', function() {
      scope.lastQuery = 'biology\\';
      scope.getSearchResults();
      expect(scope.lastQuery).to.equal('biology');
    });

    it('ensures getMore and getResults race condition is not triggered', function() {
      scope.getSearchResults();
      expect(scope.getMore()).to.equal(false);
      scope.busy = false;
      expect(scope.getMore()).to.equal(undefined);
    });

    it('expects post sortvalue to set state param values', function() {
      scope.setSortValue('POSTS');
      expect(stateParams.searchType).to.equal('POSTS');
      expect(stateParams.sortType).to.equal('sortdate:desc');
    });

    it('expects state to go when setSortValue is called with post', function() {
      var spy = sinon.spy(state, 'go');
      scope.setSortValue('POSTS');
      expect(spy).to.have.been.called();
    });

    it('expects ScreenSize to be called when isRefineCollapsed', function() {
      var spy = sinon.spy(ScreenSize, 'is');
      scope.isRefineCollapsed();
      expect(spy).to.have.been.called();
    });

    it('expects isRefineCollapsed to be false when ScreenSize returns false', function() {
      ScreenSize.is = function() {
        return false;
      };
      var isRefineCollapsed = scope.isRefineCollapsed();
      expect(isRefineCollapsed).to.equal(false);
    });

    it('expects isRefinedCollapsed to be true when ScreenSize returns true', function() {
      ScreenSize.is = function() {
        return true;
      };
      var isRefineCollapsed = scope.isRefineCollapsed();
      expect(isRefineCollapsed).to.equal(true);
    });
  });
});
