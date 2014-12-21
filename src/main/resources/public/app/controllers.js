app.controller("ChatCtrl", [ 'ChatService', function($scope, ChatService) {
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

app.controller('MainCtrl', [ '$scope', 'GeolocationService', 'UserService',
		function($scope, geolocation, userservice) {
			$scope.position = null;
			$scope.message = "";

			$scope.users = null;

			$scope.start = function() {
				geolocation().then(function(position) {
					$scope.position = position;
					var promise = userservice.sendLocation(position);
					promise.then(function(response) {
						$scope.users = response.users
					}, function(error) {
						$scope.message = error
					});
				}, function(reason) {
					$scope.message = "Could not be determined."
				});
			};

		} ]);
