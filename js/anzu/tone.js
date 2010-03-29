Anzu.tone = function(){
  var toneList = {};
  var defaultTone = Anzu.wave.createSquareSignal;

  toneList["Anzu.Sequare"] = Anzu.wave.generator.createSquareSignal;
  toneList["Anzu.Sin"] = Anzu.wave.generator.createSinSignal;

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