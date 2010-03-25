$(function(){
    var ifdoc = $("#pianorole").contents().find("#role");
//     ifdoc.appendChild(document.createTextNode("node"));

    console.log(ifdoc[0]);

//     $("<div>")
//       .addClass("ui-widget-header")
//       .attr("style", "width: 300px; height: 19px; float: left; margin 0 20px 20px 0;")
//       .resizable({ maxHeight : 19, minHeight : 19})
//       .draggable({ grid : [1, 20], iframeFix : true})
//       .appendTo(ifdoc[0]);

//     $("#note2").draggable({ grid : [1, 20]});
//     $("#note2").resizable({ maxHeight : 19, minHeight : 19});

//     $("#note3").draggable({ grid : [1, 20]});
//     $("#note3").resizable({ maxHeight : 19, minHeight : 19});

//     document.body.style.backgroundImage = "url(css/anzu/piano.png)";

    setTimeout(checkRoleNode, 1000);
});

function checkRoleNode(){
  var ifdoc = $("#pianorole").contents().find("#role");

  $("<div>").append("sampleString").attr("style", "display: none;").appendTo(ifdoc);

  console.log(ifdoc);
}

