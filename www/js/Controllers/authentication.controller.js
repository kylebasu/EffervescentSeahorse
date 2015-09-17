(function() {
  'use strict';
  angular.module('starter.controllers')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$ionicModal', '$state', '$firebaseAuth', '$ionicLoading', '$timeout', '$ionicHistory', 'userService'];

  function AuthenticationController ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $timeout, $ionicHistory, userService) {
    var vm = this;
    vm.createUser = createUser;
    vm.signIn = signIn;
    vm.logout = logout;

    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
      scope: $scope
    }).then(function(modal) {
      vm.modal = modal;
    });

    function logout () {
      delete window.localStorage['uid'];
      ref.unauth();
      $ionicHistory.clearCache().then(function() {
        console.log('cleared views');
      });
      $state.go('login');
    }

    function createUser(user) {
      if(user && user.email && user.password && user.displayname) {
        $ionicLoading.show({
          template: 'Signing Up'
        });

        var onComplete = function(error) {
          if (!error) {
            user.email = '';
            user.password = '';
            user.displayname = '';
            ref.child('profilepicture').child(window.localStorage.uid).set({
              'profilepicture' : '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAEAAQADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2Mk560ZPrQetFABk+tGT60lFAC5PrRk+tJRQAZPrRk+tFFABk+tGT60UUAGT60ZPrRRQAZPrRk+tFFABk+tGT61FLcRQ/ebn0HWqr6if4Ix+JoAv5PrRk+tZZvpz0YD6CkF7cD+P9BQBq5PrRk+tZ8eoMD+8QEeoq7HKkq7kOR/KgB+T6mjJ9TRRQITJ9TRk+ppaSgYZPqaMn1NFFABk+poyfU0UUAGT6mjJ9TRRQIMn1NKCcjmkoHUUAPPWkpT1pKBhRRRQAUlLRQAlFLSUAFFFFABRRRQA13WNSzHAFZ8968mVj+VfXuaS+lLzFP4U4x71WoELSUUUwCiiigAqSGVoZAy/iPWo6KANpHEiB16EU6qWnyZVoz25FXaQwooooAKSlooASilooASiiigAoHUUUDqKAHmkpaKAEopaKAEooooAKKKKACkpaKAEopaKAMWU7pnPqxplKeppKYgooooAKKKKACiiigCezfZcr6HitWsVDh1Poa2qQwooooAKKKKACiiigAooooASlHUUUDqKAHUUUUAFFFFABRRRQAlFLRQAlFFFABRRRQBj3MRimZT0JyPpUVaWooDCG7qazaYgooooAKKKKACiiigByDLqPcVtVjwDM8Y/2hWxSAKKKKBhRRRQAUUUUAFFFFABQOoooHUUAOooooAKKKKACiiigAooooAKKKKACkpaKAK98CbVsdsGsmt1lDKVI4Iwaxp4TBKUP4H1FAiOiiimAUUUUAFFNeQJ16+lEbFlye5oAs2YzdJ7ZNatZ2nLmcn0WtGkMKKKKACiiigAooooAKKKKACgdRRQOooAdRS0UAJRRRQAUUUUAFFFFABRRRQAUUUUAFQ3VuJ48fxD7pqaigDCIKsVIwR1FJWje2BuCJImCSd89DWXNFdW/+sUgeuMimIf0qJ5uyfnURdm6kmm0ALyT6k1aQbVA9KjhjwNx69qloAv6avEjfQVeqnpzAxMncHNXKQwooooASilooASiiigAooooAKB1FFKOtADqKKKACiiigApKWigBKKWkoAKKKKACiiigAooooAKQgMCCAQeoNLRnnFAGBc2qpcuqHCg8D0piwqpyTmtq5tFnG4fK/r61UgsXkOZMoo/M0xFUDJwKsxWEsnLfIPfr+VaEUEUI+RAD696kpDIYLVIOVySepNS1BeT+RFwfmbgVUTUZVADKrY/OgDSoqomoxH7ysv61OlxDJ92RT7dKAJKKKKACiiigApKWigBKUdaKB1oAfSUtFACUUtFACUUUUAFFFFABSHAGScD3papak+IlT+8c0ATtcwJ1lX8Dmom1CAdNzfQVl0UCL7an/di/M1E2oTt0Kr9BVWimBK1xM/WVvzqSxV3ugwP3eSarVr2kPkwgEfM3JoAhvLuSKTy0XHGdxotb1pGEcgyx6ECodQkDzBR/AOTVjT4gsPmY+Zj19qQy3RRVa+l8uAgH5n4FAFC6m86Yt/COB9KhoopiCiiigCWK4liI2sceh6VqQTLPEHX6EehrGqxp03l3bRE8SDI+ooA1aKWikMSiiigAoHWilHWgB1FFFABRRRQA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'
            })
          }
        };

        auth.$createUser({
          email: user.email,
          password: user.password
        }).then(function(userData) {
          alert('user created successfully!');
          window.localStorage.uid = userData.uid;
          ref.child('users').child(userData.uid).set({
            email: user.email,
            displayName: user.displayname
          }, onComplete);
          //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>put stock profile picture HERE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
          $ionicLoading.hide();
          vm.modal.hide();
        }).catch(function(error) {
          alert('Error: ' + error);
          $ionicLoading.hide();
        });
      } else {
        alert('Please fill in all fields');
      }
    };

    function signIn(user) {
      if(user && user.email && user.pwdForLogin) {

        $ionicLoading.show({
          template: 'Signing in...'
        });

        auth.$authWithPassword({
          email: user.email,
          password: user.pwdForLogin
        }).then(function(authData) {
          userService.setCurrentUserId(authData.uid);
          user.email = '';
          user.pwdForLogin = '';
          $ionicLoading.hide();
          $state.go("tab.search");
        }).catch(function(error) {
          alert('Authentication failed ' + error.message);
          $ionicLoading.hide();
        });
      } else {
        alert('please enter email and password');
      }
    };
  }
})();
