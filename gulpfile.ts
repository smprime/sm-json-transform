import test from 'ava';
import * as gulp from 'gulp'
import * as clean from 'gulp-clean'
import * as conflict from 'gulp-conflict'
import * as rename from 'gulp-rename'
import { gulpAutoSchema } from './gulpclass'

const paths = {
    files: ['src/schemas/*.js*'],
    dest: ['dist/'],
    modsrc: ['src/models'],
    mysqlsrc: ['src/mysql'],
    jsonsrc: ['src/jsonSchema'],
    tssrc: ['src/interfaces'],
    iosrc: ['src/types'],
    testsrc: ['dist/test'],
    src: ['src/']
};

gulp.task('clean', () => gulp.src(paths.dest, {allowEmpty: true})
    .pipe(clean())
);

gulp.task('post-clean', () => gulp.src(['./src/interfaces', './src/types', './src/jsonSchema', './src/models', './src/mysql'], {allowEmpty: true})
    .pipe(clean())
);

gulp.task('copy', () =>
    gulp.src('./src/**/*')
        .pipe(gulp.dest(paths.dest))
);

gulp.task('json2ts', () =>
    gulp.src(paths.files)
        .pipe(gulpAutoSchema('JsonTs'))
        .pipe(rename(paths => paths.extname = '.ts'))
        .pipe(gulp.dest(paths.tssrc))
);

gulp.task('json2iots', () =>
    gulp.src(paths.files)
        .pipe(gulpAutoSchema('JsonIoTs'))
        .pipe(rename(paths => paths.extname = '.ts'))
        .pipe(gulp.dest(paths.iosrc))
);
gulp.task('JsonSchema', () =>
    gulp.src(paths.files)
        .pipe(gulpAutoSchema('JsonSchema'))
        .pipe(rename(paths => paths.extname = '.js'))
        .pipe(gulp.dest(paths.jsonsrc))
);
gulp.task('json2Mysql', () =>
    gulp.src(paths.files)
        .pipe(gulpAutoSchema('JsonMysql'))
        .pipe(rename(paths => paths.extname = '.mysql'))
        .pipe(gulp.dest(paths.mysqlsrc))
);
gulp.task('json2Models', () =>
    gulp.src(paths.files)
        .pipe(gulpAutoSchema('JsonModels'))
        .pipe(rename(paths => paths.extname = '.js'))
        .pipe(gulp.dest(paths.modsrc))
);

gulp.task('generate-indices', () =>
    gulp.src('./src/**/', {base: './src'})
        .pipe(gulpAutoSchema('Indices'))
        .pipe(conflict('./dist/**/*'))
        .pipe(gulp.dest(paths.dest))
);
gulp.task('generate-Operations', () =>
    gulp.src('./src/models/', { base: './src' })
        .pipe(gulpAutoSchema('Operations'))
        .pipe(conflict('./dist/**/*'))
        .pipe(gulp.dest(paths.dest))
);
gulp.task('generate-Tests', () =>
    gulp.src(paths.files)
        .pipe(gulpAutoSchema('Tests'))
        .pipe(rename(paths => {
            paths.basename = 'test.'  + paths.basename;
            paths.extname = '.js'
        }))
        .pipe(conflict('./dist/**/*'))
        .pipe(gulp.dest(paths.testsrc))
);

gulp.task('default', gulp.series(
    'clean', 'json2ts', 'json2iots',
    'JsonSchema', 'json2Mysql', 'json2Models',
    'copy',  'generate-indices', 'generate-Operations', 'generate-Tests', 'post-clean')
    );
