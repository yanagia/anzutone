Anzu.Score = function(){
  
  return function(obj){
    if(typeof obj === "string"){
      try {
	obj = JSON.parse(obj);
      } catch(e){
	alert("Parse Error");
	console.log(e);
      }
    }
    var tracks = [];
    var audio, callback, acallback;

    for(var i = 0; i < obj.tracks.length; i++){
      tracks[i] = Anzu.Track(obj.tracks[i]);
    }

    return {
      bpm : obj.bpm,
      addTrack : function(t){
	tracks.push(t);
      },
      updateTrack : function(i, src){
	tracks[i] = src;
      },
      setCallback : function(f){
	callback = f;
      },
      setAfterCallback : function(f){
	acallback = f;
      },
      play : function(beginTime){ // beginTime は 4分音符を1とした値
	var i, len, track, baseSignals, signals, spb, endTime, alen, srate;
	srate = Anzu.core.samplingRate;
	len = tracks.length;
	endTime = this.getEndTime();
	spb = 60.0 / this.bpm;
	alen = Math.ceil((endTime - beginTime) * spb * srate);
	if(alen <= 0.0) alen = 1;
	baseSignals = new Array(alen);
	for(i = 0; i < alen; i++){
	  baseSignals[i] = 0;
	}

	for(i = 0; i < len; i++){
	  track = tracks[i];
	  signals = track.getSignalOpt(baseSignals, beginTime, spb);
// 	  Anzu.wave.mixSignal(baseSignals, signals, 0);
	}
	var binary = Anzu.wave.convertToBinary(baseSignals);
	var url = Anzu.wave.convertToURL(binary);
	audio = new Audio(url);
	Anzu.core.audioStream.append($(audio));
	audio.volume = 1.0;

	baseSignals = null;
	signals = null;
	binary = null;
	url = null;

	if(callback){
	  var tim = setInterval(function()
				{
				  if(audio.currentTime > 0.1){
				    clearInterval(tim);
				    callback(spb, endTime - beginTime, audio.currentTime / spb);
				  }
				}, 1000/10);
	}
	if(acallback){
	  setTimeout(function()
		     {
		       acallback();
		       if(audio){
			 audio.pause();
			 audio.src = undefined;
			 $(audio).remove();
		       }
		     }, alen / srate * 1000 + 100);
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
	  '"bpm":' + this.bpm + "," +
	  '"maxID":' + this.getMaxID() +
	  "}";
      },
      changeBPM : function(b){
	this.bpm = b;
      },
      getMaxID : function(){
	var max, can;
	max = 0;
	for(var i = 0; i < tracks.length; i++){
	  can = tracks[i].getMaxID();
	  if(can > max) max = can;
	}
	return max;
      }
    };
  };
}();

Anzu.Track = function(){

  return function(obj){
    if(typeof obj === "string") obj = JSON.parse(obj);
    var notes, tone, volume = 0.5;
    notes = obj.notes;
    for(var i = 0; i < notes.length; i++){
      notes[i] = Anzu.Note(notes[i]);
    }

    tone = obj.tone/*Anzu.wave.createSquareSignal*/;
    if(obj.volume)
      volume = Math.abs(obj.volume) > 1.0 ? 0.5 : obj.volume;
    else
      volume = 0.5;
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
      deleteUnlinkNotes : function(){
	var len = notes.length;
	for(var i = len-1; i >= 0; i--){
	  if(! notes[i].divID){
	    notes.splice(i, 1);
	  }
	}
      },
      _notes : function(){
	return notes;
      },
      deleteNoteFromDiv : function(div){
	for(var i = 0; i < notes.length; i++){
	  if(notes[i].divID === parseInt(div.id, 10)){
	    Anzu.eventManager.add("deleteNote", notes[i]);
	    notes.splice(i, 1);
	    return;
	  }
	}
      },
      changeNote : function(div){
	for(var i = 0; i < notes.length; i++){
	  if(notes[i].divID === parseInt(div.id, 10)){
	    notes[i].setDiv(div);
	    Anzu.eventManager.add("changeNote", notes[i]);
	    return;
	  }
	}
      },
      setTone : function(ts){
	/* なにかする！ */
	tone = ts;
      },
      getTone : function(){
	return tone;
      },
      getLastNote : function(){
	if(notes.length === 0) return Anzu.Note({begin : 0, length : 0, key : "A4"});
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
      // 高速版。引数が違う。
      getSignalOpt : function(baseSignals, beginTime, spb){
	var srate = Anzu.core.samplingRate;
	var lastNote, len, alen, i, note, signals, ftone;
	ftone = Anzu.tone.getTone(tone);
	len = notes.length;
	lastNote = this.getLastNote();
	alen = Math.ceil((lastNote.begin + lastNote.length) * spb * srate);

	// 合成
	if(typeof ftone === "function"){ // プリセットトーン
	  for(i = 0; i < len; i++){
	    note = notes[i];
	    if(note.begin < beginTime) continue;
	    signals = note.getSignal(ftone, spb);
	    Anzu.wave.mixSignalV(baseSignals, signals, (note.begin - beginTime) * spb * srate, volume);
	  }
	}else{			// ユーザートーン
	  for(i = 0; i < len; i++){
	    note = notes[i];
	    if(note.begin < beginTime) continue;
	    var key = i + "@" + note.begin + "@" + note.end;
	    Anzu.mixer.addQueue(
	      {
		key : key,
		info : {
		  start : (note.begin - beginTime) * spb * srate,
		  volume : volume
		}
	      });
	    note.getSignalASync(ftone, spb, key);
// 	    Anzu.wave.mixSignalV(baseSignals, signals, (note.begin - beginTime) * spb * srate, volume);
	  }  
	}

	return baseSignals;
      },

      getVolume : function(){
	return volume;
      },
      setVolume : function(v){
	volume = v;
      },
      getMaxID : function(){
	var max, can;
	max = 0;
	for(var i = 0; i < notes.length; i++){
	  can = notes[i].divID;
	  if(can > max) max = can;
	}
	return max;
      },

      dump : function(){
	return "{" +
	  '"notes":' + "[" + 
	  notes.map(function(el)
		    {
		      return el.dump();
		    }).join(",") + "]" + "," + 
	  '"tone":' + '"'+ tone + '"' + "," + 
	  '"volume":' + volume
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
      divID : parseInt(obj.id),
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
	this.divID = parseInt(div.id, 10);
      },
      getSignal : function(tone, spb){
	var signals = tone(spb * this.length, Anzu.core.convertToPitch(this.key));
	return signals;
      },
      getSignalASync : function(tone, spb, key){
	tone.call(spb * this.length, Anzu.core.convertToPitch(this.key), key);
      },
      dump : function(){
	return "{" + 
	  '"begin":' + this.begin + "," +
	  '"length":' + this.length + "," +
	  '"key":' + '"' + this.key + '"' + "," +
	  '"id":' + '"' + this.divID + '"' + 
	  "}";
      }
    };

  };
}();

