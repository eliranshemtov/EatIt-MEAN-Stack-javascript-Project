/**
 * Created by Eliran on 8/9/2016.
 */
angular.module('cookApp').factory('dishes', ['$http', 'auth', function ($http, auth) {
    var d = {
        dishes: [],
        dishesByUserContainer: [],
        owner: []
    };

    d.getAll = function () {
        return $http.get('/dishes').success(function (data) {
            angular.copy(data, d.dishes);
            angular.copy(data, d.dishesByUserContainer);
        });
    };

    d.getDishOwnerId = function (dishId) {
        d.get(dishId).then(function (data) {
            console.log(data.owner);
            angular.copy(data.owner, d.owner);
            return data.owner;
        });
    };

    d.postParamAndGetRecipe = function (ingredient) {



        var invocation = new XMLHttpRequest();
        var link = 'http://www.recipepuppy.com/api/?i=' + ingredient;


        var answer =$http.get(link , {
            headers: { "Access-Control-Allow-Origin": "*"}
        });


        //var answer = $http.get(link, config);
        answer.then(function () {
            console.log('Server Replied. good!')
        });
        return answer;
    };

    d.getAllByUserId = function (userId) {
        return $http.get('/myDishes/'+ userId).success(function (data) {
            angular.copy(data, d.dishesByUserContainer);
        });
    };

    d.create = function (dish) {
        return $http.post('/dishes', dish, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            d.dishes.push(data);
        });
    };

    d.upvote = function (dish) {
        return $http.put('/dishes/' +dish._id + '/upvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            dish.upvotes += 1;
        });
    };

    d.get = function (id) {
        return $http.get('/dishInfo/' + id).then(function (res) {
            return res.data;
        });
    };

    d.addComment = function (id, comment) {
        return $http.post('dishes' + id + '/comments', comment, {
            headers: {Authorization: 'Bearer ' +auth.getToken()}
        });
    };

    d.queryDishesByParams = function(searchGenre, searchCity, price, courseType){
      var params = {};
      if(searchGenre != null){
          params.param1 = searchGenre;
      };
      if(searchCity != null){
          params.param2 = searchCity;
      }
      if(price != null){
          params.param3 = price;
      }
      if(courseType != null){
          params.param4 = courseType;
      }
          var answer = $http.post('/dishesSearch/' + searchGenre + "/" + searchCity + "/" + price + "/" + courseType, params);
          answer.then(function () {
              console.log('Server Replied. good!')
          });
          return answer;
    };



    return d;
}]);