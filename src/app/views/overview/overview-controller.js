'use strict';

(function(window, angular, undefined){

  function OverviewController($q, $rootScope, _, ParameterService, Metrics, Jobapplication, Jobsearch, Questionnaire, Users, ngDialog, TenantService, User){
    window.scrollTo(0,0);
    let model = this;

    // if (User.profile && User.profile.firstName) {
    //   model.name = User.profile.firstName;
    // } else {
    //   model.name = '';
    // }

    model.name = (User.auth.username) ? User.auth.username : '';

    //set tenant in controller
    model.tenant = TenantService.getTenant().value;

    ParameterService.etlJobStatus().then(function(response){
      let lastRun = response.data[0].lastRunDate;
      let lastRunDate = new Date(lastRun);
      model.lastRunDate = moment(new Date(lastRunDate)).format('h:mm:ss A z[on] MM/DD/YY');
    });

    // PRIMARY METRICS
    model.metrics = {
      title  : 'Primary Metrics',
      width: 960,
      height: 205,
      hanger: 'primary-metric',
      menu: true,
     filters : {
      },
      params : {
        flatOutput: true
      },
      viewall : false,
      textual: {
        label :' Total Unique Users :',
        align : 'right'
      },
      wait: true,
      update : function(config){
        ParameterService.update(config).then(function(){
          model.metricLoader = Metrics.getTotalAndTrendData(config.params, model.metrics.order).then(function(response){
            model.metrics.data = response.metrics;
            model.metrics.textual.value = response.totalUniqueUser;
          });
        });
      },
      order:['Goals', 'User Skill','Resumes','Job Search', 'Job Apply'],
      infoContent : 'The primary metrics component captures the tool usage for the five most important user activities in Career guidance system: total number of goals set,total number of skills assessed, total number of resumes created, total count of job searches conducted and total count of jobs applied for a date range. The component also compares the usage and reports a % increase/ decrease. The component also lists the count of the unique users who performed this action.'
    };

    //QUESTIONNAIRE RESPONSES
    model.questionnaire = {
      title: 'Questionnaire Responses',
      width: 993,
      height: 200,
      hanger: 'd3-multi-donut',
      charts: [{
          title: 'Which of the following best describes your career goal?',
          scaleColor: ['#0099cc', '#b7cd00', '#999999'],
          textColor: ['#ffffff', '#000000', '#ffffff']
        },{
          title: 'Which of the following best describes your current employment status?',
          scaleColor: ['#0099cc', '#b7cd00', '#999999', '#FF6600'],
          textColor: ['#ffffff', '#000000', '#ffffff', '#ffffff']
        },{
          title: 'Are you currently looking for a job?',
          scaleColor: ['#0099cc', '#b7cd00', '#999999', '#FF6600', '#09587b'],
          textColor: ['#ffffff', '#000000', '#ffffff', '#ffffff', '#ffffff']
        },{
          title: 'Does your need for a job impact your decision to stay in school?',
          scaleColor: ['#0099cc', '#b7cd00', '#999999', '#FF6600'],
          textColor: ['#ffffff', '#000000', '#ffffff', '#ffffff']
        },{
          title: 'Red Alert Students',
          scaleColor: ['#d7234a', '#999999'],
          textColor: ['#ffffff', '#ffffff'],
          click: {
            group: 'At Risk',
            action: function(){
              ngDialog.open({
                template: 'app/components/red-alert/red-alert-modal.html',
                showClose: false,
                className: 'ngdialog-theme-default red-alert-modal',
                resolve: {
                  studentPromise: function(){
                    delete model.questionnaire.params.questionType;
                    model.questionnaire.params.showUsers = true;
                    model.studentPromise = Questionnaire.redalert(model.questionnaire.params);
                    delete model.questionnaire.params.showUsers;
                    return model.studentPromise;
                  },
                },
                controller: ['$scope', 'studentPromise', function($scope, studentPromise){
                  let model = this;
                  model.studentPromise = studentPromise;
                  model.students = studentPromise.data;
                }],
                controllerAs: 'ctrl'
              });
            }
          }
        }
      ],
      menu: true,
      filters : {
      },
      // range: 3,
      textual: {
         label :' Total Responses :',
         align : 'right'
      },
      update: function(config){
        model.tenant = TenantService.getTenant().value;
        ParameterService.update(config).then(function(){
          model.questionnairePromise = Questionnaire.allResponses(config.params).then(function(response){
            model.questionnaire.data = response.data;
            model.questionnaire.textual.value = response.totalResponses;
          });
        });
      },
      infoContent : 'The questionnaire responses capture the responses received from the initial survey we ask our users to take. The questionnaire categorizes the responses captured and helps in user segmentation. The component also segments the red alert students; users who are users who are ‘either un-employed by choice or not by choice’ and are ‘actively or somewhat actively looking for a job’ and ‘will or may drop out of school’ if they found a job.'
    };
    // JOBSEARCH BY TITLE TOP 20
    model.jobsearchTopByTitle = {
      title  : 'Top 20 searches by Job Title',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Jobsearch.topn,
        resource: 'jobtitle'
      },
      graph: {
        xKey: 'jobTitle',
        yKey: 'count',
        classname: 'job-search'
      },
      search:{
        update: Jobsearch.topn,
        key: 'jobTitle',
        resource: 'jobtitle'
      },
      params : {
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart lists the top 20 job titles searches in a date range. It also provides the functionality to search for a specific job title and also to view all the titles in order of frequency. The data can also be downloaded as a csv file.',
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.jobsearchTopTitlePromise = Jobsearch.topnAll(config.params, 'jobtitle').then(function(response){
          model.jobsearchTopByTitle.data = response.data;
          model.jobsearchTopByTitle.totalCount = response.totalCount;
        });
       });
      }
    };

    //JOB APPLICATIONS BY TITLE TOP 20
    model.jobapplicationTopTitle = {
      title: 'Top 20 applications by Job Title',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Jobapplication.topn,
        resource: 'jobtitle'
      },
      search:{
        update: Jobapplication.topn,
        key: 'jobTitle',
        resource: 'jobtitle'
      },
      graph: {
        xKey: 'jobTitle',
        yKey: 'count',
        classname: 'job-app'
      },
      params: {
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart lists the top 20 jobs applications segmented by job titles in a date range.  It also provides the functionality to search for a specific job application by title and also to view all the job applications in order of frequency. The data can also be downloaded as a csv file.',
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.jobapplicationTopTitlePromise = Jobapplication.topnAll(config.params, 'jobtitle').then(function(response){
          model.jobapplicationTopTitle.data = response.data;
          model.jobapplicationTopTitle.totalCount = response.totalCount;
        });
       });
      }
    };

        //JOB APPLICATIONS BY TITLE TOP 20
    model.milestoneProgression = {
      title: 'Milestone Progression &nbsp;',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Users.milestones,
        resource: 'mileStone'
      },
      search:{
        update: Users.milestones,
        key: 'mileStone',
        resource: 'mileStone'
      },
      graph: {
        xKey: 'mileStone',
        yKey: 'count',
        classname: 'resumes'
      },
      params: {
        pageNumber: 0,
        pageSize: 20,
        timestamp: Date.now()
      },
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.milestoneProgressionPromise =  Users.milestones(config.params).then(function(response){
          model.milestoneProgression.data = response.data;
        });
       });
      }
    };

    $rootScope.$on('tenant-change', function($event, msg){
      $event.preventDefault();
      $event.stopPropagation();
      model.tenant = TenantService.getTenant().value;
    });
  }

  OverviewController.$inject = ['$q','$rootScope', 'lodash','ParameterService', 'Metrics', 'Jobapplication', 'Jobsearch', 'Questionnaire', 'Users', 'ngDialog', 'TenantService', 'User'];

  angular.module('admin-dashboard')
  .controller('OverviewController', OverviewController);

})(window, window.angular);
