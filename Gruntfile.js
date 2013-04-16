module.exports = function(grunt) {

  grunt.initConfig({

	  	clean: ['dist'],
				
		requirejs: {
			
			build: {
			
				options: {
					
					paths: {
						'backbone': '../vendor/backbone-min',
						'underscore': '../vendor/underscore-min',
						'jquery': '../vendor/jquery-1.9.0.min',
						'jqueryui': '../vendor/jquery-ui-1.10.1.draggable',
						'mousewheel': '../vendor/jquery.mousewheel'		
					},
					
					baseUrl: 'src',
			    	
			    	name: 'lenta',
			    	
			    	out: 'dist/lenta.js',
			    	
			    	exclude: ['backbone', 'underscore', 'jquery', 'jqueryui', 'mousewheel']
				}
		
			},
			
			'build-cycled': {
				
				options: {
					
					paths: {
						'backbone': '../vendor/backbone-min',
						'underscore': '../vendor/underscore-min',
						'jquery': '../vendor/jquery-1.9.0.min',
						'jqueryui': '../vendor/jquery-ui-1.10.1.draggable',
						'mousewheel': '../vendor/jquery.mousewheel'		
					},
					
					baseUrl: 'src',
			    	
			    	name: 'cycled-lenta',
			    	
			    	out: 'dist/cycled-lenta.js',
			    
			    	exclude: ['backbone', 'underscore', 'jquery', 'jqueryui', 'mousewheel']
				}
		
			}
			
		}
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('default', ['clean', 'requirejs:build', 'requirejs:build-cycled']);
};
