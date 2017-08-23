const gulp = require('gulp-help')(require('gulp'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const pump = require('pump');
const runSequence = require('run-sequence');
const webserver = require('gulp-webserver');
const replace = require('gulp-html-replace');
const util = require('gulp-util');
const clean = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
const Server = require('karma').Server;

const sourcesDev = require('./scripts.json');
const sources = require('./sources.json');

const PATH_DEST = './public';
const SCRIPTS = 'scripts.js';
const SCRIPTS_MIN = 'scripts.min.js';
const SCRIPTS_DEV = 'scripts-dev.min.js';
const SCRIPTS_ALL = 'scripts-all.min.js';


gulp.task('scripts', 'Concatena todos os arquivos javascript de devenvolvimento e minifica',  function() {
	return gulp.src(sources.jsDir)
		.pipe(concat(SCRIPTS))
		.pipe(util.env.type === 'prd' ? uglify() : util.noop())
		.pipe(util.env.type === 'prd' ? rename({suffix : '.min'}) : util.noop())
		.pipe(gulp.dest(PATH_DEST + '/js'));
});

gulp.task('scripts-dev', 'Concatena todos os arquivos javascript de dependência', function() {
 	return gulp.src(sourcesDev)
        .pipe(concat(SCRIPTS_DEV))
        .pipe(gulp.dest(PATH_DEST + '/js'));
});

gulp.task('copyViews', 'Copia os arquivos *.html para a pasta de build', function() {
	var isEnvPrd = util.env.type === 'prd';
	
	gulp.src(sources.templatesDir)
		.pipe(gulp.dest(PATH_DEST + '/templates'));
	
	gulp.src(['./sources/index.html'])
		.pipe(replace({
			css: isEnvPrd ? sources.cssPrd : sources.cssDev,
			js: isEnvPrd ? sources.scriptsPrd : sources.scriptsDev
		}))
		.pipe(gulp.dest(PATH_DEST));
});

/*gulp.task('scripts-concat', function() {
	return gulp.src(sources.concatJs)
		.pipe(concat(SCRIPTS_ALL))
		.pipe(gulp.dest(PATH_DEST + '/js'));
});*/

gulp.task('sass', 'Gera o arquivo main.min.css baseado nos *.scss', function () {
	var isEnvPrd = util.env.type === 'prd';
	
	return gulp.src(sources.scssDir)
		.pipe(sass({outputStyle: isEnvPrd ? 'compressed' : 'expanded'}).on('error', sass.logError))
		.pipe(isEnvPrd ? rename({suffix : '.min'}) : util.noop())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(gulp.dest(PATH_DEST + '/css'));
});

gulp.task('webserver', 'Executa um server', function() {
	return gulp.src('./public').pipe(webserver({
	      livereload: true,
	      //directoryListing: false,
	      open: true,
	      host: '127.0.0.1',
	      port: '8081'
    }));
});

gulp.task('test', 'Executa os testes unitários', function(done) {
	new Server({
	    configFile: __dirname + '/karma.conf.js',
	    singleRun: true
	}, done).start();
});

gulp.task('watch', 'Escuta as alterações nos arquivos de desenvolvimento, e executa a build', function() {
	return gulp.watch('./sources/**', ['build']);
});

gulp.task('clean', 'Limpa a pasta de build', function() {
	return gulp.src(PATH_DEST, {read: false})
		.pipe(clean({force: true}));
});

gulp.task('build', 'Gera todos os arquivos web', function() {
	return runSequence('test', 'scripts', 'scripts-dev', 'copyViews', 'sass');
});

gulp.task('default', 'Executa as tarefas [build, watch, webserver]', function() {
	return runSequence('build', 'watch', 'webserver');
});
