'use strict';

describe('ngEnter Directive', function () {

  var $rootScope;
  var $compile;
  var $scope;
  var elm;
  var handler;
  var mockEvent;

  var defaultTemplate = '<input' +
    '  ng-enter="handler()"' +
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
    $scope.handler = handler = sinon.spy();
    mockEvent = {
      preventDefault: sinon.spy(),
      target: {
        blur: sinon.spy()
      }
    };

    elm = compileDirective(defaultTemplate, $scope);
  }));

  function compileDirective(template, scope) {
    var elm = angular.element(template);
    elm = $compile(elm)(scope);
    scope.$apply();
    return elm;
  }

  ['keydown', 'keypress'].forEach(function (eventType) {

    describe('when ' + eventType + ' is triggered', function () {

      beforeEach(function () {
        mockEvent.type = eventType;
      });

      describe('when "which" is not 13', function () {

        beforeEach(function () {
          mockEvent.which = 14;
          elm.triggerHandler(mockEvent);
        });

        it('should not call event.target.blur()', function () {
          expect(mockEvent.target.blur).not.to.have.been.called();
        });

        it('should not call event.preventDefault()', function () {
          expect(mockEvent.preventDefault).not.to.have.been.called();
        });

        it('should not call the handler', function () {
          expect(handler).not.to.have.been.called();
        });
      });

      describe('when "which" is 13', function () {

        beforeEach(function () {
          mockEvent.which = 13;
          elm.triggerHandler(mockEvent);
        });

        it('should call event.target.blur()', function () {
          expect(mockEvent.target.blur).to.have.been.called();
        });

        it('should call event.preventDefault()', function () {
          expect(mockEvent.preventDefault).to.have.been.called();
        });

        it('should call the handler', function () {
          expect(handler).to.have.been.called();
        });
      });

      describe('when "which" is 13 and blur throws', function () {

        it('should catch it', function () {
          mockEvent.which = 13;
          mockEvent.target.blur = sinon.stub();
          mockEvent.target.blur.throws();
          elm.triggerHandler(mockEvent);

          expect(handler).to.have.been.called();
          expect(mockEvent.target.blur).to.have.been.called();
          expect(mockEvent.preventDefault).to.have.been.called();
        });
      });
    });
  });

});

