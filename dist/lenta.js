define("lenta/mixins/data-options",[],function(){return{optionsPrefix:"lenta",parseOptions:function(){var e=this,t=this.$el.data()||{},n=new RegExp("^"+this.optionsPrefix+"([a-zA-Z]+)");return $.each(t,function(r,i){t.hasOwnProperty(r)&&n.test(r)&&(shortName=r.match(n)[1].replace(/[A-Z]/,function(e){return(e||"").toLowerCase()}),e.options[shortName]=i)}),this}}}),define("lenta/slide",["backbone","lenta/mixins/data-options"],function(e,t){var n=e.View.extend({options:{width:0,height:0,maxWidth:null},initialize:function(){this.parseOptions()},isNearTo:function(){return!1},getOffset:function(){var e={x:this.$el.outerWidth(!0)-this.$el.width(),y:this.$el.outerHeight(!0)-this.$el.height()};return e},getAspectRatio:function(){var e=this.options.aspectRatio;return e||(e=this.options.width/this.options.height),e},getOuterWidth:function(){return this.$el.outerWidth(!0)},getPosition:function(){return this.$el.position()},resize:function(e){this.trigger("resize:before");var t=this.getOffset();e-=t.y;var n=Math.floor(e*this.getAspectRatio());return this.options.maxWidth&&this.options.maxWidth<n&&(n=this.options.maxWidth),this.$el.css({height:e,width:n}),this.trigger("resize:after"),this},render:function(){return this.trigger("render:before"),this}});return _.extend(n.prototype,t),n}),define("lenta/scrollbar",["backbone","lenta/mixins/data-options","jqueryui"],function(e,t){var n=e.View.extend({slider:null,viewport:null,lenta:null,handler:null,options:{handlerSelector:".lenta-scrollbar-handler",trackSelector:".lenta-scrollbar-track"},initialize:function(){_.bindAll(this),this.lenta=this.options.lenta,this.slider=this.lenta.slider,this.viewport=this.lenta.viewport,this.handler=this.$(this.options.handlerSelector),this.track=this.$(this.options.trackSelector),this.lenta.on("moving",this.changePosition).on("resized",this.render),this.handler.draggable({axis:"x",containment:"parent",start:this.activateAllSlides,drag:this.changeContainerPosition,stop:this.toCenterSlide})},activateAllSlides:function(){this.lenta.activateAllSlides()},findCenterSlide:function(){var e={slide:null,offset:null},t=this.viewport.width()/2+Math.abs(parseInt(this.slider.css("left")));return _.each(this.lenta.slides,function(n){var r=n.getPosition().left+n.getOuterWidth()/2,i=Math.abs(t-r);if(i<e.offset||e.offset==null)e.offset=i,e.slide=n}),e.slide},changePosition:function(e){var t=e.point/this.viewport.width()*this.handler.width();this.handler.animate({left:-1*t},this.lenta.options.transitionSpeed)},changeContainerPosition:function(){var e=parseInt(this.handler.css("left")),t=e/this.handler.width()*this.viewport.width();this.slider.css("left",-1*t)},toCenterSlide:function(){var e=parseInt(this.handler.css("left")),t=null;e==0?t=_.first(this.lenta.slides):this.track.width()==e+this.handler.width()?t=_.last(this.lenta.slides):t=this.findCenterSlide(),t&&this.lenta.toSlide(t.$el)},render:function(){var e=this.viewport.width()/this.slider.width()*this.track.width();return this.handler.width(e),this.slider.width()<=this.viewport.width()?this.$el.hide():this.$el.show(),this}});return n}),define("lenta",["backbone","lenta/slide","lenta/scrollbar","lenta/mixins/data-options","mousewheel","jqueryui"],function(e,t,n,r){var i=e.View.extend({timerMoveOnResize:null,options:{height:0,scrollbarSelector:".lenta-scrollbar",viewportSelector:".lenta-viewport",sliderSelector:".lenta-viewport > ul",slidesSelector:".lenta-viewport > ul > li",prevBtnSelector:".lenta-prev",nextBtnSelector:".lenta-next",transitionSpeed:"fast",index:0,onMovingCssClass:"moving",onFocusCssClass:"focus",aspectRatio:null,align:"left",verticalAlign:"top",mousewheelTracking:!0,animatedResizing:!0},events:{mousewheel:"onMousewheel"},initialize:function(){var e=this;_.bindAll(this),this.parseOptions(),this.slides=[],this.scrollbar=null,this.slider=this.$(this.options.sliderSelector),this.prevBtn=this.$(this.options.prevBtnSelector),this.nextBtn=this.$(this.options.nextBtnSelector),this.viewport=this.$(this.options.viewportSelector),this.$(this.options.slidesSelector).each(function(n,r){var i=new t({el:$(r)});e.slides.push(i)}),this.nextBtn.on("click",this.next),this.prevBtn.on("click",this.prev),this.$(this.options.slidesSelector).on("click",this.onSlideClick),this.on("moving",this.initControls),$(window).resize(this.onWindowResize),this.$(this.options.scrollbarSelector).length&&(this.scrollbar=new n({el:this.$(this.options.scrollbarSelector),lenta:this}))},onMousewheel:function(e,t,n,r){this.options.mousewheelTracking&&(r>0?this.prev():this.next())},onWindowResize:function(){var e=this;this.resize(),this.options.animatedResizing?(this.timerMoveOnResize&&(clearTimeout(this.timerMoveOnResize),this.timerMoveOnResize=null),this.timerMoveOnResize=setTimeout(function(){e.move(e.options.index)},300)):e.move(e.options.index,!1,!1)},initControls:function(e){e.toIndex+1>=this.slides.length?this.nextBtn.hide():this.nextBtn.show();var t=_.filter(this.slides,function(e){return e.$el.is(".disabled")}).length;e.toIndex-1<t?this.prevBtn.hide():this.prevBtn.show()},onSlideClick:function(e){var t=$(e.currentTarget),n=t.hasClass(this.options.onFocusCssClass);n||this.toSlide(t)},toSlide:function(e){var t=this.$el.find(this.options.slidesSelector).index(e);t+1<=this.slides.length&&t>=0&&this.move(this.options.index=t)},prev:function(e){e&&e.preventDefault(),this.options.index-1>=0&&this.move(this.options.index-1)},next:function(e){e&&e.preventDefault(),this.options.index+1<this.slides.length&&this.move(this.options.index+1)},move:function(e,t,n){var r=this;typeof n=="undefined"&&(n=!0);if(this.$el.hasClass(this.options.onMovingCssClass))return!1;var i=this.slides[e];if(i){if(i.$el.is(".disabled"))return this.move(e+1,!0);this.$el.addClass(this.options.onMovingCssClass);var s=t?this.$el.width()/2-(this.slides[0].getOuterWidth()/2+this.slides[0].getPosition().left):this.$el.width()/2-(i.getOuterWidth()/2+i.getPosition().left),o=0,u=this.$el.width()-this.slider.width(),a=Math.max(Math.min(o,s),u>0?0:u),f=this.findActiveSlide();this.trigger("moving",{point:a,from:f,to:i,toIndex:e});var l=function(){r.options.index=e,r.$el.removeClass(r.options.onMovingCssClass),r.setFocus(i),r.trigger("moved",{from:f,to:i})};n?this.slider.animate({left:a},this.options.transitionSpeed,l):(this.slider.css("left",a),l())}},findActiveSlide:function(){var e=this;return _.find(this.slides,function(t){return t.$el.hasClass(e.options.onFocusCssClass)})},activateAllSlides:function(){this.$el.find(this.options.slidesSelector).addClass(this.options.onFocusCssClass)},deactivateAllSlides:function(){this.$el.find(this.options.slidesSelector).removeClass(this.options.onFocusCssClass)},setFocus:function(e){this.deactivateAllSlides(),e.$el.addClass(this.options.onFocusCssClass)},calculateSize:function(){if(_.isFunction(this.options.calculateSize))return this.options.calculateSize.apply(this);var e=null;if(this.options.aspectRatio){var t=this.$el.parent(),n=Math.min(t.width()/this.$el.width(),t.height()/this.$el.height()),r=this.$el.height()*n;r>this.options.height&&(r=this.options.height),e={width:r*this.options.aspectRatio,height:r}}return e},resize:function(){var e=this,t=this.calculateSize();t&&this.$el.width(t.width).height(t.height);var n=0;return _.invoke(this.slides,function(){this.resize(e.$el.height(),e.$el.width()),n+=this.getOuterWidth()}),this.slider.width(n),this.align(),this.trigger("resized"),this},align:function(){if(this.options.align=="center"){var e=this.$el.parent().width()/2-this.$el.width()/2;this.$el.css("left",e)}else if(this.options.align=="right"){var e=this.$el.parent().width()-this.$el.width();this.$el.css("left",e)}if(this.options.verticalAlign=="center"){var t=this.$el.parent().height()/2-this.$el.height()/2;this.$el.css("top",t)}else if(this.options.verticalAlign=="bottom"){var t=this.$el.parent().height()-this.$el.height();this.$el.css("top",t)}},render:function(){return this.$el.css({position:"relative","max-height":this.options.height}),_.invoke(this.slides,"render"),this.resize().move(this.options.index),this.$el.removeClass("loading"),this}});return _.extend(i.prototype,r),i});