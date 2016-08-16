'use strict';

(function (angular) {

  angular
    .module('ne.views.BridgeModule')
    .constant('BRIDGE_CONFIG', {
      BRIDGE_ERRORS: {
        errorCode: 'ab-error-101',
        errorMsg: 'SteamID can NOT be found'
      }

    });

})(angular);
