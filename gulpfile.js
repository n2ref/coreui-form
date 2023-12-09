const gulp             = require('gulp');
const concat           = require('gulp-concat');
const sourcemaps       = require('gulp-sourcemaps');
const uglify           = require('gulp-uglify');
const htmlToJs         = require('gulp-html-to-js');
const sass             = require('gulp-sass')(require('sass'));
const rollup           = require('rollup-stream');
const rollupSourcemaps = require('rollup-plugin-sourcemaps');
const rollupBabel      = require('rollup-plugin-babel');
const source           = require('vinyl-source-stream');
const buffer           = require("vinyl-buffer");
const wrapFile         = require('gulp-wrap-file');



var conf = {
    dist: "./dist",
    js: {
        file: 'coreui-form.js',
        fileMin: 'coreui-form.min.js',
        main: 'src/js/main.js',
        src: 'src/js/*.js'
    },
    css: {
        file: 'coreui-form.css',
        fileMin: 'coreui-form.min.css',
        src: [
            'src/css/*.css',
            'src/css/*.scss',
        ]
    },
    tpl: {
        file: 'coreui.form.templates.js',
        dist: './src/js',
        src: [
            'src/html/**/*.html',
            'src/html/*.html'
        ]
    }
};

gulp.task('build_css', function(){
    return gulp.src(conf.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(conf.css.file))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_css_min_fast', function(){
    return gulp.src(conf.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(conf.css.fileMin))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_css_min', function(){
    return gulp.src(conf.css.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat(conf.css.fileMin))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});


gulp.task('build_js', function() {
    return rollup({
        input: conf.js.main,
        sourcemap: false,
        format: 'umd',
        name: "CoreUI.form",
        plugins: [rollupBabel()],
        context: "window"
    })
        .pipe(source(conf.js.file))
        .pipe(buffer())
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_js_min_fast', function() {
    return rollup({
        input: conf.js.main,
        sourcemap: false,
        format: 'umd',
        name: "CoreUI.form",
        context: "window"
    })
        .pipe(source(conf.js.fileMin))
        .pipe(buffer())
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_js_min', function() {
    return rollup({
        input: conf.js.main,
        sourcemap: false,
        format: 'umd',
        name: "CoreUI.form",
        context: "window",
        plugins: [
            rollupSourcemaps(),
            rollupBabel()
        ],
    })
        .pipe(source(conf.js.fileMin))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(conf.dist));
});


gulp.task('build_tpl', function() {
    return gulp.src(conf.tpl.src)
        .pipe(htmlToJs({global: 'tpl', concat: conf.tpl.file}))
        .pipe(wrapFile({
            wrapper: function(content, file) {
                content = content.replace(/\\n/g, ' ');
                content = content.replace(/[ ]{2,}/g, ' ');
                return 'let ' + content + ";\nexport default tpl;"
            }
        }))
        .pipe(gulp.dest(conf.tpl.dist));
});


gulp.task('build_watch', function() {
    gulp.watch(conf.css.src, gulp.series(['build_css_min_fast']));
    gulp.watch(conf.tpl.src, gulp.series(['build_tpl', 'build_js_min_fast']));
    gulp.watch(conf.js.src, gulp.parallel(['build_js_min_fast']));
});

gulp.task("default", gulp.series([ 'build_tpl', 'build_js_min', 'build_js', 'build_css_min', 'build_css']));