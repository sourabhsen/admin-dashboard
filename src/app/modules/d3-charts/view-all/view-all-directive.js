'use strict';
(function(window, angular, undefined){
  function d3ViewAll(ngDialog, _, ParameterService){
    return {
      require     : '^d3Chart',
      replace     : true,
      transclude  : true,
      scope       : true,
      templateUrl : 'app/modules/d3-charts/view-all/view-all-template.html',
      link        : function(scope, elem, attr, ctrl){
        scope.open = function(){
          let totalResults = 0;
          // make a copy of params to get total result count
          let countParams = {
            resultCount: true
          };
          for(var key in ctrl.config.params) {
            if(key !== 'pageNumber' && key !== 'pageSize'){
              countParams[key] = ctrl.config.params[key];
            }
          }
          // get the total result count
          ctrl.config.viewall.update(countParams, ctrl.config.viewall.resource).then(function(results){
            totalResults = results.data[0].count;
            ngDialog.open({
              template:'app/modules/d3-charts/view-all/view-all-modal-template.html',
              overlay:false,
              showClose: false,
              className: 'ngdialog-theme-default ch-view-all-modal',
              resolve: {
                config: function(){
                  return ctrl.config;
                },
                totalResults: function(){
                  return totalResults;
                }
              },
              controller: ['$scope', 'config', 'totalResults', function($scope, _config, totalResults){
                let model = this;
                // divide results count by 20
                // multiple chart config height by this number
                model.id  =  'viewall-' + Math.floor((Math.random() * 1000) + 1);
                model.modalConfig = {};
                // Deep Copy Config
                _.map(_config, function(c, k){
                  switch(k) {
                    case 'height':
                      model.modalConfig[k] = (totalResults * 32) + 15;
                      // 32 = bar height, 15 = bottom margin
                      break;
                    case 'width':
                      model.modalConfig[k] = 500;
                      break;
                    case 'viewall':
                      model.modalConfig[k] = false;
                      break;
                    case 'hanger':
                      model.modalConfig[k] = 'd3-horizontal-bar-modal';
                      break;
                    case 'update':
                      break;
                    case 'data' :
                      model.modalConfig[k] = [];
                      break;
                    default:
                      model.modalConfig[k] = _.cloneDeep(c);
                      break;
                  }
                  return model.modalConfig[k];
                });
                model.modalConfig.manualDimensions = true;
                model.modalConfig.params.pageSize = totalResults < 100 ? totalResults : 100;
                model.modalConfig.wait = true;
                model.modalConfig.domainY = true;
                // model.modalConfig.margin.right = 50;
                model.modalConfig.update = function(config){
                  ParameterService.update(config).then(function(){
                    model.graphPromise = _config.viewall.update(config.params, _config.viewall.resource).then(function(response){

                      let data = response.data;
                      if(data.length && data.length > 0){
                        if (config.title.substring(0, 13) === 'Top 20 skills'){
                          switch(config.title.substring(21, config.title.length - 1)){
                          case 'beginner':
                            data = response.data.filter(function(d){
                              return d.skillLevel === 'Beginner';
                            });
                            break;
                          case 'intermediate':
                            data = response.data.filter(function(d){
                              return d.skillLevel === 'Intermediate';
                            });
                            break;
                          case 'advanced':
                            data = response.data.filter(function(d){
                              return d.skillLevel === 'Advanced';
                            });
                            break;
                          }
                        }
                      }
                      model.modalConfig.data = model.modalConfig.data.concat(data);
                      model.modalConfig.params.pageNumber++;
                    });
                  });
                };
              }],
              controllerAs: 'ctrl'
            });
          });
        };
      }
    };
  }

  d3ViewAll.$inject = ['ngDialog', 'lodash', 'ParameterService'];

  angular.module('d3Charts')
  .directive('d3ViewAll', d3ViewAll);
})(window, window.angular);
