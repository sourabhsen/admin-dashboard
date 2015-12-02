'use strict';

var config      = require('../config');
var gulp        = require('gulp');
var svgSprite   = require('gulp-svg-sprite');

var srcConfig = {
       'mode'           : {
        'css'             : {
           'prefix'           : '.icon-%s',
            'sprite'          : '../images/sprite.svg',
            'bust'            : false,
            'dimensions'      : true,
            'render'          : {
                'scss'         : {
                  'dest'        : '../styles/_sprite.scss'
                }
            }
        }
    }
  };

  var distConfig = {
        'mode'            : {
          'css'             : {
            'prefix'         : '.icon-%s',
            'bust'            : false,
            'sprite'          : '../images/sprite.svg'
          },
          'example' : false
      }
    };

/**
 * Create svgsprite sheet with accompanying scss file
 */
gulp.task('sprite', function(){
  return gulp.src(config.sprites)
    .pipe(svgSprite(srcConfig))
      .on('error', function(error){
       console.log(error);
      })
    .pipe(gulp.dest(config.src));
});

gulp.task('sprite:dist', function(){
 return gulp.src(config.sprites)
    .pipe(svgSprite(distConfig))
      .on('error', function(error){
       console.log(error);
      })
    .pipe(gulp.dest(config.dist));
});
