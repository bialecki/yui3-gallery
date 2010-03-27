YUI.add("gallery-effects",function(D){var I=D.Lang,N=D.DOM,K="global",G={};G.EffectQueues={instances:{},get:function(L){if(!I.isString(L)){return L;}if(!this.instances[L]){this.instances[L]=new D.AsyncQueue();}return this.instances[L];}};G.GlobalQueue=G.EffectQueues.get(K);D.mix(D.DOM,{show:function(L){D.DOM.setStyle(L,"display","");},hide:function(L){D.DOM.setStyle(L,"display","none");},displayed:function(L){return D.DOM.getStyle(L,"display")!=="none";},toggle:function(L){D.DOM[D.DOM.displayed(L)?"hide":"show"](L);},getPositionedOffset:function(O){var L=0,Q=0;do{L+=O.offsetTop||0;Q+=O.offsetLeft||0;O=O.offsetParent;if(O){if(O.tagName==="BODY"){break;}var P=N.getStyle(O,"position");if(P!=="static"){break;}}}while(O);return[Q,L];},positionAbsolutely:function(O){if(N.getStyle(O,"position")==="absolute"){return;}var L=N.getPositionedOffset(O);N.setStyles(O,{position:"absolute",top:L[1]+"px",left:L[0]+"px",width:O.clientWidth+"px",height:O.clientHeight+"px"});},getDimensions:function(O){var R;if(N.displayed(O)){R=N.region(O);return[R.width,R.height];}var P=N.getStyle(O,"visibility"),S=N.getStyle(O,"position"),L=N.getStyle(O,"display"),Q;N.setStyles(O,{visibility:"hidden",position:"absolute",display:"block"});R=N.region(O);Q=[R.width,R.height];N.setStyles(O,{visibility:P,position:S,display:L});return Q;},makePositioned:function(L){var O=N.getStyle(L,"position");if(O==="static"||!O){N.setStyle(L,"position","relative");}},undoPositioned:function(L){N.setStyles(L,{position:"",top:"",left:"",bottom:"",right:""});},_makeClipping:function(L){if(L._overflow){return L;}L._overflow=N.getStyle(L,"overflow")||"auto";if(L._overflow!=="hidden"){N.setStyle(L,"overflow","hidden");}},_undoClipping:function(L){if(!L._overflow){return;}N.setStyle(L,"overflow",L._overflow==="auto"?"":L._overflow);L._overflow=undefined;}});D.Node.importMethod(D.DOM,["show","hide","displayed","toggle","getPositionedOffset","positionAbsolutely","getDimensions","makePositioned","undoPositioned","_makeClipping","_undoClipping"]);var M="beforeStart",B="beforeSetup",E="afterSetup",H="beforeFinish",A="afterFinish",F=[M,B,E,H,A];G.BaseEffect=function(L){G.BaseEffect.superclass.constructor.apply(this,arguments);};G.BaseEffect.NAME="baseEffect";G.BaseEffect.ATTRS={scope:{value:K,validator:I.isString},wait:{value:true,validator:I.isBoolean},managed:{value:false,validator:I.isBoolean},anim:{validator:function(L){return L instanceof D.Anim;}},node:{writeOnce:true,validator:function(L){return L instanceof D.Node;}},config:{validator:I.isObject}};D.extend(G.BaseEffect,D.Base,{initializer:function(L){this.set("config",L);this.set("node",D.one(L.node));D.Array.each(F,D.bind(function(O){this.publish(O);if(L[O]){this.on(O,L[O]);}},this));},setup:function(){},addToQueue:function(){if(!this.get("managed")){this.fire("beforeStart");var L=this._getQueue();L.add({fn:this.run,context:this,autoContinue:!this.get("wait")});if(!L.isRunning()){L.run();}}},run:function(){this.fire("beforeSetup");this.setup();this.fire("afterSetup");var L=this.get("anim");L.on("end",this.finish,this);L.run();},finish:function(){this.fire("beforeFinish");this._finish();if(!this.get("managed")&&!this._getQueue().isRunning()){this._getQueue().run();}this.fire("afterFinish");},_getQueue:function(){return G.EffectQueues.get(this.get("scope"));},_finish:function(){}});G.Parallel=function(L){G.Parallel.superclass.constructor.apply(this,arguments);};G.Parallel.NAME="parallel";G.Parallel.ATTRS={effects:{value:[],validator:I.isArray}};D.extend(G.Parallel,G.BaseEffect,{initializer:function(){this.addToQueue();},run:function(){var O=this.get("effects"),L=this.get("config");this.fire("beforeSetup");this.setup();this.fire("afterSetup");if(O.length){O[O.length-1].after("animChange",function(P){P.newVal.on("end",this.finish,this);},this);D.Array.each(O,function(P){P.set("config",D.merge(P.get("config"),L));P.fire("beforeStart");P.run();});}else{this.finish();}}});G.Opacity=function(L){G.Opacity.superclass.constructor.apply(this,arguments);};G.Opacity.NAME="opacity";D.extend(G.Opacity,G.BaseEffect,{_startOpacity:0,initializer:function(L){this._startOpacity=this.get("node").getStyle("opacity")||0;this.addToQueue();},setup:function(){var L=this.get("config");L.from={opacity:L.from!==undefined?L.from:this._startOpacity};L.to={opacity:L.to!==undefined?L.to:1};this.set("anim",new D.Anim(L));}});G.Move=function(L){G.Move.superclass.constructor.apply(this,arguments);};G.Move.NAME="move";D.extend(G.Move,G.BaseEffect,{initializer:function(){this.addToQueue();},setup:function(){var L=this.get("config"),P=this.get("node"),O=D.Node.getDOMNode(P);P.makePositioned();if(L.mode==="absolute"){L.to={xy:[L.x,L.y]};}else{L.to={left:((L.x||0)+parseFloat(O.style.left||"0"))+"px",top:((L.y||0)+parseFloat(O.style.top||"0"))+"px"};}this.set("anim",new D.Anim(L));}});G.Morph=function(L){G.Morph.superclass.constructor.apply(this,arguments);};G.Morph.NAME="morph";D.extend(G.Morph,G.BaseEffect,{initializer:function(){this.addToQueue();},setup:function(){this.set("anim",new D.Anim(this.get("config")));}});G.Scale=function(L){G.Scale.superclass.constructor.apply(this,arguments);};G.Scale.NAME="scale";G.Scale.ATTRS={scaleX:{value:true,validator:I.isBoolean},scaleY:{value:true,validator:I.isBoolean},scaleContent:{value:true,validator:I.isBoolean},scaleFromCenter:{value:false,validator:I.isBoolean},scaleMode:{value:"box",validator:function(L){return L==="box"||L==="contents"||I.isObject(L);}},scaleFrom:{value:100,validator:I.isNumber},scaleTo:{value:200,validator:I.isNumber,setter:function(L){return L;}},restoreAfterFinish:{value:false,validator:I.isBoolean}};D.extend(G.Scale,G.BaseEffect,{_originalStyle:{},initializer:function(L){this.addToQueue();},setup:function(){var k=this.get("config"),e=this.get("node"),j=this.get("scaleX"),i=this.get("scaleY"),d=this.get("scaleContent"),V=this.get("scaleFromCenter"),g=this.get("scaleMode"),m=this.get("scaleFrom"),T=this.get("scaleTo"),W=e.getStyle("position"),X=e.getPositionedOffset(),R=e.getStyle("fontSize")||"100%",b,c;
D.Array.each(["top","left","width","height","fontSize"],D.bind(function(n){this._originalStyle[n]=e.getStyle(n);},this));D.Array.each(["em","px","%","pt"],function(n){if(R.toString().indexOf(n)>0){R=parseFloat(R);b=n;}});if(g==="box"){c=[e.get("offsetHeight"),e.get("offsetWidth")];}else{if(/^content/.test(g)){c=[e.get("scrollHeight"),e.get("scrollWidth")];}else{c=[g.originalHeight,g.originalWidth];}}var Q={},f={},Z=T/100,O=m/100,a=c[1]*O,Y=c[0]*O,P=c[1]*Z,U=c[0]*Z;if(d&&R){f.fontSize=R*O+b;Q.fontSize=R*Z+b;}if(j){f.width=a+"px";Q.width=P+"px";}if(i){f.height=Y+"px";Q.height=U+"px";}if(V){var L=(Y-c[0])/2,h=(a-c[1])/2,l=(U-c[0])/2,S=(P-c[1])/2;if(W==="absolute"){if(i){f.top=(X[1]-L)+"px";Q.top=(X[1]-l)+"px";}if(j){f.left=(X[0]-h)+"px";Q.left=(X[0]-S)+"px";}}else{if(i){f.top=-L+"px";Q.top=-l+"px";}if(j){f.left=-h+"px";Q.left=-S+"px";}}}k.to=Q;k.from=f;this.set("anim",new D.Anim(k));},_finish:function(){if(this.get("restoreAfterFinish")){this.get("node").setStyles(this._originalStyle);}}});G.Highlight=function(L){if(!D.one(L.node).displayed()){return;}G.Highlight.superclass.constructor.apply(this,arguments);};G.Highlight.NAME="highlight";G.Highlight.ATTRS={startColor:{value:"#ff9",validator:I.isString},endColor:{value:"#fff",validator:I.isString},restoreColor:{value:"",validator:I.isString}};D.extend(G.Highlight,G.BaseEffect,{_previousBackgroundImage:"",initializer:function(){this.addToQueue();},setup:function(){var L=D.merge({iterations:1,direction:"alternate"},this.get("config")),O=this.get("node");L.from={backgroundColor:this.get("startColor")};L.to={backgroundColor:this.get("endColor")};if(!this.get("restoreColor")){this.set("restoreColor",O.getStyle("backgroundColor"));}this._previousBackgroundImage=O.getStyle("backgroundImage");O.setStyle("backgroundImage","none");this.set("anim",new D.Anim(L));},_finish:function(){this.get("node").setStyles({backgroundImage:this._previousBackgroundImage,backgroundColor:this.get("restoreColor")});}});G.Puff=function(L){var P=D.one(L.node),O={opacity:P.getStyle("opacity"),position:P.getStyle("position"),top:P.getStyle("top"),left:P.getStyle("left"),width:P.getStyle("width"),height:P.getStyle("height")};return new G.Parallel(D.merge({effects:[new G.Scale({node:P,managed:true,scaleTo:200,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new G.Opacity({node:P,managed:true,to:0})],duration:1,beforeSetup:function(){this.get("node").positionAbsolutely();},afterFinish:function(){this.get("node").hide().setStyles(O);}},L));};G.Appear=function(L){var O=D.one(L.node),P=!O.displayed()?0:O.getStyle("opacity")||0;return new G.Opacity(D.merge({from:P,to:1,beforeSetup:function(){this.get("node").setStyle("opacity",P).show();}},L));};G.Fade=function(O){var Q=D.one(O.node),P=Q.getStyle("opacity"),L=O.to||0;return new G.Opacity(D.merge({from:P||1,to:L,afterFinish:function(){if(L!==0){return;}this.get("node").hide().setStyle("opacity",P);}},O));};G.BlindUp=function(L){var O=D.one(L.node);O._makeClipping();return new G.Scale(D.merge({scaleTo:0,scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinish:function(){this.get("node").hide()._undoClipping();}},L));};G.BlindDown=function(O){var P=D.one(O.node),L=P.getDimensions();return new G.Scale(D.merge({scaleTo:100,scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:L[1],originalWidth:L[0]},restoreAfterFinish:true,afterSetup:function(){var Q=this.get("node");Q._makeClipping().setStyle("height","0px").show();},afterFinish:function(){this.get("node")._undoClipping();}},O));};D.Effects=G;var J={},C="opacity move scale morph highlight appear fade puff blindUp blindDown".split(" ");D.Array.each(C,function(L){J[L]=function(P,O){O=D.merge({node:D.get(P)},O||{});var Q=new D.Effects[L.charAt(0).toUpperCase()+L.substring(1)](O);};});D.Node.importMethod(J,C);},"@VERSION@",{requires:["node","anim","async-queue"]});