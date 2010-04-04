onmessage = function(query){
  var args = query.split("@");

  if(args.length === 2){	// initialize
    var url = args[1];
    importScripts(url);
    postMessage(getName());
  }else{
    var duration = parseFloat(args[0]);
    var f = parseFloat(args[1]);
    var samplingRate = parseInt(args[2], 10);

    postMessage(createSignal(duration, f, samplingRate));
  }

  
};