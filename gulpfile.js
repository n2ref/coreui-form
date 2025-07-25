const gulp             = require('gulp');
const concat           = require('gulp-concat');
const sourcemaps       = require('gulp-sourcemaps');
const uglify           = require('gulp-uglify');
const htmlToJs         = require('gulp-html-to-js');
const wrapFile         = require('gulp-wrap-file');
const sass             = require('gulp-sass')(require('sass'));
const rollup           = require('@rollup/stream');
const rollupSourcemaps = require('rollup-plugin-sourcemaps');
const rollupBabel      = require('@rollup/plugin-babel');
const nodeResolve      = require('@rollup/plugin-node-resolve');
const source           = require('vinyl-source-stream');
const buffer           = require("vinyl-buffer");


var conf = {
    dist: "./dist",
    js: {
        fileMin: 'coreui-form.min.js',
        main: 'src/main.js',
        reservedNames: ['FormInstance'],
        src: 'src/js/**/*.js'
    },
    css: {
        fileMin: 'coreui.form.min.css',
        main: 'src/main.scss',
        src: [
            'src/css/**/*.scss',
        ]
    },
    tpl: {
        file: 'tpl.js',
        dist: './src/js',
        src: [
            'src/html/**/*.html',
        ]
    }
};



gulp.task('build_css', function(){
    return gulp.src(conf.css.main)
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: ['node_modules'], outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat(conf.css.fileMin))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_css_fast', function(){
    return gulp.src(conf.css.main)
        .pipe(sass({includePaths: ['node_modules']}).on('error', sass.logError))
        .pipe(concat(conf.css.fileMin))
        .pipe(gulp.dest(conf.dist));
});


gulp.task('build_js_fast', function() {
    return rollup({
        input: conf.js.main,
        output: {
            sourcemap: true,
            format: 'umd',
            name: "CoreUI.form"
        },
        onwarn: function (log, handler) {
            if (log.code === 'CIRCULAR_DEPENDENCY') {
                return; // Ignore circular dependency warnings
            }
            handler(log.message);
        },
        context: "window",
        plugins: [
            nodeResolve(),
            rollupSourcemaps(),
            rollupBabel({babelHelpers: 'bundled'}),
        ]
    })
        .pipe(source(conf.js.fileMin))
        .pipe(buffer())
        .pipe(gulp.dest(conf.dist));
});


gulp.task('build_js', function() {
    return rollup({
        input: conf.js.main,
        output: {
            sourcemap: true,
            format: 'umd',
            name: "CoreUI.form"
        },
        onwarn: function (log, handler) {
            if (log.code === 'CIRCULAR_DEPENDENCY') {
                return; // Ignore circular dependency warnings
            }
            handler(log.message);
        },
        context: "window",
        plugins: [
            nodeResolve(),
            rollupSourcemaps(),
            rollupBabel({babelHelpers: 'bundled'}),
        ]
    })
        .pipe(source(conf.js.fileMin))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify({
            mangle: {
                reserved: conf.js.reservedNames
            }
        }))
        .pipe(sourcemaps.write('.'))
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
    gulp.watch(conf.tpl.src, gulp.series(['build_tpl', 'build_js_fast']));
    gulp.watch(conf.js.src, gulp.parallel(['build_js_fast']));
    gulp.watch(conf.css.src, gulp.parallel(['build_css_fast']));
});

gulp.task("default", gulp.series([ 'build_tpl', 'build_js', 'build_css']));