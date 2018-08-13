(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ThingMember", ThingMemberFactory);

  ThingMemberFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function ThingMemberFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/members/",
      { thing_id: '@thing_id'}
      );
  }

})();
