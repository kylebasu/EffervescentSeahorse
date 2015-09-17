(function() {
  'use strict';
  angular.module('starter.controllers')
    .controller('MessagesController', MessagesController);

  MessagesController.$inject = ['$scope', '$stateParams', '$timeout', '$ionicScrollDelegate'];

  function MessagesController ($scope, $stateParams, $timeout, $ionicScrollDelegate) {
    var vm = this;


    vm.user;
    vm.text = '';
    vm.messages = [];
    vm.setStyle = setStyle;
    vm.sendMessage = sendMessage;

    ref.child('rooms').child(window.localStorage['uid']).child($stateParams.userId).on('value', function(snapshot) {
      vm.messages = [];
      $timeout(function() {
        for(var key in snapshot.val()) {
          if(key !== 'unreadMessage'){
            vm.messages.push(snapshot.val()[key]);
          }
        }
        //Set Messages to read HERE HERE HERE =================================
        ref.child('rooms').child(window.localStorage['uid']).child($stateParams.userId).update({
          unreadMessage: false
        });
      });
      $ionicScrollDelegate.scrollBottom();
    });

    function setStyle(id) {
      if(id === window.localStorage['uid']) {
        return 'chat-bubble--right';
      } else {
        return 'chat-bubble--left';
      }
    }

    function sendMessage(message) {
      if(message !== "") {
        vm.messages = [];
        ref.child('rooms').child(window.localStorage['uid']).child($stateParams.userId).push({
          sender: window.localStorage['uid'],
          text: message
        });
        ref.child('rooms').child($stateParams.userId).child(window.localStorage['uid']).push({
          sender: window.localStorage['uid'],
          text: message
        });
        // Set Unread messages to stateParams userID room HERE HERE HERE=================================
        ref.child('rooms').child($stateParams.userId).child(window.localStorage['uid']).update({
          unreadMessage: true
        });
      }
      vm.text = '';
      $ionicScrollDelegate.scrollBottom();
    }

  }
})();
