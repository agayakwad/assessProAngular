'use strict';

angular.module('uiApp').factory('UserFactory',
		[ '$resource', function($resource) {
			return $resource('/admin/admin', {}, {
				'get' : {
					method : 'GET',
					isArray : true
				},
				'query' : {
					method : 'GET',
					isArray : true
				}
			});
		} ]);