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
						'draggable': '../vendor/jquery-ui-1.10.1.draggable',
						'mousewheel': '../vendor/jquery.mousewheel'		
					},
					
					baseUrl: 'src',
			    	
			    	name: 'lenta',
			    	
			    	out: 'dist/lenta.js',
			    	
			    	exclude: ['backbone', 'underscore', 'jquery', 'draggable', 'mousewheel']
				}
		
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('default', ['clean', 'requirejs']);
};