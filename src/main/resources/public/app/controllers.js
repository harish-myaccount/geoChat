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

app.controller('MainCtrl', [ '$scope','$location', 'GeolocationService', 'UserService',
		function($scope,$location, geolocation, userservice) {
			$scope.position = null;
			$scope.message = "";
			$scope.users = null;

			$scope.start = function() {
				geolocation().then(function(position) {
					$scope.position = position;
					urls=[];
					urls[false]='http://goo.gl/J7SKmj';
					urls[true]='http://goo.gl/SvjslJ';
					userservice.getPicURL($scope.nickname).then(function(hits){
						var promise = userservice.sendLocation(position,$scope.nickname,$scope.tagline,hits.length>0?hits[0].previewURL:urls[Math.random()<.5]);
						promise.then(function(response) {
							$scope.users=[];
							angular.forEach(response,function(user,i){
								$scope.users.push(user)});
						}, function(error) {
							$scope.message = error
						});
					});
				}, function(reason) {
					$scope.message = "Could not be determined."
				});
			};
			
			$scope.sendRequest = function(user){
				console.log(user);
			    $location.path('chat');	
			};

		} ]);
