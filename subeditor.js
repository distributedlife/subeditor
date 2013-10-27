"use strict";

Array.prototype.clean = function() {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == "") {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var app = angular.module('subeditor', []);

var SubeditorController = function($scope, $http) {
  var NotReady = "Please wait. I'm retrieving data.";
  var Ready = "I've got data now. Let's do this.";

  $http.get('reference.json').success(function(data) {
    $scope.reference = data;
    $scope.status = Ready;
    $scope.rawtext = $scope.rawtext + "";
  }).error(function() {
    $scope.reference = {
      'THE': 'x',
      'QUICK': '/'
    };
    $scope.status = Ready;
    $scope.rawtext = $scope.rawtext + "";
  });

  $scope.status = NotReady;
  $scope.rawtext = "The quick brown fox jumps over the lazy dog. The time has come for all good men to attend the dance.\n\nNow is the winter of our derp."

  $scope.notReady = function() {
    return $scope.status === NotReady;
  }

  $scope.paragraphs = function() {
    return $scope.rawtext.split("\n\n")
  }

  $scope.sentences = function(paragraph) {
    return paragraph.trim().split(".").clean();
  }

  $scope.words = function(sentence) {
    return sentence.trim().split(" ").clean();
  }

  $scope.stress = function(word) {
    if ($scope.notReady()) {
      return "?";
    }

    var key = word.toUpperCase();
    if ($scope.reference[key] === undefined) {
      return "?"
    } else {
      return $scope.reference[key];
    }
  }

  var getStressForSentence = function(sentence) {
    var stress = "";

    words(sentence).forEach(function(word) {
      stress = stress + $scope.stress(word);
    });

    return stress;
  };

  var footReference = [
    {'name': 'pyrrhus', 'pattern' : '//'},
    {'name': 'iamb', 'pattern' : '/x'},
    {'name': 'trochee', 'pattern' : 'x/'},
    {'name': 'spondee', 'pattern' : 'xx'}
  ];

  $scope.feet = function(sentence) {  
    var return_value = "unknown";

    footReference.forEach(function(foot) {
      if (sentence.length % foot.pattern.length !== 0) {
        return;
      }

      var template = foot.pattern;
      while(template.length <= sentence.length) {
        if (sentence === template) {
          return_value = foot.name;
          return;
        }

        template = template += foot,pattern;
      }
    });

    return return_value;
  }

  $scope.metre = function(sentence) {
    return "pentameter";
  }
};

SubeditorController.inject = ['$scope', '$http']