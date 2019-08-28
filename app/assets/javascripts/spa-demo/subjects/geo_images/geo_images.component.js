(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdGeoImages", {
      templateUrl: geoImagesTemplateUrl,
      controller: GeoImagesController,
    });

  geoImagesTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function geoImagesTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.geo_images_html;
  }  

  GeoImagesController.$inject = ["$rootScope",
                                 "spa-demo.geoloc.currentOrigin",
                                 "spa-demo.config.APP_CONFIG",
                                 "spa-demo.subjects.GeoImages"];
  function GeoImagesController($rootScope, co, APP_CONFIG, GeoImages) {
    var vm=this;
    vm.toRemove={};
    vm.images = [];
    vm.title = "Images";

    vm.reset=reset;
    vm.refresh=refresh;
    vm.exclude_ids=exclude_ids;
    
    vm.$postLink = function() {
      $rootScope.$watch(function(){ return co.getVersion(); }, refresh);
    }
    return;
    //////////////
    function refresh() {
      GeoImages.query(params()).$promise.then(
        function(images){
          vm.images=images;
          vm.title = co.getDistance() && co.getFormattedAddress()
            ? "Images within " + co.getDistance() + " miles of " + co.getFormattedAddress()
            : "Images";
      });      
    }
    function params() {
      var params=co.getPosition();
      if (!params || !params.lng || !params.lat) {
        params = angular.copy(APP_CONFIG.default_position);
      } else {
        params["distance"]=true;
      }
      if (co.getDistance() > 0) {
        params["miles"]=co.getDistance();
      }
      params["exclude_ids[]"]=exclude_ids();
      params["order"]="ASC";
      console.log("params",params);
      return params;
    }
    function exclude_ids() {
      return Object.keys(vm.toRemove).filter(function(key){return vm.toRemove[key];});
    }
    function reset() {
      vm.toRemove={};
      refresh();
    }
  }

})();
