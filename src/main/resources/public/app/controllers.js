app.controller("ChatCtrl", ['$scope', 'ChatService', function($scope, ChatService) {
	$scope.messages = [];
	$scope.message = "";
	$scope.max = 140;

	$scope.addMessage = function() {
		ChatService.send($scope.message);
		$scope.message = "";
	};

	ChatService.receive().then(null, null, function(message) {
		$scope.messages.push(message);
	});
} ]);

app.controller('MainCtrl', [ '$scope','$location', 'GeolocationService', 'UserService','localStorageService',
		function($scope,$location, geolocation, userservice,localStorageService) {
			$scope.position = null;
			$scope.message = "";
			$scope.users = null;

			geolocation().then(function(position) {
				$scope.position = position;
			}, function(reason) {
				$scope.message = "Allow browser to share location to start using app"
			});

			$scope.self={email:''};
			if(localStorageService.get('email')){
				$scope.start();
			}
			
			$scope.start = function() {
				localStorageService.set('email',$scope.self.email)
				var promise = userservice.sendLocation($scope.position,$scope.self.email);
				promise.then(function(response) {
					$scope.users=[];
					angular.forEach(response,function(user,i){
						$scope.users.push(user)});
				}, function(error) {
					$scope.message = error
				});
			};
			
			$scope.postQuestion = function(){
				urls=[];
				urls[false]='http://goo.gl/J7SKmj';
				urls[true]='http://goo.gl/SvjslJ';
				userservice.postQuestion($scope.email,$scope.tagline).then(function(user){
					$scope.users.push(user);
				});
			}
			
			$scope.sendRequest = function(user){
				console.log(user);
			    $location.path('chat');	
			};

		} ]);
