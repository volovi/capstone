(function() {
    "use strict";

    angular
        .module("spa-demo.cities")
        .factory("spa-demo.cities.City", CityFactory);

    CityFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

    /* @ngInject */
    function CityFactory($resource, APP_CONFIG) {
    	return $resource(APP_CONFIG.server_url + "/api/cities/:id",
    		{ id: '@id'},
    		{ 
                update: { method: "PUT",
                        transformRequest: buildNestedBody },
                save: { method: "POST",
                        transformRequest: buildNestedBody }
    	    }
    	    );
    }

    function buildNestedBody(data) {
        return angular.toJson({city: data})
    }
})();