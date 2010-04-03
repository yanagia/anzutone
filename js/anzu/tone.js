Anzu.tone = function(){
  var toneList = {};
  var defaultTone = Anzu.wave.createSquareSignal;

  toneList["Anzu.SquareWave"] = Anzu.wave.generator.createSquareSignal;
  toneList["Anzu.SineWave"] = Anzu.wave.generator.createSinSignal;
  toneList["Anzu.SawtoothWave"] = Anzu.wave.generator.createSawtoothSignal;
  toneList["Anzu.TriangleWave"] = Anzu.wave.generator.createTriangleSignal;
  toneList["Anzu.WhiteNoise"] = Anzu.wave.generator.createWhiteNoiseSignal;

  return {
    addTone : function(name, f){
      toneList[name] = f;
    },
    getTone : function(tonename){
      var f = toneList[tonename];
      if(f) return f;
      else return Anzu.wave.createSquareSignal;
    },
    getDefaultTone : function(){
      return defaultTone;
    },
    setDefaultTone : function(t){
      defaultTone = this.getTone(t);
    }
  };
}();