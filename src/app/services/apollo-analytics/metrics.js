'use strict';
(function(window, angular, undefined){
  function Metrics(Restangular, $q, _, TenantService){
    let model = {};
      /**
      * make GET request to primary metrics endpoint
      * @param  {object} params query paramteters object, startDate and endDate are required
      * @return {object} Restangular response object
      */
      model.total = function(params){
        let tenant = TenantService.getTenant().value;
        return Restangular.one(tenant, 'metrics').one('total').get(params);
      };

      model.uniques = function(params){
        let tenant = TenantService.getTenant().value;
        return Restangular.one(tenant, 'metrics').one('uniques').get(params);
      };

      model.getTotalAndTrendData = function(params, order){
        let metricData = [];
        let deferred = $q.defer();
        let totalUniqueUserParams = _.extend({'studentCount': true}, params);

        metricData.push(model.total(params));
        metricData.push(model.getTrendData(params));
        metricData.push(model.uniques(params));
        metricData.push(model.uniques(totalUniqueUserParams));

        // complete parameter updates before calling service
        $q.all(metricData).then(function(results){
            let actualData = results[0].data;
            let trendData = results[1].data;
            let uniqueData = results[2].data;
            let totalUniqueUser = results[3].data;


             // check totalUniqueUser is an array with length
            let totalCount = 0;
            if(angular.isArray(totalUniqueUser) && totalUniqueUser.length === 1){
              totalCount = totalUniqueUser[0].count;
            }

            // add trend data
            let _tmpData = model.addTrendData(actualData, trendData, params);
            //add uniques data
            let allData = model.addUniquesData(_tmpData, uniqueData);

            let _data = allData;
            //rearrange the object on bases on metricnames
            let data = order.map(function(key){
              return _.find(_data, function(item){
                return item.metricName === key;
              });
            });
            // return groomed data
            let res = {
              'metrics' : data,
              'totalUniqueUser' : totalCount
            };

            deferred.resolve(res);
        });
        return deferred.promise;
      };

      model.addTrendData = function(actualData, trendData, params){
        var _tmpData = [];
        _.assign(actualData, trendData, function(a,b){
          if(a.metricName === b.metricName){
            let variation = Math.round(((a.count - b.count)/b.count) * 100);
            let tmp = {
              'change' : variation,
              'changedirection' : variation < 0 ? 'down':'up',
              'diff' : model.trendRange(params)
            };
            tmp = _.extend(tmp, a);
            _tmpData.push(tmp);
          }
        });
        return _tmpData;
      };

      model.addUniquesData = function(_tmpData, uniqueData){
        let _data = [];
        _.assign(_tmpData, uniqueData, function(a,b){
          if(a.metricName === b.metricName){
            let tmp = _.extend({'uniqueCount' : b.count}, a);
            _data.push(tmp);
          }
        });
        return  _data;
      };

      model.getTrendData = function(params){
        let paramConfig = angular.extend({}, params);
        let from = moment(paramConfig.endDate);
        let to = moment(paramConfig.startDate);
        let diff = from.diff(to);
        let diffAsDays = moment.duration(diff).asDays();

        paramConfig.startDate = moment(to).subtract(diffAsDays,'d').format('YYYY-MM-DD');
        paramConfig.endDate = moment(to).subtract(1,'d').format('YYYY-MM-DD');


        return model.total(paramConfig);
      };

      model.trendRange = function(params){
        let paramConfig = angular.extend({}, params);
        let from = moment(paramConfig.endDate);
        let to = moment(paramConfig.startDate);
        let diff = from.diff(to);


        moment.locale('precise-en', {
            relativeTime : {
                s : '%d seconds',
                m : '1 minute',
                mm : '%d minutes',
                h : '1 hour',
                hh : '%d hours',
                d : '1 day',
                dd : '%d days',
                M : '1 month',
                MM : '%d months',
                y : '12 months',
                yy : '%d years'
            }
        });
        return moment.duration(diff).locale('precise-en').humanize();
      };

     return model;
  }




  Metrics.$inject = ['Restangular', '$q', 'lodash', 'TenantService'];

  angular.module('apollo-analytics')
  .factory('Metrics', Metrics);
})(window, window.angular);
