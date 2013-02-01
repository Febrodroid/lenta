module.exports = function(grunt) {

  grunt.initConfig({

  
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-rigger');
  
  
  grunt.registerTask('default', ['requirejs', 'uglify']);
};