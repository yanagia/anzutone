// ShortAudioオブジェクト。
// リソース管理が主な役目。
Anzu.ShortAudio = function(){

  return function(duration, key){
    var generator = Anzu.tone.getDefaultTone();
    var pitch = Anzu.core.convertToPitch(key);
    var signals = generator(duration, pitch);
    var url = Anzu.wave.convertToURL(Anzu.wave.convertToBinary(signals));
    var audio = new Audio(url);
    var jo = $(audio);
    var audioStream = Anzu.core.audioStream;
    var t = duration;
    url = null;
    signals = null;
    generator = null;
    pitch = null;

    function disposeAudio(){
      audio.pause();
      audio.loop = false;
      audio = null;
      jo[0].src = undefined;
      jo.remove();
      jo = null;
      audioStream = null;
      t = null;
    }

    return {
      play : function(){
	audioStream.append(jo);
	audio.volume = 0.3 * (IsGecko() ? 1 : 2);
	audio.loop = false;
	audio.play();
	audioStream = null;
	setTimeout(disposeAudio, Math.floor(t * 1000 * 1.2));
	t = null;
      }
    };
  };

}();