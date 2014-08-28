var AngularApp = angular.module('AngularApp', [ 'ngRoute']);

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
  $routeProvider.when('/groups/create', {
		templateUrl : 'javascripts/partials/groups/create.html',
		controller : 'GroupsCreateController'
	});
	$routeProvider.when('/groups/:groupId', {
		templateUrl : 'javascripts/partials/groups/groupinfo.html',
		controller : 'GroupInfoController'
	});
  $routeProvider.when('/groups/remove/:groupId', {
		controller : 'GroupRemoveController',
    templateUrl : 'javascripts/partials/splash.html'
	});
	$routeProvider.when('/users/login', {
		templateUrl : 'javascripts/partials/users/login.html',
		controller : 'LoginController'
	});
  $routeProvider.when('/user/:userId', {
		templateUrl : 'javascripts/partials/users/details.html',
		controller : 'UserController'
	});
  $routeProvider.when('/groups/:groupId/members/:userId/remove/', {
		templateUrl : 'javascripts/partials/users/details.html',
		controller : 'UserRemoveController'
	});
	$routeProvider.otherwise({
		redirectTo : '/splash'
	});
});

// Splash for main screen.
AngularApp.controller('SplashController', function($scope) {
	var localStorage = window['localStorage'];
	if (localStorage.getItem('user') !== null) {
		$scope.path = '/#/groups/';
		$scope.linkTitle = "Play Now";
	}
	else {
		$scope.path = "/#/users/login";
		$scope.linkTitle = "Validate yourself";
	}
});
// Groups Controller.
AngularApp.controller('GroupsController', function($scope, $http) {
  var labels = {
    remove: 'X',
    create: 'Add Group'
  };
  $scope.labels = labels;
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
		$scope.title = 'MyGroup';
    $scope.removeLabel = "Remove from group";
		$scope.groups = data;
    $scope.groupId = $routeParams.groupId;
	})
	.error(function(data) {
		$scope.groups = [];
	});
});
//Single Users Controller.
AngularApp.controller('UserController', function($scope, $http, $routeParams) {
	$http.get('/api/user/' + $routeParams.userId).success(function(data) {
		var labels = {
      name: 'Name',
      phone: 'Phone'
    };

    $scope.title = 'User Details';
		$scope.user = data;
    $scope.labels = labels;
	})
	.error(function(data) {
		$scope.user = [];
	});
});

//Single Groups Controller.
AngularApp.controller('LoginController', function($scope, $http, $location) {
	$scope.title = "Sign in to Play";
	$scope.formData = {};
	var localStorage = window['localStorage'];

	var loggedInUser = localStorage.getItem('user');


	$scope.processForm = function() {
		localStorage.setItem('user', this.formData.phone);
		$location.path('/groups');
	}

});

// Create A group.
//Single Groups Controller.
AngularApp.controller('GroupsCreateController', function($scope, $http, $location) {
	$scope.title = "Add Group";
	$scope.formData = {};

  $scope.saveGroup = function(loggedUser) {
    $http.post('/api/groups/create', $scope.formData).success(function() {
      $location.path('/groups');
    });
  }
});

AngularApp.controller('GroupRemoveController', function($scope, $http, $routeParams, $location) {
	$http.post('/api/groups/remove' , {user: '9650594146', groupId: $routeParams.groupId}).success(function() {
      $location.path('/groups');
  });
});

AngularApp.controller('UserRemoveController', function($scope, $http, $routeParams, $location) {
  console.log($routeParams);
	$http.post('/api/groups/members/remove' , {removeUserId: $routeParams.userId, currentUserId: '9650594146', groupId: $routeParams.groupId}).success(function() {
      $location.path('/groups/' + $routeParams.groupId);
  });
});