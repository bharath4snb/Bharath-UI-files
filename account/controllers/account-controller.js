'use strict';

(function (angular) {

  angular
    .module('ne.views.AccountModule')
    .controller('AccountController', AccountCtrl);

  AccountCtrl.$inject = ['$window', 'CONFIG', 'SessionFactory', 'SettingsService'];

  function AccountCtrl($window, CONFIG, SessionFactory, SettingsService) {
    var vm = this;
    vm.userid = SessionFactory.userId;
    vm.loginid = SessionFactory.email;
    vm.resetPassUrl =  CONFIG.ACCOUNT_RESETPASSWORD_ENDPOINT;
    vm.provider = SessionFactory.provider;
    vm.receiveNotifications = null;

    SettingsService.getEmailNotificationSettings().then(
      function(data) {
        vm.receiveNotifications = data.notifications;
      },
      function() {
        vm.receiveNotifications = false;
      }
    );

    vm.callResetPassword = function () {
      $window.location.href = CONFIG.ACCOUNT_RESETPASSWORD_ENDPOINT + '?uid=' + encodeURIComponent(vm.userid);
    };
    vm.isSteamProvider = function() {
      return vm.provider === 'steam';
    };
    function formatProvider() {
      if (vm.provider === 'linkedin') {
        vm.provider = 'LinkedIn';
        vm.providerUrl = 'http://www.linkedin.com';
      }
      if (vm.provider === 'facebook') {
        vm.provider = 'Facebook';
        vm.providerUrl = 'http://www.facebook.com';
      }
    }

    vm.emailOptInOut = function () {
      vm.receiveNotifications = !vm.receiveNotifications;
      SettingsService.optInOut(vm.userid, vm.receiveNotifications);
    };

    formatProvider();
  }
})(angular);
