Anzu.ui = function(){
//   Anzu.ui.killBuffer = [];
//   Anzu.ui.divID = 0;
//   Anzu.ui.browser = IsGecko() ? 0 : 1;

  // 座標と音名の対応表を作る
  var base = ["Ad", "Ad#", "Bd", "Cd", "Cd#", "Dd", "Dd#","Ed", "Fd", "Fd#", "Gd","Gd#"];
  var posKeyList = {};
  var posKeyRev = {};
  var bodyHeight = 1920;

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

  return {
    killBuffer : [],
    divID : 0,
    browser : IsGecko() ? 0 : 1,
    posKeyList : posKeyList,
    posKeyRev : posKeyRev,
    defualtNoteLen : 98
  };
}();

Anzu.ui.initPianorole = function(_track){

  var role = $("#role");
  var noteCSSClass = "ui-widget-header";
  var bodyHeight = 1920;
  var tracks = _track;

//   var divID = Anzu.ui.divID ? Anzu.ui.divID : 0;
  Anzu.ui.divID = Anzu.ui.divID ? Anzu.ui.divID : 0;

  Anzu.ui.track = tracks;
  
  var posKeyList = Anzu.ui.posKeyList;
  var posKeyRev = Anzu.ui.posKeyRev;

  // ごみを消す
  $(window).unbind("dblclick");
  $(window).unbind("keydown");
  $(document).selectable("destroy");

  $("#role > .ui-widget-header").each(function(ind, elm)
				     {
				       var el = $(elm);

				       var n = tracks.getNote(parseInt(el.id, 10));

				       el.animate({opacity : 0.9}, 0, "linear", function()
						 {
						   el.draggable("destroy");
						   el.resizable("destroy");
						   el.remove();			   
						 });
// 				       el.draggable("destroy");
// 				       el.resizable("destroy");
// 				       el.remove();
				     });

  // 読み込み開始
  var i, j, len, k;

  function createDivFromNote(note){
    var obj = {};

    obj.width = note.length * 100;
    obj.left = note.begin * 100;
    obj.top = posKeyRev[note.key];
    return createNoteDiv(obj, note);
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
    var sa = Anzu.ShortAudio(0.3, key);
//     sa.play();
    sa = null;
    key = null;
    prev = now;
    lastKeyIndex = nowKeyIndex;
  };

  function createNoteDiv(obj, did){
    var note, id;
    var top, left;

    if(! did){
      id = Anzu.eventManager.getDivID();
      // Waveでは同期が必要。
      Anzu.eventManager.incDivID();
      note = new Anzu.Note();
      tracks.addNote(note);
      top = Math.floor(obj.top / 20) * 20 + 1;
      left = Math.floor(obj.left / 12.5) * 12.5;
    }else{
      id = did.divID;
      note = did;
      top = obj.top;
      left = obj.left;
    }

    var div = $("<div>")
      .addClass(noteCSSClass)
      .attr("style", "width: " + obj.width + "px;" + " height: 17px; margin 0px 20px 20px 0px;" + 
	    "position: absolute; opacity: 0.9;"  + 
	    "top:" + top + "px;" + 
	    "left:" + left + "px;")
      .attr("id", id + "AnzutoneNoteDiv")
      .resizable(
	{ maxHeight : 17, 
	  minHeight : 17,
	  stop : function(ev, ui){
	    Anzu.ui.defualtNoteLen = parseInt(this.style.width, 10);
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

    // 将来的にdivIDを同期させる必要がありそうなので、アニメーションで遅さをごまかす。
//     div.animate({ opacity : 0.9}, 150);

    note.setDiv(div[0]);

    if(! did){
      Anzu.eventManager.add("addNote", note);
    }

    return div;
  }

  function deleteNoteDiv(elm){
    var el = $(elm);
    tracks.deleteNoteFromDiv(elm);
    el.draggable("destroy");
    el.resizable("destroy");
    el.remove();
  }

//   var killBuffer = Anzu.ui.killBuffer;
  function copyToKillBuffer(selected){
    Anzu.ui.killBuffer = [];
    var min = 1000 * 1000;
    selected.each(function(ind, elm){
		    if(min > parseInt(elm.style.left)) min = parseInt(elm.style.left);
		  });
    selected.each(function(ind, elm)
		  {
		    var el = $(elm);
		    Anzu.ui.killBuffer.push(
		      {
			top : parseInt(elm.style.top), 
			width : parseInt(elm.style.width),
			left : parseInt(elm.style.left) - min
		      });
		  });
  }

  function renderOnionTrack(t){
    var i, notes;
    notes = t._notes();
    for(i = 0; i < notes.length; i++){
      renderOnionNote(notes[i]);
    }
  }

  function renderOnionNote(note){
    var obj = {};
    obj.width = note.length * 100;
    obj.left = note.begin * 100;
    obj.top = posKeyRev[note.key];

    var div = $("<div>")
      .addClass(noteCSSClass)
      .attr("style", "width: " + obj.width + "px;" + " height: 17px; margin 0px 20px 20px 0px;" + 
	    "position: absolute; opacity: 0.3;"  + 
	    "top:" + obj.top + "px;" + 
	    "left:" + obj.left + "px;");

    div.appendTo($("#role"));
  }

  // ノートの読み込み、表示を開始
  len = tracks._notes().length;
  var _notes = tracks._notes();
  for(i = 0; i < len; i++){
    var div = createDivFromNote(_notes[i]);
    div.appendTo($("#role"));
  }

  // オニオンスキン
  var onionTracks = Anzu.ui.score.getOnionTracks();
  var onionTrack;
  len = onionTracks.length;
  for(i = 0; i < len; i++){
    onionTrack = onionTracks[i];
    if(onionTrack === tracks) continue;
    renderOnionTrack(onionTrack);
  }

  // イベントのバインド

  // ダブルクリックでノートを追加
  $(window).dblclick(function(ev)
		       {
			 var div = createNoteDiv(
			   {
			     top : ev.pageY,
			     left : ev.pageX,
			     width : Anzu.ui.defualtNoteLen
			   });
			 div.appendTo($("#role"));
		       });

  // キーイベント
  $(window).keydown(function(ev)
		    {
		      var selected;
		      switch(ev.keyCode){
		      case 8:	// backspace
		      case 46:	// delete
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
			for(i = 0; i < Anzu.ui.killBuffer.length; i++){
			  Anzu.ui.killBuffer[i].left = Anzu.ui.killBuffer[i].left + x;
			  var newNoteDiv = createNoteDiv(Anzu.ui.killBuffer[i]);
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
	if(elm.style.position && elm.id){
	  $(elm).addClass("anzu-note-selected");
// 	  $(elm).animate({backgroundColor : "#66CDAA"}, 300);
	}
      },
      unselected : function(ev, ui){
	var elm = ui.unselected;
	if(elm.style.position){
	  $(ui.unselected).removeClass("anzu-note-selected");
// 	  $(ui.unselected).animate({backgroundColor : "#f6a828"}, 200);
	}
      },
      start : function(ev, ui){
	window.focus(); // focusを奪う
	playTestSound(ev);
      },
      filter : "#role > [id]"
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
    $("#bar")[0].style.left = Math.ceil(x / 12.5) * 12.5 + "px";
    animeTimer = null;
  }

  // publicな何か
  Anzu.ui.getTrack = function(){
    return tracks;
  };

  var animeDelta, animeEnd, animeTimer, animeTim, animeStart, animePass, scrollStart;

  Anzu.ui.startAnimation = function(spb, end, offset){
    var fps = 20.0;
    var d;
    if(end <= 0) return false;
    if(animeTimer) return false;
    animeDelta = spb;
    animeEnd = end * 100.0;
    animeStart = parseInt($("#bar")[0].style.left) + offset * 100 * Anzu.ui.browser;
    animePass = (animeEnd - animeStart) / 100.0 * spb;
    animeTim = new Date();
    scrollStart = document.body.scrollLeft;
    animeTimer = setInterval(barAnimation, 1000 / fps);
    return true;
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

  Anzu.ui.changeVolume = function(v){
    tracks.setVolume(v);
    tracks.setTone(tone);
    Anzu.tone.setDefaultTone(tone);
  };

  // 音色を設定
  Anzu.ui.changeTone(tracks.getTone());
  
  window.focus();
};

Anzu.ui.getCurrentTime = function(){
  return parseInt($("#bar")[0].style.left) / 100.0;
};

Anzu.ui.setTrack = function(t){
  Anzu.ui.initPianorole(t);
};

Anzu.ui.setScore = function(s){
  Anzu.ui.score = s;
};