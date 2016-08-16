'use strict';

describe('One-P Security Constant', function () {

  var ProjectNeonSecurity;

  beforeEach(module('ne'));

  beforeEach(inject(function (_ProjectNeonSecurity_) {
    ProjectNeonSecurity = _ProjectNeonSecurity_;
  }));

  it('should provide access to OnePSecurity global', function () {
    expect(ProjectNeonSecurity).to.not.be.undefined();
  });

});