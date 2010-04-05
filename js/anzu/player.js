$(function()
  {
    Anzu.player.score = Anzu.Score(
      '{"tracks" : [ { "notes" : [], "tone" : "Anzu.SquareWave"}, { "notes" : [], "tone" : "Anzu.SquareWave"}, { "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"} ], "bpm" : 120}'
      );

    $("#back1Button").button(
    {
      icons : {
	primary : "ui-icon-seek-first"
	},
      text: false
    }).click(function(){
	       Anzu.player.moveBar(-400);
	     });
    $("#back4Button").button(
    {
      icons : {
	primary : "ui-icon-seek-prev"
	},
      text: false
    }).click(function(){
	       Anzu.player.moveBar(-100);
	     });
    $("#playstopButton").button(
    {
      icons : {
	primary : "ui-icon-play"
	},
      text: false
    }).click(function(){
	       Anzu.player.playstop();
	     });
    $("#play1Button").button(
    {
      icons : {
	primary : "ui-icon-seek-next"
	},
      text: false
    }).click(function(){
	       Anzu.player.moveBar(+100);
	     });
    $("#play4Button").button(
    {
      icons : {
	primary : "ui-icon-seek-end"
	},
      text: false
    }).click(function(){
	       Anzu.player.moveBar(+400);
	     });
    $("#bpmButton").button(
      {
      }
    ).click(function(){
	      $("#bpmDialog").dialog("open");
	    });
    $("#saveButton").button(
      {
      }
    ).click(function(){
	      Anzu.player.openExportDialog();
	    });

    $("#bpmDialog").dialog(
      {
	autoOpen: false,
// 	height: 200,
// 	width: 300,
	modal: true,
	buttons : {
	  'Set new BPM' : function(){
	    var b = $("#bpmForm").val();
	    Anzu.player.changeBPM(b);
	    $("#bpmButton > .ui-button-text").html("BPM=" + b);
	    $(this).dialog("close");
	  },
	  Cancel : function(){
	    $(this).dialog("close");
	  }
	},
	close : function(){
	  
	}
      });

    $("#exportDialog").dialog(
      {
	autoOpen: false,
	modal: true
      });

    $("#trackVolume").slider(
      {
	value: 50,
	range: "min",
	stop: function(ev, ui){
	  var v = $("#trackVolume").slider("value") / 100.0;
	  Anzu.player.changeVolume(v);
	},
	animate: true
      });

    $("#toneSelect").append(
      $("<input>")
	.attr("type", "radio")
	.attr("name", "tone")
	.attr("id", "radio." + "Yanagia.SineWave")
	.attr("value", "Yanagia.SineWave"))
      .append(
	$("<label>")
	  .attr("for", "radio." + "Yanagia.SineWave")
	  .html("Yanagia.SineWave"));

    $("#toneSelect").buttonset();
      
  });

Anzu.player = function(){
//   var score = Anzu.Score({tracks : [], bpm : 120});
//   score.addTrack({notes : [], tone : "Anzu.Square"});
  var currentTime = 0;
  var currentTrack = 0;
  var playing = false;

  var s_name = "";
  var s_comment = "";
  var loaderURL = "http://dl.dropbox.com/u/294534/anzutone/editor.html?load=";
  loaderURL = "file:///Users/yanagi/Documents/program/anzutone/editor.html?load=";

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
      Anzu.player.score.updateTrack(currentTrack, $("iframe")[0].contentWindow.Anzu.ui.getTrack());
//       Anzu.player.score.updateTrack(currentTrack, parseFrame());
      Anzu.player.score.setCallback(innerWindow.Anzu.ui.startAnimation);
      Anzu.player.score.setAfterCallback(function(){
					   playing = false;
					 });
      Anzu.player.score.play(currentTime);
    },
    stop : function(){
      Anzu.player.score.stop(currentTime);
      var innerWindow = $("iframe")[0].contentWindow.Anzu.ui.stopAnimation();      
    },
    playstop : function(){
      if(playing) this.stop();
      else this.play();
      playing = ! playing;
    },
    set : function(){
      var t = Anzu.player.score.getTrack(currentTrack);
      $("iframe")[0].contentWindow.Anzu.ui.setTrack(t);

      $('input[name="tone"]').each(function(d, elm)
				   {
				     if(elm.value === t.getTone()){
				       elm.checked = true;
				     }else{
				       elm.checked = false;
				     }
				   });
      $("#trackVolume").slider("value", t.getVolume() * 100);
      $('#toneSelect').button("destroy");
      $('#toneSelect').buttonset();
    },
    setEventManager : function(){
      $("iframe")[0].contentWindow.Anzu.eventManager = Anzu.eventManager;
      $("iframe")[0].contentWindow.Anzu.tone = Anzu.tone;
    },
    moveBar : function(delta){
      $("iframe")[0].contentWindow.Anzu.ui.moveBar(delta);
    },
    changeTone : function(obj){
      var t = $('input[name="tone"]:checked').val();
      $("iframe")[0].contentWindow.Anzu.ui.changeTone(t);
      Anzu.eventManager.add("changeTone", t);
    },
    changeVolume : function(v){
      Anzu.player.score.getTrack(currentTrack).setVolume(v);
      Anzu.eventManager.add("changeVolume", v);
    },
    selectTrack : function(obj){
//       Anzu.player.score.updateTrack(currentTrack, $("iframe")[0].contentWindow.Anzu.ui.getTrack());
      var trackNumber = parseInt(obj.value);
      currentTrack = trackNumber-1;
      this.set();
      $("#tracklist > li").each(function(ind, obj)
			       {
				 obj.className = "";
			       });
      obj.className = "current";
      Anzu.eventManager.changeCurrentTrack(currentTrack);
      return false;
    },
    exportAsURL : function(obj){
      Anzu.player.score.updateTrack(currentTrack, parseFrame());
      var scoreDump = Anzu.player.score.dump();
      return loaderURL + 
	"{" + 
	'"name":'  + '"' + encodeURI(obj.name) + '"' + "," +
	'"comment":' + '"' + encodeURI(obj.comment) + '"' + "," +
	'"version":' + '"' + obj.version + '"' + "," + 
	'"score":' + scoreDump +
	"}";
    },
    openExportDialog : function(){
      var url = this.exportAsURL({name : "Anzu", comment : "first", version : Anzu.core.version});
      $("#exportDialog").dialog("open");
      $("#exportDialogURL").html("I save your score "+ 
				 "<a href='" + encodeURI(url) + "'>this url</a>" + "." + "<br><br>" + 
				 "Bookmark it!"
				 );
    },
    load : function(data){
      try{
	var s = JSON.parse(data);
      }catch(e){
	alert("Parse Error. I cannot load this URL.");
      }
      s_name = s.name;
      s_comment = s.comment;
      var version = s.version;

      Anzu.eventManager.setDivID(s.score.maxID + 1);

      Anzu.player.score = Anzu.Score(s.score);
      $("#bpmInput").val(Anzu.player.score.bpm);

      currentTime = 0;
      currentTrack = 0;
      Anzu.player.set();
      $("#bpmForm").val(Anzu.player.score.bpm);
      $("#bpmButton > .ui-button-text").html("BPM=" + Anzu.player.score.bpm);
    },
    parseURL : function(){
      var url = document.location.href;
      var data;
      if(url.match(/.+?load=(.+)/)){
	data = RegExp.$1;
	Anzu.player.load(decodeURI(data));
      }else{
	this.set();
      }
    },
    changeBPM : function(obj){
      var bpm = parseFloat(obj);
      if(bpm <= 0.0 || bpm === NaN) return;
      Anzu.player.score.changeBPM(bpm);
      Anzu.eventManager.add("changeBPM", bpm);
    },
    frameLoaded : function(){
      Anzu.player.setEventManager();
      Anzu.eventManager.init();
      Anzu.player.parseURL();

      Anzu.tone.addUserTone("tone/sampleSine.js");
      console.log(Anzu.tone.getToneList());
//       this.set();
    }

  };
}();
