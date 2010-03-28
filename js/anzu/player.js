$(function()
  {
    Anzu.player.score = Anzu.Score(
      '({"tracks" : [ { "notes" : [], "tone" : "Anzu.Sequare"} ], "bpm" : 120})'
      );
    
  });

Anzu.player = function(){
//   var score = Anzu.Score({tracks : [], bpm : 120});
//   score.addTrack({notes : [], tone : "Anzu.Sequare"});
  var currentTime = 0;
  var currentTrack = 0;

  function getCurrentTime(){
    currentTime = $("iframe")[0].contentWindow.Anzu.ui.getCurrentTime();
  }

  function parseFrame(){
    return $("iframe")[0].contentWindow.Anzu.ui.getTrack();
  }

  return {
    play : function(){
      var innerWindow = $("iframe")[0].contentWindow;
      console.log(parseFrame());
      getCurrentTime();
      Anzu.player.score.updateTrack(currentTrack, parseFrame());
      Anzu.player.score.play(currentTime);
      innerWindow.Anzu.ui.startAnimation(60.0 / Anzu.player.score.bpm, Anzu.player.score.getEndTime());
    },
    stop : function(){
      Anzu.player.score.stop(currentTime);
      var innerWindow = $("iframe")[0].contentWindow.Anzu.ui.stopAnimation();      
    },
    set : function(){
      $("iframe")[0].contentWindow.Anzu.ui.setTrack(Anzu.player.score.getTrack(currentTrack));
    }
  };
}();