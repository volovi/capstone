(function() {
  "use strict";

  angular
    .module("spa-demo.tripStops")
    .component("sdCurrentStops", {
      templateUrl: stopsTemplateUrl,
      controller: CurrentStopsController,
    })
    .component("sdCurrentStopInfo", {
      templateUrl: stopInfoTemplateUrl,
      controller: CurrentStopInfoController,
    })
    ;

  stopsTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function stopsTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_stops_html;
  }    
  stopInfoTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function stopInfoTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_stop_info_html;
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

  CurrentStopInfoController.$inject = ["$scope",
                                       "spa-demo.tripStops.currentTripStops",
                                       "spa-demo.subjects.Thing",
                                       "spa-demo.authz.Authz"];
  function CurrentStopInfoController($scope,currentTripStops,Thing,Authz) {
    var vm=this;
    vm.nextStop = currentTripStops.nextStop;
    vm.previousStop = currentTripStops.previousStop;

    vm.$onInit = function() {
      console.log("CurrentStopInfoController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentTripStops.getCurrentStop(); },
        newStop
      );
      $scope.$watch(
        function() { return Authz.getAuthorizedUserId(); },
        function() { newStop(currentTripStops.getCurrentStop()); }
      );

    }    
    return;
    //////////////
    function newStop(link) {
      vm.link = link;
      vm.stop = null;
      if (link && link.stop_id) {
        vm.stop=Thing.get({id:link.stop_id});
      }
    }
  }

})();
