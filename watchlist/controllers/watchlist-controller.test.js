'use strict';

describe('Unit: Testing Watch List Controller ------ ', function () {
  var ctrl;
  var $controller;
  var WatchlistDetailsDataMock;
  beforeEach(module('ne.views.WatchListModule'));

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
    WatchlistDetailsDataMock = {
      containerId: '1234-5678',
      containerName: 'watch list 1',
      containerType: 'watchlist',
      containerDesc: 'math'
    };
    ctrl = $controller('WatchListController', {
      WatchlistDetailsData: WatchlistDetailsDataMock
    });

  }));

  it('should not be null.', function () {
    expect(ctrl).not.to.equal(null);
  });

  it('should declare a containerId property that equals the resolved WatchlistDetailsData.containerId.', function () {
    expect(ctrl.WatchlistDetailsData.containerId).to.equal('1234-5678');
  });

  it('should declare a containerName property that equals the resolved WatchlistDetailsData.containerName.', function () {
    expect(ctrl.WatchlistDetailsData.containerName).to.equal('watch list 1');
  });

  it('should declare a containerType property that equals the resolved WatchlistDetailsData.containerType.', function () {
    expect(ctrl.WatchlistDetailsData.containerType).to.equal('watchlist');
  });
});
