var AngularApp = angular.module('AngularApp', ['ngRoute']);
function getSessionId() {
  var socket = io.sockets;
  var sessionId = '';
  for (i in socket) {
    sessionId = socket[i].sessionid;
  }
  return sessionId;
}

AngularApp.config(function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'javascripts/partials/game.html',
    controller: 'GameController'
  });
  $routeProvider.when('/engine', {
    templateUrl: 'javascripts/partials/engine.html',
    controller: 'EngineController'
  });
  $routeProvider.when('/splash', {
    templateUrl: 'javascripts/partials/splash.html',
    controller: 'SplashController'
  });
  $routeProvider.otherwise({
    redirectTo: '/splash'
  });
});

// Splash for main screen.
AngularApp.controller('SplashController', function($scope, $window, $location) {
  var localStorage = window['localStorage'];
  var labels = {
    playButton: 'Join the Game'
  };
  $scope.form = {};
  $scope.labels = labels;
  $scope.startGame = function(username) {
    window.location = "/#/game?s=" + btoa(username);
  };
});
// Game Screen controller.
AngularApp.controller('GameController', function($scope, $http, $window, $location) {
  var labels = {
    playButton: 'Join the Game'
  };
  $scope.labels = labels;
  $scope.path = '/#/game';
  var sessionId = getSessionId() || true;

  $http.get('/api/game/ticket').success(function(data) {
    $scope.ticket = data;
    qStr = $location.search();
    setCookie('user-' + sessionId, JSON.stringify(data));
    setCookie('user-' + sessionId + '-name', qStr['s']);
  });

});

AngularApp.controller('EngineController', function($scope, $http, $window) {
  
});