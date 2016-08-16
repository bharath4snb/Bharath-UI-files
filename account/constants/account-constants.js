'use strict';

(function (angular) {

  angular
    .module('ne.views.AccountModule')
    .constant('ACCOUNT_CONFIG', {
      EMAIL_OPT_ENDPOINT: '/api/account/auth/settings',
      UNSUBSCRIBE_ENDPOINT: '/api/users/sprefs'

    });

})(angular);
