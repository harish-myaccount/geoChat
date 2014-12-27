 var app=angular.module("chatApp", [ "ngRoute","LocalStorageModule",'mgcrea.ngStrap',"chatApp.controllers","chatApp.services" ]);
  app.config(['$routeProvider',
              function($routeProvider) {
	    $routeProvider.
	      when('/', {
	        templateUrl: 'templates/main.htm',
	        controller: 'MainController'
	    }).
	      when('/chat', {
	        templateUrl: 'templates/chat.htm',
	        controller: 'ChatController'
	      }).
	      otherwise({
	        redirectTo: '/'
	      });
	}]);
