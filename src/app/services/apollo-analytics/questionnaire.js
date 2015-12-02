'use strict';
(function(window, angular, undefined){
  function Questionnaire($q, Restangular, TenantService){
    let model = this;

    model.get = function(params, resource){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'questionnaire').one(resource).get(params);
    };

    model.redalert = function(params){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'questionnaire').one('redalert').get(params);
    };

    model.totalresponse = function(params){
      let tenant = TenantService.getTenant().value;
      return Restangular.one(tenant, 'questionnaire').one('totalresponses').get(params);
    };
    model.allResponses = function(params){
      let deferred = $q.defer();
      let all = [];

      all.push(model.getAllResponsesAndRedAlert(params));
      all.push(model.totalresponse(params));

      $q.all(all).then(function(results){
        // check totalUniqueUser is an array with length
        let totalCount = 0;

        let allResponses = results[0];
        let totalResponses = results[1].data;

        if(angular.isArray(totalResponses) && totalResponses.length === 1){
          totalCount = totalResponses[0].count;
        }

        // return groomed data
        let response = {
          'data' : allResponses,
          'totalResponses' : totalCount
        };

        deferred.resolve(response);
      });

      return deferred.promise;
    };

    model.getAllQuestionTypeResponses = function(params){
      let deferred = $q.defer();
      let questions = ['careerGoal', 'employmentStatus', 'jobSeekerStatus', 'jobImpact'];
      let all = questions.map(function(q){
        return model.get(params, q);
      });

      $q.all(all).then(function(responses){
        let response = responses.map(function(r){return r.data;});
        deferred.resolve(response);
      });

      return deferred.promise;
    };

    model.getAllResponsesAndRedAlert = function(params){
      let deferred = $q.defer();
      model.getAllQuestionTypeResponses(params).then(function(responses){
        model.redalert(params).then(function(response){
          responses.push(response.data);
          deferred.resolve(responses);
        });
      });
      return deferred.promise;
    };

  }

  Questionnaire.$inject = ['$q','Restangular', 'TenantService'];

  angular.module('apollo-analytics')
  .service('Questionnaire', Questionnaire);
})(window, window.angular);
