'use strict';

describe('Unit: Testing Account Controller ------ ', function () {
  var ctrl;
  var $controller;
  var $rootScope;
  var $window;
  var CONFIG;
  var forceSettingsFail;
  var resetPasswordEndpoint = '/api/auth/resetpassword';
  var $q;
  var SessionFactoryService;
  var SettingsService;

  var MockSessionFactoryService = function() {};

  MockSessionFactoryService.prototype.userId = 'theUserID';
  MockSessionFactoryService.prototype.email = 'theEmail';
  MockSessionFactoryService.prototype.provider = 'facebook';

  var MockSettingsService = function() {};

  MockSettingsService.prototype.getEmailNotificationSettings = function () {
    var deferred = $q.defer();

    if (forceSettingsFail) {
      deferred.reject({});
    } else {
      deferred.resolve({notifications: true});
    }

    return deferred.promise;
  };

  MockSettingsService.prototype.optInOut = function () {
    var deferred = $q.defer();

    if (forceSettingsFail) {
      deferred.reject({});
    } else {
      deferred.resolve({});
    }

    return deferred.promise;
  };

  beforeEach(module('ne.views.AccountModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      ACCOUNT_RESETPASSWORD_ENDPOINT: resetPasswordEndpoint
    });
  }));

  beforeEach(module(function ($provide) {
    $provide.service('SessionFactory', MockSessionFactoryService);

    $provide.service('SettingsService', MockSettingsService);
  }));

  beforeEach(inject(function (_$controller_, _$rootScope_, _CONFIG_, _SessionFactory_, _SettingsService_, _$q_) {
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $q = _$q_;
    SessionFactoryService = _SessionFactory_;
    SettingsService = _SettingsService_;

    CONFIG = _CONFIG_;

    $window = {
      location: {
        href: 'page'
      }
    };

    ctrl = $controller('AccountController', {
      $window: $window,
      CONFIG: CONFIG
    });

    $rootScope.$apply();

  }));

  describe('Controller Initialization', function () {
    it('should initialize a userid property to "theUserID"', function () {
      expect(ctrl.userid).to.exist();
      expect(ctrl.userid).to.equal('theUserID');
    });

    it('should initialize a loginid property to "theEmail"', function () {
      expect(ctrl.loginid).to.exist();
      expect(ctrl.loginid).to.equal('theEmail');
    });

    it('should initialize a resetPassUrl property to CONFIG.ACCOUNT_RESETPASSWORD_ENDPOINT', function () {
      expect(ctrl.resetPassUrl).to.exist();
      expect(ctrl.resetPassUrl).to.equal(CONFIG.ACCOUNT_RESETPASSWORD_ENDPOINT);
    });

    it('should initialize a provider property to "Facebook"', function () {
      expect(ctrl.provider).to.exist();
      expect(ctrl.provider).to.equal('Facebook');
    });

    it('should initialize a providerUrl property to http://www.facebook.com', function () {
      expect(ctrl.providerUrl).to.exist();
      expect(ctrl.providerUrl).to.equal('http://www.facebook.com');
    });

    it('should initialize a provider property to "LinkedIn"', function () {
      MockSessionFactoryService.prototype.provider = 'linkedin';
      var vm = $controller('AccountController', {
        $window: $window,
        CONFIG: CONFIG
      });
      expect(vm.provider).to.exist();
      expect(vm.provider).to.equal('LinkedIn');
    });

    it('should initialize a providerUrl property to http://www.linkedin.com', function () {
      expect(ctrl.providerUrl).to.exist();
      expect(ctrl.providerUrl).to.equal('http://www.linkedin.com');
    });

    it('should call SettingsService.getEmailNotificationSettings', function () {

      var spy = sinon.spy(SettingsService, 'getEmailNotificationSettings');

      $controller('AccountController', {
        $window: $window,
        CONFIG: CONFIG
      });

      $rootScope.$apply();
      expect(spy).to.have.been.called();
    });

    it('should initialize a receiveNotifications property to true after calling SettingsService.getEmailNotificationSettings', function () {
      expect(ctrl.receiveNotifications).to.be.true();
    });

    it('should define callResetPassword function', function () {
      expect(ctrl.callResetPassword).to.exist();
    });

    it('should define isSteamProvider function', function () {
      expect(ctrl.isSteamProvider).to.exist();
    });

    it('should define emailOptInOut function', function () {
      expect(ctrl.emailOptInOut).to.exist();
    });

  });

  describe('Controller Actions', function () {

    it('should change $window.location.href property to reset password endpoint', function () {
      ctrl.callResetPassword();
      expect($window.location.href).to.equal(CONFIG.ACCOUNT_RESETPASSWORD_ENDPOINT + '?uid=' + encodeURIComponent('theUserID'));
    });

    it('should return false if provider property is not "OnePlatform"', function () {
      expect(ctrl.isSteamProvider()).to.be.false();
    });

    it('should return true if provider property is "steam"', function () {
      ctrl.provider = 'steam';
      expect(ctrl.isSteamProvider()).to.be.true();
    });

    it('should toggle receiveNotifications property to false and call the SettingsService.optInOut method', function () {
      var spy = sinon.spy(SettingsService, 'optInOut');
      ctrl.emailOptInOut();
      expect(ctrl.receiveNotifications).to.be.false();
      expect(spy).to.have.been.called();
      ctrl.emailOptInOut();
      expect(ctrl.receiveNotifications).to.be.true();
      expect(spy).to.have.been.called();
    });

  });
});
