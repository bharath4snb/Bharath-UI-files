'use strict';

describe('Bridge Controller Test', function () {
  var $controller;
  var $state;
  var $log;
  var $rootScope;
  var statespy;
  var prevStatespy;

  beforeEach(module('ne.views.BridgeModule'));
  beforeEach(module(function ($provide) {
    $provide.service('$state', function () {
      return {
        go: angular.noop
      };
    });
    $provide.service('$rootScope', function () {
      return {
        previousState: angular.noop
      };
    });
  }));

  beforeEach(inject(function (_$controller_, _$log_, _$state_, _$rootScope_) {
    $controller = _$controller_;
    $state = _$state_;
    $log = _$log_;
    $rootScope = _$rootScope_;
    statespy = sinon.spy($state, 'go');
    prevStatespy = sinon.spy($rootScope, 'previousState');
    $controller('bridgeController', { $log: $log, $state: $state, $rootScope: $rootScope});
  }));

  it('checks if $state go is called', function () {
    expect(statespy).to.have.been.called();
  });
  it('should call rootScope.previousState to get the previous state', function () {
    $rootScope.previousState();
    expect(prevStatespy).to.have.been.called();
  });
});