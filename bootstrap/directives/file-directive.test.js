'use strict';

describe('file Directive', function () {

  var $rootScope;
  var $compile;
  var $scope;
  var elm;
  var mockFile = {
    name: 'whatever.png'
  };

  var defaultTemplate = '<file' +
    '  ng-model="model.file"' +
    '  ></file>';

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

  describe('when directive is initialized', function () {

    it('make its element a file input', function () {
      expect(elm[0].nodeName.toLowerCase()).to.equal('input');
      expect(elm.attr('type')).to.equal('file');
    });
  });

  describe('when change event is triggered (multiple present)', function () {

    it('should set ngModel to the file', function () {
      elm = compileDirective('<file ng-model="model.file" multiple="multiple"></file>', $scope);
      elm[0].files[0] = mockFile;
      elm[0].files[1] = mockFile;
      elm.triggerHandler('change');

      expect($scope.model.file[0]).to.equal(mockFile);
      expect($scope.model.file[1]).to.equal(mockFile);
    });
  });

  describe('when change event is triggered (multiple absent)', function () {

    it('should set ngModel to the file', function () {
      elm[0].files[0] = mockFile;
      elm.triggerHandler('change');

      expect($scope.model.file).to.equal(mockFile);
    });
  });

});

