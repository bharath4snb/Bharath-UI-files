'use strict';

describe('User Comments Directive', function () {

  var scope;
  var $compile;
  var $log;
  var $rootScope;
  var AppreciateIt;
  var userCommentListsGet;
  var $httpBackend;
  var $filter;
  var vm;

  var Analytics;

  var statisticsGet;

  var element;

  var basicTemplate = '<ne-user-comments-display data-truid="mockId" profile-data="mockUserProfile" is-current-users-profile="true" comments-data="MultipleComments" comments-count="3"></ne-user-comments-display>';

  var basicTemplateNoId = '<ne-user-comments-display profile-data="mockUserProfile" is-current-users-profile="true" comments-data="ZeroComments"></ne-user-comments-display>';

  var zeroCommentsTemplate = '<ne-user-comments-display data-truid="mockId" profile-data="mockUserProfile" is-current-users-profile="true" comments-data="ZeroComments"></ne-user-comments-display>';

  var otherUserTemplate = '<ne-user-comments-display data-truid="mockOtherId" profile-data="mockUserProfile" is-current-users-profile="false" comments-data="ZeroComments"></ne-user-comments-display>';

  var moreThan10Comments = '<ne-user-comments-display data-truid="mockId" profile-data="mockUserProfile" is-current-users-profile="true" comments-data="MultipleComments" comments-count="11"></ne-user-comments-display>';

  var ZeroComments = {
    size: 0,
    found: true,
    comments: []
  };

  var mockCommentResult = {
    content: '<p>What <i>if</i> <b>... </b></p>',
    created: '2016-02-05 03:08:16',
    found: true,
    id: 'ce450620-e63b-4c32-b38e-b88cd136b848',
    keydate: 1450710496082,
    keydateModified: 1450710496082,
    modified: '2015-12-21 03:08:16',
    record: {},
    statistics: {},
    status: 'PUBLISHED',
    targetId: 'c32313c6-9106-49cc-9928-3a7f964730e5',
    targetType: 'comments',
    userId: 'bc4a7b23-d94e-4c30-b05b-bf09df5e99b8',
    wasCleanedUp: 0,
    wasTruncated: false
  };

  var MultipleComments = {
    size: 3,
    found: true,
    comments: [
      mockCommentResult,
      mockCommentResult,
      mockCommentResult
    ]
  };

  var mockUserProfile = {
    email: 'email@domain.com',
    firstName: 'First',
    hcrIndicator: 'true',
    lastName: 'Last',
    location: 'Philadelphia, Pennsylvania, USA',
    middleName: 'Middle',
    primaryInstitution: 'My Company',
    role: 'My Role',
    title: 'First Middle Last',
    userid: '15561ec2-c733-4046-97d6-63a349e399aa'
  };


  beforeEach(module(function ($provide) {

    $provide.service('statisticsGet', function ($q) {
      this.get = function () {
        var deferred = $q.defer();
        return deferred.promise;
      };
    });

    $provide.service('userCommentListsGet', function ($q) {
      var get = sinon.stub().returns($q.resolve(MultipleComments));

      return {
        get: get
      };
    });

    $provide.service('AppreciateIt', function () {
      this.put = angular.noop();
    });

    $provide.service('searchServiceGet', function ($q) {
      this.getById = function () {
        var deferred = $q.defer();
        return deferred.promise;
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

  beforeEach(module('ne.views.ProfileModule'));
  beforeEach(module('modules/views/profile/templates/user-comments-display.html'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _Analytics_, _$filter_, _userCommentListsGet_, _statisticsGet_, _AppreciateIt_, _searchServiceGet_, _$log_, _$httpBackend_) {

    $rootScope = _$rootScope_;
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $log = _$log_;
    statisticsGet = _statisticsGet_;
    Analytics = _Analytics_;
    AppreciateIt = _AppreciateIt_;
    userCommentListsGet = _userCommentListsGet_;
    $httpBackend = _$httpBackend_;
    $filter = _$filter_;

    scope.mockId = '15561ec2-c733-4046-97d6-63a349e399cc';
    scope.mockOtherId = '15561ec2-c733-4046-97d6-63a349e399aa';
    scope.ZeroComments = ZeroComments;
    scope.MultipleComments = MultipleComments;
    scope.mockUserProfile = mockUserProfile;

    scope.$digest();

  }));

  function compileDirective(template, scope) {
    var elm = angular.element(template);
    $compile(elm)(scope);
    scope.$apply();
    return elm;
  }

  describe('Test for no truid', function () {

    it('Should throw an error if no truid is provided', function () {

      var spy = sinon.spy($log, 'error');
      element = compileDirective(basicTemplateNoId, scope);

      expect(spy).to.have.been.calledWith('This directive requieres a truid property');
    });
  });

  describe('Test for no comments message block, users profile', function () {

    beforeEach(function () {
      element = compileDirective(zeroCommentsTemplate, scope);
    });

    it('Expect the write a comments message to be visible when current user has not comments', function () {
      var userHasNoComments = angular.element(element.find('.current-user-no-comments'));
      var otherUserNoComments = angular.element(element.find('.other-user-no-comments'));

      expect(userHasNoComments.hasClass('ng-hide')).to.be.false();
      expect(otherUserNoComments.hasClass('ng-hide')).to.be.true();
    });

    it('Should hide the comments wrapper when no comments are available in current users profile', function () {

      var commentsWrapper = angular.element(element.find('.user-comment'));

      expect(commentsWrapper.hasClass('ng-show')).to.be.false();
    });

  });

  describe('Test for no comments message, other users profile', function () {

    beforeEach(function () {
      element = compileDirective(otherUserTemplate, scope);
    });

    it('Expect the write a post message to be visible when other user has no comments', function () {
      var userHasNoComments = angular.element(element.find('.current-user-no-comments'));
      var otherUserNoComments = angular.element(element.find('.other-user-no-comments'));

      expect(userHasNoComments.hasClass('ng-hide')).to.be.true();
      expect(otherUserNoComments.hasClass('ng-hide')).to.be.false();
    });

    it('Should hide the comments wrapper when no comments are available in other profile', function () {
      var commentsWrapper = angular.element(element.find('.user-comment'));

      expect(commentsWrapper.hasClass('ng-show')).to.be.false();
    });

  });

  describe('Timestamp display', function() {

    beforeEach(function () {
      element = compileDirective(basicTemplate, scope);
    });

    it('should display timestamp if not today', function () {
      var timestamp = angular.element(element.find('wui-timestamp'));
      expect(timestamp.length).to.equal(3);
    });

    it('should return true when the comment was modified today', function () {
      vm = element.controller('neUserCommentsDisplay');
      var testDate = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');

      expect(vm.isDateTodaysDate(testDate)).to.be.true();
    });

  });

  describe('User can see comments', function () {

    beforeEach(function () {
      element = compileDirective(basicTemplate, scope);
    });

    it('should show the comments wrapper when the directive loads', function () {
      var commentsWrapper = angular.element(element.find('.user-comment'));
      expect(commentsWrapper.hasClass('ng-hide')).to.be.false();
    });

    it('should display as many comments as found in the server', function () {
      var commentsWrapper = angular.element(element.find('.user-comment'));
      expect(commentsWrapper.length).to.equal(3);
    });
  });

  describe('Get more comments function', function() {

    it('Should request more comments if user has more than 10', function () {
      element = compileDirective(moreThan10Comments, scope);

      var vm = element.controller('neUserCommentsDisplay');

      vm.grabMore();

      expect(userCommentListsGet.get).to.have.been.called();
    });

    it('Should not request more comments if a request is being processed', function () {
      element = compileDirective(moreThan10Comments, scope);

      var vm = element.controller('neUserCommentsDisplay');

      vm.busy = true;

      vm.grabMore();

      expect(userCommentListsGet.get).to.have.not.been.called();
    });

    it('Should not request more comments if user has less than 10 comments', function () {
      element = compileDirective(basicTemplate, scope);

      var vm = element.controller('neUserCommentsDisplay');

      vm.grabMore();

      expect(userCommentListsGet.get).to.have.not.been.called();
    });

  });

});
