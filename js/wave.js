var pitchList;

// ピッチ関連はwaveに置くべきじゃないよね？
function initPitchList(){
  var base = {
    "Cd" : 261.6/4, "Cd#" : 277.2/4, "Dd" : 293.7/4, "Dd#" : 311.1/4,
    "Ed" : 329.6/4, "Fd" : 349.2/4, "Fd#" : 370.0/4, "Gd" : 392.0/4,
    "Gd#" : 415.3/4, "Ad" : 440.0/8, "Ad#" : 466.2/8, "Bd" : 493.9/8
  };

  pitchList = {
    "A1" :  440.0/8 , "A1#" : 466.2/8 , "B1" : 493.9/8,
    "C1" : 261.6/4, "C1#" : 277.2/4, "D1" : 293.7/4, "D1#" : 311.1/4,
    "E1" : 329.6/4, "F1" : 349.2/4, "F1#" : 370.0/4, "G1" : 392.0/4,
    "G1#" : 415.3/4
  };

  var h;
  for(h = 2; h <= 9; h++){
    for(var i in base){
      pitchList[i.replace("d", h.toString(10))] = 
	pitchList[i.replace("d", (h-1).toString(10))] * 2;
    }
  }

}

function convertToPitch(key){
  return pitchList[key];
}

function createSquareSignal(t, sinF){
  var i;
  var signals, sig, phase, hz;

  hz = 22050;			// 11025
  phase = 0;
  t = Math.round(t*hz);
  var freq = sinF * 2.0 * Math.PI / hz;
  signals = new Array(t);

  for(i = 0; i < t; i++){
    sig = Math.sin(phase);
//     sig = sig > 0 ? 180 : 75;
    sig = sig > 0.0 ? 1.0 : -1.0;
    signals[i] = sig;

    phase += freq;
  };

  return signals;
}

function mixSignal(base, up, offset){
  var i, len, sig;
  len = up.length;
  offset = Math.floor(offset);
  for(i = 0; i < len; i++){
    sig = base[i+offset] + up[i] * 0.1;
//     sig = sig > 255 ? 255 : sig; // 255でカット
    sig = sig > 1.0 ? 1.0 : sig;
    sig = sig < -1.0 ? -1.0 : sig;
    base[i+offset] = sig;
  }
}

function convertToBinary(signals){ // signals は 8bit unsigned charの配列
  var i, len, bin;
  len = signals.length;
  bin = "";
  for(i = 0; i < len; i++){
    bin += String.fromCharCode(Math.floor((signals[i] + 2.0)/2.0 * 255));
  }
  return bin;
}

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

function convertToURL(signals){
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
};
