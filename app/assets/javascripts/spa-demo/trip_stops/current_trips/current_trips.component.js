(function() {
  "use strict";

  angular
    .module("spa-demo.tripStops")
    .component("sdCurrentTrips", {
      templateUrl: tripsTemplateUrl,
      controller: CurrentTripsController,
    })
    .component("sdCurrentTripInfo", {
      templateUrl: tripInfoTemplateUrl,
      controller: CurrentTripInfoController,
    })
    ;

  tripsTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function tripsTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_trips_html;
  }    
  tripInfoTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function tripInfoTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.current_trip_info_html;
  }    

  CurrentTripsController.$inject = ["$scope",
                                    "spa-demo.tripStops.currentTripStops"];
  function CurrentTripsController($scope,currentTripStops) {
    var vm=this;
    vm.tripClicked = tripClicked;
    vm.isCurrentTrip = currentTripStops.isCurrentTripIndex;

    vm.$onInit = function() {
      console.log("CurrentTripsController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentTripStops.getTrips(); }, 
        function(trips) { vm.trips = trips; }
      );
    }    
    return;
    //////////////
    function tripClicked(index) {
      currentTripStops.setCurrentTrip(index);
    }    
  }

  CurrentTripInfoController.$inject = ["$scope",
                                       "spa-demo.tripStops.currentTripStops",
                                       "spa-demo.tripStops.Trip"];
  function CurrentTripInfoController($scope,currentTripStops,Trip) {
    var vm=this;
    vm.nextTrip = currentTripStops.nextTrip;
    vm.previousTrip = currentTripStops.previousTrip;

    vm.$onInit = function() {
      console.log("CurrentTripInfoController",$scope);
    }
    vm.$postLink = function() {
      $scope.$watch(
        function() { return currentTripStops.getCurrentTrip(); }, 
        newTrip 
      );
    }    
    return;
    //////////////
    function newTrip(link) {
      vm.link = link; 
      vm.trip = null;
      if (link && link.trip_id) {
        vm.trip=Trip.get({id:link.trip_id});
      }
    }
  }
})();
