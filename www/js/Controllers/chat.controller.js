(function() {
  'use strict';
  angular.module('starter.controllers')
    .controller('ChatController', ChatController);

  ChatController.$inject = ['$scope', '$state', '$timeout', 'userService', 'chatService'];

  function ChatController ($scope, $state, $timeout, userService, chatService) {
    var vm = this;

    vm.sendToProfile = function () {
      $state.go('profile');
    };

    $scope.$on('$ionicView.enter', function(e) {
      vm.users = [];
      var uid = window.localStorage['uid'];

      ref.child('rooms').child(uid).on('value', function(snapshot) {
        chatService.getChats(snapshot.val()).then(function(chats) {
          $timeout(function() {
            vm.users = chats;
            for(var i = 0; i < vm.users.length; i++){
              ref.child('rooms').child(uid).child(vm.users[i].uid).child('unreadMessage').on('value', function (snapshot) {
                vm.users[i].newMsg = snapshot.val();
              });
            }
            console.log(vm.users)
          });
        });
      });
    });

  }
})();
