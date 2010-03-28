$(function(){
    var ifdoc = $("#pianorole").contents().find("#role");
//     ifdoc.appendChild(document.createTextNode("node"));

//     console.log(ifdoc[0]);

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

//     setTimeout(checkRoleNode, 1000);
    initPitchList();
});

function checkRoleNode(){
  var ifd = $("#pianorole").contents().find("#role");
  $("iframe")[0].contentWindow.innerFunction();
//   $("<div>").append("sampleString").attr("style", "display: none;").appendTo(ifdoc);

//   console.log(ifdoc);
}

function getCurrentScore(){
  var track = $("iframe")[0].contentWindow.convertToTrack();
  var score = Anzu.Score();
  score.addTrack(track);

  return score;
}

function playScore(){
  var score = getCurrentScore();

  score.play(0.0);
  return;

  var bpm = score.bpm;  
  var track = score.tracks[0];
  var tone = track.tone;
  var notes = track.notes;

  notes.sort(function(a, b)
	     {
	       return  a.begin + a.length - (b.begin + b.length);
	     });

  console.log(notes);

  var samplingRate = 22050;
  var endTime = notes[notes.length-1].begin + notes[notes.length-1].length;
  var totalSeconds = 60.0 / bpm * endTime;
  var totalFrames = Math.ceil(totalSeconds * samplingRate);
  var baseSignals = new Array(totalFrames);
  var i;
  for(i = 0; i < totalFrames; i++){
    baseSignals[i] = 0;
  }
  var noteslen = notes.length;
  var note, spb = 60.0 / bpm;
  var noteframe, signals;
  for(i = 0; i < noteslen; i++){
    note = notes[i];
    noteframe = note.length * spb;
    signals = createSquareSignal(note.length * spb, convertToPitch(note.key));
    mixSignal(baseSignals, signals, note.begin * spb * samplingRate);
  }

  var url = convertToURL(convertToBinary(baseSignals));
  baseSignals = null;
  var audio = new Audio(url);
  url = null;
  var jo = $(audio);
  $("#outAudioStream").append(jo);
  audio.volume = 0.5;
  audio.loop = false;
  audio.play();
  setTimeout(function()
	     {
	       audio.pause();
	       audio.loop = false;
	       audio = null;
	       jo.remove();
	       jo = null;
	     }, totalSeconds * 1000 + 500);
}