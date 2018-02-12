'use strict'



// Require all necessary plugins.
import pkg from './package.json'
import gulp from 'gulp'
import fs from 'fs'
import util from 'gulp-util'
import copy from 'gulp-copy'
import notify from 'gulp-notify'
import runSequence from 'run-sequence'
import rename from 'gulp-rename'
import phpcs from 'gulp-phpcs'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import stylelint from 'gulp-stylelint'
import babel from 'gulp-babel'
import xo from 'gulp-xo'
import uglify from 'gulp-uglify'
import imagemin from 'gulp-imagemin'
import replace from 'gulp-replace-task'
import pot from 'gulp-wp-pot'
import zip from 'gulp-zip'
import browserSync from 'browser-sync'
browserSync.create()



// Configuration.
const config = {
  build: !!util.env.build,
  src: {
    php: ['**/*.php', '!./**/autoload.php', '!vendor/**/*', '!node_modules/**/*'],
    translateableFiles: ['build/**/*.php'],
    js: ['src/js/**/*.js'],
    css: ['src/css/**/*.scss'],
    img: ['src/img/**/*']
  },
  dest: {
    assetsFolder: 'assets/',
    assets: 'assets/**/*',
    js: 'assets/js/',
    css: 'assets/css/',
    img: 'assets/img/'
  },
  build: {
    filesToCopy: ['readme.txt'],
    folder: 'build/',
    files: 'build/**/*.*'
  }
}



/**
 * START TASKS.
 */



 /**
  * BrowserSync
  */
gulp.task('browserSync', () => {
  if (!util.env.url) return

  browserSync.init({
    proxy: util.env.url,
    open: true,
    injectChanges: true
  })
})

gulp.task('reload', () => {
  browserSync.reload()
})



/**
 * Lint all PHP files using PHP CodeSniffer.
 *
 * NOTE: For this to work, PHP CS needs to be installed on the machine. For more
 * info, see here:
 * <https://github.com/squizlabs/PHP_CodeSniffer#installation>
 *
 * If PHP CS is not installed, this step will be skipped.
 */
gulp.task('lintPHP', () => {
  let filesToLint = config.src.php
  filesToLint.push('!**/index.php')

  // Ignore the index.php files in each folder
  return gulp.src(filesToLint)
    // Add plumber with custom error handler.
    .pipe(plumber({ errorHandler: notify.onError({
      title: 'PHP CodeSniffer: Processing Error',
      message: '<%= error.message %>'
    }) }))
    // Validate files using PHP CodeSniffer.
    .pipe(phpcs({
      standard: 'WordPress',
      warningSeverity: 0,
      colors: true
    }))
    // Log all problems that were found.
    .pipe(phpcs.reporter('log'))
    // Exit if building plugin
    .on('error', () => { config.build && process.exit(1) })
})



/**
 * CSS Linting
 */
gulp.task('lintCSS', () =>
  gulp.src(config.src.css)
    .pipe(plumber({ errorHandler: notify.onError({
      title: 'Sass: Linting Error',
      message: '<%= error.message %>'
    }) }))
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        { formatter: 'string', console: true }
      ],
    }))
)



/**
 * CSS
 */
gulp.task('css', () => {
  const plugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
    cssnano()
  ]

  return gulp.src(config.src.css)
    .pipe(plumber({ errorHandler: notify.onError({
      title: 'Sass: Parsing Error',
      message: '<%= error.message %>'
    }) }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(config.build ? postcss(plugins) : util.noop())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dest.css))
    .pipe(util.env.url ? browserSync.reload({ stream: true} ) : util.noop())
    .pipe(notify({
      title: 'CSS',
      message: 'All CSS is copied and minified.'
    }))
})



/**
 * JavaScript Linting
 */
gulp.task('lintJS', () =>
  gulp.src(config.src.js)
    .pipe(plumber({ errorHandler: notify.onError({
      title: 'JavaScript: Linter Error',
      message: '<%= error.message %>'
    }) }))
    .pipe(xo())
    .pipe(xo.format())
    .pipe(xo.failAfterError())
)



/**
 * JavaScript
 */
gulp.task('js', () =>
  gulp.src(config.src.js)
    .pipe(plumber({ errorHandler: notify.onError({
      title: 'JavaScript: Processing Error',
      message: '<%= error.message %>'
    }) }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(config.build ? babel() : util.noop())
    .pipe(config.build ? uglify() : util.noop())
    .pipe(gulp.dest(config.dest.js))
    .pipe(util.env.url ? browserSync.reload({ stream: true} ) : util.noop())
    .pipe(notify({
      title: 'JavaScript',
      message: 'All JavaScript is minified.'
    }))
)



/**
 * Images.
 */
gulp.task('img', () =>
  gulp.src(config.src.img)
    .pipe(plumber({ errorHandler: notify.onError({
      title: 'Images: Processing Error',
      message: '<%= error.message %>'
    }) }))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ])
    )
    .pipe(gulp.dest(config.dest.img))
    .pipe(notify({
      title: 'Images',
      message: 'All images are copied and minified.'
    }))
)



/**
 * Copy.
 *
 * Copies all necessary files to build folder.
 */
gulp.task('copy', () => {
  // Always copy PHP files and files defined in config.
  let filesToCopy = config.src.php.concat(config.build.filesToCopy)
  // If the assets folder was generated, copy all contents.
  fs.existsSync(config.dest.assetsFolder) && filesToCopy.push(config.dest.assets)

  return gulp.src(filesToCopy)
    .pipe(copy(config.build.folder + pkg.config.slug))
})



/**
 * String replace.
 *
 * Replaces all placeholders with their correct values from package.json.
 */
gulp.task('replace', () =>
  gulp.src(config.build.files)
    .pipe(replace({
      patterns: [
        {
          match: /PluginNamespace/g,
          replacement: pkg.config.name.replace(' ', '')
        },
        {
          match: 'name',
          replacement: pkg.config.name
        },
        {
          match: 'slug',
          replacement: pkg.config.slug
        },
        {
          match: 'prefix',
          replacement: pkg.config.prefix
        },
        {
          match: 'textdomain',
          replacement: pkg.config.slug
        },
        {
          match: 'author',
          replacement: pkg.author
        },
        {
          match: 'author_uri',
          replacement: pkg.config.author.uri
        },
        {
          match: 'author_email',
          replacement: pkg.config.author.email
        },
        {
          match: 'version',
          replacement: pkg.version
        },
        {
          match: 'description',
          replacement: pkg.description
        },
        {
          match: 'plugin_uri',
          replacement: pkg.config.plugin.uri
        },
        {
          match: 'requires',
          replacement: pkg.config.plugin.requires
        },
        {
          match: 'tested_up_to',
          replacement: pkg.config.plugin.tested_up_to
        },
        {
          match: 'tags',
          replacement: pkg.config.plugin.tags
        }
      ]
    }))
    .pipe(gulp.dest(config.build.folder))
)



/**
 * I18n.
 *
 * Create .po file.
 */
gulp.task('i18n', () =>
  gulp.src(config.src.translateableFiles)
    .pipe(pot({
      domain        : pkg.config.slug,
      destFile      : `${pkg.config.slug}.pot`,
      package       : pkg.config.name,
      bugReport     : pkg.config.author.uri,
      lastTranslator: pkg.author,
      team          : pkg.config.author.uri,
    }))
    .pipe(gulp.dest(`${config.build.folder}/${pkg.config.slug}/languages/${pkg.config.slug}.pot`,))
)



/**
 * Zip.
 */
gulp.task('zip', () =>
  gulp.src(config.build.folder + pkg.config.slug + '/**/*')
      .pipe(zip(`${pkg.config.slug}.zip`))
      .pipe(gulp.dest(config.build.folder))
)



/**
 * Tasks.
 */
gulp.task(
  'default',
  [
    'lintPHP',
    'lintCSS',
    'css',
    'lintJS',
    'js',
    'img',
    'browserSync'
  ],
  () => {
    gulp.watch(config.src.js, ['lintJS', 'js'])
    gulp.watch(config.src.css, ['lintCSS', 'css'])
    gulp.watch(config.src.php, ['reload', 'lintPHP'])
  }
)

gulp.task(
  'build',
  () => {
    runSequence(
      'lintPHP',
      'lintCSS',
      'css',
      'lintJS',
      'js',
      'img',
      'copy',
      'replace',
      'i18n',
      'zip',
      () =>
        gulp.src('')
          .pipe(notify({
            title: 'Build Complete',
            message: `👷 Your build of ${pkg.config.name} ${pkg.version} is complete.`
          }))
    )
  }
)
