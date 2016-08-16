'use strict';

describe('Unit: User Image Dialog Controller', function () {
  var $scope;
  var ctrl;
  var $timeout;
  var Analytics;
  var $q;
  var imageReaderMock = {};
  var $modalInstance;

  beforeEach(angular.mock.module('ne.views.ProfileModule'));

  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance', function () {
      this.close = function () {
        angular.noop();
      };
    });
    $provide.provider('Analytics', function () {
      this.$get = function () {
        var trackEvent = function (category, action) {
          angular.noop(category, action);
        };

        return {
          trackEvent: trackEvent
        };
      };
    });
  }));

  beforeEach(inject(function ($controller, _$timeout_, _$q_, $rootScope, _$modalInstance_, _Analytics_) {
    $timeout = _$timeout_;
    $q = _$q_;
    $scope = $rootScope.$new();
    $modalInstance = _$modalInstance_;
    Analytics = _Analytics_;

    //Create the controller with the new scope
    ctrl = $controller('UserImageDialog', {
      $scope: $scope, $modalInstance: $modalInstance, imageReader: imageReaderMock,
      sizeBounds: {min: 1000, max: 1000000}, widthBounds: {min: 100, max: 1000}, heightBounds: {min: 200, max: 2000}, imageAlt: {title: 'someUser'}
    });
  }));

  it('should contain UserImageDialog controller', function () {
    expect(ctrl).not.to.equal(null);
  });

  it('should initialize as invalid and without error message', function () {
    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).to.equal('');
  });

  it('UserImageDialog should call imageReader on image change', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 5000,
          width: 100,
          height: 200
        });
      });
      return deferred.promise;
    };

    var spy = sinon.spy(imageReaderMock, 'readImage');

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect(spy.calledOnce).to.equal(true);
    expect($scope.isValid()).to.equal(true);
    expect($scope.errorMsg()).to.equal('');
    expect($scope.imageInfo.size).to.equal(5000);
    expect($scope.imageInfo.width).to.equal(100);
    expect($scope.imageInfo.height).to.equal(200);
    expect($scope.imageInfo.src).to.equal('data:image/png;base64,qwertyprofile3');
  });

  it('UserImageDialog should error on image width too small', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 5000,
          width: 50,
          height: 200
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).not.to.equal('');
  });

  it('UserImageDialog should error on image width too big', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 5000,
          width: 1001,
          height: 200
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).not.to.equal('');
  });

  it('UserImageDialog should error on image height too small', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 5000,
          width: 100,
          height: 199
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).not.to.equal('');
  });

  it('UserImageDialog should error on image height too big', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 5000,
          width: 100,
          height: 2001
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).not.to.equal('');
  });

  it('UserImageDialog should error on image file size too small', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 50,
          width: 100,
          height: 200
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).not.to.equal('');
  });

  it('UserImageDialog should error on image file size too big', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 1000001,
          width: 100,
          height: 200
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(false);
    expect($scope.errorMsg()).not.to.equal('');
  });

  it('UserImageDialog should not error on image not too small', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 1000,
          width: 100,
          height: 200
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.$digest();
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(true);
    expect($scope.errorMsg()).to.equal('');
  });

  it('UserImageDialog should not error on image not too big', function () {
    imageReaderMock.readImage = function () {
      var deferred = $q.defer();
      $timeout(function () {
        deferred.resolve({
          src: 'data:image/png;base64,qwertyprofile3',
          size: 100000,
          width: 1000,
          height: 2000
        });
      });
      return deferred.promise;
    };

    $scope.inputFile = 'somefile.png';
    $scope.imageSet();
    $timeout.flush();

    expect($scope.isValid()).to.equal(true);
    expect($scope.errorMsg()).to.equal('');
  });
});
