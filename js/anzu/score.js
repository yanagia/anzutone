Anzu.Score = function(){
  
  return function(obj){
    obj = eval(obj);
    var tracks = obj.tracks;
    var audio, callback;
    return {
      bpm : obj.bpm,
      addTrack : function(t){
	tracks.push(t);
      },
      updateTrack : function(i, src){
	tracks[i] = Anzu.Track(eval("(" + src + ")"));
      },
      setCallback : function(f){
	callback = f;
      },
      play : function(beginTime){ // beginTime は 4分音符を1とした値
	var i, len, track, baseSignals, signals, spb, endTime, alen, srate;
	srate = Anzu.core.samplingRate;
	len = tracks.length;
	endTime = this.getEndTime();
	spb = 60.0 / this.bpm;
	alen = Math.ceil((endTime - beginTime) * spb * srate);
	baseSignals = new Array(alen);
	for(i = 0; i < alen; i++){
	  baseSignals[i] = 0.0;
	}

	for(i = 0; i < len; i++){
	  track = tracks[i];
	  signals = track.getSignal(beginTime, spb);
	  Anzu.wave.mixSignal(baseSignals, signals, 0);
	}
	console.log(endTime - beginTime);
	var binary = Anzu.wave.convertToBinary(baseSignals);
	var url = Anzu.wave.convertToURL(binary);
	audio = new Audio(url);
	Anzu.core.audioStream.append($(audio));
	audio.volume = 1.0;
// 	setTimeout(function(){
// 		     audio.play();
// 		   }, 1);
	if(callback){
	  var tim = setInterval(function()
				{
				  if(audio.currentTime > 0.1){
				    clearInterval(tim);
				    callback(spb, endTime - beginTime);
				  }
				}, 1000/10);
	}
	audio.play();
      },
      stop : function(){
	audio.pause();
	$(audio).remove();
// 	audio = null;
      },
      getEndTime : function(){
	var i, len, track, ln, endTime, ent;
	len = tracks.length;
	endTime = 0;
	for(i = 0; i < len; i++){
	  track = tracks[i];
	  ln = track.getLastNote();
	  ent = ln.begin + ln.length;
	  if(ent > endTime) endTime = ent;
	}
	return endTime;
      },
      getTrack : function(i){
	return tracks[i];
      },
      dump : function(){
	return "{" + 
	  '"tracks":' + "[" + 
	  tracks.map(function(el)
		     {
		       return el.dump();
		     }).join(",") + "]" + "," +
	  '"bpm":' + bpm +
	  "}";
      }
    };
  };
}();

Anzu.Track = function(){

  return function(obj){
    var notes, tone;
    notes = obj.notes;
    for(var i = 0; i < notes.length; i++){
      notes[i] = Anzu.Note(notes[i]);
    }

    tone = obj.tone/*Anzu.wave.createSquareSignal*/;
    return {
      addNote : function(note){
	notes.push(note);
      },
      deleteNote : function(note){
	for(var i = 0; notes.length; i++){
	  if(notes[i] === note){
	    notes.splice(i, 1);
	    return;
	  }
	}
      },
      deleteNoteFromDiv : function(div){
	for(var i = 0; i < notes.length; i++){
	  if(notes[i].divID === div.id){
	    notes.splice(i, 1);
	    return;
	  }
	}
      },
      changeNote : function(div){
	for(var i = 0; i < notes.length; i++){
	  if(notes[i].divID === div.id){
	    notes[i].setDiv(div);
	    return;
	  }
	}
      },
      setTone : function(ts){
	/* なにかする！ */
	tone = ts;
      },
      getLastNote : function(){
	// 一番後ろにいるノートを探す
	notes.sort(function(a, b){
		      return (a.begin + a.length) - (b.begin + b.length);
	});
	return notes[notes.length-1];
      },
      getSignal : function(beginTime, spb){
	var srate = Anzu.core.samplingRate;
	var baseSignals, lastNote, len, alen, i, note, signals, ftone;
	ftone = Anzu.tone.getTone(tone);
	len = notes.length;
	lastNote = this.getLastNote();

	// 合成のベースになる配列をつくる
	alen = Math.ceil((lastNote.begin + lastNote.length) * spb * srate);
	baseSignals = new Array(alen);
	for(i = 0; i < alen; i++){
	  baseSignals[i] = 0.0;
	}

	// 合成
	for(i = 0; i < len; i++){
	  note = notes[i];
	  if(note.begin < beginTime) continue;
	  signals = note.getSignal(ftone, spb);
	  Anzu.wave.mixSignal(baseSignals, signals, (note.begin - beginTime) * spb * srate);
	}

	return baseSignals;
      },
      dump : function(){
	return "{" +
	  '"notes":' + "[" + 
	  notes.map(function(el)
		    {
		      return el.dump();
		    }).join(",") + "]" + "," + 
	  '"tone":' + '"'+ tone + '"'
	+ "}";
      }
    };
  };
}();

Anzu.Note = function(){

  return function(obj){
    obj = ! obj ? {} : obj;

    return {
      begin : obj.begin,
      length : obj.length,
      key : obj.key,
      divID : 0,
      setDiv : function(div){
	this.div = div;
	var top, left, width;
	top = parseInt(div.style.top, 10);
	left = parseInt(div.style.left, 10);
	width = parseInt(div.style.width, 10);
  
	// 4分音符が1.0になるように変換
	this.begin = left / 100.0;
	this.length = width / 100.0;
	this.key = Anzu.ui.posKeyList[Math.floor((top+5) / 20) * 20];
	this.divID = div.id;
      },
      getSignal : function(tone, spb){
	var signals = tone(spb * this.length, Anzu.core.convertToPitch(this.key));
	return signals;
      },
      dump : function(){
	return "{" + 
	  '"begin":' + this.begin + "," +
	  '"length":' + this.length + "," +
	  '"key":' + '"' + this.key + '"' + 
	  "}";
      }
    };

  };
}();

