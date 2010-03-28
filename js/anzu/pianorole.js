Anzu.ui.pianorole = function(){

  $(function(){
      var role = $("#role");
      var noteCSSClass = "ui-widget-header";
      var posKeyList, bodyHeight = 1920;

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
	prev = now;
	lastKeyIndex = nowKeyIndex;
      };

      function createNoteDiv(obj){
	return $("<div>")
	  .addClass(noteCSSClass)
	  .attr("style", "width: " + obj.width + "px;" + " height: 17px; margin 0px 20px 20px 0px;" + 
		"position: absolute; opacity: 0.9;"  + 
		"top:" + (Math.floor(obj.top / 20) * 20 + 1) + "px;" + 
		"left:" + (Math.floor(obj.left / 12.5) * 12.5) + "px;")
	  .resizable({ maxHeight : 17, minHeight : 17})
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
	      }
	    });
      }

      function deleteNoteDiv(elm){
	var el = $(elm);
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

      // イベントのバインド

      // ダブルクリックでノートを追加
      $(document).dblclick(function(ev)
			   {
			     createNoteDiv(
			       {
				 top : ev.pageY,
				 left : ev.pageX,
				 width : 98
			       }).appendTo($("#role"));
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

      
  });

}();