Anzu.eventManager = function(){
  var eventQueue = [];
  var currentTrack = 0;
  var divID = 0;

  return {
    add : function(type, target){
      eventQueue.push(
	{
	  type : type,
	  note : target,
	  track : currentTrack
	});
//       console.log([type, currentTrack + target.dump()]);
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
	
      }else{
	divID += 1;
      }
      console.log(divID);
    }
  };
}();