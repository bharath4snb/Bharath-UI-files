'use strict';

(function (angular) {

  angular
    .module('ne')
    .directive('errorImage', ErrorImageDirective);

  ErrorImageDirective.$inject = [];

  function ErrorImageDirective() {
    return {
      link: linkFn
    };
  }

  function linkFn(scope, element, attrs) {
    element.bind('error', function() {
      if (attrs.src !== attrs.errorImage) {
        attrs.$set('src', attrs.errorImage);
      }
    });
  }
})(angular);
