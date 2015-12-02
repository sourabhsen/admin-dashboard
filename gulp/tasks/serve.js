'use strict';
var config = require('../config');
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var spa         = require('browser-sync-spa');
var runSequence = require('run-sequence');
var httpProxy   = require('http-proxy');

var proxy = httpProxy.createProxyServer({
  // TODO: add ability to use yargs for environment switching of multiple targets
  target : 'https://developer.qa.aptimus.net',
  rejectUnauthorized: false,
  secure: false
});

proxy.on('error', function(error, req, res) {
 res.writeHead(500, {
   'Content-Type': 'text/plain'
 });

 config.log('Proxy Error' + error);
});

// TODO: implement after added ability to check yargs
// if (args.verbose) {
//  proxy.on('proxyRes', function(proxyRes, req, res) {
//    config.log('Response headers ', JSON.stringify(proxyRes.headers, true, 2));
//  });
// }

// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//  var fwdHost = proxyReq.getHeader('host').replace(/:\d+$/, '');
//  proxyReq.setHeader('X-Forwarded-Host', fwdHost);
//  if (args.verbose) {
//    config.log('Request headers ', JSON.stringify(proxyReq._headers, true, 2));
//  }
// });

/*
* The proxy middleware is an Express middleware added to BrowserSync to
* handle backend request and proxy them to your backend.
*/
function proxyMiddleware(req, res, next) {
 /*
  * This test is the switch of each request to determine if the request is
  * for a static file to be handled by BrowserSync or a backend request to proxy.
  *
  */
 if (/api/.test(req.url)) {
   proxy.web(req, res);
 } else {
   next();
 }
}

browserSync.use(spa({
  selector: '[ng-app]' // Only needed for angular apps
}));

// TODO: condense callback for both env to take args for baseDir
function serveCallback() {
  browserSync.instance = browserSync.init({
      startPath: '/',
      notify  : false,
      port    : 3000,
      server: {
        baseDir    : ['build', './'],
        middleware : [proxyMiddleware]
      }
  });
}

function serveDistCallback() {
  browserSync.instance = browserSync.init({
      startPath: '/',
      notify  : false,
      port    : 3000,
      server: {
        baseDir    : ['dist'],
        middleware : [proxyMiddleware]
      }
  });
}

/**
 * Create a development build and serve files from /build
 */
gulp.task('serve', function(){
  runSequence(
    'clean',
    ['scripts', 'wiredep', 'sprite'],
    'styles',
    'html',
    'copy',
    'inject',
    'watch',
    serveCallback
  );
});
gulp.task('serve:build', function(){
  serveCallback();
});

/**
 * Create a production build and serve from /dist
 */
gulp.task('serve:dist', function(){
  runSequence(
    'clean:dist',
	['wiredep:dist','sprite:dist'],
    ['scripts:dist', 'styles:dist', 'html:dist', 'fonts:dist'],
    'copy:dist',
    'inject:dist',
    serveDistCallback
  );
});

gulp.task('serve:test', function(){
  serveDistCallback();
});
