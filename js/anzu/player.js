$(function()
  {
    Anzu.player.score = Anzu.Score(
      '({"tracks" : [ { "notes" : [], "tone" : "Anzu.Sequare"}, { "notes" : [], "tone" : "Anzu.Sequare"} ], "bpm" : 120})'
      );
    
    setTimeout(Anzu.player.parseURL, 500);
  });

Anzu.player = function(){
//   var score = Anzu.Score({tracks : [], bpm : 120});
//   score.addTrack({notes : [], tone : "Anzu.Sequare"});
  var currentTime = 0;
  var currentTrack = 0;

  var s_name = "";
  var s_comment = "";
  var loaderURL = "file:///Users/yanagi/Documents/program/anzutone/editor.html?load=";

  function getCurrentTime(){
    currentTime = $("iframe")[0].contentWindow.Anzu.ui.getCurrentTime();
  }

  function parseFrame(){
    return $("iframe")[0].contentWindow.Anzu.ui.getTrack();
  }

  return {
    play : function(){
      var innerWindow = $("iframe")[0].contentWindow;
      getCurrentTime();
      Anzu.player.score.updateTrack(currentTrack, parseFrame());
      Anzu.player.score.setCallback(innerWindow.Anzu.ui.startAnimation);
      Anzu.player.score.play(currentTime);
    },
    stop : function(){
      Anzu.player.score.stop(currentTime);
      var innerWindow = $("iframe")[0].contentWindow.Anzu.ui.stopAnimation();      
    },
    set : function(){
      var t = Anzu.player.score.getTrack(currentTrack);
      $("iframe")[0].contentWindow.Anzu.ui.setTrack(t.dump());
      $("#toneSelect").val(t.getTone());
    },
    moveBar : function(delta){
      $("iframe")[0].contentWindow.Anzu.ui.moveBar(delta);
    },
    changeTone : function(obj){
      $("iframe")[0].contentWindow.Anzu.ui.changeTone(obj.value);
    },
    selectTrack : function(obj){
      Anzu.player.score.updateTrack(currentTrack, parseFrame());
      var trackNumber = parseInt(obj.value);
      currentTrack = trackNumber-1;
      this.set();
      $("#tracklist > li").each(function(ind, obj)
			       {
				 obj.className = "";
			       });
      obj.className = "current";
      return false;
    },
    exportAsURL : function(obj){
      Anzu.player.score.updateTrack(currentTrack, parseFrame());
      var scoreDump = Anzu.player.score.dump();
      return loaderURL + 
	"{" + 
	'"name":'  + '"' + encodeURI(obj.name) + '"' + "," +
	'"comment":' + '"' + encodeURI(obj.comment) + '"' + "," +
	'"score":' + scoreDump +
	"}";
    },
    openExportDialog : function(){
      var url = this.exportAsURL({name : "Anzu", comment : "first"});
      $("#exportDialog").dialog();
      $("#exportDialogURL").html("以下のリンクに出力しました。<br>" + 
				 "<a href='" + url + "'>ここ！</a>");
    },
    load : function(data){
      var s = eval( "(" + data + ")" );
      s_name = s.name;
      s_comment = s.comment;
      Anzu.player.score = Anzu.Score(s.score);

      currentTime = 0;
      currentTrack = 0;
      Anzu.player.set();
    },
    parseURL : function(){
      var url = document.location.href;
      var data;
      if(url.match(/.+?load=(.+)/)){
	data = RegExp.$1;
	Anzu.player.load(decodeURI(data));
      }
    },
    changeBPM : function(obj){
      var bpm = parseFloat(obj.value);
      if(bpm <= 0.0 || bpm === NaN) return;
      Anzu.player.score.changeBPM(bpm);
    }

  };
}();
