var AngularApp = angular.module('AngularApp', [ 'ngRoute', 'ngRoute']);

AngularApp.config(function($routeProvider) {
	$routeProvider.when('/list', {
		templateUrl : 'javascripts/partials/list.html',
		controller : 'ListController'
	});
	$routeProvider.when('/splash', {
		templateUrl : 'javascripts/partials/splash.html',
		controller : 'SplashController'
	});
	$routeProvider.when('/groups', {
		templateUrl : 'javascripts/partials/groups/groups.html',
		controller : 'GroupsController'
	});
	$routeProvider.when('/groups/:groupId', {
		templateUrl : 'javascripts/partials/groups/groupinfo.html',
		controller : 'GroupInfoController'
	});
	$routeProvider.otherwise({
		redirectTo : '/splash'
	});
});

// Controllers for angular app.
AngularApp.controller('ListController', function($scope) {
	$scope.data = {
		name : 'divesh kuarm'
	};
});
// Splash for main screen.
AngularApp.controller('SplashController', function($scope) {
	var localStorage = window['localStorage'];
	if (localStorage.getItem('user') !== null) {
		$scope.path = '/#/groups';
		$scope.linkTitle = "Play Now";
	}
	else {
		$scope.path = "/#/login";
		$scope.linkTitle = "Validate yourself";
	}
});
// Groups Controller.
AngularApp.controller('GroupsController', function($scope, $http) {
	$http.get('/api/groups').success(function(data) {
		$scope.groups = data;
	})
	.error(function(data) {
		$scope.groups = [];
	});
});

//Single Groups Controller.
AngularApp.controller('GroupInfoController', function($scope, $http, $routeParams) {
	$http.get('/api/groups/' + $routeParams.groupId).success(function(data) {
		console.log('hldool');
		$scope.groups = data;
	})
	.error(function(data) {
		$scope.groups = [];
	});
});