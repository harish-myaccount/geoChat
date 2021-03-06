app = angular.module("chatApp.services", []);
app.service("ChatService", function($q, $timeout) {
	var service = {}, listener = $q.defer(), socket = {
		client : null,
		stomp : null
	}, messageIds = [];

	service.RECONNECT_TIMEOUT = 30000;
	service.SOCKET_URL = "/chat";
	service.CHAT_TOPIC = "/topic/message";
	service.CHAT_BROKER = "/geoc/send";

	service.receive = function() {
		return listener.promise;
	};

	service.send = function(message) {
		var id = Math.floor(Math.random() * 1000000);
		socket.stomp.send(service.CHAT_BROKER, {
			priority : 9
		}, JSON.stringify({
			message : message,
			id : id
		}));
		messageIds.push(id);
	};

	var reconnect = function() {
		$timeout(function() {
			initialize();
		}, this.RECONNECT_TIMEOUT);
	};

	var getMessage = function(data) {
		var message = JSON.parse(data), out = {};
		out.message = message.message;
		out.time = new Date(message.time);
		if (_.contains(messageIds, message.id)) {
			out.self = true;
			messageIds = _.remove(messageIds, message.id);
		}
		return out;
	};

	var startListener = function() {
		socket.stomp.subscribe(service.CHAT_TOPIC, function(data) {
			listener.notify(getMessage(data.body));
		});
	};

	var initialize = function() {
		socket.client = new SockJS(service.SOCKET_URL);
		socket.stomp = Stomp.over(socket.client);
		socket.stomp.connect({}, startListener);
		socket.stomp.onclose = reconnect;
	};

	initialize();
	return service;
});

app.factory("GeolocationService", function($q, $window, $rootScope) {
	return function() {
		var deferred = $q.defer();

		if (!$window.navigator) {
			$rootScope.$apply(function() {
				deferred.reject(new Error("Geolocation is not supported"));
			});
		} else {
			$window.navigator.geolocation.getCurrentPosition(
					function(position) {
						$rootScope.$apply(function() {
							deferred.resolve(position);
						});
					}, function(error) {
						$rootScope.$apply(function() {
							deferred.reject(error);
						});
					});
		}

		return deferred.promise;
	}
});

app.service("UserService", function($q, $http) {
	
	this.sendLocation = function(position, email) {
		var deferred = $q.defer();
		user = {
			coOrd : position.coords,
			email : email
		};
		$http.post('/users/nearby', user).success(function(data) {
			deferred.resolve(data.content);
		}).error(function(msg, code) {
			deferred.reject(msg);
			console.error(msg, code);
		});
		return deferred.promise;
	};
	
	this.postQuestion = function(email, question,code) {
		var deferred = $q.defer();
		user = {
			tagline : question,
			code:code,
			email : email
		}
		$http.post('/users/question/add', user).success(function(data) {
			deferred.resolve(data);
		}).error(function(msg) {
			deferred.reject(msg);
			console.error(msg);
		});
		return deferred.promise;
	};
	
	this.postAnswer = function(packet) {
		var deferred = $q.defer();
		$http.post('/users/question/answer', {email:packet.content.email,answer:packet.answer,self:packet.self}).success(function(data) {
			deferred.resolve(data);
		}).error(function(msg, code) {
			deferred.reject(msg);
			console.error(msg, code);
		});
		return deferred.promise;
	};
	
});



app.factory("AuthService",function(){
	var isAuthenticated;
	var isAccepted;
	
	return {setAuth:function(result){isAuthenticated=result},
		getAuth:function(){return isAuthenticated;}};
});