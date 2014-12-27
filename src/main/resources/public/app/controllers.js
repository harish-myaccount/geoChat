app = angular.module('chatApp.controllers',[]);
app.controller("ChatController", function($scope, ChatService,UserService,AuthService) {
	$scope.messages = [];
	$scope.message = "";
	$scope.max = 140;
	
	$scope.authenticated=AuthService.getAuth();

	$scope.addMessage = function() {
		ChatService.send($scope.message);
		$scope.message = "";
	};

	ChatService.receive().then(null, null, function(message) {
		$scope.messages.push(message);
	});
} );

app.controller('MainController', function($scope,$location, GeolocationService, UserService,localStorageService,$window,$filter,AuthService) {
			$scope.position = null;
			$scope.message = "";
			$scope.users = null;

			GeolocationService().then(function(position) {
				$scope.position = position;
				if(localStorageService.get('email')){
					$scope.self.email=localStorageService.get('email');
					$scope.start();
				}
			}, function(reason) {
				console.log(reason);
				$scope.message = "Allow browser to share location to start using app"
			});

			$scope.self={email:''};
			$scope.reset=function(){
				localStorageService.set('email','');
				$window.location.reload();
				}
			$scope.start = function() {
				localStorageService.set('email',$scope.self.email)
				var promise = UserService.sendLocation($scope.position,$scope.self.email);
				promise.then(function(response) {
					$scope.users=[];
					angular.forEach(response,function(user,i){
						$scope.users.push(user)});
				}, function(error) {
					$scope.message = error
				});
			};
			
			$scope.postQuestion = function(){
				if($scope.self.tagline && $scope.self.tagline.trim() && $scope.self.secret && $scope.self.secret.trim() ){
				UserService.postQuestion($scope.self.email,$scope.self.tagline,$scope.self.secret).then(function(user){
					$scope.users = $filter('filter')($scope.users, !$scope.self.email);
					$scope.users.push({content:user,self:true});
				});
				}
			}
			
			$scope.sendRequest = function(user){
				if(user.content.email==$scope.self.email)
					user.self=true;
				UserService.postAnswer(user).then(function(allowed){
					if(allowed){
						AuthService.setAuth(allowed);
						$location.path('chat');
					}
				})
			};

			
		} );
