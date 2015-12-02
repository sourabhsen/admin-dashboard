'use strict';
(function(window, angular, undefined){
  /**
   * @ngdoc service
   * @name  SearchService
   * @description
   * Provide functionality for the search directive
   */
  function SearchService($http, ParameterService, ngDialog, _, $q){
    let model = this;
    model.searchResults = {};
    model.skillLevelFlag = 'Beginner';

    model.getJobs = function(query) {
      return $http.get('/api/job-service/1/jobs/suggest/keywords',{
          params: {
            q : query,
            noOfResults : 5,
            highlight : false
          }
        }).then(function(response){
            return response.data.map(function(item){
              return item.value;
            });
        });
    };

    model.getLocations = function(query) {
      return $http.get('/api/validation-service/1/uopx/address/cities/suggest/'+query, {
        params:{
          noOfResults : 5
        }
      }).then(function(response){
        //@TODO need to beautify the response
        return response.data.resultList.map(function(item){
          return item.city + ',' + item.state;
        });
      });
    };

    model.getSkills = function(query) {
      return $http.get('/api/analytics-service/1/uopx/filters/skills/'+query,{
        // headers: {
        //   'Authorization': 'Basic YXB0X2FjY2VwdGFuY2VfYWNjb3VudDphcHRfYWNjZXB0YW5jZV9hY2NvdW50'
        // },
        params: {
          noOfResults : 5
        }
      })
      .then(function(response){
          //as service implmentation doesn't support limitTo,thus restricting results to 5 items at FE
          return response.data.splice(0,5);
      });
    };

    model.getGoals = function(query) {
      return $http.get('/api/labormarket-service/1/uopx/jobcodes',{
          params: {
            searchTerm : query,
            noOfResults : 5
          }
        }).then(function(response){
            //as service implmentation doesn't support limitTo,thus restricting results to 5 items at FE
            var filteredItem =  response.data.results.filter(function(item, index){
              return index < 5;
            });

            return filteredItem.map(function(item){
              return item.name;
            });
        });
    };

    model.uopxSearchModal = function(config, searchfilters){
      ngDialog.open({
            template: 'app/modules/d3-charts/search/search-modal-template.html',
            showClose: false,
            className: 'ngdialog-theme-default ch-search-modal',
            resolve: {
              config: function(){
                return config;
              },
              searchkey : function(){
                return searchfilters;
              },
              searchtitle: function(){
                switch (config.search.key){
                  case 'smarterName':
                    return 'Skill';
                  case 'skillName':
                    return 'Skill';
                  case 'companyName':
                    return 'Company';
                  case 'jobTitle':
                    return 'Job Title';
                  case 'location':
                    return 'Location';
                  case 'goal':
                    return 'Goal';
                  default:
                    return 'Search Title';
                }
              }
            },
            controller: ['$scope', 'config','searchkey', 'searchtitle' , function($scope, config, searchkey, searchtitle){
              let model = this;
              let paramConfig = '';

              model.config = config;
              model.searchKey = searchkey;
              model.searchtitle = searchtitle;
              $scope.themeClass = config.graph.classname;
              $scope.data = {};

              model.updateSearchResults = function(config){
                ParameterService.update(config).then(function(){
                  model.searchModalLoader = model.getSearchResults(config).then(function(response){
                    $scope.data = response;
                  });
                });
              };

              model.getSearchResults = function(params){
                let searchData = [];
                let totalCount = 0;
                let deferred = $q.defer();
                searchData.push(model.getTotalResults(params));
                searchData.push(model.getSearchedItem(params));

                $q.all(searchData).then(function(results){
                  let totalResults= results[0].data;
                  let searchedItem= results[1].data;

                  // check totalResults is an array with length
                  if(angular.isArray(totalResults) && totalResults.length === 1){
                    totalCount = totalResults[0].count;
                  }else{//this can be skill total Counts
                    totalCount = totalResults.filter(function(item){
                        if(item.skillLevel.toLowerCase() === model.skillLevelFlag.toLowerCase()){
                          return item.count;
                        }
                    });
                    totalCount = totalCount[0].count;
                  }

                  let res = {
                    'totalCount' : totalCount,
                    'rowItem' : searchedItem
                  };

                  deferred.resolve(res);
                });
                return deferred.promise;
              };

              /*
               * Function to total count of search type
               * @return Promise for the total count
               */
              model.getTotalResults = function(config){
                paramConfig = _.extend({'resultCount' : true}, config.params);
                return config.search.update(paramConfig, config.search.resource);
              };

              /*
               * Function to get searched Item details
               * @return Promise for the total count
               */
              model.getSearchedItem = function(config){

                if (config.title.substring(0, 15) ==='Top 20 searches' ||
                    config.title.substring(0, 19) ==='Top 20 Job searches'){
                  paramConfig = _.extend({'searchTerm' : searchkey}, config.params);
                } else {

                  switch(config.search.key){
                    case 'jobTitle':
                     paramConfig = _.extend({'jobtitle' : searchkey}, config.params);
                      break;
                    case 'companyName':
                     paramConfig = _.extend({'company' : searchkey}, config.params);
                      break;
                    case 'skillName':
                      switch(config.title.substring(21, config.title.length - 1)){
                        case 'beginner':
                          model.skillLevelFlag = 'Beginner';
                          paramConfig = _.extend({'skillName' : searchkey, 'skillLevel':  'Beginner'}, config.params);
                          break;
                        case 'intermediate':
                          model.skillLevelFlag = 'Intermediate';
                          paramConfig = _.extend({'skillName' : searchkey, 'skillLevel':  'Intermediate'}, config.params);
                          break;
                        case 'advanced':
                          model.skillLevelFlag = 'Advanced';
                          paramConfig = _.extend({'skillName' : searchkey, 'skillLevel':  'Advanced'}, config.params);
                          break;
                        }
                        break;
                    case 'location':
                      paramConfig = _.extend({'searchTerm' : searchkey}, config.params);
                      break;
                    case 'goal':
                      paramConfig = _.extend({'careerGoal' : searchkey}, config.params);
                      break;
                  }
                }

                return config.search.update(paramConfig, config.search.resource);
              };

              model.updateSearchResults(config);

            }],
            controllerAs: 'ctrl'
        });
    };
  }

  SearchService.$inject = ['$http', 'ParameterService','ngDialog', 'lodash', '$q'];

  angular.module('d3Charts')
  .service('SearchService', SearchService);

})(window, window.angular);
