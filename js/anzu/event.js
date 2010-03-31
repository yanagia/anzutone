Anzu.eventManager = function(){
  var eventQueue = [];
  var currentTrack = 0;
  var divID = 0;

  return {
    add : function(type, target){
      eventQueue.push(
	{
	  type : type,
	  value : target,
	  track : currentTrack
	});

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
	}
      }      
    },
    changeState : function(){
//       console.log("change:something : " + state.getKeys());
      var state = wave.getState();
      var keys = state.getKeys();
      var key;
      console.log("change something");
      for(var i = 0; i < keys.length; i++){
	key = keys[i];
	switch(key){
	case "divID":
	  divID = parseInt(wave.getState().get('divID'));
	  break;	    
	default:
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
    init : function(){
      if(typeof wave !== "undefined" && wave.getState().get('divID')){
	divID = 0;
// 	divID = wave.getState().get('divID');
// 	wave.setStateCallback(this.changeState);
      }else{
	divID = 0;
      }
    }
  };
}();