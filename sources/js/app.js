angular.module('demo', ['demo.controllers', 'demo.services', 'ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: '/templates/pages/home.html',
        controller: 'DemoCtrl'
      }).otherwise({
        redirectTo: '/home'
      });

      $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

      $httpProvider.interceptors.push('HttpInterceptor');
  }]);

var appService = angular.module('demo.services', []);

var appController = angular.module('demo.controllers', []);
