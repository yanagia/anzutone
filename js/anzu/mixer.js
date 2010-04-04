Anzu.mixer = function(){
  var queue = {};
  var baseSignals;
  var finishCallback;
  var nomore = false;

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
      if(queue.Keys().length === 0) finishCallback();
    },
    finishQueue : function(obj){
      var signals = obj.signals;
      var key = obj.key;
      var len = signals.length;
      var start = queue[key].start;
      var volume = queue[key].volume;

      Anzu.wave.mixSignalV(baseSignals, signals, start, volume);

      delete queue[key];
      if(nomore && queue.Keys().length === 0) finishCallback();
    },
    setCallback : function(f){
      finishCallback = f;
    }
  };
}();