(function() {
  "use strict";

  angular
    .module("spa-demo.tripStops")
    .component("sdCurrentStops", {
      templateUrl: stopsTemplateUrl,
      controller: CurrentStopsController,
    })
    .component("sdCurrentImageViewerX", {
      templateUrl: imageViewerTemplateUrl,
      controller: CurrentImageViewerController,
      bindings: {
        name: "@",
        minWidth: "@"
      }
    })
    ;

  stopsTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function stopsTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_stops_html;
  }    
  imageViewerTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function imageViewerTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_image_viewer_html;
  }    

  CurrentStopsController.$inject = ["$scope",
                                    "spa-demo.tripStops.currentTripStops"];
  function CurrentStopsController($scope, currentTripStops) {
    var vm=this;
    vm.stopClicked = stopClicked;
    vm.isCurrentStop = currentTripStops.isCurrentStopIndex;

    vm.$onInit = function() {
      console.log("CurrentStopsController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentTripStops.getStops(); }, 
        function(stops) { vm.stops = stops; }
      );
    }    
    return;
    //////////////
    function stopClicked(index) {
      currentTripStops.setCurrentStop(index);
    }
  }

  CurrentImageViewerController.$inject = ["$scope",
                                          "spa-demo.subjects.currentSubjects"];
  function CurrentImageViewerController($scope, currentSubjects) {
    var vm=this;
    vm.viewerIndexChanged = viewerIndexChanged;

    vm.$onInit = function() {
      console.log("CurrentImageViewerController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentSubjects.getImages(); }, 
        function(images) { vm.images = images; }
      );
      $scope.$watch(
        function() { return currentSubjects.getCurrentImageIndex(); }, 
        function(index) { vm.currentImageIndex = index; }
      );
    }    
    return;
    //////////////
    function viewerIndexChanged(index) {
      console.log("viewer index changed, setting currentImage", index);
      currentSubjects.setCurrentImage(index);
    }
  }

})();
