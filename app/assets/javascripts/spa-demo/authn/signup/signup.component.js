(function() {
  "use strict";

  angular
    .module("spa-demo.authn")
    .component("sdSignup", {
      templateUrl: templateUrl,
      controller: SignupController,
    });


  templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function templateUrl(APP_CONFIG) {
    return APP_CONFIG.authn_signup_html;
  }    

  SignupController.$inject = ["$scope","$state",
                              "spa-demo.authn.Authn",
                              "spa-demo.layout.DataUtils",
                              "spa-demo.subjects.Image"];
  function SignupController($scope, $state, Authn, DataUtils, Image) {
    var vm=this;
    vm.signupForm = {}
    vm.signup = signup;
    vm.setImageContent = setImageContent;
    vm.button_text = "Sign Up";

    vm.$onInit = function() {
      console.log("SignupController",$scope);
      vm.item = new Image();
    }
    return;
    //////////////
    function setImageContent(dataUri) {
      console.log("setImageContent", dataUri ? dataUri.length : null);
      vm.item.image_content = DataUtils.getContentFromDataUri(dataUri);
    }

    function signup() {
      console.log("signup...");

      if (vm.button_text == "Skip") {
        $state.go("home");
        return;
      }

      Authn.signup(vm.signupForm)
        .then(uploadImage)
        .catch(handleError)
        .then(goHome);

    }

    function goHome(response) {
      console.log("response: ", response);
      Authn.validateUser();
      $state.go("home");
    }

    function uploadImage(response) {
      vm.id = response.data.data.id;
      console.log("signup complete", response.data, vm);
      if (vm.item.image_content) {
        vm.item.user_id = vm.id;
        return vm.item.$save();
      }
    }

    function handleError(response) {
      vm.signupForm["errors"]=response.data.errors;
      console.log("failure", response, vm);
      if (vm.id) {
        vm.button_text = "Skip";
        Authn.validateUser();
      }
      $scope.signup_form.$setPristine();
      throw new Error();
    }

  }
})();