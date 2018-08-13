(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ThingMembersAuthz", ThingMembersAuthzFactory);

  ThingMembersAuthzFactory.$inject = ["spa-demo.authz.Authz",
                                "spa-demo.authz.BasePolicy"];
  function ThingMembersAuthzFactory(Authz, BasePolicy) {
    function ThingMembersAuthz() {
      BasePolicy.call(this, "ThingMember");
    }

      //start with base class prototype definitions
    ThingMembersAuthz.prototype = Object.create(BasePolicy.prototype);
    ThingMembersAuthz.constructor = ThingMembersAuthz;

      //override and add additional methods
    //ThingMembersAuthz.prototype.canCreate=function() {
    //  return Authz.isAuthenticated();
    //};

    return new ThingMembersAuthz();
  }
})();