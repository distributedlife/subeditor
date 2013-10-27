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
      "NOW" : "/",
      "IS" : "x",
      'THE': 'x',
      "WINTER" : "/x",
      "OF" : "/",
      "OUR" : "x",
      "TO" : "x",
      "SWELL" : "/",
      "GOURD" : "/",
      "AND" : "x",
      "PLUMP" : "/",
      "HAZEL" : "/x",
      "SHELLS" : "/",
      "DISCONTENT" : "/x/"
    };
    $scope.status = Ready;
    $scope.rawtext = $scope.rawtext + "";
  });

  $scope.status = NotReady;
  $scope.rawtext = "The quick brown fox jumps over the lazy dog. The time has come for all good men to attend the dance.\n\nTo swell the gourd, and plump the hazel shells."

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

    var key = remove_punctuation(word.toUpperCase());
    if ($scope.reference[key] === undefined) {
      return "?"
    } else {
      return $scope.reference[key];
    }
  }

  var remove_punctuation = function(sentence) {
    return sentence.replace(" ", "").replace(",", "");
  };

  var getStressForSentence = function(sentence) {
    var stress = "";

    $scope.words(sentence).forEach(function(word) {
      stress = stress + $scope.stress(word);
    });

    return stress;
  };

  var footReference = [
    {'name': 'pyrrhus', 'pattern' : 'xx'},
    {'name': 'iamb', 'pattern' : 'x/'},
    {'name': 'trochee', 'pattern' : '/x'},
    {'name': 'spondee', 'pattern' : '//'},

    {'name': 'tribrach', 'pattern' : 'xxx'},
    {'name': 'dactyl', 'pattern' : '/xx'},
    {'name': 'amphibrach', 'pattern' : 'x/x'},
    {'name': 'anapest', 'pattern' : 'xx/'},
    {'name': 'bacchius', 'pattern' : 'x//'},
    {'name': 'antibacchius', 'pattern' : '//x'},
    {'name': 'cretic', 'pattern' : '/x/'},
    {'name': 'molossus', 'pattern' : '///'},

    {'name' : 'tetrabrach', 'pattern' : 'xxxx'},
    {'name' : 'primus paeon', 'pattern' : '/xxx'},
    {'name' : 'secundus paeon', 'pattern' : 'x/xx'},
    {'name' : 'tertius paeon', 'pattern' : 'xx/x'},
    {'name' : 'quartus paeon', 'pattern' : 'xxx/'},
    {'name' : 'major ionic', 'pattern' : '//xx'},
    {'name' : 'minor ionic', 'pattern' : 'xx//'},
    {'name' : 'ditrochee', 'pattern' : '/x/x'},
    {'name' : 'diiamb', 'pattern' : 'x/x/'},
    {'name' : 'choriamb', 'pattern' : '/xx/'},
    {'name' : 'antispast', 'pattern' : 'x//x'},
    {'name' : 'first epitrite', 'pattern' : 'x///'},
    {'name' : 'second epitrite', 'pattern' : '/x//'},
    {'name' : 'third epitrite', 'pattern' : '//x/'},
    {'name' : 'fourth epitrite', 'pattern' : '///x'},
    {'name' : 'dispondee', 'pattern' : '////'}
  ];

  var metreReference = [
    {'name': 'monometer', 'length': 1},
    {'name': 'dimeter', 'length': 2},
    {'name': 'trimeter', 'length': 3},
    {'name': 'tetrameter', 'length': 4},
    {'name': 'pentameter', 'length': 5},
    {'name': 'hexameter', 'length': 6},
    {'name': 'heptameter', 'length': 7},
    {'name': 'octameter', 'length': 8}
  ];

  $scope.feet = function(sentence) { 
    if ($scope.notReady()) {
      return "no data yet";
    }
    var return_value = "unknown";

    footReference.forEach(function(foot) {
      var template = foot.pattern;
      while(template.length <= sentence.length) {
        if (getStressForSentence(sentence) === template) {
          return_value = foot.name;
          return;
        }

        template = template += foot.pattern;
      }
    });

    return return_value;
  }

  $scope.metre = function(sentence) {
    var return_value = "unknown";

    var feet = $scope.feet(sentence);
    if (feet === "unknown") {
      return return_value;
    }

    var sentence_metre_length = 0;
    footReference.forEach(function(foot) {
      if (foot.name === feet) {
        sentence_metre_length = getStressForSentence(sentence).length / foot.pattern.length;
      }
    });

    metreReference.forEach(function(metre) {
      if (metre.length === sentence_metre_length) {
        return_value = metre.name;
        return;
      }
    });

    return return_value;
  }
};

SubeditorController.inject = ['$scope', '$http']