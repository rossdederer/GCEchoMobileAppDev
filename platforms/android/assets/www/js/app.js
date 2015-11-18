// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'wijmoFlexGridCtrl'
    })
    .state('app.device', {
        url: "/device",
        views: {
            'menuContent': {
                templateUrl: "templates/mainView.html",
                controller: 'DeviceCtrl'
            }
        }
    })
    
    .state('app.addUser', {
        url: "/addUser",
        views: {
            'menuContent': {
                templateUrl: "templates/addUser.html",
                controller: 'wijmoFlexGridCtrl'
            }
        }
    })

    .state('app.wijmoFlexGrid', {
            url: "/wijmoFlexGrid",
            views: {
                'menuContent': {
                    templateUrl: "templates/wijmoFlexGrid.html",
                    controller: 'wijmoFlexGridCtrl'
                }
            }
        })
        .state('app.wijmoFlexChart', {
            url: "/wijmoFlexChart",
            views: {
                'menuContent': {
                    templateUrl: "templates/wijmoFlexChart.html",
                    controller: 'wijmoFlexGridCtrl'
                }
            }
        })
        .state('app.dynamicChart', {
            url: "/dynamicChart",
            views: {
                'menuContent': {
                    templateUrl: "templates/dynamicChart.html",
                    controller: 'DynamicChartCtrl'
                }
            }
        })
       // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/device');
});
