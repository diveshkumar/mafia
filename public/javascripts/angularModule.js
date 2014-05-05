var AngularApp = angular.module('AngularApp', ['ngRoute']);

AngularApp.config(function($routeProvider) {
	$routeProvider.when('/list', {
		templateUrl : 'javascripts/partials/list.html',
		controller : 'ListController'
	});
	$routeProvider.otherwise({
		redirectTo : '/list'
	});
});

/*
 * // Controllers for angular app. AngularApp.controller('ListController',
 * function($scope) { $scope.data = { name : 'divesh kuarm' };
 * console.log('test'); });
 * 
 */
function ListController($scope, $http) {
	$http.get('/json/groups.json').success(function(data) {
		$scope.artists = data;
		$scope.artistOrder = 'reknown';
	});
}