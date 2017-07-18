/**
 * Created by valentinamelanina on 18.07.17.
 */
/**
 * Created by valentinamelanina on 22.03.17.
 */

var gulp       = require('gulp'), // Подключаем Gulp
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов


/* ------------------------
 Собираем в app
 ------------------------ */

// Создаем таск autoprefixer
gulp.task('autoprefixer', function(){
    return gulp.src('app/css/styles.css') // Берем источник
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')); // Выгружаем результата в папку app/css
});

// Создаем таск JS
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/js/vendors_js/*.js', // Берем js из vendors_js
        'app/js/_variables.js', // Берем все переменные
        'app/js/_layout.js', // Берем дополнительные скрипты шаблона
        'app/components/**/*.js' // Берем js из компонентов
    ])
        .pipe(concat('scripts.js')) // Конкатенируем файлы в один app/js/scripts.js
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});



/* ------------------------
 Переносим в dist
 ------------------------ */

// Очищаем папку dist перед сборкой
gulp.task('clean', function() {
    return del.sync('dist');
});

// Оптимизируем изображения
gulp.task('img', function() {
    return gulp.src('app/images/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images')); // Выгружаем в продакшен
});

// Переносим библиотеки
gulp.task('build', ['clean', 'img', 'scripts'], function() {

    // Переносим стили
    var buildCss = gulp.src('app/css/styles.min.css')
        .pipe(gulp.dest('dist/css'));

    // Переносим шрифты
    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    // Переносим скрипты
    var buildJs = gulp.src('app/js/scripts.min.js')
        .pipe(gulp.dest('dist/js'));

    // Переносим HTML
    var buildHtml = gulp.src('app/html/*.html')
        .pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
    return cache.clearAll();
});

gulp.task('default', ['build']);