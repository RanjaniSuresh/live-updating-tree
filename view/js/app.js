var app = angular.module('starterApp', ['ngMaterial','ngRoute','ngMessages'])
.run(function($http, $rootScope){
  var factoryData = [];
  $http.get("/treeView").success(function(response){
      //console.log("response", response);
      $rootScope.factoryData = response.data;
      console.log($rootScope.factoryData);
});
});

app.factory('socket',function(){          //connecting to socket.io server
  var socket = io.connect('http://localhost:3000');
  return socket;
});

app.config(function($routeProvider){
      console.log('I am in the route');
      $routeProvider
          .when('/',{
                templateUrl: 'home.html'
          });
});

app.controller('asyncFacController', function($scope,$mdDialog,$http,socket,$rootScope) {

    $scope.factoryData = [];
    getFactoryData();    
    function getFactoryData() {
    $http.get("/treeView").success(function(response){
      console.log("response", response);
      $scope.factoryData = response.data;
   });


    $scope.deleteFactory = function(ev, facInfo){   
    console.log("Inside deleteFactory");  
    $http({
    method: 'DELETE',
    url: '/treeView',
    data: {"id" : facInfo.id},
    headers: {'Content-Type': 'application/json;charset=utf-8'}
    });
    
  }    
  socket.on('changeFeed',function(data) {   
    console.log('I am here at changeFeed');     
                                        //listening to new messages on the socket
    for(var facCounter = 0 ;facCounter < $rootScope.factoryData.length; facCounter++) {
      if($rootScope.factoryData[facCounter].id === data.id) {
        console.log(data.id);
        $rootScope.factoryData[facCounter].children = data.children;
        $rootScope.factoryData[facCounter].upper_bound = data.upper_bound;
        $rootScope.factoryData[facCounter].lower_bound = data.lower_bound;
        $rootScope.factoryData[facCounter].number_of_children = data.number_of_children;
        $rootScope.$apply();
        console.log($rootScope);
      }
    }
  }); 
}
});

app.controller('factoryController',function($scope,$mdDialog,$http,res,$rootScope) {
  console.log("factoryController ",$scope);
  $scope.formData = {};  
  function isEmpty(obj) {
      return Object.keys(obj).length === 0;
  }
  if (!isEmpty(res.formData)) {
    $scope.isUpdate = true;
    $scope.formData.id = res.formData.id;
    $scope.formData.name = res.formData.name;
    $scope.formData.lower_bound = res.formData.lower_Bound;
    $scope.formData.upper_bound = res.formData.upper_Bound;
    $scope.formData.number_of_children = res.formData.number_of_children;
  }
  
  $scope.createFactory = function(ev) {
    var factoryData = [];
    console.log($rootScope.factoryData);
    var data = {
      "name" : $scope.formData.name,
      "number_of_children" : $scope.formData.number_of_children,
      "upper_bound" : $scope.formData.upper_bound,
      "lower_bound" : $scope.formData.lower_bound
    };       
    var message = {"title" : "", "message" : ""};
    $http.post('/treeView',data).success(function(response) {
      if(response.responseCode === 0) {
        message.title = "Success !";
        message.message = "Factory created";
        data["id"] = response.data.generated_keys[0];    
        $rootScope.factoryData.push(data);
        console.log($rootScope.factoryData);   
      } else {
        message.title = "Error !";
        message.message = "Error occured when creating Factory";
      }         
      
    });
  }
  
  $scope.close_modal = function(){
    $mdDialog.hide();    
  }
  
 
  $scope.updateFactory = function(ev) { 
    console.log("Update");    
    var data = {
      "id" : $scope.formData.id,
      "name" : $scope.formData.name,
      "number_of_children" : $scope.formData.number_of_children,
      "upper_bound" : $scope.formData.upper_bound,
      "lower_bound" : $scope.formData.lower_bound
    };
    
    $http.put('/treeView',data).success(function(response) {
      var message = {"title" : "", "message" : ""};
      if(response.responseCode === 0) {
        message.title = "Success !";
        message.message = "Factory updated";     
      } else {
        message.title = "Error !";
        message.message = "Error occured when updating Factory";
      }
    });
  }

});

app.controller( 'AppCtrl', function($scope, $mdDialog) {    
  $scope.factoryModal = function(ev, data) {
     console.log("factoryModal");
     console.log($scope);
     var res = {};
     res.formData = data;
     $mdDialog.show({
     controller: 'factoryController',
     templateUrl: 'cuFac.tmpl.html',
     parent: angular.element(document.body),
     targetEvent: ev,
     clickOutsideToClose:true,
     fullscreen: $scope.customFullscreen,
     resolve: {
         res: function () {
           return res;
         }
       }

    })
    .then(function() {
      
    }, function() {

    });
  }


});


