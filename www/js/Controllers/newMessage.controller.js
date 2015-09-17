(function() {
	'use strict';
	angular.module('starter.controllers')
	  .controller('newMsgController', newMsgController);

	newMsgController.$inject = ['$scope', '$ionicHistory', '$state', '$location'];

	function newMsgController ($scope, $ionicHistory, $state, $location) {
		var vm = this;
		vm.newMsg = false;

		function newMsg (){
			ref.child('rooms').child(window.localStorage['uid']).on('value', function (snapshot) {
				console.log(snapshot.val())
				for(var i in snapshot.val()){
					if(snapshot.val()[i].unreadMessage === true){
						vm.newMsg = true
						return;
					}
				}
				vm.newMsg = false
			});
		}
		newMsg();
	}
})();