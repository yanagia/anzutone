Anzu.Score = function(){
  
  return function(){
    var tracks = [];
    return {
      bpm : 120,
      addTrack : function(t){
	tracks.push(t);
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
	var audio = new Audio(url);
	Anzu.core.audioStream.append($(audio));
	audio.volume = 1.0;
	audio.play();
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
      }
    };
  };
}();

Anzu.Track = function(){

  return function(){
    var notes, tone;
    notes = [];
    tone = Anzu.wave.createSquareSignal;
    return {
      addNote : function(note){
	notes.push(note);
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
	var baseSignals, lastNote, len, alen, i, note, signals;
	len = notes.length;
	lastNote = this.getLastNote();

	// 開始時間でソートし直す
// 	tracks.sort(function(a, b)
// 		   {
// 		     return a.begin - b.begin;
// 		   });

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
	  signals = note.getSignal(tone, spb);
	  Anzu.wave.mixSignal(baseSignals, signals, (note.begin - beginTime) * spb * srate);
	}

	return baseSignals;
      }
    };
  };
}();

Anzu.Note = function(){

  return function(obj){

    return {
      begin : 0.0,
      length : 100.0,
      key : "A4",
      setDiv : function(div){
	this.div = div;
	var top, left, width;
	top = parseInt(div.style.top, 10);
	left = parseInt(div.style.left, 10);
	width = parseInt(div.style.width, 10);
  
	// 4分音符が1.0になるように変換
	this.begin = left / 100.0;
	this.length = width / 100.0;
	this.key = posKeyList[Math.floor((top+5) / 20) * 20];
      },
      getSignal : function(tone, spb){
	var signals = tone(spb * this.length, Anzu.core.convertToPitch(this.key));
	return signals;
      }
    };

  };
}();

