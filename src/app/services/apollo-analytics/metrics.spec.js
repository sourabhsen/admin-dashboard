'use strict';
 ngDescribe({
   name: 'Service: Metrics',
   modules: 'apollo-analytics',
   inject: ['Metrics', 'Restangular'],
   tests: function(deps){
     var params = {'flatOutput':true,'includeNulls':false,'startDate':'2015-03-09','endDate':'2015-09-09T00:00:00-07:00'};
     var actualData = [{'metricName':'Goals','count':552},{'metricName':'Job Apply','count':60},{'metricName':'Job Search','count':1415},{'metricName':'Resumes','count':2657},{'metricName':'User Skill','count':148}];
     var trendData = [{'metricName':'Goals','count':164},{'metricName':'Job Apply','count':210},{'metricName':'Job Search','count':1047},{'metricName':'Resumes','count':532},{'metricName':'User Skill','count':306}];
     var _tmpData =  [{'change':237,'changedirection':'up','diff':'6 months','metricName':'Goals','count':552},{'change':-71,'changedirection':'down','diff':'6 months','metricName':'Job Apply','count':60},{'change':35,'changedirection':'up','diff':'6 months','metricName':'Job Search','count':1415},{'change':399,'changedirection':'up','diff':'6 months','metricName':'Resumes','count':2657},{'change':-52,'changedirection':'down','diff':'6 months','metricName':'User Skill','count':148}];
     var uniqueData = [{'metricName':'Goals','count':24},{'metricName':'Job Apply','count':19},{'metricName':'Job Search','count':43},{'metricName':'Resumes','count':21},{'metricName':'User Skill','count':21}];
     var allData = [{'uniqueCount':24,'change':237,'changedirection':'up','diff':'6 months','metricName':'Goals','count':552},{'uniqueCount':19,'change':-71,'changedirection':'down','diff':'6 months','metricName':'Job Apply','count':60},{'uniqueCount':43,'change':35,'changedirection':'up','diff':'6 months','metricName':'Job Search','count':1415},{'uniqueCount':21,'change':399,'changedirection':'up','diff':'6 months','metricName':'Resumes','count':2657},{'uniqueCount':21,'change':-52,'changedirection':'down','diff':'6 months','metricName':'User Skill','count':148}];
     it('should return trend data for each metric', function(){
       expect(deps.Metrics.addTrendData(actualData, trendData, params)).toEqual(_tmpData);
     });
     it('should add unique data to each metric', function(){
       expect(deps.Metrics.addUniquesData(_tmpData, uniqueData)).toEqual(allData);
     });
   }
 });
