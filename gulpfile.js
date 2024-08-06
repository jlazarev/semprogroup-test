import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import {deleteAsync} from 'del';
import imagemin from 'gulp-imagemin';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import stylelint from 'gulp-stylelint-esm';
import htmlmin from 'gulp-htmlmin';
import fileinclude from 'gulp-file-include';
import webpackStream from 'webpack-stream';
import webpacConfig from './webpack.config.js';
import webp from 'gulp-webp';

const sass = gulpSass(dartSass);

const sourceDir = 'src',
  devDir = 'public',
  buildDir = 'build',
  path = {
    build: {
      pages: `${buildDir}/`,
      styles: `${buildDir}/assets/css/`,
      fonts: `${buildDir}/assets/fonts/`,
      img: `${buildDir}/assets/img/`,
      imgWebp: `${buildDir}/assets/img/content/**/*.{png,jpg}`,
      imgWebpOutput: `${buildDir}/assets/img/content/`,
      sprite: `${buildDir}/assets/img/sprite/`,
      scripts: `${buildDir}/assets/js/`,
      copy: `${buildDir}/`,
    },
    dev: {
      pages: `${devDir}/`,
      styles: `${devDir}/assets/css/`,
      fonts: `${devDir}/assets/fonts/`,
      img: `${devDir}/assets/img/`,
      imgWebp: `${devDir}/assets/img/content/**/*.{png,jpg}`,
      imgWebpOutput: `${devDir}/assets/img/content/`,
      scripts: `${devDir}/assets/js/`,
      sprite: `${devDir}/assets/img/sprite/`,
      copy: `${devDir}/`,
    },
    src: {
      pages: `${sourceDir}/html/*.html`,
      fonts: `${sourceDir}/assets/fonts/**/*.*`,
      styles: `${sourceDir}/assets/scss/style.scss`,
      stylesLint: `${sourceDir}/assets/scss/**/*.scss`,
      stylesFolder: `${sourceDir}/assets/scss/`,
      img: `${sourceDir}/assets/img/**/*.*`,
      sprite: `${sourceDir}/assets/img/sprite/**/*.svg`,
      scripts: `${sourceDir}/assets/js/*.js`,
      copy: [`${sourceDir}/assets/fonts/*`, `${sourceDir}/assets/favicon/*.ico`, `${sourceDir}/*.{xml,json}`],
    },
    watch: {
      pages: `${sourceDir}/**/*.html`,
      fonts: `${sourceDir}/assets/fonts/**/*.*`,
      styles: `${sourceDir}/assets/scss/**/*.scss`,
      img: `${sourceDir}/assets/img/**/*.*`,
      sprite: `${sourceDir}/assets/img/sprite/**/*.svg`,
      scripts: `${sourceDir}/assets/js/**/*.js`,
    },
    clean: {
      dev: `${devDir}/`,
      build: `${buildDir}/`,
    },
  };

const sprite = parameters => {
  const outputDir = parameters.outputDir || path.dev.sprite;

  return gulp.src(path.src.sprite)
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite_auto.svg'))
      .pipe(gulp.dest(outputDir));
};
/*
 * Функции вызова обработчика спрайта
 * */
const spriteToDev = () => {
  return sprite({
    outputDir: path.dev.sprite,
  });
};
const spriteToBuild = () => {
  return sprite({
    outputDir: path.build.sprite,
  });
};
/*
 * Конец
 * */

const html = parameters => {
  const outputDir = parameters.outputDir || path.dev.pages;
  const statusMinify = !!(parameters.mode === 'build' || parameters.minify);
  const pathForInclud = parameters.mode === 'build' ? 'build' : 'public';

  return gulp
    .src(path.src.pages)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@root',
      context: { // глобальные переменные для include
        path: pathForInclud
      }
    }))
    .pipe(
      gulpIf(
        statusMinify,
        htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          sortAttributes: true,
          sortClassName: true,
          minifyJS: true,
          minifyCSS: true,
          ignoreCustomFragments: [ /\s<br/gi ],
        })
      )
    )
    .pipe(gulp.dest(outputDir)); // Помещение HTML-файлов в build
};
/*
 * Функции вызова обработчика HTML
 * */
const htmlToDev = () => {
  return html({
    mode: 'dev',
    outputDir: path.dev.pages,
  });
};
const htmlToBuild = () => {
  return html({
    mode: 'build',
    outputDir: path.build.pages,
  });
};
/*
 * Конец
 * */

const styles = parameters => {
  const outputDir = parameters.outputDir || path.dev.styles;
  const statusSourceMap = !!(parameters.mode === 'dev' || parameters.sourceMap);
  const statusServerReload = !!(parameters.mode === 'dev' || parameters.serverReload);

  const plugins = [autoprefixer(), cssnano()];

  return gulp
    .src(path.src.styles)
    .pipe(plumber()) // Отслеживаение ошибок
    .pipe(gulpIf(statusSourceMap, sourcemaps.init())) // Инициализация sourcemap
    .pipe(sass().on('error', sass.logError)) // Компиляция SCSS в CSS
    .pipe(postcss(plugins)) // Добавление вендорных префиксов и минификация CSS
    .pipe(
      rename({
        // Добавление префикса "min" к минимизированным CSS-файлам
        suffix: '.min',
      })
    )
    .pipe(gulpIf(statusSourceMap, sourcemaps.write())) // Запись sourcemap
    .pipe(gulp.dest(outputDir)) // Помещение CSS-файлов в build
    .pipe(gulpIf(statusServerReload, browserSync.stream())); // Обновление страницы без перезагрузки
};
/*
 * Функции вызова обработчика стилей
 * */
const stylesToDev = () => {
  return styles({
    mode: 'dev',
    outputDir: path.dev.styles,
  });
};
const stylesToBuild = () => {
  return styles({
    mode: 'build',
    outputDir: path.build.styles,
  });
};
/*
 * Конец
 * */

export const styleLint = () => {
  return gulp.src(path.src.stylesLint).pipe(
    stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    })
  );
};

export const styleLintFix = () => {
  return gulp
    .src(path.src.stylesLint)
    .pipe(
      stylelint({
        reporters: [
          {
            formatter: 'string',
            console: true,
          },
        ],
        fix: true,
      })
    )
    .pipe(gulp.dest(path.src.stylesFolder));
};

const scripts = parameters => {
  const outputDir = parameters.outputDir || path.dev.scripts;
  const statusSourceMap = !!(parameters.mode === 'dev' || parameters.sourceMap);
  const statusServerReload = !!(parameters.mode === 'dev' || parameters.serverReload);

  return gulp
    .src(path.src.scripts)
    .pipe(plumber()) // Отслеживание ошибок
    .pipe(gulpIf(statusSourceMap, sourcemaps.init())) // Инициализация sourcemap
    .pipe(webpackStream(webpacConfig))
    .pipe(gulpIf(statusSourceMap, sourcemaps.write())) // Запись sourcemap
    .pipe(gulp.dest(outputDir)) // Помещение JS-файлов в build
    .pipe(gulpIf(statusServerReload, browserSync.stream()));
};
/*
 * Функции вызова обработчика скриптов
 * */
const scriptsToDev = () => {
  return scripts({
    mode: 'dev',
    outputDir: path.dev.scripts,
  });
};
const scriptsToBuild = () => {
  return scripts({
    mode: 'build',
    outputDir: path.build.scripts,
  });
};
/*
 * Конец
 * */

const images = parameters => {
  const outputDir = parameters.outputDir || path.dev.img;
  const statusMinify = !!(parameters.mode !== 'dev' || parameters.minify);

  return gulp
    .src(path.src.img)
    .pipe(
      gulpIf(
        statusMinify,
        imagemin([
          // Минификация изображений, если сборка запущена с параметром "images"
          imagemin.gifsicle({
            interlaced: true,
          }),
          imagemin.mozjpeg({
            quality: 75,
            progressive: true,
          }),
          imagemin.optipng({
            optimizationLevel: 5,
          }),
          imagemin.svgo({
            plugins: [
              {
                removeViewBox: false,
              },
              {
                cleanupIDs: false,
              },
            ],
          }),
        ])
      )
    )
    .pipe(gulp.dest(outputDir)); // Помещение изображений в build;
};

/*
 * Функции вызова переноса/оптимизации изображений
 * */
const imagesToDev = () => {
  return images({
    mode: 'dev',
    outputDir: path.dev.img,
  });
};
const imagesToBuild = () => {
  return images({
    mode: 'build',
    outputDir: path.build.img,
  });
};
/*
 * Конец
 * */

const webpmin = parameters => {
  const inputDir = parameters.inputDir || path.dev.imgWebp;
  const outputDir = parameters.outputDir || path.dev.imgWebp;

  return gulp
    .src(inputDir)
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(outputDir))
}

/*
 * Функции вызова конвертации изображений в webp
 * */
const webpminToDev = () => {
  return webpmin({
    mode: 'dev',
    inputDir: path.dev.imgWebp,
    outputDir: path.dev.imgWebpOutput,
  });
};
const webpminToBuild = () => {
  return webpmin({
    mode: 'build',
    inputDir: path.build.imgWebp,
    outputDir: path.build.imgWebpOutput,
  });
};
/*
 * Конец
 * */

const copy = (outputDir = path.dev.copy) => {
  // Копирование файлов из src без дополнительных преобразований
  return gulp.src(path.src.copy, {base: 'src/'}).pipe(gulp.dest(outputDir)); // Помещение файлов в build
};

/*
 * Функции вызова переноса/оптимизации изображений
 * */
const copyToDev = () => {
  return copy(path.dev.copy);
};
const copyToBuild = () => {
  return copy(path.build.copy);
};
/*
 * Конец
 * */
export const cleanPublic = () => {
  // Полное удаление директории сборки - public
  return deleteAsync(path.clean.dev);
};

export const cleanBuild = () => {
  // Полное удаление директории сборки - build
  return deleteAsync(path.clean.build);
};

const localServer = (from = path.dev.pages) => {
  // Инициализация локального сервера
  browserSync.init({
    server: from,
    port: 8080,
    notify: false,
    open: true,
    cors: true,
    ui: false,
    online: true,
  });
};

const startDevServer = () => {
  return localServer(path.dev.pages);
};
startDevServer.displayName = 'Локальный сервер';

const reloadServer = done => {
  // Перезагрузка сервера
  browserSync.reload();
  done(); // Вызов callback для корректного завершения перезагрузки
};

const watch = () => {
  // Слежение за изменениями
  gulp.watch(path.watch.pages, gulp.series(htmlToDev, reloadServer));
  gulp.watch(path.watch.fonts, gulp.series(copyToDev, reloadServer));
  gulp.watch(path.watch.img, gulp.series(imagesToDev, reloadServer));
  gulp.watch(path.watch.sprite, gulp.series(spriteToDev, reloadServer));
  gulp.watch(path.watch.styles, gulp.series(stylesToDev));
  gulp.watch(path.watch.scripts, gulp.series(scriptsToDev, reloadServer));
};

export const serve = cb => {
  if (process.argv[3] === '--dev') return startDevServer();

  if (process.argv[3] === '--build') return localServer(path.build.pages);

  console.log(
    `\n\tУкажите флаг:\n\t--dev\tДля запуска локального сервера из ${path.dev.pages}\n\t--build\tДля запуска локального сервера из ${path.build.pages}\n`
  );

  cb();
};
serve.description = 'Запуск локального сервера';
serve.flags = {
  '--dev': `из ${path.dev.pages}`,
  '--build': `из ${path.build.pages}`,
};

export const build = gulp.series(
  // Функция сборки build-версии - npm run build
  cleanBuild,
  spriteToBuild,
  htmlToBuild,
  imagesToBuild,
  webpminToBuild,
  styleLint,
  stylesToBuild,
  scriptsToBuild,
  copyToBuild
);

export default gulp.series(
  // Дефолтная функция запуска разработки - npm start
  cleanPublic,
  spriteToDev,
  htmlToDev,
  imagesToDev,
  webpminToDev,
  stylesToDev,
  scriptsToDev,
  copyToDev,
  gulp.parallel(watch, startDevServer)
);
