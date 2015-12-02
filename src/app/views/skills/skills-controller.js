'use strict';

(function(window, angular, undefined){

  function SkillsController(ParameterService, Skills, User){
    window.scrollTo(0,0);
    let model = this;

    model.name = (User.auth.username) ? User.auth.username : '';

    ParameterService.etlJobStatus().then(function(response){
      let lastRun = response.data[0].lastRunDate;
      let lastRunDate = new Date(lastRun);
      model.lastRunDate = moment(new Date(lastRunDate)).format('h:mm:ss A z[on] MM/DD/YY');
    });

    //TOP SKILLS by RATING Beginner
    model.topSkillsBeginner = {
      title: 'Top 20 skills (rated beginner)',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Skills.topn,
        resource: undefined
      },
      search:{
        update: Skills.topn,
        key: 'skillName',
        resource: undefined
      },
      graph : {
        xKey: 'skillName',
        yKey: 'count',
        classname: 'skills-hi'
      },
      // filters: {
      //   options: ['programSchool', 'programDegree', 'programName', 'studentStatus']
      // },
      params: {
       pageSizePerRating: 20,
       pageNumber: 0
      },
      infoContent : 'This chart lists the top 20 user-assessed skill marked as beginner in a date range. It also provides the functionality to search for a specific skill and also to view all the skills marked as beginner in order of frequency. The data can also be downloaded as a csv file.',
      update: function(config){
        ParameterService.update(config).then(function(){
          model.topSkillsBeginnerPromise = Skills.topnAll(config.params).then(function(response){
            let data = response.data;
            let count = response.totalCount;
            model.topSkillsBeginner.totalCount = response.totalCount;
            if(data.length && data.length > 0){
              data = response.data.filter(function(d){
                return d.skillLevel === 'Beginner';
              });
            }
            if (count && count.length >0){
              count  = response.totalCount.filter(function(d){
                return d.skillLevel === 'Beginner';
                });
            }
            model.topSkillsBeginner.data = data;
            model.topSkillsBeginner.totalCount = (count && count.length)? count[0].totalCount : 0;
          });
        });
      }
    };
    //TOP SKILLS by RATING Advanced
    model.topSkillsIntermediate = {
      title: 'Top 20 skills (rated intermediate)',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Skills.topn,
        resource: undefined
      },
      search:{
        update: Skills.topn,
        key: 'skillName',
        resource: undefined
      },
      graph : {
        xKey: 'skillName',
        yKey: 'count',
        classname: 'skills-metric'
      },
      // filters: {
      //   options: ['programSchool', 'programDegree', 'programName', 'studentStatus']
      // },
      params: {
       pageSizePerRating: 20,
       pageNumber: 0
      },
      infoContent : 'This chart lists the top 20 user-assessed skill marked as intermediate in a date range. It also provides the functionality to search for a specific skill and also to view all the skills marked as intermediate in order of frequency. The data can also be downloaded as a csv file.',
      update: function(config){
        ParameterService.update(config).then(function(){
          model.topSkillsIntermediatePromise = Skills.topnAll(config.params).then(function(response){
            let data = response.data;
            let count = response.totalCount;
            model.topSkillsIntermediate.totalCount = response.totalCount;
            if(data.length && data.length > 0){
                data = response.data.filter(function(d){
                return d.skillLevel === 'Intermediate';
              });
            }
            if (count && count.length >0){
              count  = response.totalCount.filter(function(d){
                return d.skillLevel === 'Intermediate';
                });
            }
            model.topSkillsIntermediate.data = data;
            model.topSkillsIntermediate.totalCount = (count && count.length)? count[0].totalCount : 0;
          });
        });
      }
    };
    //TOP SKILLS by RATING Advanced
    model.topSkillsAdvanced = {
      title: 'Top 20 skills (rated advanced)',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Skills.topn,
        resource: undefined
      },
      search:{
        update: Skills.topn,
        key: 'skillName',
        resource: undefined
      },
      graph : {
        xKey: 'skillName',
        yKey: 'count',
        classname: 'skills'
      },
      // filters: {
      //   options: ['programSchool', 'programDegree', 'programName', 'studentStatus']
      // },
      params: {
       pageSizePerRating: 20,
       pageNumber: 0
      },
      infoContent : 'This chart lists the top 20 user-assessed skill marked as advanced in a date range. It also provides the functionality to search for a specific skill and also to view all the skills marked as advanced in order of frequency. The data can also be downloaded as a csv file.',
      update: function(config){
        ParameterService.update(config).then(function(){
          model.topSkillsAdvancedPromise = Skills.topnAll(config.params).then(function(response){
            let data = response.data;
            let count = response.totalCount;
            if(data.length && data.length > 0){
                data = response.data.filter(function(d){
                return d.skillLevel === 'Advanced';
              });
            }
            if (count && count.length >0){
              count  = response.totalCount.filter(function(d){
                return d.skillLevel === 'Advanced';
                });
            }

            model.topSkillsAdvanced.data = data;
            model.topSkillsAdvanced.totalCount = (count && count.length)? count[0].totalCount : 0;
          });
        });
      }
    };
  }
  SkillsController.$inject = ['ParameterService', 'Skills', 'User'];

  angular.module('admin-dashboard')
  .controller('SkillsController', SkillsController);


})(window, window.angular);
