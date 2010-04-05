function getName(){
  return "Yanagia.SineWave";
}

function createWave(duration, f, samplingRate){
  var i, frames;
  var signals, signal, phase, hz, freq;

  phase = 0;
  frames = Math.round(duration * samplingRate);
  freq = f * 2.0 * Math.PI / samplingRate;
  signals = new Array(frames);

  for(i = 0; i < frames; i++){
    signal = Math.sin(phase);
    signals[i] = ~~ (signal * 32767);

    phase += freq;
  };

  return signals;

}