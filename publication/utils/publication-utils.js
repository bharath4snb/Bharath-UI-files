'use strict';

(function (angular) {

  angular
    .module('ne.views.PublicationModule')
    .service('RvUtil', RvUtil);

  RvUtil.$inject = ['$log', 'FIELDS'];

  function RvUtil($log, FIELDS) {

    var parse = function (data) {
      var parsedObject = {};

      parsedObject = {};
      parsedObject.type = data._type;

      try {
        data = data.fields || data._source;

        parsedObject.title = (data[FIELDS.TITLE] && data[FIELDS.TITLE] !== '') ? data[FIELDS.TITLE][0] : 'NO TITLE';
        parsedObject.uid = data[FIELDS.UID][0];
        parsedObject.abstract = (data[FIELDS.FULLRECORD.ARTICLES.ABSTRACT] !== undefined) ? data[FIELDS.FULLRECORD.ARTICLES.ABSTRACT].join() : '';
        parsedObject.authors = data[FIELDS.AUTHORS];
        parsedObject.volume = data[FIELDS.VOLUME];
        parsedObject.issue = data[FIELDS.ISSUE];
        parsedObject.pages = (data[FIELDS.FULLRECORD.ARTICLES.PAGE]) ? data[FIELDS.FULLRECORD.ARTICLES.PAGE] : null;
        parsedObject.pubDate = data[FIELDS.PUB_DATE];

        parsedObject.source = (data[FIELDS.FULLRECORD.ARTICLES.SOURCE]) ? data[FIELDS.FULLRECORD.ARTICLES.SOURCE][0] : null;

        parsedObject.citedcount = data[FIELDS.TIMES_CITED_LOCAL][0];
        parsedObject.referenceCount = data[FIELDS.FULLRECORD.ARTICLES.CITED_REFERENCE][0];
        parsedObject.cuid = (data[FIELDS.CUID]) ? data[FIELDS.CUID][0] : null;
      }
      catch (e) {
        $log.error(e);
        return undefined;
      }
      return parsedObject;
    };

    var parsePatent = function(data) {
      var parsedObject = {};

      parsedObject.type = data._type;

      try {
        data = data.fields || data._source;

        parsedObject.title = (data[FIELDS.TITLE] && data[FIELDS.TITLE] !== '') ? data[FIELDS.TITLE][0] : data[FIELDS.PATENT][0];
        parsedObject.uid = data[FIELDS.UID][0];
        parsedObject.abstract = (data[FIELDS.FULLRECORD.PATENTS.ABSTRACT] !== undefined) ? data[FIELDS.FULLRECORD.PATENTS.ABSTRACT].join() : '';
        parsedObject.authors = data[FIELDS.AUTHORS];
        parsedObject.volume = data[FIELDS.VOLUME];
        parsedObject.issue = data[FIELDS.ISSUE];
        parsedObject.pages = (data[FIELDS.FULLRECORD.ARTICLES.PAGE]) ? data[FIELDS.FULLRECORD.ARTICLES.PAGE] : null;
        parsedObject.pubDate = (data[FIELDS.PUB_DATE]) ? data[FIELDS.PUB_DATE][0] : null;

        parsedObject.citedpatents = (data[FIELDS.FULLRECORD.PATENTS.CITED_REFERENCE] !== undefined) ? data[FIELDS.FULLRECORD.PATENTS.CITED_REFERENCE][0] : 0;
        parsedObject.citedcount = (data[FIELDS.TIMES_CITED] !== undefined) ? data[FIELDS.TIMES_CITED][0] : 0;
        parsedObject.citedarticle = (data[FIELDS.CITED_ARTICLES] !== undefined) ? data[FIELDS.CITED_ARTICLES][0] : 0;
        parsedObject.patentNo = data[FIELDS.PATENT];
        parsedObject.assignee = data[FIELDS.ASSIGNEE];

        parsedObject.ipccodes = data[FIELDS.FULLRECORD.PATENTS.IPCCODES];

      }
      catch (e) {
        $log.error(e);
        return undefined;
      }

      return parsedObject;

    };

    return {
      parse: parse,
      parsePatent: parsePatent
    };
  }
})(angular);
