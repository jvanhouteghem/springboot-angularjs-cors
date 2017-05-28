//source : https://github.com/spring-guides/tut-spring-security-and-angular-js/issues/121

angular.module('hello', [ 'ngRoute' ]).config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home',
		controllerAs: 'controller'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'navigation',
		controllerAs: 'controller'
	}).otherwise('/');

    //$httpProvider.defaults.xsrfCookieName = 'csrftoken';
    //$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}).controller('navigation',

		function($rootScope, $http, $location, $route) {
			
			var self = this;

			self.tab = function(route) {
				return $route.current && route === $route.current.controller;
			};

			var authenticate = function(credentials, callback) {

				var headers = credentials ? {
					authorization : "Basic "
							+ btoa(credentials.username + ":"
									+ credentials.password)
				} : {};

				$http.get('http://localhost:8080/user', {//$http.get('user', {
					headers : headers
				}).then(function(response) {
					if (response.data.name) {
						$rootScope.authenticated = true;
					} else {
						$rootScope.authenticated = false;
					}
					callback && callback($rootScope.authenticated);
				}, function() {
					$rootScope.authenticated = false;
					callback && callback(false);
				});

			}

			authenticate();

			self.credentials = {};
			self.login = function() {
				authenticate(self.credentials, function(authenticated) {
					if (authenticated) {
						console.log("Login succeeded")
						$location.path("/");
						self.error = false;
						$rootScope.authenticated = true;
					} else {
						console.log("Login failed")
						$location.path("/login");
						self.error = true;
						$rootScope.authenticated = false;
					}
				})
			};

			self.logout = function() {
				$http.post('http://localhost:8080/logout', {}).finally(function() {
					$rootScope.authenticated = false;
					$location.path("/");
				});
			}

		}).controller('home', function($http, $rootScope) {
	var self = this;

	// -----
	// Before
	/*$http.get('http://localhost:8080/resource/').then(function(response) {
		self.greeting = response.data;
	})
	*/
	// -----
	// After
	function getCookie(name) {
	if (!document.cookie) {
		return null;
	}

	const xsrfCookies = document.cookie.split(';')
		.map(c => c.trim())
		.filter(c => c.startsWith(name + '='));

	if (xsrfCookies.length === 0) {
		return null;
	}

	return decodeURIComponent(xsrfCookies[0].split('=')[1]);
	}

	var tmpXsrfToken = getCookie('XSRF-TOKEN');
	console.log(tmpXsrfToken);
	//$http.get('http://localhost:8080/resource/').then(function(response) {
	$http.get('http://localhost:8080/resource/', {headers : {authorization : "Basic " + btoa("user:password")}}).then(function(response) {
	//$http.get('http://localhost:8080/resource/', {headers : {'X-XSRF-TOKEN' : tmpXsrfToken}}).then(function(response) {
		console.log(response);
		self.greeting = response.data;
	})
});
