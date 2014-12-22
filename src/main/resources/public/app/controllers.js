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
					userservice.getPicURL($scope.nickname).then(function(hits){
						if(hits)
				        angular.forEach(hits, function(hit, i){urls.push(hit.previewURL); });

						var promise = userservice.sendLocation(position,$scope.nickname,$scope.tagline);
						promise.then(function(response) {
							$scope.users=[];
							angular.forEach(response,function(user,i){
								user.url=urls[i];
								$scope.users.push(user)});
						}, function(error) {
							$scope.message = error
						});
					});
				}, function(reason) {
					$scope.message = "Could not be determined."
				});
			};
			
			$scope.sendRequest = function(id){
			    $location.path('chat');	
			};

		} ]);
