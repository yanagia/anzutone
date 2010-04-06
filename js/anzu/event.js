/* Licensed under the MIT license: see LICENCE.txt */
Anzu.eventManager = function(){
  var eventQueue = [];
  var currentTrack = 0;
  var divID = 0;

  return {
    add : function(type, target){
//       eventQueue.push(
// 	{
// 	  type : type,
// 	  value : target,
// 	  track : currentTrack
// 	});

      if(typeof wave !== "undefined"){
	var id = target.divID;
	var obj = {};
	var str;
	switch(type){
	case "addNote":
	case "changeNote":
	  str = currentTrack + "~" + target.dump();
	  obj[id] = str;
	  wave.getState().submitDelta(obj);
	  Anzu.cache.setNote(id, str);
	  break;
	case "deleteNote":
	  str = currentTrack + "~";
	  obj[id] = str;
	  wave.getState().submitDelta(obj);
	  Anzu.cache.setNote(id, str);
	  break;
	case "changeBPM":
	  str = target.toString(10);
	  obj["BPM"] = str;
	  wave.getState().submitDelta(obj);
	  break;
	case "changeTone":
	  str = target;
	  obj[currentTrack.toString(10) + " tone"] = str;	  
	  wave.getState().submitDelta(obj);
	  break;
	case "changeVolume":
	  str = target.toString(10);
	  obj[currentTrack.toString(10) + " volume"] = str;
	  wave.getState().submitDelta(obj);
	  break;
	}
      }      
    },
    changeState : function(){
      var state = wave.getState();
      var keys = state.getKeys();
      var key, t;
      for(var i = 0; i < keys.length; i++){
	key = keys[i];
	switch(key){
	case "divID":
	  divID = parseInt(wave.getState().get('divID'));
	  break;
	case "BPM":
	  Anzu.player._setBPM(wave.getState().get('BPM'));
	  break;
	default:
	  if(key.match(/tone/)){
	    t = parseInt(key, 10);
	    Anzu.player._setTone(t, wave.getState().get(key));
	    break;
	  }
	  if(key.match(/volume/)){
	    t = parseInt(key, 10);
	    Anzu.player._setVolume(t, wave.getState().get(key));
	    break;
	  }
	  Anzu.player.score.changeNote(key, state.get(key));
	  break;
	}
      }
      Anzu.player.renderScoreAgain();
    },
    changeCurrentTrack : function(t){
      currentTrack = t;
    },
    setDivID : function(id){
      divID = id;
    },
    getDivID : function(){
      return divID;
    },
    incDivID : function(){
      if(typeof wave !== "undefined"){
	divID = parseInt(wave.getState().get('divID', '0'), 10) + 1;
	wave.getState().submitDelta({'divID': divID});
      }else{
	divID += 1;
      }
    },
    init : function(startID){
      if(typeof wave !== "undefined" && wave.getState().get('divID')){
	divID = 0;
	divID = wave.getState().get('divID');
// 	wave.setStateCallback(this.changeState);
      }else{
	divID = startID ? startID : 0;
      }
    }
  };
}();