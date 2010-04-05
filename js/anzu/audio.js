// ShortAudioオブジェクト。
// リソース管理が主な役目。
Anzu.ShortAudio = function(){

  return function(duration, key){

    var url, audio, jo, audioStream, t;
    audioStream = Anzu.core.audioStream;

    function createAudio(sigs){
      url = Anzu.wave.convertToURL(Anzu.wave.convertToBinary(sigs));
      audio = new Audio(url);
      jo = $(audio);
      audioStream = Anzu.core.audioStream;
      t = duration;
      playAudio();
    }

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

    function playAudio(){
      audioStream.append(jo);
      audio.volume = 0.3;
      audio.loop = false;
      audio.play();
      audioStream = null;
      setTimeout(disposeAudio, Math.floor(t * 1000 * 1.2));
      t = null;
    }

    var generator = Anzu.tone.getDefaultTone();
    var pitch = Anzu.core.convertToPitch(key);
    var signals;

    if(typeof generator !== "function"){
      generator.call(createAudio, duration, pitch);
      return { play : function(){} };
    }else{
      signals = generator(duration, pitch);
      createAudio(signals);
    }
    url = null;
    signals = null;
    generator = null;
    pitch = null;

    return {
      play : playAudio
    };
  };


}();