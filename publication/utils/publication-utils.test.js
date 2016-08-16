'use strict';
describe('Record view utils', function() {
  var data;
  var RvUtil;
  var FRS = 'fullrecord.summary.';
  var FR = 'fullrecord.';
  var FIELDS;

  beforeEach(module('ne.views.PublicationModule'));

  beforeEach(module(function ($provide) {
    $provide.constant('FIELDS', {
      CONTENT_TYPE: FRS + 'contenttype',
      UID: FRS + 'uid',
      TRUID: FRS + 'truid',
      VOLUME: FRS + 'volume',
      ISSUE: FRS + 'issue',
      PUB_DATE: FRS + 'pubdate',
      EDITOR: FRS + 'editor',
      GROUP_AUTHOR: FRS + 'groupauthor',
      AUTHORS: FRS + 'authors',
      TITLE: FRS + 'title',
      TIMES_CITED: FRS + 'citingsrcscount',
      TIMES_CITED_LOCAL: FRS + 'citingsrcslocalcount',
      ROLE: FR + 'role',
      REF_COUNT: FR + 'citedrefcount',
      CITED_ARTICLES: FR + 'citedarticle',
      ASSIGNEE: FRS + 'assignee',
      PATENT: FRS + 'patentno',

      FULLRECORD: {

        ARTICLES: {
          PAGE: FR + 'page',
          ABSTRACT: FR + 'abstract',
          CITED_REFERENCE: FR + 'citedrefcount',
          SOURCE: FR + 'source'
        },

        PATENTS: {
          ABSTRACT: FR + 'abstract',
          CITED_REFERENCE: FR + 'citedrefcount',
          IPCCODES: FR + 'ipccodes',
          DRAWING: FR + 'drawing'
        },

        PEOPLE: {
          INTEREST: FR + 'interest'
        },

        POSTS: {

        }
      },
      AGGREGATIONS: {
        ARTICLES: {
          docs: {val: 'normdoctype.normdoctypenavigator', display: 'Document Type'},
          authors: {val: 'authorsrefine.authorsnavigator', display: 'Authors'},
          category: {val: 'category.categorynavigator', display: 'Categories'},
          institutions: {val: 'institution.institutionnavigator', display: 'Institutions'}
        },
        PEOPLE: {
          country: {val: 'country.countrynavigator', display: 'Country'},
          authors: {val: 'highlycited.highlycitednavigator', display: 'Authors'},
          institutions: {val: 'institution.institutionnavigator', display: 'Institutions'}
        },
        PATENTS: {
          authors: {val: 'authorsrefine.authorsnavigator', display: 'Inventor'},
          ipcCodes: {val: 'ipccodes.ipccodesnavigator', display: 'IPC Codes'},
          assignee: {val: 'assignee.assigneenavigator', display: 'Assignee'}
        },
        POSTS:{
          institutions: {val: 'institution.institutionnavigator', display: 'Institutions'}
        }
      }
    });
  }));

  beforeEach(inject(function(_RvUtil_, _FIELDS_) {
    //jshint ignore: start
    data = readJSON('mock/get-details-byid.mock.json');
    //jshint ignore: end
    RvUtil = _RvUtil_;
    FIELDS = _FIELDS_;
  }));

  it('expect Rv utils parse to work correctly', function() {
    var parsedData = RvUtil.parse(data);
    expect(parsedData.title).to.equal('The city of San Juan: imaginaries of unfinished reconstructions');
  });
});
