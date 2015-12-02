'use strict';

angular.module('apollo-profile', ['ngResource'])
/**
 * @ngdoc service
 * @name Profile
 * @requires $RESOURCE
 *
 * @description
 * Factory to construct a resource instance of Profile with
 * 'get' and 'save' restful methods. It requires a parameterized url argument
 * It returns a hash of methods to interact with profile service.
 *
 */
.factory('Profile', ['$resource',
  function($resource, CONSTANTS) {
    this.profileServicePath = '/api/profile-service/1/:tenant/profiles/:profileId';
    return $resource(this.profileServicePath, {
      tenant: 'uopx',
      profileId: '@profileId'
    }, {
      save: {
        method: 'PUT'
      },
      getPublic: {
        method: 'GET',
        url: '/api/profile-service/1/:tenant/profiles/public',
      }
    });
  }
]);
