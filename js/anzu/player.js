$(function()
  {
    Anzu.player.score = Anzu.Score(
      '({"tracks" : [ { "notes" : [], "tone" : "Anzu.SquareWave"}, { "notes" : [], "tone" : "Anzu.SquareWave"}, { "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"},{ "notes" : [], "tone" : "Anzu.SquareWave"} ], "bpm" : 120})'
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

    $("#toneSelect").buttonset();

    
    var iframe = document.createElement('IFRAME');
    document.getElementById('trackviewContainer').appendChild(iframe);
    var doc = frames[frames.length - 1].document;

    iframe.width = "100%";
    iframe.height = "80%";
    iframe.className = "trackview";
    iframe.id = "pianorole";
    iframe.frameborder = "0";
// <iframe class="trackview" width="100%" height="80%" frameborder=0 id="pianorole" tabindex=1 onload=""></iframe>
    doc.open();
    doc.write('<html>'+'<head>'+'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+''+'<!-- jQuery -->'+'<link type="text/css" href="http://dl.dropbox.com/u/294534/anzutone/css/ui-lightness/jquery-ui-1.8.custom.css" rel="stylesheet" />'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/jquery-1.4.2.min.js"></script>'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/jquery-ui-1.8.custom.min.js"></script>'+''+'<!-- jQuery Plugin -->'+'<!-- context menu -->'+'<!-- <script src="http://dl.dropbox.com/u/294534/anzutone/js/jquery.contextMenu.js" type="text/javascript"></script> -->'+'<!-- <link href="css/plugin/jquery.contextMenu.css" rel="stylesheet" type="text/css" /> -->'+''+'<!-- Base64 -->'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/base64.js"></script>'+''+'<!-- Anzu -->'+'<!-- <script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/pianorole.js"></script> -->'+'<!-- <script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/wave.js"></script> -->'+'<link type="text/css" href="http://dl.dropbox.com/u/294534/anzutone/css/anzu/tooltip.css" rel="stylesheet" />'+'<link type="text/css" href="http://dl.dropbox.com/u/294534/anzutone/css/anzu/note.css" rel="stylesheet" />'+''+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/core.js"></script>'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/wave.js"></script>'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/score.js"></script>'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/tone.js"></script>'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/audio.js"></script>'+'<!-- <script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/event.js"></script> -->'+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/anzu/pianorole.js"></script>'+''+'<script type="text/javascript" src="http://dl.dropbox.com/u/294534/anzutone/js/init.js"></script>'+''+'</head>'+'<body>'+'<div id="role">'+'</div>'+''+'<div id="bar" class="ui-state-highlight" style="width: 2px; position: absolute; height: 1920px; top: 0px; left: 100px; z-index: 999;"></div>'+''+'<div class="tooltip" id="barTooltip">'+'<div class="tooltipTri"></div><div class="tooltipBody"><div class="tooltipInner" id="barTooltipInner">abc</div></div>'+'</div>'+''+''+'<!-- <ul id="noteContextMenu" class="contextMenu"> -->'+'<!--   <li><a href="#noteDeleteEvent">Delete</a></li> -->'+'<!-- </ul> -->'+''+'<div id="audioStream"></div>'+'</body>'+'');
    doc.close();

    iframe.onload = Anzu.player.frameLoaded;

//     setTimeout(Anzu.player.frameLoaded, 1000);

    console.log("jquery initializer called");

//     gadgets.util.registerOnLoadHandler(function(){
// 					 console.log("loaded ready");
    wave.setStateCallback(Anzu.eventManager.changeState);
    // 				       });


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
      var s = eval( "(" + data + ")" );
      s_name = s.name;
      s_comment = s.comment;
      var version = s.version;

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
      Anzu.player.parseURL();
      Anzu.eventManager.init();
//       this.set();
    },
    renderScoreAgain : function(){
      this.set();
    }

  };
}();
