'use strict';

(function (angular) {

  angular
    .module('ne.views.ProfileModule')
    .controller('UserImageDialog', UserImageDialog);

  UserImageDialog.$inject = ['$scope', '$modalInstance', 'Analytics', 'imageReader', 'sizeBounds', 'widthBounds', 'heightBounds', 'imageAlt', '$timeout'];

  function UserImageDialog($scope, $modalInstance, Analytics, imageReader, sizeBounds, widthBounds, heightBounds, imageAlt, $timeout) {
    $scope.imageInfo = null;
    $scope.progress = 0;
    $scope.imageAlt = angular.isDefined(imageAlt) ? imageAlt.title : 'Uploaded image';

    $scope.ok = function () {
      $modalInstance.close([$scope.inputFile, $scope.imageInfo]);
    };

    Analytics.trackEvent('profileimage-ck-image', 'edit');

    $scope.openFileDialog = function () {
      var clickUpload = function() {
        angular.element('#image-dialog-upload').trigger('click');
      };
      $timeout(clickUpload, 0);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss();
    };

    $scope.$on('fileProgress', function (e, progress) {
      $scope.progress = progress.loaded / progress.total;
    });
    $scope.imageSet = function () {
      $scope.imageLoading = true;
      $scope.progress = 0;
      imageReader.readImage($scope.inputFile, $scope).then(function (imageInfo) {
        $scope.imageLoading = false;
        $scope.imageInfo = imageInfo;
      }, function () {
        $scope.imageLoading = false;
      });
    };

    $scope.errorMsg = function () {
      if (!$scope.imageInfo) {
        return '';
      } else if ($scope.imageInfo.size < sizeBounds.min) {
        return 'Image file is too small. Must be at least ' + $scope.bytesToSize(sizeBounds.min);
      } else if ($scope.imageInfo.size > sizeBounds.max) {
        return 'Image file is too large. Must be at most ' + $scope.bytesToSize(sizeBounds.max);
      } else if ($scope.imageInfo.width < widthBounds.min) {
        return 'Image width is too small. Must be at least ' + widthBounds.min + ' pixels';
      } else if ($scope.imageInfo.width > widthBounds.max) {
        return 'Image width is too large. Must be at most ' + widthBounds.max + ' pixels';
      } else if ($scope.imageInfo.height < heightBounds.min) {
        return 'Image height is too small. Must be at least ' + heightBounds.min + ' pixels';
      } else if ($scope.imageInfo.height > heightBounds.max) {
        return 'Image height is too large. Must be at most ' + heightBounds.max + ' pixels';
      }

      return '';
    };

    $scope.isValid = function () {
      return !!$scope.imageInfo && !$scope.errorMsg();
    };

    $scope.bytesToSize = function bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (bytes === 0) {
        return '0 Byte';
      }

      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };
  }

})(angular);
