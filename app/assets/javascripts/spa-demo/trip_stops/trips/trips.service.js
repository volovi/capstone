(function() {
  "use strict";

  angular
    .module("spa-demo.tripStops")
    .factory("spa-demo.tripStops.Trip", TripFactory);

  TripFactory.$inject = ["$resource","spa-demo.config.APP_CONFIG"];
  function TripFactory($resource, APP_CONFIG) {
    var service = $resource(APP_CONFIG.server_url + "/api/trips/:id",
        { id: '@id'},
        { update: {method:"PUT"} }
      );
    return service;
  }
})();