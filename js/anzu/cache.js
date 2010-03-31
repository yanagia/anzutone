Anzu.cache = function(){
  var noteList = {};

  return {
    setNote : function(key, value){
      noteList[key] = value;
    },
    getNote : function(key){
      return noteList[key];
    }
  };
}();