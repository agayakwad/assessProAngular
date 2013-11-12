'use strict';
var app = angular.module('uiApp', [ 'ngResource' ]);

angular.element(document).ready(function() {
	angular.bootstrap(document, [ 'uiApp' ]);
});

app.config([ '$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$locationProvider.html5Mode(true);
			$routeProvider.when('/admin', {
				templateUrl : 'ui/views/users.html',
				controller : 'UsersCtrl'
			}).when('/users', {
				templateUrl : 'views/users/index.html',
				controller : 'UserIndexCtrl'
			}).otherwise({
				redirectTo : '/'
			});
		} ]);

// angular.module('uiApp', [ 'ngResource' ])

