Anzu.tone = function(){
  var toneList = {};
  var workerList = {};
  var defaultTone = Anzu.wave.createSquareSignal;

  toneList["Anzu.SquareWave"] = Anzu.wave.generator.createSquareSignal;
  toneList["Anzu.SineWave"] = Anzu.wave.generator.createSinSignal;
  toneList["Anzu.SawtoothWave"] = Anzu.wave.generator.createSawtoothSignal;
  toneList["Anzu.TriangleWave"] = Anzu.wave.generator.createTriangleSignal;
  toneList["Anzu.WhiteNoise"] = Anzu.wave.generator.createWhiteNoiseSignal;

  function setToneFunction(worker){
    worker.onmessage = function(e){
      var data = e.data;

      if(typeof data === "string"){ // for Safari
      }
    };
  }

  return {
    addTone : function(name, f){
      toneList[name] = f;
    },
    getToneList : function(){
      return;
    },
    getTone : function(tonename){
      var f = toneList[tonename];
      if(f){
	return f;
      }else{
	var worker = workerList[tonename];
	if(worker){
	  return {
	    call : function(duration, f, key){
	      worker.onmessage = function(e){
		var data = e.data;

		if(typeof data === "string"){ // for Safari
		}
		
		Anzu.mixer.finishQueue(
		{
		  key : key,
		  signals : data
		});
	      };

	      worker.postMessage(duration + "@" + f + "@" + Anzu.core.samplingRate);
	    }
	  };
	}else{
	  return Anzu.wave.createSquareSignal; // 何も見つからなかったときはこれ。保険。
	}
      }
    },
    getDefaultTone : function(){
      return defaultTone;
    },
    setDefaultTone : function(t){
      defaultTone = this.getTone(t);
    },
    addUserTone : function(url){
      var worker = new Worker("usertone.js");
      
      worker.onmessage = function(e){
	var result = e.data;
	var arr = result.split("@");
	var name = arr[0];
	workerList[name] = worker;
      };

      worker.postMessage("init" + "@" + url);
    }
  };
}();