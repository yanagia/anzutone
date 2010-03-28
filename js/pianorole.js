var testSounds;
var bodyHeight = 1920;
var posKeyList;

$(function(){
//     console.log(document.location);
//     console.log(location.href);

    var role = $("#role");

//     $("<div>")
//       .addClass("ui-widget-header")
//       .attr("style", "width: 300px; height: 19px; float: left; margin 200px 20px 20px 0px; position: absolute; top:20px; left: 0px;")
//       .resizable({ maxHeight : 19, minHeight : 19})
//       .draggable({ grid : [12.5, 20]})
//       .appendTo(role);

    // 4分音符が100pxだから、32分単位で合わせると 100 / 8 = 12.5 ?
    // これはuserが決められると良いね。
    // だけど外側からどうやって制御するんだ？
    // 外側からDomノードに値を書き込むことはできそう

//     $("<div>")
//       .addClass("ui-widget-header")
//       .attr("style", "width: 300px; height: 19px; float: left; margin 0px 20px 20px 0px; position: absolute; top:20px;")
//       .resizable({ maxHeight : 19, minHeight : 19})
//       .draggable({ grid : [1, 20]})
//       .appendTo(role);

    var lastKey = "C1";
    var noteCSSClass = "ui-widget-header";
    var openingContextMenu = false;

    function createNoteDiv(obj){
      return $("<div>")
	.addClass(noteCSSClass)
      //  		     .addClass("ui-widget-content")
	.attr("style", "width: " + obj.width + "px;" + " height: 17px; margin 0px 20px 20px 0px;" + 
	      "position: absolute; opacity: 0.9;"  + 
	      "top:" + (Math.floor(obj.top / 20) * 20 + 1) + "px;" + 
	      "left:" + (Math.floor(obj.left / 12.5) * 12.5) + "px;")
	.resizable({ maxHeight : 17, minHeight : 17})
	.draggable(
	  { 
	    grid : [12.5, 20],
	    start : function(ev, ui){
	      var key = posKeyList[Math.floor(ev.pageY / 20) * 20];
	      var signals = createSquareSignal(0.2, convertToPitch(key));
	      var url = convertToURL(convertToBinary(signals));
	      var audio = new Audio(url);
	      lastKey = key;
	      playShortAudio(audio, 2);
	      url = null;
	      signals = null;
	      audio = null;
	      var selected = $("#role > .ui-selected");
	      var that = this;
	      selected.each(function(ind, elm)
			    {
			      if(that !== elm){
				elm.anzuHelper = {};
				elm.anzuHelper.x = parseInt(that.style.left) - parseInt(elm.style.left);
				elm.anzuHelper.y = parseInt(that.style.top) - parseInt(elm.style.top);
			      }
			    });
	      
	    },
	    drag : function(ev, ui){
	      var selected = $("#role > .ui-selected");
	      var that = this;
	      selected.each(function(ind, elm)
			    {
			      if(that !== elm){
				elm.style.left = (parseInt(that.style.left) - elm.anzuHelper.x) + "px";
				elm.style.top = (parseInt(that.style.top) - elm.anzuHelper.y) + "px";
			      }
			    });

	      var key = posKeyList[Math.floor(ev.pageY / 20) * 20];
	      if(lastKey === key) return;
	      var signals = createSquareSignal(0.2, convertToPitch(key));
	      var url = convertToURL(convertToBinary(signals));
	      var audio = new Audio(url);
	      lastKey = key;
	      playShortAudio(audio, 2);
	      url = null;
	      signals = null;
	      audio = null;
	    }, 
	    stop : function(ev, ui){
	      var selected = $("#role > .ui-selected");
	      var that = this;
	      selected.each(function(ind, elm)
			    {
			      if(that !== elm){
				elm.style.left = (parseInt(that.style.left) - elm.anzuHelper.x) + "px";
				elm.style.top = (parseInt(that.style.top) - elm.anzuHelper.y) + "px";
			      }
			    });
	    }
	  });

    }

    // ノートを追加するアクション
    $(document).dblclick(function(ev)
		 {
		   createNoteDiv({
				   top : ev.pageY,
				   left : ev.pageX,
				   width : 98
				 }).appendTo($("#role"));
		 });

    var killBuffer = [];

    // キーイベント
    $(window).keydown(function(ev)
		      {
			var selected;
			switch(ev.keyCode){
			case 8:	// backspace
			  selected = $("#role > .ui-selected");
			  selected.each(function(ind, elm)
					{
					  var el = $(elm);
					  el.draggable("destroy");
					  el.resizable("destroy");
					  el.remove();
					  el = null;					  
					});
			  
			  break;

			  case 67: // c
			  if(! ev.ctrlKey) return;
			  // Ctrl + c
			  selected = $("#role > .ui-selected");
			  if(selected.length === 0) return;
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
					  var el = $(elm);
					  el.draggable("destroy");
					  el.resizable("destroy");
					  el.remove();
					  el = null;					  
					});
			  if(selected.length === 0) return;
			  killBuffer = [];
			  min = 1000 * 1000;
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

			  break;
			}
		      });

    var prev = new Date();
    var lastKeyIndex = 0;
    // 音を鳴らす。ダブルクリックの時は鳴らさない。

    function clickHandler(ev)
    {
//       if(openingContextMenu) return;
      var now = new Date();
      var nowKeyIndex = Math.floor(ev.pageY / 20) * 20;
      if(lastKeyIndex === nowKeyIndex && now - prev < 400) return; // ダブルクリック対策
      var key = posKeyList[Math.floor(ev.pageY / 20) * 20];
      var signals = createSquareSignal(0.2, convertToPitch(key));
      var url = convertToURL(convertToBinary(signals));
      var audio = new Audio(url);
      playShortAudio(audio, 2);
      prev = now;
      lastKeyIndex = nowKeyIndex;
      audio = null;
      signals = null;
      url = null;
    };
//     $(document).click(clickHandler);

    initPitchList();
    testSounds = {};

    var base = ["Ad", "Ad#", "Bd", "Cd", "Cd#", "Dd", "Dd#","Ed", "Fd", "Fd#", "Gd","Gd#"];
    posKeyList = {};

    // 座標と音名の対応表を作る
    var i, j, len, k;
    len = base.length;
    k = 0;
    for(i = 1; i <= 9; i++){
      for(j = 0; j < len; j++){
	posKeyList[bodyHeight - k + 40] = base[j].replace("d", i.toString(10));
	k += 20;
      }
    }

    var barTooltip = $("#barTooltip")[0];
    var barTooltipInner = $("#barTooltipInner")[0];
    var lastBarPos = -1;

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
	lastBarPos =-1;
      }
    });

//     startBarAnimation(4, 1200);

    $("body").selectable(
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
	  clickHandler(ev);
	},
	filter : "#role > .ui-widget-header"
      });

    // あらかじめスクロールしておく。
    document.body.scrollTop = 1180;
});

function playShortAudio(audio, t){
  var jo = $(audio);
  $("#audioStream").append(jo);
  audio.volume = 0.1;
  audio.loop = false;
  audio.play();
  setTimeout(function()
	     {
	       audio.pause();
	       audio.loop = false;
	       audio = null;
	       jo.remove();
	       jo = null;
	     }, t * 1000 * 2);
}

function convertToTrack(){
  var role = $("#role");

  var notes = [];
  var track = Anzu.Track();
  var n;
  role.children().each(function(idn, dom){
			 n = Anzu.Note();
			 n.setDiv(dom);
			 track.addNote(n);
// 			 var top, left, width;
// 			 top = dom.style.top;
// 			 left = dom.style.left;
// 			 width = dom.style.width;
// 			 notes.push(convertToNote(dom));
		       });

  return track;
}

function convertToNote(dom){
  var top, left, width, note;
  top = parseInt(dom.style.top, 10);
  left = parseInt(dom.style.left, 10);
  width = parseInt(dom.style.width, 10);
  
  // 4分音符が1.0になるように変換
  note = {
    begin : left / 100.0,
    length : width / 100.0,
    key : posKeyList[Math.floor((top+5) / 20) * 20]
  };

  return note;
}

var barAnimationTimer;
var playBarStyle, playBarAdd, playBarMax;

function startBarAnimation(speed, to){
  playBarAdd = speed;
  playBarMax = to;
  playBarStyle = $("#bar")[0].style;
  barAnimationTimer = setInterval(barAnimate, 1000/24);
};

function barAnimate(){
//   console.log("animate");
  var pixel = parseInt(playBarStyle.left, 10);
  playBarStyle.left = playBarAdd + pixel + "px";
  if(playBarAdd + pixel > playBarMax){
    console.log("unset");
    clearInterval(barAnimationTimer);
  }
};

function stopBarAnimation(){
  clearInterval(barAnimationTimer);
}