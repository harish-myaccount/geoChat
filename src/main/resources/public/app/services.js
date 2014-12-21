app.service("ChatService", function($q, $timeout) {
    
    var service = {}, listener = $q.defer(), socket = {
      client: null,
      stomp: null
    }, messageIds = [];
    
    service.RECONNECT_TIMEOUT = 30000;
    service.SOCKET_URL = "/chat";
    service.CHAT_TOPIC = "/topic/message";
    service.CHAT_BROKER = "/geoc/chat";
    
    service.receive = function() {
      return listener.promise;
    };
    
    service.send = function(message) {
      var id = Math.floor(Math.random() * 1000000);
      socket.stomp.send(service.CHAT_BROKER, {
        priority: 9
      }, JSON.stringify({
        message: message,
        id: id
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
  
  app.factory("GeolocationService", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
	    return function () {
	        var deferred = $q.defer();

	        if (!$window.navigator) {
	            $rootScope.$apply(function() {
	                deferred.reject(new Error("Geolocation is not supported"));
	            });
	        } else {
	            $window.navigator.geolocation.getCurrentPosition(function (position) {
	                $rootScope.$apply(function() {
	                    deferred.resolve(position);
	                });
	            }, function (error) {
	                $rootScope.$apply(function() {
	                    deferred.reject(error);
	                });
	            });
	        }

	        return deferred.promise;
	    }
	}]);
  
  app.service("UserService",['$q','$http',function($q,$http){
	  this.getPicURL = function(nick){
		  var deferred = $q.defer();

		  var USERNAME = 'harishmyemails0';
		  var API_KEY = 'be2c435bd3a692ac0c49';
		  var URL = "http://pixabay.com/api/?username="+USERNAME+"&key="+API_KEY+"&q="+encodeURIComponent(nick);
		  $http.get(URL).success( function(data){
		          deferred.resolve(data.hits)		          
		  });
		 return deferred.promise; 
	  }
	  this.sendLocation = function(position,nick,tag){
		  var deferred = $q.defer();
		  user = {nickName:nick,tagLine:tag,coOrd:position.coords};
		     $http.post('/users/nearby',user)
		       .success(function(data) { 
		          deferred.resolve(data.content);
		       }).error(function(msg, code) {
		          deferred.reject(msg);
		          console.error(msg, code);
		       });
		     return deferred.promise;
	  };
  }]);
  
