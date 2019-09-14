(function() {
  "use strict";

  angular
    .module("spa-demo.tripStops")
    .service("spa-demo.tripStops.currentTripStops", CurrentTripStops);

  CurrentTripStops.$inject = ["$rootScope","$q",
                               "$resource",
                               "spa-demo.geoloc.currentOrigin",
                               "spa-demo.config.APP_CONFIG"];

  function CurrentTripStops($rootScope, $q, $resource, currentOrigin, APP_CONFIG) {
    var tripStopsResource = $resource(APP_CONFIG.server_url + "/api/trip_stops",{},{
      query: { cache:false, isArray:true }
    });
    var service = this;
    service.version = 0;
    service.trips_ = [];
    service.stops_ = [];
    service.stops = [];
    service.stopIdx = null;
    service.trips = [];
    service.tripIdx = null;
    service.refresh = refresh;
    service.isCurrentStopIndex = isCurrentStopIndex;
    service.isCurrentTripIndex = isCurrentTripIndex;
    service.nextTrip = nextTrip;
    service.previousTrip = previousTrip;
    service.nextStop = nextStop;
    service.previousStop = previousStop;

    //refresh();
    $rootScope.$watch(function(){ return currentOrigin.getVersion(); }, refresh);
    return;
    ////////////////
    function refresh() {      
      var params=currentOrigin.getPosition();
      if (!params || !params.lng || !params.lat) {
        params=angular.copy(APP_CONFIG.default_position);
      } else {
        params["distance"]=true;
      }

      if (currentOrigin.getDistance() > 0) {
        params["miles"]=currentOrigin.getDistance();
      }
      params["order"]="ASC";
      console.log("refresh",params);

      var p1=refreshStops(params);
      params["tripStop"]="trip";      
      var p2=refreshTrips(params);
      $q.all([p1,p2]).then(
        function(){
          service.doRefresh();
          //service.setCurrentStopForCurrentTrip();
        });      
    }
    function refreshStops(params) {
      var result=tripStopsResource.query(params);
      result.$promise.then(
        function(stops){
          service.stops_=stops;
          /*service.version += 1;
          if (!service.stopIdx || service.stopIdx > stops.length) {
            service.stopIdx=0;
          }*/
          console.log("refreshStops", service);
        });
      return result.$promise;
    }
    function refreshTrips(params) {
      var result=tripStopsResource.query(params);
      result.$promise.then(
        function(trips){
          service.trips_=trips;
          // service.version += 1;
          // if (!service.tripIdx || service.tripIdx > trips.length) {
          //   service.tripIdx=0;
          // }
          console.log("refreshTrips", service);
        });
      return result.$promise;
    }

    function isCurrentStopIndex(index) {
      //console.log("isCurrentStopIndex", index, service.stopIdx === index);
      return service.stopIdx === index;
    }
    function isCurrentTripIndex(index) {
      //console.log("isCurrentTripIndex", index, service.tripIdx === index);
      return service.tripIdx === index;
    }
    function nextTrip() {
      if (service.tripIdx !== null) {
        service.setCurrentTrip(service.tripIdx + 1);
      } else if (service.trips.length >= 1) {
        service.setCurrentTrip(0);
      }
    }
    function previousTrip() {
      if (service.tripIdx !== null) {
        service.setCurrentTrip(service.tripIdx - 1);
      } else if (service.trips.length >= 1) {
        service.setCurrentTrip(service.trips.length-1);
      }
    }
    function nextStop() {
      if (service.stopIdx !== null) {
        service.setCurrentStop(service.stopIdx + 1);
      } else if (service.stops.length >= 1) {
        service.setCurrentStop(0);
      }
    }
    function previousStop() {
      if (service.stopIdx !== null) {
        service.setCurrentStop(service.stopIdx - 1);
      } else if (service.stops.length >= 1) {
        service.setCurrentStop(service.stops.length-1);
      }
    }
  }

  CurrentTripStops.prototype.doRefresh = function() {
    this.trips=this.trips_;

    if (!this.tripIdx || this.tripIdx >= this.trips.length) {
      this.tripIdx=0;
    }

    this.filterStops();
    this.setCurrentStopForCurrentTrip();
  }
  CurrentTripStops.prototype.filterStops = function(){
    var trip=this.getCurrentTrip();

    this.stops=trip
      ? this.stops_.filter(function(stop){return stop.trip_id===trip.trip_id;})
      : [];
    this.version += 1;

    if (!this.stopIdx || this.stopIdx >= this.stops.length) {
      this.stopIdx=0;
    }
  }
  CurrentTripStops.prototype.getVersion = function() {
    return this.version;
  }
  CurrentTripStops.prototype.getStops = function() {
    return this.stops;
  }
  CurrentTripStops.prototype.getTrips = function() {
    return this.trips;
  }
  CurrentTripStops.prototype.getCurrentStopIndex = function() {
     return this.stopIdx;
  }
  CurrentTripStops.prototype.getCurrentStop = function() {
    return this.stops.length > 0 ? this.stops[this.stopIdx] : null;
  }
  CurrentTripStops.prototype.getCurrentTrip = function() {
    return this.trips.length > 0 ? this.trips[this.tripIdx] : null;
  }
  CurrentTripStops.prototype.getCurrentStopId = function() {
    var currentStop = this.getCurrentStop();
    return currentStop ? currentStop.stop_id : null;
  }
  CurrentTripStops.prototype.getCurrentTripId = function() {
    var currentTrip = this.getCurrentTrip();
    return currentTrip ? currentTrip.trip_id : null;
  }

  CurrentTripStops.prototype.setCurrentStop = function(index, skipTrip) {
    if (index >= 0 && this.stops.length > 0) {
      this.stopIdx = (index < this.stops.length) ? index : 0;
    } else if (index < 0 && this.stops.length > 0) {
      this.stopIdx = this.stops.length - 1;
    } else {
      this.stopIdx = null;
    }

    if (!skipTrip) {
      //this.setCurrentTripForCurrentStop();
    }

    console.log("setCurrentStop", this.stopIdx, this.getCurrentStop());
    return this.getCurrentStop();
  }

  CurrentTripStops.prototype.setCurrentTrip = function(index, skipStop) {
    if (index >= 0 && this.trips.length > 0) {
      this.tripIdx = (index < this.trips.length) ? index : 0;
    } else if (index < 0 && this.trips.length > 0) {
      this.tripIdx = this.trips.length - 1;
    } else {
      this.tripIdx=null;
    }

    this.filterStops();

    if (!skipStop) {
      this.setCurrentStopForCurrentTrip();
    }

    console.log("setCurrentTrip", this.tripIdx, this.getCurrentTrip());
    return this.getCurrentTrip();
  }

  CurrentTripStops.prototype.setCurrentTripForCurrentStop = function() {
    var stop=this.getCurrentStop();
    if (!stop || !stop.trip_id) {
      this.tripIdx = null;
    } else {
      var trip=this.getCurrentTrip();
      if (!trip || trip.trip_id !== stop.trip_id) {
        this.tripIdx=null;
        for (var i=0; i<this.trips.length; i++) {
          trip=this.trips[i];
          if (stop.trip_id === trip.trip_id) {
            this.setCurrentTrip(i, true);
            break;
          }
        }
      }      
    }
  }

  CurrentTripStops.prototype.setCurrentStopForCurrentTrip = function() {
    var stop=this.getCurrentStop();
    var trip=this.getCurrentTrip();
    if (!trip) {
      this.stopIdx=null;
    } else if ((trip && (!stop || trip.trip_id !== stop.trip_id)) || stop.priority!==0) {
      for (var i=0; i<this.stops.length; i++) {
        stop=this.stops[i];
        if (stop.trip_id === trip.trip_id && stop.priority===0) {
          this.setCurrentStop(i, true);
          break;
        }
      }
    }
  }

  CurrentTripStops.prototype.setCurrentStopId = function(stop_id, skipTrip) {
    var found=this.getCurrentStopId() === stop_id;
    if (stop_id && !found) {
      for(var i=0; i<this.stops.length; i++) {
        if (this.stops[i].stop_id === stop_id) {
          this.setCurrentStop(i, skipTrip);
          found=true;
          break;
        }
      }
    }
    if (!found) {
      this.setCurrentStop(null, true);
    }
  }
  CurrentTripStops.prototype.setCurrentTripId = function(trip_id, skipStop) {
    var found=this.getCurrentTripId() === trip_id;
    if (trip_id && !found) {
      for (var i=0; i< this.trips.length; i++) {
        if (this.trips[i].trip_id === trip_id) {
          this.setCurrentTrip(i, skipStop);
          found=true;
          break;
        }
      }
    }
    if (!found) {
      this.setCurrentTrip(null, true);
    }    
  }
  CurrentTripStops.prototype.setCurrentTripStopId = function(trip_id, stop_id) {
    console.log("setCurrentTripStop", trip_id, stop_id);
    //this.setCurrentTripId(trip_id, true);
    this.setCurrentStopId(stop_id, true);
  }
})();
