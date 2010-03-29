// ShortAudioオブジェクト。
// リソース管理が主な役目。
Anzu.ShortAudio = function(){

  return function(duration, key){
    var generator = Anzu.tone.getDefaultTone();
    var pitch = Anzu.core.convertToPitch(key);
    var signals = generator(duration, pitch);
    var url = convertToURL(convertToBinary(signals));
    var audio = new Audio(url);
    var jo = $(audio);
    var audioStream = Anzu.core.audioStream;
    url = null;
    signals = null;

    function disposeAudio(){
      audio.pause();
      audio.loop = false;
      audio = null;
      jo.remove();
      jo = null;
    }

    return {
      play : function(){
	audioStream.append(jo);
	audio.volume = 0.1;
	audio.loop = false;
	audio.play();
	setTimeout(disposeAudio, Math.floor(duration * 1000 * 1.2));
      }
    };
  };

}();