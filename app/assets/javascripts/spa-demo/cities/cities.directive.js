(function() {
    "use strict";

    angular
        .module("spa-demo.cities")
        .directive("sdCities", CitiesDirective);
        //sd-cities

    CitiesDirective.$inject = ["spa-demo.config.APP_CONFIG"];

    /* @ngInject */
    function CitiesDirective(APP_CONFIG) {
        var directive = {
        	templateUrl: APP_CONFIG.cities_html,
        	replace: true,
            bindToController: true,
            controller: "spa-demo.cities.CitiesController",
            controllerAs: "citiesVM",
            link: link,
            restrict: 'E',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
        	console.log("CitiesDirective", scope);
        }
    }
})();