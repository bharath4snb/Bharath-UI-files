'use strict';

(function (angular) {

  angular
    .module('ne.views.ProfileModule')
    .service('UserProfileService', UserProfileService);

  UserProfileService.$inject = ['$resource', '$q', '$rootScope', 'CONFIG', 'Analytics', '$stateParams', 'SessionFactory'];

  function UserProfileService($resource, $q, $rootScope, CONFIG, Analytics, $stateParams, SessionFactory) {

    function pushNamePart(nameParts, namePart) {
      if (angular.isUndefined(namePart) ||
        namePart === null ||
        namePart.length < 1 ||
        namePart.match(/^\s+$/)) {
        return nameParts;
      }
      namePart = namePart
        .replace(/^\s+/, '')
        .replace(/\s+$/, '')
        .replace(/\s+/g, ' ');
      nameParts.push(namePart);
      return nameParts;
    }

    function setDefaultTitle(response) {
      if (angular.isUndefined(response.title) ||
        response.title === null ||
        response.title.length < 1 ||
        response.title.match(/^\s+$/)) {
        var nameParts = [];
        nameParts = pushNamePart(nameParts, response.firstName);
        nameParts = pushNamePart(nameParts, response.middleName);
        nameParts = pushNamePart(nameParts, response.lastName);
        response.title = nameParts.join(' ');
      }
      return response;
    }

    function setDefaultTitleFromHttp(response) {
      return setDefaultTitle(angular.fromJson(response));
    }

    function setDefaultTitles(responseFromHttp) {
      var response = angular.fromJson(responseFromHttp);
      if (angular.isArray(response)) {
        response.forEach(function (profile) {
          profile = setDefaultTitle(profile);
        });
      }
      return response;
    }

    var _api = $resource(CONFIG.PROFILE_ENDPOINT, {truid: '@truid'},
      {
        get: {
          method: 'GET',
          url: CONFIG.PROFILE_ENDPOINT + '/:truid',
          params: {
            truid: '@truid'
          },
          transformResponse: setDefaultTitleFromHttp
        },
        getImage: {
          method: 'GET',
          url: CONFIG.PROFILE_ENDPOINT + '/:truid/image',
          params: {
            truid: '@truid'
          }
        },
        getMany: {
          method: 'GET',
          url: CONFIG.PROFILE_ENDPOINT + '/:truids',
          params: {
            truids: '@truids'
          },
          transformResponse: setDefaultTitles,
          isArray: true
        },
        update: {
          method: 'PUT',
          url: CONFIG.PROFILE_ENDPOINT + '/:truid',
          params: {
            truid: '@truid'
          }
        },
        updateImage: {
          method: 'PUT',
          url: CONFIG.PROFILE_ENDPOINT + '/:truid/image',
          params: {
            truid: '@truid'
          }
        }
      });

    var _get = function (truid) {
      var deferred;
      if (angular.isDefined(truid) && truid !== null) {
        if (angular.isArray(truid)) {
          deferred = $q.defer();
          deferred.reject('Probably wrong method: Only ONE TRUID accepted.');
          return deferred.promise;
        }
        return _api.get({truid: truid, t: Date.now()}).$promise;
      }
      deferred = $q.defer();
      deferred.reject('TRUID required.');
      return deferred.promise;
    };

    var _getImage = function (truid) {
      if (angular.isDefined(truid) && truid !== null) {
        return _api.getImage({truid: truid}).$promise;
      }
      var deferred = $q.defer();
      deferred.resolve(CONFIG.PROFILE_PLACEHOLDER_IMAGE);
      return deferred.promise;
    };

    var _getImagePath = function (truid) {
      if (angular.isDefined(truid) && truid !== null) {
        return CONFIG.PROFILE_ENDPOINT + '/' + truid + '/raw/image';
      }
      return CONFIG.PROFILE_PLACEHOLDER_IMAGE;
    };

    var _getMany = function (truids) {
      if (angular.isDefined(truids) && truids !== null) {
        if (angular.isArray(truids) && truids.length > 1) {
          return _api.getMany({truids: truids.join(',')}).$promise;
        } else {
          return _api.get({truid: truids}).$promise;
        }
      }
      var deferred = $q.defer();
      deferred.reject('TRUIDs required.');
      return deferred.promise;
    };

    var _hasNoInterests = function (data) {
      if (angular.isUndefined(data) || data === null) {
        return true;
      }
      if (angular.isDefined(data.interest) &&
        data.interest !== null &&
        angular.isArray(data.interest) &&
        data.interest.length > 0) {
        return false;
      }
      return true;
    };

    var _getImageSource = function (data) {
      if (angular.isUndefined(data) || data === null || angular.isUndefined(data.imageContent) || data.imageContent === null) {
        return CONFIG.PROFILE_PLACEHOLDER_IMAGE;
      }
      if (data.imageType === 'raw' || data.imageType === 'url') {
        return data.imageContent;
      }
      var imageType = data.imageType === 'jpg' ? 'jpeg' : data.imageType;
      return 'data:image/' + imageType + ';base64,' + data.imageContent;
    };

    var _isBlankSlate = function (data) {
      if (angular.isUndefined(data) || data === null) {
        return true;
      }
      if ((angular.isDefined(data.role) && data.role !== null) ||
        (angular.isDefined(data.primaryInstitution) && data.primaryInstitution !== null) ||
        (angular.isDefined(data.location) && data.location !== null)) {
        return false;
      }
      return true;
    };

    var _update = function (params) {
      var deferred = $q.defer();

      Analytics.trackEvent('profile-edit', 'metadata');

      if (angular.isDefined(params) && params !== null && angular.isDefined(params.truid) && params.truid !== null) {
        _api.update(
          {truid: params.truid},
          params,
          function (response) {
            deferred.resolve(response);
          }, function (error) {
            deferred.reject(error.data);
          });
      } else {
        deferred.reject('TRUID required.');
      }
      return deferred.promise;
    };

    var _updateImage = function (params) {
      var deferred = $q.defer();

      Analytics.trackEvent('profile-edit', 'image');

      if (angular.isDefined(params) && params !== null && angular.isDefined(params.truid) && params.truid !== null) {
        var paramsWithoutTruid = angular.copy(params);
        delete paramsWithoutTruid.truid;
        _api.updateImage(
          {truid: params.truid},
          paramsWithoutTruid,
          function (response) {
            deferred.resolve(response);
          }, function (error) {
            deferred.reject(error.data);
          });
      } else {
        deferred.reject('TRUID required.');
      }
      return deferred.promise;
    };


    function isBrokenProfile(profile) {
      return !angular.isDefined(profile) || !angular.isDefined(profile.truid) || profile.truid.length === 0;
    }

    function handleImageUrl(profile) {
      if (isBrokenProfile(profile)) {
        return handleErrorImageUrl();
      }
      return CONFIG.PROFILE_ENDPOINT + '/' + profile.truid + '/raw/image';
    }

    function handleErrorImageUrl() {
      return CONFIG.PROFILE_PLACEHOLDER_IMAGE;
    }

    // @TODO Use array join
    var _getUserInfo = function (profile) {
      var info = '';
      if (!angular.isDefined(profile)) {
        return info;
      }
      if (profile.role) {
        info += ', ' + profile.role;
      }
      if (profile.primaryInstitution) {
        info += ', ' + profile.primaryInstitution;
      }
      if (profile.location) {
        info += ', ' + profile.location;
      }
      return info.slice(2);
    };

    var _canUserEdit = function () {
      return angular.isDefined($stateParams.truid) && (SessionFactory.userId === $stateParams.truid);
    };

    return {
      get: _get,
      getImage: _getImage,
      getImagePath: _getImagePath,
      getMany: _getMany,
      getImageSource: _getImageSource,
      hasNoInterests: _hasNoInterests,
      isBlankSlate: _isBlankSlate,
      setDefaultTitle: setDefaultTitle,
      setDefaultTitles: setDefaultTitles,
      update: _update,
      updateImage: _updateImage,
      getImageUrl: handleImageUrl,
      getPlaceHolderImageUrl: handleErrorImageUrl,
      getUserInfo: _getUserInfo,
      canUserEdit: _canUserEdit
    };
  }
})
(angular);
