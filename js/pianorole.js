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

    // ノートを追加するアクション
    $(document).dblclick(function(ev)
		 {
		   $("<div>")
		     .addClass("ui-widget-header")
		     .attr("style", "width: 98px; height: 17px; margin 0px 20px 20px 0px;" + 
			   "position: absolute;"  + 
			   "top:" + (Math.floor(ev.pageY / 20) * 20 + 1) + "px;" + 
			   "left:" + (Math.floor(ev.pageX / 12.5) * 12.5) + "px;")
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
			 },
			 drag : function(ev, ui){
			   var key = posKeyList[Math.floor(ev.pageY / 20) * 20];
			   if(lastKey === key) return;
			   var signals = createSquareSignal(0.2, convertToPitch(key));
			   var url = convertToURL(convertToBinary(signals));
			   var audio = new Audio(url);
			   lastKey = key;
			   playShortAudio(audio, 2);
			 }
		       })
		     .contextMenu(
		       {
			 menu : "noteContextMenu",
			 afterCallback : function(){
			   $(document).click(clickHandler);			   
			 }
		       }, function(action, el, pos){
			 if(action === "noteDeleteEvent"){
			   el.disableContextMenu();
			   el.draggable("destroy");
			   el.resizable("destroy");
			   el.remove();
			 }

		       })
		     .appendTo(role);
		 });

    var prev = new Date();
    var lastKeyIndex = 0;
    // 音を鳴らす。ダブルクリックの時は鳴らさない。

    function clickHandler(ev)
    {
      var now = new Date();
      var nowKeyIndex = Math.floor(ev.pageY / 20) * 20;
      if(lastKeyIndex === nowKeyIndex && now - prev < 200) return;
      var key = posKeyList[Math.floor(ev.pageY / 20) * 20];
      var signals = createSquareSignal(0.2, convertToPitch(key));
      var url = convertToURL(convertToBinary(signals));
      var audio = new Audio(url);
      playShortAudio(audio, 2);
      prev = now;
      lastKeyIndex = nowKeyIndex;
      audio = null;
    };
    $(document).click(clickHandler);
    
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

    // あらかじめスクロールしておく。
    document.body.scrollTop = 1180;
});

function playShortAudio(audio, t){
  var jo = $(audio);
  $("#audioStream").append(jo);
  audio.volume = 0.2;
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

  var track = [];

  role.children().each(function(idn, dom){
			 var top, left, width;
			 top = dom.style.top;
			 left = dom.style.left;
			 width = dom.style.width;
			 console.log([top, left, width]);
			 track.push(convertToNote(dom));
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