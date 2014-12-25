 var app=angular.module("chatApp", [ "ngRoute","LocalStorageModule"]);
  app.config(['$routeProvider',
              function($routeProvider) {
	    $routeProvider.
	      when('/', {
	        templateUrl: 'templates/main.htm',
	        controller: 'MainCtrl'
	    }).
	      when('/chat', {
	        templateUrl: 'templates/chat.htm',
	        controller: 'ChatCtrl'
	      }).
	      otherwise({
	        redirectTo: '/'
	      });
	}]);
