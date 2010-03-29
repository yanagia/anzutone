// wave module
// this module requires Base64.encode() method.

Anzu.wave = function(){

  function intToBin2(s){
    return String.fromCharCode((s >> 0 & 0xFF),
			       (s >> 8 & 0xFF));
  }

  function intToBin4(s){
    return String.fromCharCode((s >> 0 & 0xFF),
			       (s >> 8 & 0xFF),
			       (s >> 16 & 0xFF),
			       (s >> 24 & 0xFF));
  }

  return {
    generator : {
      createSquareSignal : function(t, sinF){
	var i;
	var signals, sig, phase, hz;

	hz = 22050;
	phase = 0;
	t = Math.round(t*hz);
	var freq = sinF * 2.0 * Math.PI / hz;
	signals = new Array(t);

	for(i = 0; i < t; i++){
	  sig = Math.sin(phase);
	  sig = sig > 0.0 ? 1.0 : -1.0;
	  signals[i] = ~~ (sig * 32767); // 32767 = 2**15-1

	  phase += freq;
	};

	return signals;
      },

      createSinSignal : function(t, sinF){
	var i;
	var signals, sig, phase, hz;

	hz = 22050;
	phase = 0;
	t = Math.round(t*hz);
	var freq = sinF * 2.0 * Math.PI / hz;
	signals = new Array(t);

	for(i = 0; i < t; i++){
	  sig = Math.sin(phase);
	  signals[i] = ~~ (sig * 32767);

	  phase += freq;
	};

	return signals;
      }
    },
//     createSquareSignal : function(t, sinF){
//       var i;
//       var signals, sig, phase, hz;

//       hz = 22050;			// 11025
//       phase = 0;
//       t = Math.round(t*hz);
//       var freq = sinF * 2.0 * Math.PI / hz;
//       signals = new Array(t);

//       for(i = 0; i < t; i++){
// 	sig = Math.sin(phase);
// 	sig = sig > 0.0 ? 1.0 : -1.0;
// 	signals[i] = sig;

// 	phase += freq;
//       };

//       return signals;
//     },

    // この関数も重い。
    mixSignal : function(base, up, offset){
      var i, len, sig;
      len = up.length;
      offset = Math.floor(offset);
      for(i = 0; i < len; i++){
	sig = base[i+offset] + up[i];
	//     sig = sig > 255 ? 255 : sig; // 255でカット
// 	sig *= 0.7;
	base[i+offset] = sig;
      }
    },

    // この関数が重い。
    convertToBinary : function(signals){ // signals は floatの配列
      var i, len, sig;
      len = signals.length;

      for(i = 0; i < len; i++){
	sig = signals[i];
	// 163835 = 32767 * 5
	sig = sig > 163835 ? 163835 : (sig; 
	sig = sig < -163835 ? -163835 : sig;
	signals[i] = String.fromCharCode((sig + 163835)/327670 * 256);
// 	bin += String.fromCharCode(Math.floor((signals[i] + 1.0)/2.0 * 255));
      }
      return signals.join("");
    },

    convertToURL : function(signals){
      var header;
      var samplingRate = 22050;

      header = "WAVEfmt ";
      header += intToBin4(16);
      header += intToBin2(1); // format id
      header += intToBin2(1); // channels 1 = mono, 2 = stereo
      header += intToBin4(samplingRate); // sampling rate
      header += intToBin4(samplingRate * 1); // byte/sec
      header += intToBin2(1); // block size
      header += intToBin2(8); // byte/sample
      header += "data";		       // data chunk label

      var siglen = signals.length;
      var sigsize;

      sigsize = intToBin4(siglen);

      header += sigsize;
      // ここまで36バイト
      var wavlen = header.length + signals.length;
      var riff = "RIFF";
      
      riff += intToBin4(wavlen);
      
      var wavefile = riff + header + signals;
      var encodedata = Base64.encode(wavefile);
      var dataurl = "data:audio/wav;base64," + encodedata;

      return dataurl;
    }
  };

}();