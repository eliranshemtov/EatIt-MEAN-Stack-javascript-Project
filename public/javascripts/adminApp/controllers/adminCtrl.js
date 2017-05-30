/**
 * Created by Eliran on 8/14/2016.
 */
angular.module('adminApp').controller('adminCtrl', function($scope, $rootScope, $state, $stateParams, dishes, auth, orders) {
    $rootScope.title= "Admin Mode!";


    var init = function () {
        var courseTypes = {
            'First Course': 0,
            'Main Dish': 0,
            'Desert': 0
        };
        var answer = dishes.getAll();
        answer.then(function (promiseVal) {
           var allDishes = promiseVal.data;
            for(dish in allDishes){
                var tmp = allDishes[dish].course;
                courseTypes[tmp] += 1;
            };
            var allDishesAmount = allDishes.length;
            $scope.firstCoursePrecentage = ((courseTypes['First Course'] / allDishesAmount) * 100).toFixed(1);
            $scope.mainDishPrecentage = ((courseTypes['Main Dish']/ allDishesAmount) * 100).toFixed(1);
            $scope.desertPrecentage = ((courseTypes['Desert']/ allDishesAmount) * 100).toFixed(1);
            $scope.gauge1 = loadLiquidFillGauge("fillgauge1", $scope.firstCoursePrecentage, config1);
            $scope.gauge2= loadLiquidFillGauge("fillgauge2", $scope.mainDishPrecentage, config2);
            $scope.gauge3 = loadLiquidFillGauge("fillgauge3", $scope.desertPrecentage, config3);
        });
    };



    var config1 = liquidFillGaugeDefaultSettings();
    config1.circleColor = "#37474F";
    config1.textColor = "#37474F";
    config1.waveTextColor = "#37474F";
    config1.waveColor = "#607D8B";
    config1.circleThickness = 0.1;
    config1.textVertPosition = 0.2;
    config1.waveAnimateTime = 1500;


    var config2 = liquidFillGaugeDefaultSettings();
    config2.circleColor = "#37474F";
    config2.textColor = "#37474F";
    config2.waveTextColor = "#37474F";
    config2.waveColor = "#607D8B";
    config2.circleThickness = 0.1;
    config2.textVertPosition = 0.2;
    config2.waveAnimateTime = 1500;

    var config3 = liquidFillGaugeDefaultSettings();
    config3.circleColor = "#37474F";
    config3.textColor = "#37474F";
    config3.waveTextColor = "#37474F";
    config3.waveColor = "#607D8B";
    config3.circleThickness = 0.1;
    config3.textVertPosition = 0.2;
    config3.waveAnimateTime = 1500;






    var initBubbles = function () {
        var bubbleChart = new d3.svg.BubbleChart(
            {
            supportResponsive: true,
            // container: => use @default
            size: 600,
            //viewBoxSize: => use @default
            innerRadius: 400 / 3.5,
            //outerRadius: => use @default
            radiusMin: 50,
            data : $scope.data,
            plugins: [
                {
                    name: "lines",
                    options: {
                        format: [
                            {// Line #0
                                textField: "count",
                                classed: {count: true},
                                style: {
                                    "font-size": "28px",
                                    "font-family": "Source Sans Pro, sans-serif",
                                    "text-anchor": "middle",
                                    fill: "white"
                                },
                                attr: {
                                    dy: "0px",
                                    x: function (d) {return d.cx;},
                                    y: function (d) {return d.cy;}
                                }
                            },
                            {// Line #1
                                textField: "text",
                                classed: {text: true},
                                style: {
                                    "font-size": "14px",
                                    "font-family": "Source Sans Pro, sans-serif",
                                    "text-anchor": "middle",
                                    fill: "white"
                                },
                                attr: {
                                    dy: "20px",
                                    x: function (d) {return d.cx;},
                                    y: function (d) {return d.cy;}
                                }
                            }
                        ],
                        centralFormat: [
                            {// Line #0
                                style: {"font-size": "50px"},
                                attr: {}
                            },
                            {// Line #1
                                style: {"font-size": "30px"},
                                attr: {dy: "40px"}
                            }
                        ]
                    }
                }]
        });
    };




var groubByGenres = function (initBubbles) {
    $scope.data = {
        eval: function (item) {return item.count;},
        classed: function (item) {return item.text.split(" ").join("");}
    };
    var items = [];
    var answer = auth.groupUsersByGenre();
    answer.then(function (groupsOfGenres) {
        for(var genre in groupsOfGenres){
            if(groupsOfGenres.hasOwnProperty(genre)){
                items.push({text: groupsOfGenres[genre]._id, count: groupsOfGenres[genre].count});
            }
        }
        $scope.data.items = items;
        initBubbles();
    });
};

// Init runs to get the course types and init the first graph
    // groupByGenres runs a groupby query and gets a count for the cooks genres,
    // and sets it into the second graph
    init();
    groubByGenres(initBubbles);


});