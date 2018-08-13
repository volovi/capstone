(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdThingMemberSelector", {
      templateUrl: thingMemberSelectorTemplateUrl,
      controller: ThingMemberSelectorController,
      bindings: {
        authz: "<"
      }
    });

  thingMemberSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function thingMemberSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.thing_member_selector_html;
  }

  ThingMemberSelectorController.$inject = ["$scope", "$q",
                                            "$state",
                                            "$stateParams",
                                            "spa-demo.authz.Authz",
                                            "spa-demo.subjects.Role",
                                            "spa-demo.subjects.Thing",
                                            "spa-demo.subjects.ThingMember"];
  function ThingMemberSelectorController($scope, $q, $state, $stateParams, Authz, Role, Thing, ThingMember) {
    var vm = this;
    vm.clear = clear;
    vm.update = update;
    vm.haveDirtyAssignments = haveDirtyAssignments;

    vm.$onInit = function() {
      console.log("ThingMemberSelectorController",$scope)
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); }, 
                    function(){ 
                      if (!$stateParams.id) {
                        reload($stateParams.thing_id);
                      }
                    });
    }
    
    return;
    /////////////

    function reload(thingId) {
      var itemId = thingId ? thingId : vm.item.id;
      console.log("re/loading thing", itemId);
      vm.item = Thing.get({id:itemId});
      vm.items = ThingMember.query({thing_id:itemId}); 
      $q.all([vm.item.$promise, vm.items.$promise]
        ).then(function(response) {
            angular.forEach(vm.items, function(tm) {
              tm.originalMember = tm.member = !!tm.role_id;
              tm.currentUser = Authz.getAuthorizedUserId() === tm.id;
            });
          }).catch(handleError);
    }
    
    function update() {
      var promises=[];

      angular.forEach(vm.items, function(tm){
        if (tm.originalMember != tm.member) {
          if (tm.member) {
            var role = {role_name:'member', mname:'Thing', mid:vm.item.id, user_id:tm.id};
            promises.push(Role.save(role).$promise);
          } else {
            promises.push(Role.remove({id:tm.role_id}).$promise);
          }
        }
      });

      console.log("waiting for promises", promises);
      $q.all(promises).then(
        function(response){
          console.log("promise.all response", response);
          reload();
        },
        handleError);
    }

    function clear() {
      console.log("clear");
      $state.go('things', {id:vm.item.id});
    }

    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm["errors"]=response.data.errors;          
      } 
      if (!vm.errors) {
        vm["errors"]={}
        vm["errors"]["full_messages"]=[response]; 
      }
    }

    function haveDirtyAssignments() {
      for (var i=0; vm.items && i<vm.items.length; i++) {
        var tm=vm.items[i];
        if (tm.originalMember != tm.member) {
          return true;
        }        
      }
      return false;
    }    

  }

})();

