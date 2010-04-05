Anzu.mixer = function(){
  var queue = {};
  var baseSignals;
  var finishCallback;
  var nomore = false;

  function checkFinish(){
    if(!nomore) return false;
    var count = 0;
    for(var i in queue){
      count++;
    }
    return count === 0;
  }

  return {
    init : function(bs){
      baseSignals = bs;
      queue = {};
      nomore = false;
    },
    addQueue : function(obj){
      queue[obj.key] = obj.info;
    },
    finishAddQueues : function(){
      nomore = true;
      if(checkFinish()) finishCallback();
    },
    finishQueue : function(obj){
      var signals = obj.signals;
      var key = obj.key;
      var len = signals.length;
      var start = queue[key].start;
      var volume = queue[key].volume;

      Anzu.wave.mixSignalV(baseSignals, signals, start, volume);

      delete queue[key];
      if(checkFinish()) finishCallback();
    },
    setCallback : function(f){
      finishCallback = f;
    }
  };
}();