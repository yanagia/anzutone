$(function(){
//     console.log(document.location);
//     console.log(location.href);

    var role = $("#role");

    $("<div>")
      .addClass("ui-widget-header")
      .attr("style", "width: 300px; height: 19px; float: left; margin 200px 20px 20px 0px; position: absolute; top:20px; left: 0px;")
      .resizable({ maxHeight : 19, minHeight : 19})
      .draggable({ grid : [12.5, 20]})
      .appendTo(role);

    // 4分音符が100pxだから、32分単位で合わせると 100 / 8 = 12.5 ?
    // これはuserが決められると良いね。
    // だけど外側からどうやって制御するんだ？
    // 外側からDomノードに値を書き込むことはできそう

    $("<div>")
      .addClass("ui-widget-header")
      .attr("style", "width: 300px; height: 19px; float: left; margin 0px 20px 20px 0px; position: absolute; top:20px;")
      .resizable({ maxHeight : 19, minHeight : 19})
      .draggable({ grid : [1, 20]})
      .appendTo(role);

    $(document).dblclick(function(ev)
		 {
		   console.log(ev.pageX + ":" + ev.pageY);
		   $("<div>")
		     .addClass("ui-widget-header")
		     .attr("style", "width: 100px; height: 19px; margin 0px 20px 20px 0px;" + 
			   "position: absolute;"  + 
			   "top:" + Math.floor(ev.pageY / 20) * 20 + "px;left:" + ev.pageX + "px;")
		     .resizable({ maxHeight : 19, minHeight : 19})
		     .draggable({ grid : [1, 20]})
		     .appendTo(role);
		 });
		   

});