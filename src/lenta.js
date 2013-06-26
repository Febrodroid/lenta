define([
	
    'backbone',
    'lenta/slide',
    'lenta/scrollbar',
	'lenta/mixins/data-options',
	'mousewheel',
	'jqueryui',
	'lenta/animations/fade',
	'lenta/animations/none',
	'lenta/animations/slide'

], function(Backbone, Slide, Scrollbar, DataOptionsMixin) {
	
	var Lenta = Backbone.View.extend({
		
		timerMoveOnResize: null,
		
		options: {
			height: 0,
			scrollbarSelector: '.lenta-scrollbar',
			viewportSelector: '.lenta-viewport',
			sliderSelector: '.lenta-viewport > ul',
			slidesSelector: '.lenta-viewport > ul > li',
			prevBtnSelector: '.lenta-prev',
			nextBtnSelector: '.lenta-next',
			transitionSpeed: 'fast',
			index: null,
			onMovingCssClass: 'moving',
			onFocusCssClass: 'focus',
			aspectRatio: null,
			align: 'left',
			verticalAlign: 'top',
			mousewheelTracking: true,
			animatedResizing: true,
			transitionAnimation: 'slide' 
		},

		events: {
			'mousewheel': 'onMousewheel'
		},
		
		initialize: function() {

			_.bindAll(this);
							
			this.parseOptions();
			
			this.slides = [];
			this.scrollbar = null;
			this.slider = this.$(this.options.sliderSelector);
			this.prevBtn = this.$(this.options.prevBtnSelector);
			this.nextBtn = this.$(this.options.nextBtnSelector);
			this.viewport = this.$(this.options.viewportSelector);
			
			this.createSlides();
			
			this.nextBtn
				.on('click', this.next);
		
			this.prevBtn
				.on('click', this.prev);
					
			this.$(this.options.slidesSelector)
				.on('click', this.onSlideClick);

			this.on('moving', this.initControls);
			
			$(window).resize(this.onWindowResize);

			if(this.$(this.options.scrollbarSelector).length) {

				this.scrollbar = new Scrollbar({
					el: this.$(this.options.scrollbarSelector),
					lenta: this
				});
			}
		},
		
		unbind: function() {
			
			$(window).unbind('resize', this.onWindowResize);
			this.undelegateEvents();
			
			return this;
		},
		
		createSlides: function() {
			
			if(_.isFunction(this.options.createSlides)) {
				return this.options.createSlides.apply(this);
			}		
			
			return this.$(this.options.slidesSelector).each(this.addSlide);
		},
		
		addSlide: function(i, element) {
			
			var slide = this.createSlide(element);
			
			this.slides.push(slide);
			
			return slide;			
		},
		
		createSlide: function(element) {
			
			var slide = new Slide({
				el: $(element)
			});
			
			return slide;	
		},

		onMousewheel: function(event, delta, deltaX, deltaY) {
			
			if(this.options.mousewheelTracking) {
			
				if(deltaY > 0) {
					this.prev();
				} else {
					this.next();
				}
			}
		},
		
		onWindowResize: function() {
			
			var self = this;
			
			this.resize();
			
			if(this.options.animatedResizing) {
				
				if(this.timerMoveOnResize) {
					clearTimeout(this.timerMoveOnResize);
					this.timerMoveOnResize = null;
				}
				
				this.timerMoveOnResize = setTimeout(function() {
					self.move(self.options.index);
				}, 300);
				
			} else {
				
				self.move(self.options.index, false, false);
			}
		},
		
		getSlidesCount: function() {
			return _.filter(this.slides, function(slide) { 
				return slide.$el.is('.disabled');
			}).length; 
		},
		
		initControls: function(e) {

			if(e.toIndex + 1 >= this.getSlidesCount()) {
				this.nextBtn.hide();
			} else {
				this.nextBtn.show();
			}

			if(e.toIndex - 1 < this.getSlidesCount()) {
				this.prevBtn.hide();
			} else {
				this.prevBtn.show();
			}			
		},
		
		onSlideClick: function(e) {
		
			var slideNode = $(e.currentTarget);

			var isFocused = slideNode
				.hasClass(this.options.onFocusCssClass);
		
			if(!isFocused) {
				this.toSlide(slideNode);
			}
		},

		toSlide: function(slideNode) {

			var index = this.$el
				.find(this.options.slidesSelector)
				.index(slideNode);
			
			if(index + 1 <= this.slides.length && index >= 0)
				this.move(this.options.index = index);		
		},
		
		prev: function(e) {
			if(e)
				e.preventDefault();
			
			if(this.options.index - 1 >= 0)
				this.move(this.options.index - 1);			
		},
		
		next: function(e) {
			if(e)
				e.preventDefault();

			if(this.options.index + 1 < this.slides.length)
				this.move(this.options.index + 1);
		},
			
		move: function(index, dontMove, animation) {
		
			var self = this;
			
			var transitionAnimation = 
				animation === false? 'none': this.options.transitionAnimation;
			
			if(this.$el.hasClass(this.options.onMovingCssClass))
				return false;
			
			var slide = this.slides[index];

			if(slide) {
				
				if(slide.$el.is('.disabled')) {
					return this.move(index + 1, true);
				}
				
				this.$el.addClass(this.options.onMovingCssClass);
				
				var changeTo = dontMove 
					? this.$el.width() / 2 - (this.slides[0].getOuterWidth() / 2 + this.slides[0].getPosition().left)
					: this.$el.width() / 2 - (slide.getOuterWidth() / 2 + slide.getPosition().left);

				var min = 0;
				var max = this.$el.width() - this.slider.width();
				var point = Math.max(Math.min(min, changeTo),  max > 0? 0: max);
			
				var activeSlide = this.findActiveSlide();
					
				this.trigger('moving', {
					point: point,
					from: activeSlide,
					to: slide,
					toIndex: index
				});
				
				var complete = function() {
					
					self.options.index = index;
					self.$el.removeClass(self.options.onMovingCssClass);
					self.setFocus(slide);	
					self.trigger('moved', {
						from: activeSlide,
						to: slide
					});					
				};
				
				require(['lenta/animations/' + transitionAnimation], function(Animation) {
					
					(new Animation({
						lenta: self,
						point: point
					})).animate().then(complete);					
				});
			}
		},
				
		getSliderPosition: function() {
			return parseInt(this.slider.css('left'));	
		},

		findActiveSlide: function() {
			
			var self = this;

			return _.find(this.slides, function(slide) {
				return slide.$el.hasClass(self.options.onFocusCssClass);
			});
		},

		activateAllSlides: function() {

			this.$el
				.find(this.options.slidesSelector)
				.addClass(this.options.onFocusCssClass);
		},

		deactivateAllSlides: function() {
			
			this.$el
				.find(this.options.slidesSelector)
				.removeClass(this.options.onFocusCssClass);
		
		},
		
		setFocus: function(slide) {
			
			this.deactivateAllSlides();

			slide.$el.addClass(this.options.onFocusCssClass);
		},
		
		calculateSize: function() {
			
			if(_.isFunction(this.options.calculateSize)) {
				return this.options.calculateSize.apply(this);
			}				
			
			var size = null;
			
			if(this.options.aspectRatio) {
				
				var parent = this.$el.parent();
				
				var rate = Math.min(parent.width() / this.$el.width(), parent.height() /  this.$el.height());
				
				var height = this.$el.height() * rate;
				
				if(height > this.options.height)
					height = this.options.height;
				
				size = {
					width: height * this.options.aspectRatio,
					height: height
				};
			}

			return size;
		},
		
		resizeSlides: function() {
			
			var self = this;
			
			var width = 0;
			
			_.invoke(this.slides, function() {
				
				this
					.resize(self.$el.height(), self.$el.width());
								
				width += this.getOuterWidth();
			});
			
			return width;
		},
		
		resize: function() {
						
			var size = this.calculateSize();
			
			if(size) {
				
				this.$el
					.width(size.width)
					.height(size.height);
			}
			
			var width = this.resizeSlides();
						
			this.slider.width(width);
			
			this.align();
			
			this.trigger('resized');

			return this;
		},
		
		align: function() {
			
			if(this.options.align == 'center') {
				
				var left = this.$el.parent().width() / 2 - this.$el.width() / 2;
			
				this.$el.css('left', left);
				
			} else if(this.options.align == 'right') {
				
				var left = this.$el.parent().width() - this.$el.width();
				
				this.$el.css('left', left);				
			}
			
			if(this.options.verticalAlign == 'center') {
				
				var top = this.$el.parent().height() / 2 - this.$el.height() / 2;
				
				this.$el.css('top', top);
				
			} else if(this.options.verticalAlign == 'bottom') {
				
				var top = this.$el.parent().height() - this.$el.height();
				
				this.$el.css('top', top);				
			}
		},
		
		render: function() {
						
			this.trigger('render:before');
			
			this.$el.css({
				'position': 'relative',
				'max-height': this.options.height
			});
			
			_.invoke(this.slides, 'render');
						
			this.resize().move(this.options.index || 0);
			
			this.trigger('render:after');
			
			this.$el.removeClass('loading');

			return this;
		}
	});
	
	_.extend(Lenta.prototype, DataOptionsMixin);

	return Lenta;
});
