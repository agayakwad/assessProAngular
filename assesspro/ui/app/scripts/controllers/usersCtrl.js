/**
 * For user's table
 */
'use strict';
app.controller('UsersCtrl', [ '$scope', 'UserFactory', function($scope, User) {
	$scope.users = User.query();
} ]);