(function() {
  "use strict";

  angular
    .module("spa-demo.tripStops")
    .component("sdCurrentTripStopsMap", {
      template: "<div id='map'></div>",
      controller: CurrentTripStopsMapController,
      bindings: {
        zoom: "@"
      }
    });

  CurrentTripStopsMapController.$inject = ["$scope", "$q", "$element",
                                           "spa-demo.geoloc.currentOrigin",
                                           "spa-demo.geoloc.myLocation",
                                           "spa-demo.geoloc.Map",
                                           "spa-demo.tripStops.currentTripStops",
                                           "spa-demo.config.APP_CONFIG"];
  function CurrentTripStopsMapController($scope, $q, $element, 
                                        currentOrigin, myLocation, Map, currentTripStops, 
                                        APP_CONFIG) {
    var vm=this;

    vm.$onInit = function() {
      console.log("CurrentTripStopsMapController",$scope);
    }
    vm.$postLink = function() {
      var element = $element.find('div')[0];
      getLocation().then(
        function(location){
          vm.location = location;
          initializeMap(element, location.position);
        });

      $scope.$watch(
        function(){ return currentTripStops.getStops(); }, 
        function(stops) { 
          vm.stops = stops; 
          displayTripStops(); 
        }); 
      $scope.$watch(
        function(){ return currentTripStops.getCurrentStop(); }, 
        function(link) {
          if (link) {
            vm.setActiveMarker(link.trip_id, link.stop_id); 
          } else {
            vm.setActiveMarker(null,null);
          }
        });
      $scope.$watch(
        function(){ 
            return vm.map ? vm.map.getCurrentMarker() : null; },
        function(marker) {
          if (marker) {
            console.log("map changed markers", marker);
            currentTripStops.setCurrentTripStopId(marker.trip_id, marker.stop_id);
          }
        }); 
      $scope.$watch(
        function() { return currentOrigin.getLocation(); },
        function(location) { 
          vm.location = location;
          vm.updateOrigin(); 
        });       
    }

    return;
    //////////////
    function getLocation() {
      var deferred = $q.defer();

      //use current address if set
      var location = currentOrigin.getLocation();
      if (!location) {
        //try my location next
        myLocation.getCurrentLocation().then(
          function(location){
            deferred.resolve(location);
          },
          function(){
            deferred.resolve({ position: APP_CONFIG.default_position});
          });
      } else {
        deferred.resolve(location);
      }

      return deferred.promise;
    }

    function initializeMap(element, position) {
      vm.map = new Map(element, {
        center: position,        
        zoom: vm.zoom || 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      displayTripStops();  
    }

    function displayTripStops(){
      if (!vm.map) { return; }
      vm.map.clearMarkers();
      vm.map.displayOriginMarker(vm.originInfoWindow(vm.location));

      angular.forEach(vm.stops, function(ts){
        displayTripStop(ts);
      });
    }

    function displayTripStop(ts) {
      var markerOptions = {
        position: {
          lng: ts.position.lng,
          lat: ts.position.lat
        },
        trip_id: ts.trip_id,
        stop_id: ts.stop_id          
      };
      if (ts.trip_id && ts.priority===0) {
        markerOptions.title = ts.trip_name;
        markerOptions.icon = APP_CONFIG.trip_marker;
        markerOptions.content = vm.tripInfoWindow(ts);
      } else if (ts.trip_id) {
        markerOptions.title = ts.trip_name;
        markerOptions.icon = APP_CONFIG.secondary_marker;
        markerOptions.content = vm.tripInfoWindow(ts);
      } else {
        markerOptions.title = ts.stop_name;
        markerOptions.icon = APP_CONFIG.orphan_marker;
        markerOptions.content = vm.stopInfoWindow(ts);
      }
      vm.map.displayMarker(markerOptions);    
    }
  }

  CurrentTripStopsMapController.prototype.updateOrigin = function() {
    if (this.map && this.location) {
      this.map.center({ 
        center: this.location.position
      });
      this.map.displayOriginMarker(this.originInfoWindow(this.location));
    }
  }

  CurrentTripStopsMapController.prototype.setActiveMarker = function(trip_id, stop_id) {
    if (!this.map) { 
      return; 
    } else if (!trip_id && !stop_id) {
      if (this.map.getCurrentMarker().title!=='origin') {
        this.map.setActiveMarker(null);
      }
    } else {
      var markers=this.map.getMarkers();
      for (var i=0; i<markers.length; i++) {
        var marker=markers[i];
        if (marker.trip_id === trip_id && marker.stop_id === stop_id) {
            this.map.setActiveMarker(marker);
            break;
        }
      }
    } 
  }

  CurrentTripStopsMapController.prototype.originInfoWindow = function(location) {
    console.log("originInfo", location);
    var full_address = location ? location.formatted_address : "";
    var lng = location && location.position ? location.position.lng : "";
    var lat = location && location.position ? location.position.lat : "";
    var html = [
      "<div class='origin'>",
        "<div class='full_address'>"+ full_address + "</div>",
        "<div class='position'>",
          "lng: <span class='lng'>"+ lng +"</span>",
          "lat: <span class='lat'>"+ lat +"</span>",
        "</div>",
      "</div>",
    ].join("\n");

    return html;
  }

  CurrentTripStopsMapController.prototype.tripInfoWindow = function(ts) {
    console.log("tripInfo", ts);
    var html ="<div class='trip-marker-info'><div>";
      html += "<span class='id ti_id'>"+ ts.id+"</span>";
      html += "<span class='id trip_id'>"+ ts.trip_id+"</span>";
      html += "<span class='id stop_id'>"+ ts.stop_id+"</span>";
      html += "<span class='trip-name'>"+ ts.trip_name + "</span>";
      if (ts.stop_name) {
        html += "<span class='stop-name'> ("+ ts.stop_name + ")</span>";      
      }
      if (ts.distance) {
        html += "<span class='distance'> ("+ Number(ts.distance).toFixed(1) +" mi)</span>";
      }
      html += "</div><img src='"+ ts.image_content_url+"?width=200'>";
      html += "</div>";
    return html;
  }

  CurrentTripStopsMapController.prototype.stopInfoWindow = function(ts) {
    console.log("stopInfo", ts);
    var html ="<div class='stop-marker-info'><div>";
      html += "<span class='id stop_id'>"+ ts.stop_id+"</span>";
      if (ts.stop_name) {
        html += "<span class='stop-name'>"+ ts.stop_name + "</span>";      
      }
      if (ts.distance) {
        html += "<span class='distance'> ("+ Number(ts.distance).toFixed(1) +" mi)</span>";
      }
      html += "</div><img src='"+ ts.image_content_url+"?width=200'>";
      html += "</div>";
    return html;
  }

})();
