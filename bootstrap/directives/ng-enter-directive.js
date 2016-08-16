'use strict';

(function (angular) {

  angular
    .module('ne')
    .directive('ngEnter', EnterDirective);

  EnterDirective.$inject = [];

  function EnterDirective() {
    return {
      link: linkFunction
    };

    function linkFunction(scope, element, attrs) {
      // @TODO It is unclear how this directive differs from native browser handling of form submission using the Enter key. Consider removing.
      element.bind('keydown keypress', function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);

            try {
              event.target.blur();
            }
            catch (e) {
            }
          });

          event.preventDefault();
        }
      });
    }
  }

})(angular);
