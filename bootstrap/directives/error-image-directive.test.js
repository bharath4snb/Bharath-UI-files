'use strict';

describe('errorImage Directive', function () {

  var $rootScope;
  var $compile;
  var $scope;
  var elm;

  var defaultTemplate = '<img error-image="missing-image.png"' +
    '  ng-src="{{imgUrl}}"' +
    '  >';

  beforeEach(module('ne'));

  beforeEach(module('modules/views/login/templates/login.html'));
  beforeEach(module('modules/views/login/templates/login-view.html'));
  beforeEach(module('modules/views/login/templates/login-footer.html'));
  beforeEach(module('modules/views/login/templates/login-terms-privacy.html'));

  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $scope = $rootScope.$new();

    elm = compileDirective(defaultTemplate, $scope);
  }));

  function compileDirective(template, scope) {
    var elm = angular.element(template);
    elm = $compile(elm)(scope);
    scope.$apply();
    return elm;
  }

  describe('when image exists', function () {

    it('should keep img src', function (done) {
      var goodImage = '/assets/img/favicon/favicon.ico';
      $scope.imgUrl = goodImage;
      elm.on('load', function () {
        expect(elm.attr('src')).to.equal(goodImage);
        done();
      });
      $scope.$apply();
    });
  });

  describe('when image does not exist', function () {

    it('should change img src to error image', function (done) {
      $scope.imgUrl = 'bogus-image.png';
      elm.on('error', function () {
        expect(elm.attr('src')).to.equal('missing-image.png');
        done();
      });
      $scope.$apply();
    });
  });

});

