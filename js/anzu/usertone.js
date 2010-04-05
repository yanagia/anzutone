onmessage = function(e){
  var args = e.data.split("|");

  if(args.length === 2){	// initialize
    var url = args[1];
    importScripts(url);
    postMessage(getName());
  }else{
    var duration = parseFloat(args[0]);
    var f = parseFloat(args[1]);
    var samplingRate = parseInt(args[2], 10);
    var key = args[3];
    var browser = parseInt(args[4], 10);

    if(browser === 0){		// firefox
      var result = {};
      result.key = key;
      result.signals = createWave(duration, f, samplingRate);
      postMessage(result);
    }else{			// safari
      var signals = createWave(duration, f, samplingRate);
      signals.push(key);
      postMessage(signals);
    }
  }
  
};