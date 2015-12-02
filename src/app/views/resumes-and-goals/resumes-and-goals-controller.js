'use strict';
(function(window, angular, undefined){

  function ResumesAndGoalsController(ParameterService, Careergoals, Resume, User){
    window.scrollTo(0,0);
    let model = this;
    model.name = (User.auth.username) ? User.auth.username : '';

    ParameterService.etlJobStatus().then(function(response){
      let lastRun = response.data[0].lastRunDate;
      let lastRunDate = new Date(lastRun);
      model.lastRunDate = moment(new Date(lastRunDate)).format('h:mm:ss A z[on] MM/DD/YY');
    });

    /** Resume Created VOLUME **/
    model.resumeVolume = {
      title  : 'Resume created volume',
      width  : 831,
      height : 270,
      hanger   : 'd3-area',
      menu: true,
      graph: {
        xKey: 'date',
        yKey: 'count',
        classname: 'resumes'
      },
      params  : { //query parameters
        pageNumber: 0,
        dateAggregationLevel : 'day'
      },
      ticks: {
        y: '5'
      },
      textual: {
        labelTemplate : 'Total resumes made public as of&nbsp;${today}' ,
        align : 'right'
      },
      infoContent : 'This volume chart demonstrates the volatility of the resumes created in a date range.  It also lists the count of all the resumes that have been made public to the recruiters in the system so far. The data in the chart can also be downloaded as a csv file.',
      update : function(config){
        ParameterService.update(config).then(function(){
          model.resumeVolumePromise = Resume.getTotalAndCreatedData(config.params).then(function(response){
            model.resumeVolume.data = response.created;
            //added data to textual component
            model.resumeVolume.textual.label = model.resumeVolume.textual.labelTemplate.replace('${today}',moment(config.params.endDate).format('MM/DD/YY') + '&nbsp;:');
            model.resumeVolume.textual.value = response.total;
          });
        });
      }
    };
    // TOP 20 CAREER GOALS
    model.careergoals = {
      title  : 'Top 20 Career Goals &nbsp;',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Careergoals.topn,
        resource: undefined
      },
      search:{
        update: Careergoals.topn,
        key: 'goal',
        resource: undefined
      },
      graph: {
        xKey: 'goal',
        yKey: 'count',
        classname: 'goals'
      },
      params : {
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart lists the top 20 career goals set by the users in a date range. It also provides the functionality to search for a specific goal and also to view all the goals in order of frequency. The data can also be downloaded as a csv file.',
      update: function(config){
        ParameterService.update(config).then(function(){
          model.careergoalsPromise = Careergoals.topnAll(config.params).then(function(response){
            model.careergoals.data = response.data;
            model.careergoals.totalCount = response.totalCount;
          });
        });
      }
    };
  }

  ResumesAndGoalsController.$inject = ['ParameterService', 'Careergoals', 'Resume', 'User'];

  angular.module('admin-dashboard')
  .controller('ResumesAndGoalsController', ResumesAndGoalsController);
})(window, window.angular);
