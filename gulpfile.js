const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const pump = require('pump');
const runSequence = require('run-sequence');
const webserver = require('gulp-webserver');
const replace = require('gulp-replace');
const util = require('gulp-util');
const clean = require('gulp-clean');

const sourcesDev = require('./scripts.json');
const sources = require('./sources.json');

const PATH_DEST = './public';
const SCRIPTS = 'scripts.js';
const SCRIPTS_MIN = 'scripts.min.js';
const SCRIPTS_DEV = 'scripts-dev.min.js';
const SCRIPTS_ALL = 'scripts-all.min.js';


gulp.task('scripts', function() {
	return gulp.src(sources.jsDir)
		.pipe(concat(SCRIPTS))
		.pipe(util.env.type === 'prd' ? uglify() : util.noop())
		.pipe(util.env.type === 'prd' ? rename({suffix : '.min'}) : util.noop())
		.pipe(gulp.dest(PATH_DEST + '/js'));
});

gulp.task('scripts-dev', function() {
 	return gulp.src(sourcesDev)
        .pipe(concat(SCRIPTS_DEV))
        .pipe(gulp.dest(PATH_DEST + '/js'));
});

gulp.task('copyViews', function() {
	gulp.src(sources.templatesDir)
		.pipe(gulp.dest(PATH_DEST + '/templates'));
	
	gulp.src(['./sources/index.html'])
		.pipe(replace('<!-- scripts here -->', util.env.type === 'prd' ? sources.scriptsPrd : sources.scriptsDev))
		.pipe(gulp.dest(PATH_DEST));
});

/*gulp.task('scripts-concat', function() {
	return gulp.src(sources.concatJs)
		.pipe(concat(SCRIPTS_ALL))
		.pipe(gulp.dest(PATH_DEST + '/js'));
});*/

gulp.task('sass', function () {
	return gulp.src(sources.scssDir)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename({suffix : '.min'}))
		.pipe(gulp.dest(PATH_DEST + '/css'));
});

gulp.task('webserver', function() {
	return gulp.src('./public').pipe(webserver({
	      livereload: true,
	      //directoryListing: false,
	      open: true,
	      host: '127.0.0.1',
	      port: '8081'
    }));
});

gulp.task('watch', function() {
	return gulp.watch('./sources/**', ['build']);
});

gulp.task('clean', function() {
	return gulp.src(PATH_DEST, {read: false})
		.pipe(clean({force: true}));
});

gulp.task('build', function() {
	return runSequence('scripts', 'scripts-dev', 'copyViews', 'sass');
});

gulp.task('default', function() {
	return runSequence('build', 'watch', 'webserver');
});
