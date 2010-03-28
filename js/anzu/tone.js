Anzu.tone = function(){
  var toneList = {};

  toneList["Anzu.Sequare"] = Anzu.wave.createSquareSignal;

  return {
    getTone : function(tonename){
      var f = toneList[tonename];
      if(f) return f;
      else return Anzu.wave.createSquareSignal;
    }
  };
}();