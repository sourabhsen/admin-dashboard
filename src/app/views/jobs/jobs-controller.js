'use strict';

(function(window, angular, undefined){

  function JobsController($q, ParameterService, Careergoals, Jobsearch, Jobapplication, User){
    window.scrollTo(0,0);
    let model = this;

    model.name = (User.auth.username) ? User.auth.username : '';

    ParameterService.etlJobStatus().then(function(response){
      let lastRun = response.data[0].lastRunDate;
      let lastRunDate = new Date(lastRun);
      model.lastRunDate = moment(new Date(lastRunDate)).format('h:mm:ss A z[on] MM/DD/YY');
    });

    // JOB SEARCH VOLUME
    model.jobSearchVolume = {
      title  : 'Job Search Volume',
      width  : 831,
      height : 270,
      hanger   : 'd3-area',
      menu: true,
      graph: {
        xKey: 'date',
        yKey: 'count',
        classname: 'job-search'
      },
      params  : { //query parameters
        dateAggregationLevel : 'day',
        pageNumber: 0
      },
      ticks: {
        y: '5'
      },
      infoContent : 'This volume chart demonstrates the volatility of the job searches conducted in a date range.  The data in the chart can also be downloaded as a csv file.',
      update : function(config){
        ParameterService.update(config).then(function(){
          model.jobsearchVolumePromise = Jobsearch.volume(config.params).then(function(response){
            model.jobSearchVolume.data = response.data;
          });
        });
      }
    };
    // TOP 20 JOB SEARCHES BY TITLE
    model.jobsearchTopByTitle = {
      title  : 'Top 20 searches by <br>Job Title',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Jobsearch.topn,
        resource: 'jobtitle'
      },
      search:{
        update: Jobsearch.topn,
        key: 'jobTitle',
        resource: 'jobtitle'
      },
      graph: {
        xKey: 'jobTitle',
        yKey: 'count',
        classname: 'job-search-hi'
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
    // TOP 20 JOB SEARCHES BY COMPANY
    model.jobsearchTopCompanyName = {
      title: 'Top 20 Job searches by Company',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
       viewall: {
        update: Jobsearch.topn,
        resource: 'company'
      },
      search:{
        update: Jobsearch.topn,
        key: 'companyName',
        resource: 'company'
      },
      graph: {
        xKey: 'companyName',
        yKey: 'count',
        classname: 'job-search'
      },
      // filters : {
      //   options: true
      // },
      params: {
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart lists the top 20 job search conducted segmented by company in a date range. It also provides the functionality to search for a specific company and also to view all the data ordered by frequency. The data can also be downloaded as a csv file.',
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.jobsearchTopCompanyPromise = Jobsearch.topnAll(config.params, 'company').then(function(response){
          model.jobsearchTopCompanyName.data = response.data;
          model.jobsearchTopCompanyName.totalCount = response.totalCount;
        });
       });
      }
    };
    //TOP 20 JOB SEARCHES BY LOCATION
    model.jobsearchTopByLocation = {
      title  : 'Top 20 Job searches by Location',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Jobsearch.topn,
        resource: 'location'
      },
      search:{
        update: Jobsearch.topn,
        key: 'location',
        resource: 'location'
      },
      graph: {
        xKey: 'location',
        yKey: 'count',
        classname: 'job-search-hi'
      },
      params : {
        sortByLocation:false,
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart lists the top 20 job search conducted segmented by location in a date range. It also provides the functionality to search for a specific location and also to view all the data ordered by frequency. The data can also be downloaded as a csv file.',
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.jobsearchTopLocationPromise = Jobsearch.topnAll(config.params, 'location').then(function(response){
          model.jobsearchTopByLocation.data = response.data;
          model.jobsearchTopByLocation.totalCount = response.totalCount;
        });
       });
      }
    };
    // JOB APPLICATION VOLUME
    model.jobApplicationVolume = {
      title: 'Job Application Volume',
      width  : 831,
      height : 270,
      hanger   : 'd3-area',
      menu: true,
      graph: {
        xKey: 'date',
        yKey: 'count',
        classname: 'job-app'
      },
      params  : { //query parameters
        dateAggregationLevel : 'day',
        pageNumber: 0
      },
      ticks: {
        y: '5'
      },
      infoContent : 'This volume chart demonstrates the volatility of the job applications in a date range. The data in the chart can also be downloaded as a csv file.',
      update : function(config){
        ParameterService.update(config).then(function(){
          model.jobApplicationVolumePromise = Jobapplication.volume(config.params).then(function(response){
            model.jobApplicationVolume.data = response.data;
          });
        });
      }
    };
    // TOP 20 JOB APPLICATIONS BY TITLE
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
        classname: 'job-app-hi'
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
    //TOP 20 JOB APPLICATIONS BY COMPANY
    model.jobapplicationTopCompanyName = {
      title: 'Top 20 Job applications by Company',
      width: 1,
      height: 1.5,
      hanger: 'd3-horizontal-bar',
      menu: true,
      viewall: {
        update: Jobapplication.topn,
        resource: 'company'
      },
      search:{
        update: Jobapplication.topn,
        key: 'companyName',
        resource: 'company'
      },
      graph: {
        xKey: 'companyName',
        yKey: 'count',
        classname: 'job-app'
      },
      filters : {
        options: true
      },
      params: {
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart lists the top 20 jobs applications segmented by the companies in a date range.  It also provides the functionality to search for a specific company and also to view all the job applications in order of frequency. The data can also be downloaded as a csv file.',
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.jobapplicationTopCompanyPromise = Jobapplication.topnAll(config.params, 'company').then(function(response){
          model.jobapplicationTopCompanyName.data = response.data;
          model.jobapplicationTopCompanyName.totalCount = response.totalCount;
        });
       });
      }
    };
    // MANUAL JOB APPLICATIONS
    model.jobapplicationStatus = {
      title: 'Manual Job Applications',
      width: 1,
      height: 1.67,
      hanger: 'd3-donut-chart',
      graph: {
        countKey: 'count',
        groupKey: 'applyStatus'
      },
      params: {
        trackingType: 'MANUAL',
        dateAggregationLevel : 'year',
        pageNumber: 0,
        pageSize: 20
      },
      infoContent : 'This chart segments all the job applications manually tracked by the users by their application statuses. The data can also be downloaded as a csv file.',
      update :  function(config){
       ParameterService.update(config).then(function(){
        model.jobapplicationStatusPromise = Jobapplication.status(config.params).then(function(response){
          model.jobapplicationStatus.data = response.data;
        });
       });
      }
    };
  }

  JobsController.$inject = ['$q', 'ParameterService', 'Careergoals', 'Jobsearch', 'Jobapplication', 'User'];

  angular.module('admin-dashboard')
  .controller('JobsController', JobsController);

})(window, window.angular);
