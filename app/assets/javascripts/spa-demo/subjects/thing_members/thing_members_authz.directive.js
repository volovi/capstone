(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .directive("sdThingMembersAuthz", ThingMembersAuthzDirective);

  ThingMembersAuthzDirective.$inject = [];

  function ThingMembersAuthzDirective() {
    var directive = {
        bindToController: true,
        controller: ThingMembersAuthzController,
        controllerAs: "vm",
        restrict: "A",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
      console.log("ThingMembersAuthzDirective", scope);
    }
  }

  ThingMembersAuthzController.$inject = ["$scope", 
                                         "spa-demo.subjects.ThingMembersAuthz"];

  function ThingMembersAuthzController($scope, ThingMembersAuthz) {
    var vm = this;
    vm.authz={};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem=newItem;

    activate();
    return;
    //////////
    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
      ThingMembersAuthz.getAuthorizedUser().then(
        function(user){ authzUserItem(item, user); },
        function(user){ authzUserItem(item, user); });
    }

    function authzUserItem(item, user) {
      console.log("new Item/Authz", item, user);

      vm.authz.authenticated = ThingMembersAuthz.isAuthenticated();
      vm.authz.canQuery      = ThingMembersAuthz.canQuery();
      vm.authz.canCreate = ThingMembersAuthz.canCreate();
      if (item && item.$promise) {
        vm.authz.canUpdate     = false;
        vm.authz.canDelete     = false;
        vm.authz.canGetDetails = false;
        item.$promise.then(function(){ checkAccess(item); });
      } else {
        checkAccess(item)
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate     = ThingMembersAuthz.canUpdate(item);
      vm.authz.canDelete     = ThingMembersAuthz.canDelete(item);
      vm.authz.canGetDetails = ThingMembersAuthz.canGetDetails(item);
      console.log("checkAccess", item, vm.authz);
    }    

    function canUpdateItem(item) {
      return ThingMembersAuthz.canUpdate(item);
    }    
  }
})();