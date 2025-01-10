/// <binding ProjectOpened='default' />

'use strict';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import babel from 'gulp-babel';
import color from 'ansi-colors';
import { deleteAsync } from 'del';
import log from 'fancy-log';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import plumber from 'gulp-plumber';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';

const sass = gulpSass(dartSass);
const _browserSync = browserSync.create();
const root = 'content';
const source = {
        scssMaster: `${root}/scss/app.scss`,
        scss: [
            `${root}/scss/**/*.scss`,
            `!${root}/scss/**/*-ORIG.*`,
            `!${root}/scss/**/*-V*.*`,
        ],
        //js: [`${root}/js/**/*.*`, `!${root}/js/**/*-ORIG.*`, `!${root}/js/**/*-V*.*`],
        //order of files matters here.
        js: [
			`${root}/js/app.global.js`,
            `${root}/js/app.js`
        ],
        images: [`${root}/imgs/**/*`],
        favicons: [`${root}/favicons/**/*`],
        libraries: {
            js: [
                
                'node_modules/@popperjs/core/dist/umd/popper.js',
                'node_modules/bootstrap/dist/js/bootstrap.js',
				'node_modules/@googlemaps/markerclusterer/dist/index.dev.js',
                'node_modules/@googlemaps/markerwithlabel/dist/index.dev.js'
            ],

            css: [
                'node_modules/bootstrap/dist/css/bootstrap.css',
                'node_modules/bootstrap/dist/css/bootstrap.css.map',
            ],
        },
    },
    destination = {
        dist: `${root}/build`,
        js: `${root}/build/js`,
        css: `${root}/build/css`,
        images: `${root}/build/imgs`,
        favicons: `${root}/build/favicons`,
        libraries: `${root}/build/lib`,
    };


gulp.task('clean', async () => {
    log(color.yellow('Deleted build files and folders.'));
    return deleteAsync([destination.dist]);
});


gulp.task('favicons', () => {
    return gulp
        .src(source.favicons)
        .pipe(imagemin())
        .pipe(gulp.dest(destination.favicons));
});


gulp.task('imgs:app', () => {
    return gulp
        .src(source.images)
        .pipe(imagemin())       
        .pipe(gulp.dest(destination.images));
});


gulp.task('js:app', () => {
    return gulp
        .src(source.js)
        .pipe(
            plumber({
                errorHandler: function (err) {
                    log(color.red('[Error: JavaScript Source]'));
                    log(color.red(err.toString()));
                    this.emit('end');
                },
            })
        )
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destination.js))
        .pipe(rename('app.min.js'))
        .pipe(
            terser().on('error', function (err) {
                log(color.red('[Error: compileJS Uglify Source]'));
                log(color.red(err.toString()));
                this.emit('end');
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destination.js))
        .pipe(browserSync.stream());
});


gulp.task('js:libraries', () => {
    return gulp.src(source.libraries.js)
        .pipe(
            plumber({
                errorHandler: function (err) {
                    log(color.red('[Error: JavaScript Library Source]'));
                    log(color.red(err.toString()));
                    this.emit('end');
                },
            })
        )
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(destination.libraries))
        .pipe(rename('lib.min.js'))
        .pipe(
            terser().on('error', function (err) {
                log(color.red('[Error: compileJS Uglify Library Source]'));
                log(color.red(err.toString()));
                this.emit('end');
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(destination.libraries))
});


gulp.task('css:app', () => {
	return gulp.src(source.scssMaster)
		.pipe(plumber({
			errorHandler: (err) => {
				log(color.red('[Error: SCSS Source]'));
				log(color.red(err.toString()));
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('app.css'))
		.pipe(gulp.dest(destination.css))
		.pipe(rename('app.min.css'))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(destination.css))
        .pipe(browserSync.stream());
});


gulp.task('css:libraries', () => {
	return gulp.src(source.libraries.css)
		.pipe(plumber({
			errorHandler: (err) => {
				log(color.red('[Error: SCSS Source]'));
				log(color.red(err.toString()));
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(concat('lib.css'))
		.pipe(gulp.dest(destination.libraries))
		.pipe(rename('lib.min.css'))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(destination.libraries));
});


gulp.task('watch', () => {
	log(color.yellow('Starting watch for js:app, css:app, and imgs:app.'));
    gulp.watch(source.scss, gulp.parallel('css:app'));
    gulp.watch(source.js, gulp.parallel('js:app'));
    gulp.watch(source.images, gulp.parallel('imgs:app'));    
});


gulp.task('serve', function() {
    _browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(source.scss, gulp.parallel('css:app')).on('change', _browserSync.reload);
    gulp.watch(source.js, gulp.parallel('js:app')).on('change', _browserSync.reload);
    gulp.watch("./*.html").on('change', _browserSync.reload);
});


gulp.task('build', gulp.parallel(
	[
        'js:app',
        'js:libraries',
        'css:app',
		'css:libraries',
        'imgs:app',
        'favicons',
        'serve',
        'watch',
    ])
);

export default gulp.series(['clean'], ['build']);
