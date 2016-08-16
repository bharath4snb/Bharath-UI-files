'use strict';

(function (angular) {

  var FRS = 'fullrecord.summary.';
  var FR = 'fullrecord.';

  angular
    .module('ne.views.SearchModule')
    .constant('FIELDS', {
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
      CUID: 'cuid',

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
      },

      SORT_RESULTS: {
        ALL: {
          relevance: {val: '_score:desc', sortText: 'Relevance'},
          timesCited: {val: 'citingsrcslocalcount:desc', sortText: 'Times Cited'},
          pubDateNewest: {val: 'sortdate:desc', sortText: 'Date (Newest)'},
          pubDateOldest: {val: 'sortdate:asc', sortText: 'Date (Oldest)'}
        },

        ARTICLES: {
          relevance: {val: '_score:desc', sortText: 'Relevance'},
          timesCited: {val: 'citingsrcslocalcount:desc', sortText: 'Times Cited'},
          pubDateNewest: {val: 'sortdate:desc', sortText: 'Publication Date (Newest)'},
          pubDateOldest: {val: 'sortdate:asc', sortText: 'Publication Date (Oldest)'}
        },
        PEOPLE: {
          relevance: {val: '_score:desc', sortText: 'Relevance'},
          loadtime: {val: 'loadtime:desc', sortText: 'Registration Date'}
        },
        PATENTS: {
          relevance: {val: '_score:desc', sortText: 'Relevance'},
          timesCited: {val: 'citingsrcscount:desc', sortText: 'Times Cited'},
          pubDateNewest: {val: 'sortdate:desc', sortText: 'Publication Date (Newest)'},
          pubDateOldest: {val: 'sortdate:asc', sortText: 'Publication Date (Oldest)'}
        },
        POSTS:{
          pubDateNewest: {val: 'sortdate:desc', sortText: 'Create Date (Newest)'},
          pubDateOldest: {val: 'sortdate:asc', sortText: 'Create Date (Oldest)'},
          relevance: {val: '_score:desc', sortText: 'Relevance'}
        }
      }
    });

})(angular);
