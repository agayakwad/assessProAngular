'use strict';

app.controller('CustomersController', [ '$scope', '$location', 'simpleFactory',
		function($scope, $location, customersService) {
			// I like to have an init() for controllers that need to perform
			// some initialization. Keeps things in
			// one place...not required though especially in the simple example
			// below

			function init() {
				$scope.customers = customersService.getCustomers();
			}
			init();
			$scope.insertCustomer = function() {
				var firstName = $scope.newCustomer.firstName;
				var lastName = $scope.newCustomer.lastName;
				var city = $scope.newCustomer.city;
				customersService.insertCustomer(firstName, lastName, city);
				$scope.newCustomer.firstName = '';
				$scope.newCustomer.lastName = '';
				$scope.newCustomer.city = '';
			};

			$scope.deleteCustomer = function(id) {
				customersService.deleteCustomer(id);
			};
		} ]);

// This controller retrieves data from the customersService and associates it
// with the $scope
// The $scope is bound to the orders view
app.controller('OrdersController', [ '$scope', 'simpleFactory',
		function($scope, simpleFactory) {
			$scope.customers = [];

			// I like to have an init() for controllers that need to perform
			// some initialization. Keeps things in
			// one place...not required though especially in the simple example
			// below

			function init() {
				// $scope.customers = customersService.getCustomers();
				$scope.customers = simpleFactory.getCustomers();
			}
			init();
		} ]);

app.controller('NavbarController', function($scope, $location) {
	$scope.getClass = function(path) {
		if ($location.path().substr(0, path.length) === path) {
			return true;
		} else {
			return false;
		}
	};
});

// This controller is a child controller that will inherit functionality from a
// parent
// It's used to track the orderby parameter and ordersTotal for a customer. Put
// it here rather than duplicating
// setOrder and orderby across multiple controllers.
app.controller('OrderChildController', function($scope) {
	$scope.orderby = 'product';
	$scope.reverse = true;
	$scope.ordersTotal = 0.00;

	function init() {
		// Calculate grand total
		// Handled at this level so we don't duplicate it across parent
		// controllers
		if ($scope.customer && $scope.customer.orders) {
			var total = 0.00;
			for (var i = 0; i < $scope.customer.orders.length; i++) {
				var order = $scope.customer.orders[i];
				total += order.orderTotal;
			}
			$scope.ordersTotal = total;
		}
	}

	init();

	$scope.setOrder = function(orderby) {
		if (orderby === $scope.orderby) {
			$scope.reverse = !$scope.reverse;
		}
		$scope.orderby = orderby;
	};

});
