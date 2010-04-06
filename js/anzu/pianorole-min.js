var Anzu={};Anzu.ui={};
Anzu.core=function(){function k(){var d={Cd:65.4,"Cd#":69.3,Dd:73.425,"Dd#":77.775,Ed:82.4,Fd:87.3,"Fd#":92.5,Gd:98,"Gd#":103.825,Ad:55,"Ad#":58.275,Bd:61.7375},c;for(c=2;c<=9;c++)for(var i in d)g[i.replace("d",c.toString(10))]=g[i.replace("d",(c-1).toString(10))]*2}var g={A1:55,"A1#":58.275,B1:61.7375,C1:65.4,"C1#":69.3,D1:73.425,"D1#":77.775,E1:82.4,F1:87.3,"F1#":92.5,G1:98,"G1#":103.825};k();return{convertToPitch:function(d){return g[d]},audioStream:$("body"),samplingRate:22050,version:"0.0.1"}}();
function IsGecko(){if(navigator)if(navigator.userAgent)if(navigator.userAgent.indexOf("Gecko/")!=-1)return true;return false};Anzu.wave=function(){function k(d){return String.fromCharCode(d>>0&255,d>>8&255)}function g(d){return String.fromCharCode(d>>0&255,d>>8&255,d>>16&255,d>>24&255)}return{generator:{createSquareSignal:function(d,c){var i,e,b;b=0;d=Math.round(d*22050);var a=c*2*Math.PI/22050;i=new Array(d);for(c=0;c<d;c++){e=Math.sin(b);e=e>0?0.7:-0.7;i[c]=~~(e*32767);b+=a}return i},createSinSignal:function(d,c){var i,e,b;b=0;d=Math.round(d*22050);var a=c*2*Math.PI/22050;i=new Array(d);for(c=0;c<d;c++){e=Math.sin(b);
i[c]=~~(e*32767);b+=a}return i},createSawtoothSignal:function(d,c){var i,e,b;b=0;d=Math.round(d*22050);var a=22050/c;i=new Array(d);for(c=0;c<d;c++){if(b>a)b-=a;e=b*2/a-1;i[c]=~~(e*32767);b+=1}return i},createTriangleSignal:function(d,c){var i,e,b;b=0;d=Math.round(d*22050);var a=22050/c;i=new Array(d);for(c=0;c<d;c++){if(b>a)b-=a;e=b*2/a-1;e=(Math.abs(e)-0.5)*2;i[c]=~~(e*32767);b+=1}return i},createWhiteNoiseSignal:function(d){var c,i,e;d=Math.round(d*22050);i=new Array(d);for(c=0;c<d;c++){e=Math.random()*
2-1;i[c]=~~(e*32767)}return i}},mixSignal:function(d,c,i){var e,b,a;b=c.length;i=Math.floor(i);for(e=0;e<b;e++){a=d[e+i]+c[e];d[e+i]=a}},mixSignalV:function(d,c,i,e){var b,a,j;a=c.length;i=Math.floor(i);for(b=0;b<a;b++){j=d[b+i]+~~(c[b]*e);d[b+i]=j}},convertToBinary:function(d){var c,i,e;i=d.length;for(c=0;c<i;c++){e=d[c];e=e>393204?393204:e<-393204?-393204:e;d[c]=String.fromCharCode((e+393204)/786408*256)}return d.join("")},convertToURL:function(d){var c;c="WAVEfmt ";c+=g(16);c+=k(1);c+=k(1);c+=
g(22050);c+=g(22050);c+=k(1);c+=k(8);c+="data";var i;i=g(d.length);c+=i;i="RIFF";i+=g(c.length+d.length);return"data:audio/wav;base64,"+Base64.encode(i+c+d)}}}();Anzu.Score=function(){return function(k){if(typeof k==="string")try{k=JSON.parse(k)}catch(g){alert("Parse Error");console.log(g)}for(var d=[],c,i,e,b=0;b<k.tracks.length;b++)d[b]=Anzu.Track(k.tracks[b]);return{bpm:k.bpm,addTrack:function(a){d.push(a)},updateTrack:function(a,j){d[a]=j},setCallback:function(a){i=a},setAfterCallback:function(a){e=a},play:function(a){var j,m,l,n,o,q,p,v,w;w=Anzu.core.samplingRate;m=d.length;p=this.getEndTime();q=60/this.bpm;v=Math.ceil((p-a)*q*w);if(v<=0)v=1;n=new Array(v);
for(j=0;j<v;j++)n[j]=0;Anzu.mixer.init(n);Anzu.mixer.setCallback(function(){var u=Anzu.wave.convertToBinary(n);u=Anzu.wave.convertToURL(u);c=new Audio(u);Anzu.core.audioStream.append($(c));c.volume=1;u=u=o=n=null;if(i)var t=setInterval(function(){if(c.currentTime>0.1){clearInterval(t);i(q,p-a,c.currentTime/q)}},100);e&&setTimeout(function(){e();if(c){c.pause();c.src=undefined;$(c).remove()}},v/w*1E3+100);c.play()});for(j=0;j<m;j++){l=d[j];o=l.getSignalOpt(n,a,q)}Anzu.mixer.finishAddQueues()},stop:function(){c.pause();
$(c).remove()},getEndTime:function(){var a,j,m,l;j=d.length;for(a=l=0;a<j;a++){m=d[a];m=m.getLastNote();m=m.begin+m.length;if(m>l)l=m}return l},getTrack:function(a){return d[a]},dump:function(){return'{"tracks":['+d.map(function(a){return a.dump()}).join(",")+'],"bpm":'+this.bpm+',"maxID":'+this.getMaxID()+"}"},changeBPM:function(a){this.bpm=a},changeNote:function(a,j){var m,l,n;if(m=Anzu.cache.getNote(a)){if(m===j)return;l=j.split("~");if(l[1]===""){n=parseInt(l[0]);d[n].deleteNote(eval("("+m.split("~")[1]+
")"))}else{n=parseInt(l[0]);d[n].updateNote(a,l[1])}}else{l=j.split("~");if(l[1]==="")return;n=parseInt(l[0]);d[n].updateNote(a,l[1])}Anzu.cache.setNote(a,j)},getMaxID:function(){for(var a,j,m=a=0;m<d.length;m++){j=d[m].getMaxID();if(j>a)a=j}return a},getOnionTracks:function(){for(var a=[],j=0;j<d.length;j++)d[j].isOnion()&&a.push(d[j]);return a}}}}();
Anzu.Track=function(){return function(k){if(typeof k==="string")k=JSON.parse(k);var g,d,c=0.5,i=false;g=k.notes;for(var e=0;e<g.length;e++)g[e]=Anzu.Note(g[e]);if(k.tone.match(/\.js/)){d="Anzu.SequareWave";Anzu.tone.addUserTone(k.tone,function(b){d=b})}else d=k.tone;c=k.volume?Math.abs(k.volume)>1?0.5:k.volume:0.5;return{addNote:function(b){g.push(b)},deleteNote:function(b){for(var a=0;a<g.length;a++)if(g[a].divID==b.divID){g.splice(a,1);return}},deleteUnlinkNotes:function(){for(var b=g.length-1;b>=
0;b--)g[b].divID||g.splice(b,1)},getNote:function(b){for(var a=0;a<g.length;a++)if(g[a].divID==b)return g[a];return null},_notes:function(){return g},deleteNoteFromDiv:function(b){for(var a=0;a<g.length;a++)if(g[a].divID==parseInt(b.id,10)){Anzu.eventManager.add("deleteNote",g[a]);g.splice(a,1);return}},changeNote:function(b){for(var a=0;a<g.length;a++)if(g[a].divID==parseInt(b.id,10)){g[a].setDiv(b);Anzu.eventManager.add("changeNote",g[a]);return}},setTone:function(b){d=b},getTone:function(){return d},
getLastNote:function(){if(g.length===0)return Anzu.Note({begin:0,length:0,key:"A4"});g.sort(function(b,a){return b.begin+b.length-(a.begin+a.length)});return g[g.length-1]},getSignal:function(b,a){var j=Anzu.core.samplingRate,m,l,n,o,q,p;p=Anzu.tone.getTone(d);l=g.length;m=this.getLastNote();n=Math.ceil((m.begin+m.length)*a*j);m=new Array(n);for(o=0;o<n;o++)m[o]=0;for(o=0;o<l;o++){n=g[o];if(!(n.begin<b)){q=n.getSignal(p,a);Anzu.wave.mixSignal(m,q,(n.begin-b)*a*j)}}return m},getSignalOpt:function(b,
a,j){var m=Anzu.core.samplingRate,l,n,o,q,p;p=Anzu.tone.getTone(d);n=g.length;l=this.getLastNote();Math.ceil((l.begin+l.length)*j*m);if(typeof p==="function")for(l=0;l<n;l++){o=g[l];if(!(o.begin<a)){q=o.getSignal(p,j);Anzu.wave.mixSignalV(b,q,(o.begin-a)*j*m,c)}}else for(l=0;l<n;l++){o=g[l];if(!(o.begin<a)){q=l+"@"+o.begin+"@"+o.length;Anzu.mixer.addQueue({key:q,info:{start:(o.begin-a)*j*m,volume:c}});o.getSignalASync(p,j,q)}}return b},isOnion:function(){return i},setOnion:function(b){i=b},getVolume:function(){return c},
setVolume:function(b){c=b},getMaxID:function(){for(var b,a,j=b=0;j<g.length;j++){a=g[j].divID;if(a>b)b=a}return b},updateNote:function(b,a){for(var j=0;j<g.length;j++)if(g[j].divID==b){g[j]=Anzu.Note(eval("("+a+")"));return}g.push(Anzu.Note(eval("("+a+")")))},dump:function(){return'{"notes":['+g.map(function(b){return b.dump()}).join(",")+'],"tone":"'+Anzu.tone.getToneDumpName(d)+'","volume":'+c+"}"}}}}();
Anzu.Note=function(){return function(k){k=!k?{}:k;return{begin:k.begin,length:k.length,key:k.key,divID:k.divID,dirty:true,setDiv:function(g){this.div=g;var d,c,i;d=parseInt(g.style.top,10);c=parseInt(g.style.left,10);i=parseInt(g.style.width,10);this.begin=c/100;this.length=i/100;this.key=Anzu.ui.posKeyList[Math.floor((d+5)/20)*20];if(!this.divID)this.divID=parseInt(g.id,10)},getSignal:function(g,d){return g(d*this.length,Anzu.core.convertToPitch(this.key))},getSignalASync:function(g,d,c){g.call(d*
this.length,Anzu.core.convertToPitch(this.key),c)},dump:function(){return'{"begin":'+this.begin+',"length":'+this.length+',"key":"'+this.key+'","divID":"'+this.divID+'"}'}}}}();Anzu.mixer=function(){function k(){if(!i)return false;var e=0;for(var b in g)e++;return e===0}var g={},d,c,i=false;return{init:function(e){d=e;g={};i=false},addQueue:function(e){g[e.key]=e.info},finishAddQueues:function(){i=true;k()&&c()},finishQueue:function(e){var b=e.key;Anzu.wave.mixSignalV(d,e.signals,g[b].start,g[b].volume);delete g[b];k()&&c()},setCallback:function(e){c=e}}}();Anzu.tone=function(){function k(e){var b={};if(typeof e==="string"){e=e.split(",");var a,j=e.length;for(a=0;a<j-1;a++)e[a]=parseInt(e[a],10);a=e.pop();b.key=a;b.signals=e}else b=e;return b}var g={},d={},c=Anzu.wave.createSquareSignal,i={};g["Anzu.SquareWave"]=Anzu.wave.generator.createSquareSignal;g["Anzu.SineWave"]=Anzu.wave.generator.createSinSignal;g["Anzu.SawtoothWave"]=Anzu.wave.generator.createSawtoothSignal;g["Anzu.WhiteNoise"]=Anzu.wave.generator.createWhiteNoiseSignal;return{addTone:function(e,
b){g[e]=b},getToneList:function(){var e=[],b;for(b in g)e.push(b);for(b in d)e.push(b);return e},getToneDumpName:function(e){if(g[e])return e;else if(d[e])return i[e];return"Anzu.SequareWave"},getTone:function(e){var b=g[e];if(b)return b;else{var a=d[e];return a?{call:function(j,m,l){(function(n){parseInt(n);var o;a.onmessage=function(){return function(q){q=k(q.data);Anzu.mixer.finishQueue({key:q.key,signals:q.signals})}}(n);o=IsGecko()?0:1;a.postMessage(j+"|"+m+"|"+Anzu.core.samplingRate+"|"+n+"|"+
o)})(l)}}:Anzu.wave.createSquareSignal}},getDefaultTone:function(){return c},setDefaultTone:function(e){if(g[e])c=this.getTone(e);else if(d[e]){var b=d[e];c={call:function(a,j,m){b.onmessage=function(n){n=k(n.data).signals;a(n)};var l=IsGecko()?0:1;b.postMessage(j+"|"+m+"|"+Anzu.core.samplingRate+"|once|"+l)}}}return g["Anzu.SeguareWave"]},addUserTone:function(e,b,a){for(var j in i)i.key===e&&b(j);var m=new Worker("usertone.js");m.onmessage=function(l){l=l.data.split("@")[0];d[l]=m;i[l]=e;b&&b(l);
Anzu.player.refreshTone()};m.onerror=function(l){a(l.message)};m.postMessage("init|"+e)}}}();Anzu.ui=function(){var k=["Ad","Ad#","Bd","Cd","Cd#","Dd","Dd#","Ed","Fd","Fd#","Gd","Gd#"],g={},d={},c,i,e,b;e=k.length;b=0;for(c=1;c<=9;c++)for(i=0;i<e;i++){g[1920-b+40]=k[i].replace("d",c.toString(10));d[k[i].replace("d",c.toString(10))]=1920-b+40;b+=20}return{killBuffer:[],divID:0,browser:IsGecko()?0:1,posKeyList:g,posKeyRev:d,defualtNoteLen:98}}();
Anzu.ui.initPianorole=function(k){function g(f){var h={};h.width=f.length*100;h.left=f.begin*100;h.top=w[f.key];return b(h,f)}function d(f,h){if(t!==h){h.anzuHelper={};h.anzuHelper.x=parseInt(t.style.left)-parseInt(h.style.left);h.anzuHelper.y=parseInt(t.style.top)-parseInt(h.style.top)}}function c(f,h){if(t!==h){h.style.left=parseInt(t.style.left)-h.anzuHelper.x+"px";h.style.top=parseInt(t.style.top)-h.anzuHelper.y+"px"}}function i(f,h){p.changeNote(h)}function e(f){var h=new Date,r=Math.floor(f.pageY/
20)*20;if(H!==r){f=v[Math.floor(f.pageY/20)*20];Anzu.ShortAudio(0.3,f);M=h;H=r}}function b(f,h){var r,s,D,E;if(h){s=h.divID;r=h;D=f.top;E=f.left}else{s=Anzu.eventManager.getDivID();Anzu.eventManager.incDivID();r=new Anzu.Note;p.addNote(r);D=Math.floor(f.top/20)*20+1;E=Math.floor(f.left/12.5)*12.5}f=$("<div>").addClass(q).attr("style","width: "+f.width+"px; height: 17px; margin 0px 20px 20px 0px;position: absolute; opacity: 0.9;top:"+D+"px;left:"+E+"px;").attr("id",s+"AnzutoneNoteDiv").resizable({maxHeight:17,
minHeight:17,stop:function(){Anzu.ui.defualtNoteLen=parseInt(this.style.width,10);p.changeNote(this)}}).draggable({grid:[12.5,20],start:function(x){var F=$("#role > .ui-selected");t=this;F.each(d);e(x)},drag:function(x){var F=$("#role > .ui-selected");t=this;F.each(c);e(x)},stop:function(){var x=$("#role > .ui-selected");t=this;x.each(c);x.each(i);p.changeNote(this)}});r.setDiv(f[0]);h||Anzu.eventManager.add("addNote",r);return f}function a(f){var h=$(f);p.deleteNoteFromDiv(f);h.draggable("destroy");
h.resizable("destroy");h.remove()}function j(f){Anzu.ui.killBuffer=[];var h=1E6;f.each(function(r,s){if(h>parseInt(s.style.left))h=parseInt(s.style.left)});f.each(function(r,s){$(s);Anzu.ui.killBuffer.push({top:parseInt(s.style.top),width:parseInt(s.style.width),left:parseInt(s.style.left)-h})})}function m(f){var h;h=f._notes();for(f=0;f<h.length;f++)l(h[f])}function l(f){var h={};h.width=f.length*100;h.left=f.begin*100;h.top=w[f.key];$("<div>").addClass(q).attr("style","width: "+h.width+"px; height: 17px; margin 0px 20px 20px 0px;position: absolute; opacity: 0.3;top:"+
h.top+"px;left:"+h.left+"px;").appendTo($("#role"))}function n(){var f=parseInt($("#bar")[0].style.left);f=(new Date-I)/1E3/J*(z-A);$("#bar")[0].style.left=f+A+"px";f>z+0.2&&o();document.body.scrollLeft=K+f}function o(){clearInterval(B);var f=parseInt($("#bar")[0].style.left);$("#bar")[0].style.left=Math.ceil(f/12.5)*12.5+"px";B=null}$("#role");var q="ui-widget-header",p=k;Anzu.ui.divID=Anzu.ui.divID?Anzu.ui.divID:0;Anzu.ui.track=p;var v=Anzu.ui.posKeyList,w=Anzu.ui.posKeyRev;$(window).unbind("dblclick");
$(window).unbind("keydown");$(document).selectable("destroy");$("#role > .ui-widget-header").each(function(f,h){var r=$(h);p.getNote(parseInt(r.id,10));r.animate({opacity:0.9},0,"linear",function(){r.draggable("destroy");r.resizable("destroy");r.remove()})});var u,t,M=new Date,H;u=p._notes().length;var C=p._notes();for(k=0;k<u;k++)g(C[k]).appendTo($("#role"));C=Anzu.ui.score.getOnionTracks();var G;u=C.length;for(k=0;k<u;k++){G=C[k];G!==p&&m(G)}$(window).dblclick(function(f){b({top:f.pageY,left:f.pageX,
width:Anzu.ui.defualtNoteLen}).appendTo($("#role"))});$(window).keydown(function(f){switch(f.keyCode){case 8:case 46:f=$("#role > .ui-selected");f.each(function(r,s){a(s)});break;case 67:if(!f.ctrlKey)return;f=$("#role > .ui-selected");if(f.length===0)return;j(f);break;case 86:case 89:f=parseInt($("#bar")[0].style.left);var h;for(h=0;h<Anzu.ui.killBuffer.length;h++){Anzu.ui.killBuffer[h].left+=f;b(Anzu.ui.killBuffer[h]).appendTo($("#role"))}break;case 87:case 88:f=$("#role > .ui-selected");f.each(function(r,
s){a(s)});if(f.length===0)return;j(f);break}});$(document).selectable({selected:function(f,h){f=h.selected;f.style.position&&f.id&&$(f).addClass("anzu-note-selected")},unselected:function(f,h){h.unselected.style.position&&$(h.unselected).removeClass("anzu-note-selected")},start:function(f){window.focus();e(f)},filter:"#role > [id]"});var y=$("#barTooltip")[0],L=$("#barTooltipInner")[0];$("#bar").draggable({axis:"x",grid:[12.5,1],start:function(f){y.style.top=f.pageY-20+"px";y.style.left=f.pageX+"px";
L.innerHTML="&nbsp;"+Math.floor(f.pageX/400)+" + "+f.pageX%400/100;y.style.display="block"},drag:function(f){var h=parseInt($("#bar")[0].style.left);y.style.top=f.pageY-20+"px";y.style.left=h+"px";L.innerHTML="&nbsp;"+Math.floor(h/400)+" + "+h%400/100},stop:function(){y.style.display="none"}});Anzu.ui.getTrack=function(){return p};var z,B,I,A,J,K;Anzu.ui.startAnimation=function(f,h,r){if(h<=0)return false;if(B)return false;z=h*100;A=parseInt($("#bar")[0].style.left)+r*100*Anzu.ui.browser;J=(z-A)/
100*f;I=new Date;K=document.body.scrollLeft;B=setInterval(n,50);return true};Anzu.ui.stopAnimation=o;Anzu.ui.moveBar=function(f){var h=parseInt($("#bar")[0].style.left);if(h+f<0)$("#bar")[0].style.left="0px";else{h=Math.ceil((h+f)/100)*100;$("#bar")[0].style.left=h+"px";document.body.scrollLeft=h-400}};Anzu.ui.changeTone=function(f){p.setTone(f);Anzu.tone.setDefaultTone(f)};Anzu.ui.changeVolume=function(f){p.setVolume(f);p.setTone(tone);Anzu.tone.setDefaultTone(tone)};Anzu.ui.changeTone(p.getTone());
window.focus()};Anzu.ui.getCurrentTime=function(){return parseInt($("#bar")[0].style.left)/100};Anzu.ui.setTrack=function(k){Anzu.ui.initPianorole(k)};Anzu.ui.setScore=function(k){Anzu.ui.score=k};

