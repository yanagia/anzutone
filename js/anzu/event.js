/* Licensed under the MIT license: see LICENCE.txt */
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
	divID = parseInt(wave.getState().get('divID'), 10) + 1;
	wave.getState().submitDelta({'divID': divID});
      }else{
	divID += 1;
      }
    },
    init : function(startID){
      if(typeof wave !== "undefined" && wave.getState().get('divID')){
	divID = wave.getState().get('divID');
      }else{
	divID = startID ? startID : 0;
      }
    }
  };
}();