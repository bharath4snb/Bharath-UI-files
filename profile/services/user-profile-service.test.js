'use strict';

describe('User Profile Service', function () {
  var UserProfileService;
  var $httpBackend;
  var Analytics;
  var $q;
  var $rootScope;
  var $stateParams;
  var CONFIG;
  var mockNow;
  var mockTRUID;

  beforeEach(module('ne.views.ProfileModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('CONFIG', {
      PROFILE_ENDPOINT: '/api/v2users/user',
      PROFILE_PLACEHOLDER_IMAGE: '/modules/components/user-profile-image/img/profile-placeholder.jpg'
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

    $provide.service('SessionFactory', function () {
      this.userId = 'mockUserId';
    });

    $provide.value('$stateParams', {
      truid: undefined
    });

  }));

  beforeEach(inject(function (_UserProfileService_, _$httpBackend_, _CONFIG_, _Analytics_, _$q_, _$rootScope_, _$stateParams_) {
    UserProfileService = _UserProfileService_;
    $httpBackend = _$httpBackend_;
    Analytics = _Analytics_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    CONFIG = _CONFIG_;
    mockNow = 1440781191714;
    mockTRUID = 'c605e52b56e64cb0a3038aa439fbf9ab';

    $stateParams = _$stateParams_;

  }));

  describe('Retrieve user profile by TRUID', function () {
    beforeEach(function () {
      $httpBackend.whenGET(CONFIG.PROFILE_ENDPOINT + '/' + mockTRUID + '?t=' + mockNow)
        .respond({
          email: 'hao.ching@thomsonreuters.com',
          firstName: 'N.',
          hcrIndicator: 'true',
          lastName: 'Ching',
          location: 'Philadelphia, Pennsylvania, USA',
          middleName: 'Hao',
          primaryInstitution: 'Thomson Reuters',
          role: 'UI Developer',
          title: 'N. Hao Ching',
          truid: mockTRUID
        });

      $httpBackend.whenGET(CONFIG.PROFILE_ENDPOINT + '/' + mockTRUID)
        .respond({
          email: 'hao.ching@thomsonreuters.com',
          firstName: 'N.',
          hcrIndicator: 'true',
          lastName: 'Ching',
          location: 'Philadelphia, Pennsylvania, USA',
          middleName: 'Hao',
          primaryInstitution: 'Thomson Reuters',
          role: 'UI Developer',
          title: 'N. Hao Ching',
          truid: mockTRUID
        });

      $httpBackend.whenGET(CONFIG.PROFILE_ENDPOINT + '/' + mockTRUID + ',' + mockTRUID)
        .respond([{
          email: 'hao.ching@thomsonreuters.com',
          firstName: 'N.',
          hcrIndicator: 'true',
          lastName: 'Ching',
          location: 'Philadelphia, Pennsylvania, USA',
          middleName: 'Hao',
          primaryInstitution: 'Thomson Reuters',
          role: 'UI Developer',
          title: 'N. Hao Ching',
          truid: mockTRUID
        }, {
          email: 'hao.ching@thomsonreuters.com',
          firstName: 'N.',
          hcrIndicator: 'true',
          lastName: 'Ching',
          location: 'Philadelphia, Pennsylvania, USA',
          middleName: 'Hao',
          primaryInstitution: 'Thomson Reuters',
          role: 'UI Developer',
          title: 'N. Hao Ching',
          truid: mockTRUID
        }]);

      $httpBackend.whenGET(CONFIG.PROFILE_ENDPOINT + '/xxx-xxx-xxxx?t=' + mockNow)
        .respond(404, '');
    });

    it('should declare a get method', function () {
      expect(UserProfileService.get).to.not.be.undefined();
    });

    it('should return "TRUID required." message if TRUID is not provided', function () {
      UserProfileService.get()
        .catch(function (error) {
          expect(error).to.equal('TRUID required.');
        });
    });

    it('should return "Probably wrong method: Only ONE TRUID accepted."', function () {
      UserProfileService.get([mockTRUID, mockTRUID])
        .catch(function (error) {
          expect(error).to.equal('Probably wrong method: Only ONE TRUID accepted.');
        });
    });

    it('should return a promise when calling get', function () {
      sinon.stub(Date, 'now', function () {
        return mockNow;
      });
      expect(UserProfileService.get(mockTRUID).then).to.not.be.undefined();
      $httpBackend.flush();
      Date.now.restore();
    });

    it('should return "TRUIDs required." if TRUIDs are not provided', function () {
      UserProfileService.getMany().catch(function (error) {
        expect(error).to.equal('TRUIDs required.');
      });
    });

    it('should return a promise when getting many TRUIDs', function () {
      expect(UserProfileService.getMany([mockTRUID, mockTRUID]).then).to.not.be.undefined();
      $httpBackend.flush();
    });

    it('should return a promise when getting a TRUID', function () {
      expect(UserProfileService.getMany(mockTRUID).then).to.not.be.undefined();
      $httpBackend.flush();
    });

    it('should return a promise when getting a TRUID', function () {
      expect(UserProfileService.getMany([mockTRUID]).then).to.not.be.undefined();
      $httpBackend.flush();
    });

    it('should return an error if the TRUID is not found', function () {
      sinon.stub(Date, 'now', function () {
        return mockNow;
      });
      UserProfileService.get('xxx-xxx-xxxx').then(
        angular.noop,
        function (error) {
          expect(error.data).to.equal('');
          expect(error.status).to.equal(404);
        }
      );
      $httpBackend.flush();
      Date.now.restore();
    });
  });

  describe('Update user profile by TRUID', function () {
    beforeEach(function () {
      $httpBackend.whenPUT(CONFIG.PROFILE_ENDPOINT + '/' + mockTRUID)
        .respond({
          email: 'hao.ching@thomsonreuters.com',
          firstName: 'N.',
          hcrIndicator: 'true',
          lastName: 'Ching',
          location: 'Philadelphia, Pennsylvania, USA',
          middleName: 'Hao',
          primaryInstitution: 'Thomson Reuters',
          role: 'UI Developer',
          title: 'N. Hao Ching',
          truid: mockTRUID
        });

      $httpBackend.whenPUT(CONFIG.PROFILE_ENDPOINT + '/xxx-xxx-xxxx')
        .respond(404, '');
    });

    it('should declare an update method', function () {
      expect(UserProfileService.update).to.not.be.undefined();
    });

    it('should return "TRUID required." message if TRUID is not provided', function () {
      UserProfileService.update()
        .catch(function (error) {
          expect(error).to.equal('TRUID required.');
        });
    });

    it('should return a promise when calling update', function () {
      expect(UserProfileService.update({truid: mockTRUID}).then).to.not.be.undefined();
      $httpBackend.flush();
    });

    it('should return an error if the TRUID is not found', function () {
      UserProfileService.update({truid: 'xxx-xxx-xxxx'})
        .catch(function (error) {
          expect(error).to.equal('');
        });
      $httpBackend.flush();
    });
  });

  describe('Update user profile image by TRUID', function () {
    beforeEach(function () {
      $httpBackend.whenPUT(CONFIG.PROFILE_ENDPOINT + '/' + mockTRUID + '/image')
        .respond({
          truid: mockTRUID
        });

      $httpBackend.whenPUT(CONFIG.PROFILE_ENDPOINT + '/xxx-xxx-xxxx/image')
        .respond(404, '');
    });

    it('should declare an updateImage method', function () {
      expect(UserProfileService.updateImage).to.not.be.undefined();
    });

    it('should return "TRUID required." message if TRUID is not provided', function () {
      UserProfileService.updateImage()
        .catch(function (error) {
          expect(error).to.equal('TRUID required.');
        });
    });

    it('should return a promise when calling updateImage', function () {
      expect(UserProfileService.updateImage({truid: mockTRUID}).then).to.not.be.undefined();
      $httpBackend.flush();
    });

    it('should return an error if the TRUID is not found', function () {
      UserProfileService.updateImage({truid: 'xxx-xxx-xxxx'})
        .catch(function (error) {
          expect(error).to.equal('');
        });
      $httpBackend.flush();
    });
  });

  describe('Formatted image source URL', function () {
    it('should give only the image content when type is "raw"', function () {
      var imageContent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAA';

      var source = UserProfileService.getImageSource({
        imageContent: imageContent,
        imageType: 'raw'
      });

      expect(source).to.equal(imageContent);
    });

    it('should build the image content based on the type', function () {
      var imageContent = 'iVBORw0KGgoAAAANSUhEUgAAAoAAAA';

      var source = UserProfileService.getImageSource({
        imageContent: imageContent,
        imageType: 'png'
      });

      expect(source).to.equal('data:image/png;base64,' + imageContent);
    });

    it('should return the default image', function () {
      var promise = UserProfileService.getImage();

      promise.then(function (source) {
        expect(source).to.equal(CONFIG.PROFILE_PLACEHOLDER_IMAGE);
      });
    });

    it('should return the default image', function () {
      var source = UserProfileService.getImageSource();

      expect(source).to.equal(CONFIG.PROFILE_PLACEHOLDER_IMAGE);
    });

    it('NotifySnippetCtrl image url for profile', function () {
      expect(UserProfileService.getImageUrl({truid: 1})).to.equal('/api/v2users/user/1/raw/image');
    });

    it('NotifySnippetCtrl handleImage should handle broken profiles without errors ', function () {
      expect(UserProfileService.getImageUrl(undefined)).to.equal(CONFIG.PROFILE_PLACEHOLDER_IMAGE);
      expect(UserProfileService.getImageUrl({})).to.equal(CONFIG.PROFILE_PLACEHOLDER_IMAGE);
      expect(UserProfileService.getImageUrl({truid: ''})).to.equal(CONFIG.PROFILE_PLACEHOLDER_IMAGE);
    });

  });

  describe('Blank slate for new user', function () {
    it('should tell if blank slate', function () {
      expect(UserProfileService.isBlankSlate()).to.be.true();
    });

    it('should tell if blank slate', function () {
      var data = {
        firstName: 'n.',
        middleName: 'hao',
        lastName: 'ching'
      };
      expect(UserProfileService.isBlankSlate(data)).to.be.true();
    });

    it('should tell if not blank slate', function () {
      var data = {
        firstName: 'n.',
        middleName: 'hao',
        lastName: 'ching',
        role: 'uidev'
      };
      expect(UserProfileService.isBlankSlate(data)).to.be.false();
    });

    it('should tell if blank slate', function () {
      var data = {
        firstName: 'n.',
        middleName: 'hao',
        lastName: 'ching',
        interest: ['chess']
      };
      expect(UserProfileService.isBlankSlate(data)).to.be.true();
    });
  });

  describe('User with no interests or skills', function () {
    it('should tell if user has no interests or skills', function () {
      var data = {
        firstName: 'n.',
        middleName: 'hao',
        lastName: 'ching'
      };
      expect(UserProfileService.hasNoInterests(data)).to.be.true();
    });

    it('should tell if user has no interests or skills', function () {
      var data = {
        firstName: 'n.',
        middleName: 'hao',
        lastName: 'ching',
        interest: []
      };
      expect(UserProfileService.hasNoInterests(data)).to.be.true();
    });

    it('should tell if user has no interests or skills', function () {
      var data = {
        firstName: 'n.',
        middleName: 'hao',
        lastName: 'ching',
        interest: ['chess']
      };
      expect(UserProfileService.hasNoInterests(data)).to.be.false();
    });

    it('should tell if user has no interests or skills', function () {
      expect(UserProfileService.hasNoInterests()).to.be.true();
    });

    it('should set the default title', function () {
      var data = {
        firstName: 'hao',
        lastName: 'ching'
      };
      var response = UserProfileService.setDefaultTitle(data);
      expect(response.title).to.equal('hao ching');
    });

    it('should not reset the title', function () {
      var data = {
        firstName: 'hao',
        lastName: 'ching',
        title: 'white rabbit'
      };
      var response = UserProfileService.setDefaultTitle(data);
      expect(response.title).to.equal('white rabbit');
    });
  });

  describe('User info', function () {

    it('should return all info in one line comma separated', function () {
      var profile = {
        location: 'Philadelphia, Pennsylvania, USA',
        primaryInstitution: 'Thomson Reuters',
        role: 'UI Developer'
      };
      var info = UserProfileService.getUserInfo(profile);
      expect(info).to.equal('UI Developer, Thomson Reuters, Philadelphia, Pennsylvania, USA');
    });

    it('should return only the info presented', function () {
      var profile = {
        primaryInstitution: 'Thomson Reuters'
      };
      var info = UserProfileService.getUserInfo(profile);
      expect(info).to.equal('Thomson Reuters');
    });

    it('profiles without info should return empty', function () {
      var profile = {};
      var info = UserProfileService.getUserInfo(profile);
      expect(info).to.equal('');
    });

    it('null profiles should return empty', function () {
      var info = UserProfileService.getUserInfo();
      expect(info).to.equal('');
    });


  });

  describe('Profile Edit Mode', function () {

    it('should expose a canUserEdit method', function () {
      expect(UserProfileService.canUserEdit).to.not.be.undefined();
    });

    it('should return false if the current userId DOES NOT match the truid state param', function () {
      expect(UserProfileService.canUserEdit()).to.be.false();
    });

    it('should return true if the current userId DOES match the truid state param', function () {
      $stateParams.truid = 'mockUserId';
      expect(UserProfileService.canUserEdit()).to.be.true();
    });

  });

});
