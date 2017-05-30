/**
 * Created by Eliran on 8/2/2016.
 */
mainApp.controller('MainCtrl', [
    '$scope', 'posts', 'auth',
    function ($scope, posts, auth) {
        $scope.test = 'Hello World!';
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.posts = posts.posts;
        $scope.users = auth.users;

        // Switch between modules
        $scope.cook = function () {
            window.location.replace('/cook');
        };
        $scope.diner = function () {
            window.location.replace('/diner');
        };
        $scope.admin = function () {
            window.location.replace('/admin');
        }

        $scope.addPost = function () {
            if(!$scope.title || $scope.title === '') {return;}
            posts.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };
        $scope.incrementUpvotes = function(post) {
            posts.upvote(post);
        };

    }
]);