define([
	
    'backbone',
    'lenta/slide',
    'lenta/scrollbar',
	'lenta/mixins/data-options',
	'jqueryui'

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
			index: 0,
			onMovingCssClass: 'moving',
			onFocusCssClass: 'focus',
			aspectRatio: null,
			align: 'left',
			verticalAlign: 'top'
		},
		
		initialize: function() {
			
			_.bindAll(this);
							
			this.parseOptions();
			
			this.scrollbar = null;
			this.slider = this.$(this.options.sliderSelector);
			this.prevBtn = this.$(this.options.prevBtnSelector);
			this.nextBtn = this.$(this.options.nextBtnSelector);
			this.viewport = this.$(this.options.viewportSelector);
			
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
		
		onWindowResize: function() {
			
			var self = this;
			
			this.resize();
			
			if(this.timerMoveOnResize) {
				clearTimeout(this.timerMoveOnResize);
				this.timerMoveOnResize = null;
			}
			
			this.timerMoveOnResize = setTimeout(function() {
				self.move(self.options.index);
			}, 300);
		},
		
		initControls: function(e) {

			if(e.toIndex + 1 >= this.slides.length) {
				this.nextBtn.hide();
			} else {
				this.nextBtn.show();
			}
			
			if(e.toIndex - 1 < 0) {
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
			
		move: function(index) {
		
			var self = this;
			
			if(this.$el.hasClass(this.options.onMovingCssClass))
				return false;
			
			var slide = this.slides[index];

			if(slide) {

				this.$el.addClass(this.options.onMovingCssClass);
				
				var changeTo = this.$el.width() / 2 - (slide.getOuterWidth() / 2 + slide.getPosition().left);

				var min = 0;
				var max = this.$el.width() - this.slider.width();
				var point = Math.max(Math.min(min, changeTo),  max > 0? 0: max);

				this.trigger('moving', {
					point: point,
					from: this.findActiveSlide(),
					to: slide,
					toIndex: index
				});
							
				this.slider.animate({
					'left': point
				}, this.options.transitionSpeed, function() {
					self.options.index = index;
					self.$el.removeClass(self.options.onMovingCssClass);
					self.setFocus(slide);	
					self.trigger('moved');
				});
			}
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
		
		resize: function() {
			
			var self = this;
			
			if(this.options.aspectRatio) {
				
				var parent = this.$el.parent();
				
				var rate = Math.min(parent.width() / this.$el.width(), parent.height() /  this.$el.height());
				
				var height = this.$el.height() * rate;
				
				if(height > this.options.height)
					height = this.options.height;
				
				this.$el
					.width(height * this.options.aspectRatio)
					.height(height);
			}
			
			var width = 0;
			
			_.invoke(this.slides, function() {
				
				this
					.resize(self.$el.height(), self.$el.width());
				
				width += this.getOuterWidth();
			});
			
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

			this.$el.css({
				'position': 'relative',
				'max-height': this.options.height
			});
		
			this.slides = this.$(this.options.slidesSelector)
				.map(function(i, element) {
					
					return (new Slide({
						el: $(element)
					}))
					.render();

				});
			
			this.resize().move(this.options.index);
			
			this.$el.removeClass('loading');

			return this;
		}
	});
	
	_.extend(Lenta.prototype, DataOptionsMixin);

	return Lenta;
});
