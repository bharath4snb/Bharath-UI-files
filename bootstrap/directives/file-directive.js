'use strict';

// @TODO Not completely clear on the need for this directive.

(function (angular) {

  angular
    .module('ne')
    .directive('file', FileDirective);

  FileDirective.$inject = [];

  function FileDirective() {
    return {
      restrict: 'E',
      template: '<input type=\'file\' />',
      replace: true,
      require: 'ngModel',
      link: linkFunction
    };

    function linkFunction(scope, element, attr, ctrl) {
      var listener = function () {
        scope.$apply(function () {
          var files = attr.multiple ? element[0].files : element[0].files[0];

          ctrl.$setViewValue(files);
        });
      };
      element.bind('change', listener);
    }
  }

})(angular);
