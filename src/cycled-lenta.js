define([
	
    'lenta'

], function(Lenta) {
	
	return Lenta.extend({
		
		initialize: function(options){
			
			this.constructor.__super__.initialize.apply(this, [options])
			
			this
				.on('moved', function(e) {
					
					if(this.getFakeSlides().length) {
						
						if(e.to.$el.index() < this.slides.length / 3 || e.to.$el.index() > this.slides.length / 3 * 2) {
						
							this.move(this.slides.length / 3 + this.getCurrentSlideIndex(), false, false);
						}						
					}
				})
				.on('render:before', function() {
					
					if(this.getFakeSlides().length) {
						
						this.options.index = this.slides.length / 3 + this.getCurrentSlideIndex();	
					}
				});			
		},
		
		getFakeSlides: function() {
			
			return _.filter(this.slides, function(slide) { 
				return slide.$el.data('fake');
			});
		},
		
		getOriginSlides: function() {
			
			return _.filter(this.slides, function(slide) { 
				return !slide.$el.data('fake') && !slide.$el.is('.disabled');
			});
		},
		
		getSlidesCount: function() {
			
			return this.getOriginSlides().length; 
		},
		
		initControls: function(e) {

			if(this.getSlidesCount() <= 1) {
				this.prevBtn.hide();
				this.nextBtn.hide();
			} else {
				this.nextBtn.show();
				this.prevBtn.show();
			}
		},
		
		getOriginSliderWidth: function() {
			
			var width = 0;
			
			_.invoke(this.getOriginSlides(), function() {
				width += this.getOuterWidth();
			});
			
			return width;
		},
		
		getCurrentSlideIndex: function() {
			return this.options.index % this.getSlidesCount();
		},
		
		createSlides: function() {

			var self = this;
			
			var slides = this.$(this.options.slidesSelector);
			
			slides.each(this.addSlide);
			
			var viewportSize = this.calculateSize();
			
			viewportWidth = 
				viewportSize? viewportSize.width: this.viewport.width();

			var width = this.resizeSlides();			
							
			if(width > viewportWidth || this.options.forcedCycling) {
				
				var fakeSlides = new Array();
				
				slides.each(function(i, element) {
					
					var appendClone = $(element)
						.clone(true).data('fake', true);
					
					self.slider.append(appendClone);
					
					fakeSlides.push(appendClone);
					
				});
				
				slides.each(function(i, element) {
					
					var appendClone = $(element)
						.clone(true).data('fake', true);
					
					self.slider.append(appendClone);
					
					fakeSlides.push(appendClone);
					
				});
				
				$(fakeSlides).each(self.addSlide);			
			}
			
		}
	});
	
});
