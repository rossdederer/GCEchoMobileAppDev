angular.module('starter.controllers', ['ngCordova','ionic','wj'])

.controller('AppCtrl', function() {})

.controller('DeviceCtrl', function($ionicPlatform, $scope, $cordovaDevice) {
    $ionicPlatform.ready(function() {
        $scope.$apply(function() {
            // getting device infor from $cordovaDevice
            var device = $cordovaDevice.getDevice();
            //alert("");
            $scope.manufacturer = device.manufacturer;
            $scope.model = device.model;
            $scope.platform = device.platform;
            $scope.uuid = device.uuid;
        });

    });
})
.controller('wijmoFlexGridCtrl', function($ionicPlatform, $scope)
{
     // Create Data Element   
        var data = [
 
  {
    "pName":"Francisco Cervelli",
    "GP":130,
    "AB":451,
    "R":56,
    "H":133,
    "BA":0.295,
    "OPS":0.771,
    "OWAR":3.4
  },
  {
    "pName":"Andrew McCutchen",
    "GP":157,
    "AB":566,
    "R":91,
    "H":165,
    "BA":0.292,
    "OPS":0.889,
    "OWAR":5.7
  },
  {
    "pName":"Chris Stewart",
    "GP":58,
    "AB":159,
    "R":9,
    "H":46,
    "BA":0.289,
    "OPS":0.659,
    "OWAR":0.2
  },
  {
    "pName":"Jung Ho Kang",
    "GP":126,
    "AB":421,
    "R":60,
    "H":121,
    "BA":0.287,
    "OPS":0.816,
    "OWAR":3.5
  },
  {
    "pName":"Josh Harrison",
    "GP":114,
    "AB":418,
    "R":57,
    "H":120,
    "BA":0.287,
    "OPS":0.717,
    "OWAR":1.6
  },
  {
    "pName":"Starling Marte",
    "GP":153,
    "AB":579,
    "R":84,
    "H":166,
    "BA":0.287,
    "OPS":0.78,
    "OWAR":2.6
  },
  {
    "pName":"Michael Morse",
    "GP":45,
    "AB":69,
    "R":6,
    "H":19,
    "BA":0.275,
    "OPS":0.782,
    "OWAR":0.3
  },
  {
    "pName":"Neil Walker",
    "GP":151,
    "AB":543,
    "R":69,
    "H":146,
    "BA":0.269,
    "OPS":0.756,
    "OWAR":2.6
  },
  {
    "pName":"Gregory Polanco",
    "GP":153,
    "AB":593,
    "R":83,
    "H":152,
    "BA":0.256,
    "OPS":0.701,
    "OWAR":1.2
  },
  {
    "pName":"Sean Rodriguez",
    "GP":139,
    "AB":224,
    "R":25,
    "H":55,
    "BA":0.246,
    "OPS":0.642,
    "OWAR":-0.6
  },
  {
    "pName":"Aramis Ramirez",
    "GP":56,
    "AB":196,
    "R":18,
    "H":48,
    "BA":0.245,
    "OPS":0.712,
    "OWAR":0
  },
  {
    "pName":"Jordy Mercer",
    "GP":116,
    "AB":394,
    "R":34,
    "H":96,
    "BA":0.244,
    "OPS":0.613,
    "OWAR":0.3
  },
  {
    "pName":"Pedro Alvarez",
    "GP":150,
    "AB":437,
    "R":60,
    "H":106,
    "BA":0.243,
    "OPS":0.787,
    "OWAR":1.5
  },
  {
    "pName":"Travis Ishikawa",
    "GP":38,
    "AB":58,
    "R":5,
    "H":13,
    "BA":0.224,
    "OPS":0.646,
    "OWAR":-0.2
  }
];
    
        $scope.title = "Sales Figures for 2015";
        $scope.stacking= wijmo.chart.Stacking.None;
        $scope.cv = new wijmo.collections.CollectionView(data);
        $scope.labelAngle= 90;
        $scope.majorUnit= 150;
        $scope.confirmUpdate = function()
        {
            var myNewItem = $scope.cv.addNew();
            myNewItem.pName = "test1";
            myNewItem.GP = 10;
            myNewItem.AB = 100;
            
            $scope.cv.commitNew();
            $scope.chartType = wijmo.chart.ChartType.Column;
            for ( var i = 0 ; i < $scope.cv.items.length ; i++)
            {
                var item = $scope.cv.items[i];
                console.log(i +" " + item.name);
            }
        };
        $scope.ctx = {
            chart: null,
            grid: null,
        };
})

.controller('DynamicChartCtrl', function($ionicPlatform, $scope)
{
    // dynamic data
    var toAddData;
    $scope.trafficData = new wijmo.collections.ObservableArray();
    $scope.setInterval = function (interval) {
        if (toAddData) {
            clearTimeout(toAddData);
            toAddData = null;
        }
        $scope.interval = interval;
        if (interval) {
            toAddData = setTimeout(addTrafficItem);
        }
    };
    $scope.setInterval(500);

    function addTrafficItem() 
    {
        var len = $scope.trafficData.length,
            last = len ? $scope.trafficData[len - 1] : null,
            trucks = last ? last.trucks : 0,
            ships = last ? last.ships : 0,
            planes = last? last.planes : 0;
        trucks = Math.max(0, trucks + Math.round(Math.random() * 50 - 25));
        ships = Math.max(0, ships + Math.round(Math.random() * 10 - 5));
        planes = Math.max(0, planes + Math.round(Math.random() * 10 - 5));

        // add random data, limit array length
        $scope.trafficData.push({ time: new Date(), trucks: trucks, ships: ships, planes: planes });
        if ($scope.trafficData.length > 200) {
            $scope.trafficData.splice(0, 1);
        }

        // keep adding
        if ($scope.interval) {
            toAddData = setTimeout(addTrafficItem, $scope.interval);
        }
    }
})
