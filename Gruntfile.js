module.exports = function (grunt) {
    const sass = require('node-sass');

    require('load-grunt-tasks')(grunt);
    require('jit-grunt')(grunt);

    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig({

        //Compiles SASS into CSS
        sass: {
            options: {
                implementation: sass,
                sourceMap: false
            },
            dist: {
                files: {
                    'static/css/styles.min.css': 'static/scss/base.scss'
                }
            }
        },

        //Adds necessary prefixes and minifies CSS
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        Browserslist: ['last 2 versions']
                    }),
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'static/css/styles.min.css'
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['static/js/main.js'],
                dest: 'static/js/main.min.js',
            },
        },
        //Minify Javascript
        uglify: {
            my_target: {
                files: {
                    'static/js/main.min.js': ['static/js/main.min.js']
                }
            }
        },
        watch: {
            styles: {
                files: ['static/scss/*.scss'], // which files to watch
                tasks: ['sass', 'postcss:dist'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: ['static/js/*.js'], // which files to watch
                tasks: ['concat', 'uglify'],
                options: {
                    nospawn: true
                }
            }
        }
    });
    grunt.registerTask('default', ['sass', 'postcss:dist', 'watch']);
};
