appService.factory('HttpInterceptor', ['$q', '$location', function($q, $location) {
	return {
		responseError : function(error) {
			if (error.status == 401) {
				//Do something
			}
		}
	}
}]);
