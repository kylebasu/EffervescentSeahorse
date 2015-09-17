(function() {
	'use strict';
	angular.module('starter.controllers')
	  .controller('SettingsController', SettingsController);

	SettingsController.$inject = ['$scope', '$ionicHistory', '$state', '$location'];

	function SettingsController ($scope, $ionicHistory, $state, $location) {
		var vm = this;
		vm.logout = logout;
		vm.userID = window.localStorage.uid;
		vm.profile = goProfile;


		function logout () {
			delete window.localStorage['uid'];
			ref.unauth();
			$ionicHistory.clearCache().then(function() {
				console.log('cleared views');
			});
			$state.go('login');
		}

		function goProfile() {
			$location.path('/profile/' + vm.userID)
		};
	}
})();
