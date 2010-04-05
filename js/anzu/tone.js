Anzu.tone = function(){
  var toneList = {};
  var workerList = {};
  var defaultTone = Anzu.wave.createSquareSignal;
  var urls = {};

  toneList["Anzu.SquareWave"] = Anzu.wave.generator.createSquareSignal;
  toneList["Anzu.SineWave"] = Anzu.wave.generator.createSinSignal;
  toneList["Anzu.SawtoothWave"] = Anzu.wave.generator.createSawtoothSignal;
//   toneList["Anzu.TriangleWave"] = Anzu.wave.generator.createTriangleSignal;
  toneList["Anzu.WhiteNoise"] = Anzu.wave.generator.createWhiteNoiseSignal;

  function parseResult(arg){
    var obj = {};

    if(typeof arg === "string"){ // for Safari
      var signals = arg.split(",");
      var i, len = signals.length;
      for(i = 0; i < len-1; i++){
	signals[i] = parseInt(signals[i], 10);
      }
      var key = signals.pop();
      obj.key = key;
      obj.signals = signals;
    }else{
      obj = arg;
    }

    return obj;
  }

  return {
    addTone : function(name, f){
      toneList[name] = f;
    },
    getToneList : function(){
      var keys = [], i;
      for(i in toneList) keys.push(i);
      for(i in workerList) keys.push(i);
      return keys;
    },
    getToneDumpName : function(name){
      if(toneList[name]){
	return name;
      }else if(workerList[name]){
	return urls[name];
      }
      return "Anzu.SequareWave";
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
	      var s = function(key){
		var keycopy = parseInt(key);
		var browser;

		worker.onmessage = function(key){
		  return function(e){
		    var data = e.data;
		    var obj = parseResult(data);
		    var signals = obj.signals;

		    Anzu.mixer.finishQueue(
		      {
			key : obj.key,
			signals : signals
		      });
		  };
		}(key);
		browser = IsGecko() ? 0 : 1;
		worker.postMessage(duration + "|" + f + "|" + 
				   Anzu.core.samplingRate + "|" + key + "|" + browser);
	      }(key);
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
      if(toneList[t]){
	defaultTone = this.getTone(t);
      }else if(workerList[t]){
	var worker = workerList[t];
	defaultTone = {
	  call : function(callback, duration, f){
	    worker.onmessage = function(e){
	      var data = e.data;
	      var obj = parseResult(data);
	      var signals = obj.signals;
	      callback(signals);
	    };
	    var browser = IsGecko() ? 0 : 1;
	    worker.postMessage(duration + "|" + f + "|" + 
			       Anzu.core.samplingRate + "|" + "once" + "|" + browser);
	  }
	};
      }
      return toneList["Anzu.SeguareWave"];
    },
    addUserTone : function(url, callback, errorCallback){
      for(var key in urls){
	if(urls.key === url) callback(key);
      }

      var worker = new Worker("js/anzu/usertone.js");
      
      worker.onmessage = function(e){
	var result = e.data;
	var arr = result.split("@");
	var name = arr[0];
	workerList[name] = worker;
	urls[name] = url;

	if(callback){
	  callback(name);
	}

	Anzu.player.refreshTone();
      };

      worker.onerror = function(e){
	errorCallback(e.message);
      };

      worker.postMessage("init" + "|" + url);

    }
  };
}();