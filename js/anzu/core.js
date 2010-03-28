var Anzu = {};

Anzu.ui = {};

Anzu.core = function(){

  // private variable
  var pitchList = {
    "A1" :  440.0/8 , "A1#" : 466.2/8 , "B1" : 493.9/8,
    "C1" : 261.6/4, "C1#" : 277.2/4, "D1" : 293.7/4, "D1#" : 311.1/4,
    "E1" : 329.6/4, "F1" : 349.2/4, "F1#" : 370.0/4, "G1" : 392.0/4,
    "G1#" : 415.3/4
  };

  // private method
  function initPitchList(){
    var base = {
      "Cd" : 261.6/4, "Cd#" : 277.2/4, "Dd" : 293.7/4, "Dd#" : 311.1/4,
      "Ed" : 329.6/4, "Fd" : 349.2/4, "Fd#" : 370.0/4, "Gd" : 392.0/4,
      "Gd#" : 415.3/4, "Ad" : 440.0/8, "Ad#" : 466.2/8, "Bd" : 493.9/8
    };

    var h;
    for(h = 2; h <= 9; h++){
      for(var i in base){
	pitchList[i.replace("d", h.toString(10))] = 
	  pitchList[i.replace("d", (h-1).toString(10))] * 2;
      }
    }
  }

  // initialize module
  initPitchList();

  // public
  return {
    convertToPitch : function(key){
      return pitchList[key];
    },
    audioStream : $("body"),	// readable & writable
    samplingRate : 22050
  };
}();

// function convertToPitch(key){
//   return pitchList[key];
// }

// console.log(Anzu.core.initPitchList("C4"));
// Anzu.core.initPitchList2();
