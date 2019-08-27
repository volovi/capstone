(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.GeoImages", GeoImagesFactory);

  GeoImagesFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

  function GeoImagesFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/geo_images",{},{
      query: { cache:false, isArray:true }
    });
  }
})();
