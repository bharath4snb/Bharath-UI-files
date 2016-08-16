'use strict';

describe('Service: citationWatchListService', function () {

  var $httpBackend;
  var citationWatchListService;
  var cfg;
  var member2Mock = {
    id: 'dc27624e-903b-47d1-8d58-dbeb20efbed3',
    'public': false,
    profile: false,
    created: '2015-06-04 02:58:44',
    keydate: 1433429924319,
    modified: '2015-06-04 02:58:44',
    name: 'Another list, my second of course.',
    items: [''],
    size: 3
  };
  var membersMock = [{
    id: '6542c358-8e31-4a4c-88cd-14ed6d86330b',
    'public': false,
    profile: false,
    created: '2015-06-04 02:57:35',
    keydate: 1433429855832,
    modified: '2015-06-04 02:57:35',
    name: 'This is a list. My First list',
    size: 1
  },
    member2Mock
  ];


  beforeEach(module('ne.views.WatchListModule', function($provide) {
    $provide.constant('CONFIG', {
      CITATION_WATCHLIST_ENDPOINT: '/api/lists/watchlist'
    });
    $provide.constant('Analytics', { trackEvent:function () {}});
  }));

  beforeEach(inject(function (_$httpBackend_, CONFIG, _citationWatchListService_) {
    $httpBackend = _$httpBackend_;
    cfg = CONFIG;
    citationWatchListService = _citationWatchListService_;

  }));

  it('should always return the profileId', function () {
    citationWatchListService.getListId(function (data) {
      expect(data).to.equal('data');
    });
  });

  it('isWatching return 2 members', function () {
    var itemId = 'dc27624e-903b-47d1-8d58-dbeb20efbed3';
    var type = 'article';

    $httpBackend.whenGET(cfg.CITATION_WATCHLIST_ENDPOINT +  '/ismember?id=' + type + '::' + itemId)
      .respond(membersMock);

    citationWatchListService.isWatching(itemId, type, function (data) {
      expect(data).to.have.length.of(2);
    });

    $httpBackend.flush();
  });


  it('add should add the item', function () {
    var itemId = 'ecfb4124-f257-4167-9152-fc685ab2389b';
    var type = 'patent';

    $httpBackend.whenPUT(cfg.CITATION_WATCHLIST_ENDPOINT + '/' + type + '::' + itemId).respond(200);

    citationWatchListService.add(itemId, type, function (data) {
      expect(data).to.be.ok();
    });

    $httpBackend.flush();
  });



});