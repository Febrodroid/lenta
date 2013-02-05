define([
	
    'backbone',
    'slide',
	'mixins/data-options'
	
], function(Backbone, Slide, DataOptionsMixin) {
	
	var Lenta = Backbone.View.extend({
		
		options: {
			height: 0,
			sliderSelector: '> ul',
			slidesSelector: '> ul > li',
			prevBtnSelector: '.prev-btn',
			nextBtnSelector: '.next-btn',
			transitionSpeed: 'fast',
			index: 0,
			onMovingCssClass: 'moving',
			onFocusCssClass: 'focus'
		},
		
		initialize: function() {
			
			_.bindAll(this);
			
			this.parseOptions();
			
			this.slider = this.$(this.options.sliderSelector);
			this.prevBtn = this.$(this.options.prevBtnSelector);
			this.nextBtn = this.$(this.options.nextBtnSelector);
			
			this.nextBtn
				.on('click', this.next);
		
			this.prevBtn
				.on('click', this.prev);
			
			this.$(this.options.slidesSelector)
				.on('click', this.toSlide);
			
			this.on('moved', this.initControls);
		},
		
		initControls: function() {

			if(this.options.index + 1 >= this.slides.length) {
				this.nextBtn.hide();
			} else {
				this.nextBtn.show();
			}
			
			if(this.options.index - 1 < 0) {
				this.prevBtn.hide();
			} else {
				this.prevBtn.show();
			}			
		},
		
		toSlide: function(e) {
			e.preventDefault();
	
			var index = this.$el
				.find(this.options.slidesSelector)
				.index(e.currentTarget);
			
			if(index + 1 <= this.slides.length && index >= 0)
				this.move(this.options.index = index);				
		},
		
		prev: function(e) {
			e.preventDefault();
			
			if(this.options.index - 1 >= 0)
				this.move(--this.options.index);			
		},
		
		next: function(e) {

			e.preventDefault();
			
			if(this.options.index + 1 < this.slides.length)
				this.move(++this.options.index);
		},
			
		move: function(index) {
		
			var self = this;
			
			if(this.$el.hasClass(this.options.onMovingCssClass))
				return false;
			
			this.trigger('moving');
			
			var slide = this.slides[index];

			if(slide) {
				
				var changeTo = this.$el.width() / 2 - (slide.getOuterWidth() / 2 + slide.getPosition().left);
				
				var min = 0;
				var max = this.$el.width() - this.slider.width();
				
				this.$el.addClass(this.options.onMovingCssClass);
				
				this.slider.animate({
					'left':  Math.max(Math.min(min, changeTo),  max)
				}, this.options.transitionSpeed, function() {
					
					self.$el.removeClass(self.options.onMovingCssClass);
					self.setFocus(slide);	
					self.trigger('moved');
				});
			}
		},
		
		setFocus: function(slide) {
			
			this.$el
				.find(this.options.slidesSelector)
				.removeClass(this.options.onFocusCssClass);
		
			slide.$el.addClass(this.options.onFocusCssClass);
		},
		
		render: function() {
			
			var self = this;
			
			this.$el.css('position', 'relative');
			
			this.$el.height(this.options.height);
			
			var offset = 0;
			
			this.slides = this.$(this.options.slidesSelector)
				.map(function(i, element) {
					
					var slide = (new Slide({
						el: $(element)
					}))
					.render()
					.resize(self.options.height)
					.position(offset);
					
					offset += slide.$el.width() + slide.getOffset().x;
					
					return slide;
				});
			
			this.slider
				.width(offset)
				.height(this.options.height);
			
			this.move(this.options.index);
			
			return this;
		}
	});
	
	_.extend(Lenta.prototype, DataOptionsMixin);

	return Lenta;
});