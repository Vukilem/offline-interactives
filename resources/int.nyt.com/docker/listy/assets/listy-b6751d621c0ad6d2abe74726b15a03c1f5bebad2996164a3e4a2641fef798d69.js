(function(factory){if(typeof define==="function"&&define.amd){define("laziestloader",["jquery/nyt"],factory)}else{factory(jQuery)}})(function($){var laziestLoader=function(options,callback){var $w=$(window),$elements=this,$loaded=$(),retina=window.devicePixelRatio>1,didScroll=false;options=$.extend(true,{threshold:0,sizePattern:/{{SIZE}}/gi,getSource:getSource,scrollThrottle:250,sizeOffsetPercent:0,setSourceMode:true},options);function getSource($el){var source,slug;var data=$el.data();if(data.pattern&&data.widths&&$.isArray(data.widths)){source=retina?data.patternRetina:data.pattern;source=source||data.pattern;if(typeof data.widths[0]==="object"){slug=function(){var widths=$.map(data.widths,function(val){return val.size});var bestFitWidth=bestFit($el.width(),widths);for(var i=data.widths.length-1;i>=0;i--){if(data.widths[i].size===bestFitWidth){return data.widths[i].slug}}}();source=source.replace(options.sizePattern,slug)}else{source=source.replace(options.sizePattern,bestFit($el.width(),data.widths))}}else{source=retina?data.srcRetina:data.src;source=source||data.src}return source}function onLoad($el){$el.addClass("ll-loaded").removeClass("ll-notloaded");$el.trigger("loaded");if(typeof callback==="function"){callback.call($el)}}function bindLoader(){$elements.one("laziestloader",function(){var $el=$(this);var source;if($el.data().ratio){setHeight.call(this)}if(options.setSourceMode){source=options.getSource($el);if(source&&this.getAttribute("src")!==source){this.setAttribute("src",source)}}if(options.setSourceMode&&(this.nodeName==="IMG"||this.nodeName==="VIDEO"||this.nodeName==="AUDIO")){if(this.nodeName==="IMG"){this.onload=function(){onLoad($el)}}else{this.onloadstart=function(){onLoad($el)}}}else{onLoad($el)}})}function unbindLoader(){$elements.off("laziestloader")}var bestFit=laziestLoader.bestFit=function(targetWidth,widths){var selectedWidth=widths[widths.length-1],i=widths.length,offset=targetWidth*(options.sizeOffsetPercent/100);widths.sort(function(a,b){return a-b});while(i--){if(targetWidth-offset<=widths[i]){selectedWidth=widths[i]}}return selectedWidth};function laziestloader(){var $inview=$elements.not($loaded).filter(function(){var $el=$(this),threshold=options.threshold;if($el.is(":hidden"))return;var wt=$w.scrollTop(),wb=wt+$w.height(),et=$el.offset().top,eb=et+$el.height();return eb>=wt-threshold&&et<=wb+threshold});$inview.trigger("laziestloader");$loaded.add($inview)}function setHeight(){var $el=$(this),data=$el.data();data.ratio=data.ratio||data.heightMultiplier;if(data.ratio){$el.css({height:Math.round($el.width()*data.ratio)})}}$elements.addClass("ll-init ll-notloaded").each(setHeight);bindLoader();$w.scroll(function(){didScroll=true});setInterval(function(){if(didScroll){didScroll=false;laziestloader()}},options.scrollThrottle);$w.resize(function(){$loaded=$();unbindLoader();bindLoader();laziestloader()});laziestloader();return this};$.fn.laziestloader=laziestLoader});(function(factory){if(typeof define==="function"&&define.amd){define("text-balancer",["jquery/nyt"],factory)}else{factory(jQuery)}})(function(jQuery){(function($,sr){var debounce=function(func,threshold,execAsap){var timeout;return function debounced(){var obj=this,args=arguments;function delayed(){if(!execAsap){func.apply(obj,args)}timeout=null}if(timeout){clearTimeout(timeout)}else if(execAsap){func.apply(obj,args)}timeout=setTimeout(delayed,threshold||100)}};jQuery.fn[sr]=function(fn){return fn?this.bind("resize",debounce(fn)):this.trigger(sr)}})(jQuery,"smartresize");(function($){var style=document.documentElement.style,hasTextWrap=style.textWrap||style.WebkitTextWrap||style.MozTextWrap||style.MsTextWrap||style.OTextWrap;function NextWS_params(){this.reset()}NextWS_params.prototype.reset=function(){this.index=0;this.width=0};var isWS=function(c){return Boolean(c.match(/^\s$/))};var removeTags=function($el){$el.find('br[data-owner="balance-text"]').replaceWith(" ");var $span=$el.find('span[data-owner="balance-text"]');if($span.length>0){var txt="";$span.each(function(){txt+=$(this).text();$(this).remove()});$el.html(txt)}};var isJustified=function($el){style=$el.get(0).currentStyle||window.getComputedStyle($el.get(0),null);return style.textAlign==="justify"};var justify=function($el,txt,conWidth){txt=$.trim(txt);var words=txt.split(" ").length;txt=txt+" ";if(words<2){return txt}var tmp=$("<span></span>").html(txt);$el.append(tmp);var size=tmp.width();tmp.remove();var wordSpacing=Math.floor((conWidth-size)/(words-1));tmp.css("word-spacing",wordSpacing+"px").attr("data-owner","balance-text");return $("<div></div>").append(tmp).html()};var isBreakOpportunity=function(txt,index){return index===0||index===txt.length||isWS(txt.charAt(index-1))&&!isWS(txt.charAt(index))};var findBreakOpportunity=function($el,txt,conWidth,desWidth,dir,c,ret){var w;for(;;){while(!isBreakOpportunity(txt,c)){c+=dir}$el.text(txt.substr(0,c));w=$el.width();if(dir<0?w<=desWidth||w<=0||c===0:desWidth<=w||conWidth<=w||c===txt.length){break}c+=dir}ret.index=c;ret.width=w};var getSpaceWidth=function($el,h){var container=document.createElement("div");container.style.display="block";container.style.position="absolute";container.style.bottom="0";container.style.right="0";container.style.width="0px";container.style.height="0px";container.style.margin="0";container.style.padding="0";container.style.visibility="hidden";container.style.overflow="hidden";var space=document.createElement("span");space.style.fontSize="2000px";space.innerHTML="&nbsp;";container.appendChild(space);$el.append(container);var dims=space.getBoundingClientRect();container.parentNode.removeChild(container);var spaceRatio=dims.height/dims.width;return h/spaceRatio};$.fn.balanceText=function(){if(hasTextWrap){return this}return this.each(function(){var $this=$(this);var maxTextWidth=5e3;removeTags($this);var oldLH="";if($this.attr("style")&&$this.attr("style").indexOf("line-height")>=0){oldLH=$this.css("line-height")}$this.css("line-height","normal");var containerWidth=$this.width();var containerHeight=$this.height();var oldWS=$this.css("white-space");var oldFloat=$this.css("float");var oldDisplay=$this.css("display");var oldPosition=$this.css("position");$this.css({"white-space":"nowrap","float":"none",display:"inline",position:"static"});var nowrapWidth=$this.width();var nowrapHeight=$this.height();var spaceWidth=oldWS==="pre-wrap"?0:getSpaceWidth($this,nowrapHeight);if(containerWidth>0&&nowrapWidth>containerWidth&&nowrapWidth<maxTextWidth){var remainingText=$this.text();var newText="";var lineText="";var shouldJustify=isJustified($this);var totLines=Math.round(containerHeight/nowrapHeight);var remLines=totLines;while(remLines>1){var desiredWidth=Math.round((nowrapWidth+spaceWidth)/remLines-spaceWidth);var guessIndex=Math.round((remainingText.length+1)/remLines)-1;var le=new NextWS_params;findBreakOpportunity($this,remainingText,containerWidth,desiredWidth,-1,guessIndex,le);var ge=new NextWS_params;guessIndex=le.index;findBreakOpportunity($this,remainingText,containerWidth,desiredWidth,+1,guessIndex,ge);le.reset();guessIndex=ge.index;findBreakOpportunity($this,remainingText,containerWidth,desiredWidth,-1,guessIndex,le);var splitIndex;if(le.index===0){splitIndex=ge.index}else if(containerWidth<ge.width||le.index===ge.index){splitIndex=le.index}else{splitIndex=Math.abs(desiredWidth-le.width)<Math.abs(ge.width-desiredWidth)?le.index:ge.index}lineText=remainingText.substr(0,splitIndex);if(shouldJustify){newText+=justify($this,lineText,containerWidth)}else{newText+=lineText.replace(/\s+$/,"");newText+='<br data-owner="balance-text" />'}remainingText=remainingText.substr(splitIndex);remLines--;$this.text(remainingText);nowrapWidth=$this.width()}if(shouldJustify){$this.html(newText+justify($this,remainingText,containerWidth))}else{$this.html(newText+remainingText)}}$this.css({position:oldPosition,display:oldDisplay,"float":oldFloat,"white-space":oldWS,"line-height":oldLH})})};function applyBalanceText(){$(".balance-text").balanceText()}$(window).ready(applyBalanceText);$(window).smartresize(applyBalanceText)})(jQuery)});require(["jquery/nyt","underscore/nyt","shared/sharetools/views/sharetools","shared/ad/views/ads","vhs","laziestloader","text-balancer"],function($,_,ShareTools,Ad,vhs){if(magnum.getViewportInteger()>720&&$("body").hasClass("list-style-feature")){$(".story-header .story-heading").balanceText()}$(".media.photo .image img").laziestloader({threshold:200});var env=window.location.hostname.match(".stg.")!==null?"staging":"production";_.each($(".video_container"),function(vid,i){var vidid=$(vid).attr("data-videoid");var poster=$(vid).attr("data-poster");var container=$(vid).find(".video_wrap").attr("id");var player=vhs.player({container:container,id:vidid,mode:"html5",width:"100%",height:"100%",type:"listy",conviva:false,poster:poster,cover:{mode:"duration"},env:env})});new ShareTools({el:$("#sharetools-story")});if(magnum.getViewportInteger()>960){var viewport_positions=["MiddleRight1"];$("#mobilebanner").css("display","none")}else if(magnum.getViewportInteger()>720){var viewport_positions=["mobilebanner"];$("#MiddleRight1").css("display","none")}var section=$('meta[property="article:section"]').attr("content").toLowerCase();var slug=$('meta[name="slug"]').attr("content").toLowerCase();new Ad({positions:viewport_positions,scope:"int-ads"});if($("#related-coverage").find(".story").length>0){var marginaliaHTML='<aside class="marginalia related-coverage-marginalia nocontent robots-nocontent" role="complementary">';marginaliaHTML+='<div class="nocontent robots-nocontent">';marginaliaHTML+='<a class="visually-hidden skip-to-text-link" href="#story-continues-2">Continue reading the main story</a>';marginaliaHTML+='<header><h2 class="module-heading">Related Coverage</h2></header>';marginaliaHTML+="<ul>";var related=$("#related-coverage").find(".story");_.each(related,function(item){var $item=$(item),url=$item.find("a").attr("href"),imsrc=$item.find("img").length>0?$item.find("img").attr("src"):null,hed=$item.find(".story-heading").html();marginaliaHTML+='<li><article class="story theme-summary">';marginaliaHTML+='<a class="story-link" href="'+url+'">';if(imsrc!==null)marginaliaHTML+='<div class="thumb"><img src="'+changeRendition(imsrc,"thumbStandard")+'" alt=""><div class="media-action-overlay"></div></div>';marginaliaHTML+='<h2 class="story-heading"><span class="story-heading-text">'+hed+"</span></h2>";marginaliaHTML+="</a></article></li>"});marginaliaHTML+="</ul></div></aside>";$(".lede-container-ads").append(marginaliaHTML)}function changeRendition(ogSrc,crop){var newSrc,version,rBegin;if(ogSrc[ogSrc.lastIndexOf("-")+1]==="v"&&ogSrc[ogSrc.lastIndexOf("-")+3]==="."){version=ogSrc.slice(ogSrc.lastIndexOf("-"),ogSrc.length);rBegin=ogSrc.slice(0,ogSrc.lastIndexOf("-")).lastIndexOf("-");newSrc=ogSrc.slice(0,rBegin)+"-"+crop+version}else{rBegin=ogSrc.lastIndexOf("-");fileExt=_.last(ogSrc.split("."))||"jpg";newSrc=ogSrc.slice(0,rBegin)+"-"+crop+"."+fileExt}return newSrc}});define("listy",function(){});