'use strict';

var BridgeServiceObj;
var mockConfig;
var $httpBackend;

describe('Unit: Testing Bridge Service', function() {
  beforeEach(function() {
    module(function($provide) {
      $provide.constant('CONFIG', {
        AUTHORIZE_URL: '/api/authorize',
        BACK_URL: 'http://local.1p.thomsonreuters.com:6789/#/login/AUTHTOKEN',
        BRIDGE_URL: '/api/bridge/en/tokenbytruid',
        CHECK_EXISTING_EMAIL_URL: '/api/account/user/',
        RESET_PASSWORD_URL: '/api/auth/resetpassword'
      });
    });
    module('ne.views.BridgeModule');
  });

  beforeEach(inject(
    function(CONFIG, BridgeService, _$httpBackend_) {
      mockConfig = CONFIG;
      BridgeServiceObj = BridgeService;
      $httpBackend = _$httpBackend_;
    }));

  it('should call getBridge method', function() {
    var spy = sinon.spy(BridgeServiceObj, 'getBridge');
    BridgeServiceObj.getBridge();
    expect(spy).to.be.called();
  });
});
