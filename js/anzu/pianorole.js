Anzu.ui.initPianorole = function(_track){

  var role = $("#role");
  var noteCSSClass = "ui-widget-header";
  var posKeyList, bodyHeight = 1920;
  var tracks = Anzu.Track(_track);
  var divID = 0;

  Anzu.ui.track = tracks;
  
  // ごみを消す
  $(window).unbind("dblclick");
  $(window).unbind("keydown");
  $(document).selectable("destroy");

  $("#role > .ui-widget-header").each(function(ind, elm)
				     {
				       var el = $(elm);
				       el.draggable("destroy");
				       el.resizable("destroy");
				       el.remove();
				     });

  // 読み込み開始

  // 座標と音名の対応表を作る
  var base = ["Ad", "Ad#", "Bd", "Cd", "Cd#", "Dd", "Dd#","Ed", "Fd", "Fd#", "Gd","Gd#"];
  posKeyList = {};
  var posKeyRev = {};
  Anzu.ui.posKeyList = posKeyList;
  var i, j, len, k;
  len = base.length;
  k = 0;
  for(i = 1; i <= 9; i++){
    for(j = 0; j < len; j++){
      posKeyList[bodyHeight - k + 40] = base[j].replace("d", i.toString(10));
      posKeyRev[base[j].replace("d", i.toString(10))] = bodyHeight - k + 40;
      k += 20;
    }
  }

  function createDivFromNote(note){
    var obj = {};

    obj.width = note.length * 100;
    obj.left = note.begin * 100;
    obj.top = posKeyRev[note.key];
    return createNoteDiv(obj);
  }

  var that;
  function selectedPosHelper(ind, elm){
    if(that !== elm){
      elm.anzuHelper = {};
      elm.anzuHelper.x = parseInt(that.style.left) - parseInt(elm.style.left);
      elm.anzuHelper.y = parseInt(that.style.top) - parseInt(elm.style.top);
    }
  }
  function selectedPosHelperRun(ind, elm){
    if(that !== elm){
      elm.style.left = (parseInt(that.style.left) - elm.anzuHelper.x) + "px";
      elm.style.top = (parseInt(that.style.top) - elm.anzuHelper.y) + "px";
    }
  }

  function changeSelectedNotes(ind, elm){
    tracks.changeNote(elm);
  }

  function getKey(y){
    return posKeyList[Math.floor(y / 20) * 20];
  }

  var prev = new Date(), lastKeyIndex;

  function playTestSound(ev)
  {
    var now = new Date();
    var nowKeyIndex = Math.floor(ev.pageY / 20) * 20;
    if(lastKeyIndex === nowKeyIndex /*&& now - prev < 400*/) return; // ダブルクリック対策
    var key = posKeyList[Math.floor(ev.pageY / 20) * 20];
    var sa = Anzu.ShortAudio(0.2, key);
    sa.play();
    sa = null;
    key = null;
    prev = now;
    lastKeyIndex = nowKeyIndex;
  };

  function createNoteDiv(obj){
    var div = $("<div>")
      .addClass(noteCSSClass)
      .attr("style", "width: " + obj.width + "px;" + " height: 17px; margin 0px 20px 20px 0px;" + 
	    "position: absolute; opacity: 0.9;"  + 
	    "top:" + (Math.floor(obj.top / 20) * 20 + 1) + "px;" + 
	    "left:" + (Math.floor(obj.left / 12.5) * 12.5) + "px;")
      .attr("id", "AnzutoneNoteDiv" + divID)
      .resizable(
	{ maxHeight : 17, 
	  minHeight : 17,
	  stop : function(ev, ui){
	    tracks.changeNote(this);
	  }
	})
      .draggable(
	{ 
	  grid : [12.5, 20],
	  start : function(ev, ui){
	    var selected = $("#role > .ui-selected");
	    that = this;
	    selected.each(selectedPosHelper);
	    playTestSound(ev);
	  },
	  drag : function(ev, ui){
	    var selected = $("#role > .ui-selected");
	    that = this;
	    selected.each(selectedPosHelperRun);
	    playTestSound(ev);
	  }, 
	  stop : function(ev, ui){
	    var selected = $("#role > .ui-selected");
	    that = this;
	    selected.each(selectedPosHelperRun);
	    selected.each(changeSelectedNotes);
	    tracks.changeNote(this);
	  }
	});
    divID += 1;

    var note = Anzu.Note();
    note.setDiv(div[0]);
    tracks.addNote(note);

    return div;
  }

  function deleteNoteDiv(elm){
    var el = $(elm);
    tracks.deleteNoteFromDiv(elm);
    el.draggable("destroy");
    el.resizable("destroy");
    el.remove();
  }

  var killBuffer = [];
  function copyToKillBuffer(selected){
    killBuffer = [];
    var min = 1000 * 1000;
    selected.each(function(ind, elm){
		    if(min > parseInt(elm.style.left)) min = parseInt(elm.style.left);
		  });
    selected.each(function(ind, elm)
		  {
		    var el = $(elm);
		    killBuffer.push(
		      {
			top : parseInt(elm.style.top), 
			width : parseInt(elm.style.width),
			left : parseInt(elm.style.left) - min
		      });
		  });
  }

  // ノートの読み込み、表示を開始
  len = tracks._notes().length;
  var _notes = tracks._notes();
  for(i = 0; i < len; i++){
    createDivFromNote(_notes[i]).appendTo($("#role"));
  }
  tracks.deleteUnlinkNotes();

  // イベントのバインド

  // ダブルクリックでノートを追加
  $(window).dblclick(function(ev)
		       {
			 var div = createNoteDiv(
			   {
			     top : ev.pageY,
			     left : ev.pageX,
			     width : 98
			   });
			 div.appendTo($("#role"));
		       });

  // キーイベント
  $(window).keydown(function(ev)
		    {
		      var selected;
		      switch(ev.keyCode){
		      case 8:	// backspace
			selected = $("#role > .ui-selected");
			selected.each(function(ind, elm)
				      {
					deleteNoteDiv(elm);
				      });
			break;

		      case 67: // c
			if(! ev.ctrlKey) return;
			// Ctrl + c
			selected = $("#role > .ui-selected");
			if(selected.length === 0) return;
			copyToKillBuffer(selected);
			break;

		      case 86: // v
		      case 89: // y
			var x = parseInt($("#bar")[0].style.left);
			var i, len;
			for(i = 0; i < killBuffer.length; i++){
			  killBuffer[i].left = killBuffer[i].left + x;
			  var newNoteDiv = createNoteDiv(killBuffer[i]);
			  newNoteDiv.appendTo($("#role"));
			}
			break;

		      case 87: // w
		      case 88: // x
			selected = $("#role > .ui-selected");
			selected.each(function(ind, elm)
				      {
					deleteNoteDiv(elm);
				      });
			if(selected.length === 0) return;
			copyToKillBuffer(selected);
			break;
		      }
		    }
		   );

  // ノートを選択できるようにする
  $(document).selectable(
    {
      selected : function(ev, ui){
	var elm = ui.selected;
	if(elm.style.position){
	  $(elm).addClass("anzu-note-selected");
	  $(elm).animate({backgroundColor : "#66CDAA"}, 300);
	}
      },
      unselected : function(ev, ui){
	var elm = ui.unselected;
	if(elm.style.position){
	  $(ui.unselected).removeClass("anzu-note-selected");
	  $(ui.unselected).animate({backgroundColor : "#f6a828"}, 200);
	}
      },
      start : function(ev, ui){
	window.focus(); // focusを奪う
	playTestSound(ev);
      },
      filter : "#role > .ui-widget-header"
    });

  // 再生バーをつかめるようにする
  var barTooltip = $("#barTooltip")[0];
  var barTooltipInner = $("#barTooltipInner")[0];

  $("#bar")
    .draggable(
      {
	axis : "x",
	grid : [12.5, 1],
	start : function(ev, ui){
	  barTooltip.style.top = (ev.pageY-20) + "px";
	  barTooltip.style.left = ev.pageX + "px";
	  barTooltipInner.innerHTML = "&nbsp;" + (Math.floor(ev.pageX / 400)) + " + " + (ev.pageX % 400 / 100);
	  barTooltip.style.display = "block";
	},
	drag : function(ev, ui){
	  var  barPos = parseInt($("#bar")[0].style.left);
	  barTooltip.style.top = (ev.pageY-20) + "px";
	  barTooltip.style.left = barPos + "px";
	  barTooltipInner.innerHTML = "&nbsp;" + (Math.floor(barPos / 400)) + " + " + (barPos % 400 / 100);
	},
	stop : function(ev, ui){
	  barTooltip.style.display = "none";
	}
      });

  function barAnimation(){
    var x = parseInt($("#bar")[0].style.left);
    var now = new Date();
    x = ((now - animeTim) / 1000) / animePass  * (animeEnd - animeStart);
    $("#bar")[0].style.left = x + animeStart + "px";
    if(x > animeEnd + 0.2) stopAnimation();
    document.body.scrollLeft = scrollStart + x;
  }

  function stopAnimation(){
    clearInterval(animeTimer);
    var x = parseInt($("#bar")[0].style.left);
    $("#bar")[0].style.left = Math.floor(x / 12.5) * 12.5 + "px";
  }

  // publicな何か
  Anzu.ui.getTrack = function(){
    return tracks.dump();
  };

  var animeDelta, animeEnd, animeTimer, animeTim, animeStart, animePass, scrollStart;

  Anzu.ui.startAnimation = function(spb, end){
    var fps = 20.0;
    var d;
    animeDelta = spb;
    animeEnd = end * 100.0;
    animeStart = parseInt($("#bar")[0].style.left);
    animePass = (animeEnd - animeStart) / 100.0 * spb;
    animeTim = new Date();
    scrollStart = document.body.scrollLeft;
    animeTimer = setInterval(barAnimation, 1000 / fps);
  };

  Anzu.ui.stopAnimation = stopAnimation;

  Anzu.ui.moveBar = function(delta){
    var x = parseInt($("#bar")[0].style.left);
    if(x + delta < 0){
      $("#bar")[0].style.left = 0 + "px";
      return;
    }
    x = Math.ceil((x + delta) / 100.0) * 100;
    $("#bar")[0].style.left = x + "px";
    document.body.scrollLeft = x - 400;
  };

  Anzu.ui.changeTone = function(tone){
    tracks.setTone(tone);
    Anzu.tone.setDefaultTone(tone);
  };

  // 音色を設定
  Anzu.ui.changeTone(tracks.getTone());

};

Anzu.ui.getCurrentTime = function(){
  return parseInt($("#bar")[0].style.left) / 100.0;
};

Anzu.ui.setTrack = function(t){
  Anzu.ui.initPianorole(t);
};

