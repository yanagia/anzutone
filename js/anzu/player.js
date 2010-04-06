/* Licensed under the MIT license: see LICENCE.txt */
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
//     $("#toneButton").button(
//       {
//       }
//     ).click(function(){
// 	      $("#userToneForm").val("http://");
// 	      $("#userToneForm").removeClass("ui-state-error");
// 	      $("#userToneFormHelper").html("");
// 	      $("#userToneFormHelper").removeClass("ui-state-highlight");
// 	      $("#addToneDialog").dialog("open");
// 	    });

    $("#onionCheckBox").button(
      {
	icons : {
	  primary : "ui-icon-check"
	}
      })
      .click(function(){
	       Anzu.player.setOnion(this.checked);
	     });

    $("#bpmDialog").dialog(
      {
	autoOpen: false,
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

    $("#addToneDialog").dialog(
      {
	autoOpen: false,
	modal: true,
	buttons : {
	  'Load this tone' : function(){
	    var t = $("#userToneForm").val();
	    if(t.match(/\.js/)){
	      $("#userToneFormHelper").text("Now loading ...");
	      Anzu.player.addUserTone(t, function(){
					$("#addToneDialog").dialog("close");
				      });
// 	      $(this).dialog("close");
	    }else{
// 	      $("#userToneForm").addClass("ui-state-error");
	      $("#userToneFormHelper").addClass("ui-state-highlight")
		.text("Invalid URL. Tone file must be JavaScript file. (*.js only)");
	    }
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
    doc.write('<html>'+'<head>'+'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+'<link type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/ui-lightness/jquery-ui.css" rel="stylesheet" />'+'<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js" type="text/javascript"></script>'+'<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js" type="text/javascript" ></script>'+'<script type="text/javascript" src="http://anzutone.appspot.com/js/base64.js"></script>'+'<link type="text/css" href="http://anzutone.appspot.com/wave/css/anzu/tooltip.css" rel="stylesheet" />'+'<link type="text/css" href="http://anzutone.appspot.com/wave/css/anzu/note.css" rel="stylesheet" />'+'<script type="text/javascript" src="http://anzutone.appspot.com/wave/js/anzu/pianorole-min.js"></script>'+'<script type="text/javascript" src="http://anzutone.appspot.com/wave/js/init.js"></script>'+'</head>'+'<body>'+'<div id="role">'+'</div>'+'<div id="bar" class="ui-state-highlight" style="width: 2px; position: absolute; height: 1920px; top: 0px; left: 100px; z-index: 999;"></div>'+'<div class="tooltip" id="barTooltip">'+'<div class="tooltipTri"></div><div class="tooltipBody"><div class="tooltipInner" id="barTooltipInner">abc</div></div>'+'</div>'+'<div id="audioStream"></div>'+'</body>'+'</html>');
    doc.close();

    iframe.onload = Anzu.player.frameLoaded;

//     setTimeout(Anzu.player.frameLoaded, 1000);

//     gadgets.util.registerOnLoadHandler(function(){
// 					 console.log("loaded ready");
    wave.setStateCallback(Anzu.eventManager.changeState);
    gadgets.window.adjustHeight(600);

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
  var loaderURL = "http://anzutone.appspot.com/editor.html?load=";
//   loaderURL = "file:///Users/yanagi/Documents/program/anzutone/editor.html?load=";

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
      if(typeof $("iframe")[0].contentWindow.Anzu === "undefined") return;
      $("iframe")[0].contentWindow.Anzu.ui.setScore(Anzu.player.score);
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
      $("#onionCheckBox")[0].checked = t.isOnion();
      $("#onionCheckBox").button("refresh");
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
    _setBPM : function(b){
      Anzu.player.score.changeBPM(b);
      $("#bpmForm").val(b);
      $("#bpmButton > .ui-button-text").html("BPM=" + b);
    },
    _setTone : function(t, tone){
      Anzu.player.score.getTrack(t).setTone(tone);      
    },
    _setVolume : function(t, v){
      Anzu.player.score.getTrack(t).setVolume(v);
    },
    frameLoaded : function(){
      setTimeout(function()
		 {
		   Anzu.player.setEventManager();
		   Anzu.player.parseURL();
		   Anzu.eventManager.init();
		   Anzu.player.refreshTone();
		 }, 500);
    },
    renderScoreAgain : function(){
      this.set();
    },
    refreshTone : function(){
      $("#toneSelect").html("");
      var tone;
      var toneList = Anzu.tone.getToneList();
      toneList.sort();
      var i, len = toneList.length;
      for(i = 0; i < len; i++){
	tone = toneList[i];

	var tonePrefix = tone.split(".")[0];
	var toneName;
	if(tonePrefix === "Anzu"){
	  toneName = tone.split(".")[1];
	}else{
	  toneName = tone;
	}

	$("#toneSelect").append(
	  $("<input>")
	    .attr("type", "radio")
	    .attr("name", "tone")
	    .attr("id", "radio." + tone)
	    .attr("value", tone))
	  .append(
	    $("<label>")
	      .attr("for", "radio." + tone)
	      .html(toneName));
      }
      $("#toneSelect").buttonset();
    },
    addUserTone : function(t, callback){
      Anzu.tone.addUserTone(t, 
			    function(name){
			      callback();
			    },
			   function(error){
			     $("#userToneFormHelper").html("Error!!" + "<br>" + error);
			   });
    },
    setOnion : function(tf){
      Anzu.player.score.getTrack(currentTrack).setOnion(tf);
    }

  };
}();
