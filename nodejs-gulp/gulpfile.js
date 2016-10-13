var gulp = require('gulp'),
	runSequence = require('run-sequence'),			//顺序执行
	sass = require('gulp-ruby-sass'),				//sass转css
	autoprefixer = require('gulp-autoprefixer'),	//增加私有变量前缀
	minifycss = require('gulp-minify-css'),			//压缩css
	jshint = require('gulp-jshint'),				//js代码校验
	uglify = require('gulp-uglify'),				//压缩js
	obfuscate = require('gulp-obfuscate');			//混淆js
	imagemin = require('gulp-imagemin'),			//图片压缩
	rename = require('gulp-rename'),				//重命名
	concat = require('gulp-concat'),				//合并
	notify = require('gulp-notify'),				//加控制台文字描述用的
	cache = require('gulp-cache'),					//缓存，只压缩修改的图片
	gulpif = require('gulp-if'),					//条件判断
	rev = require('gulp-rev'),						//生成版本号
	revCollector = require('gulp-rev-collector'),	//引入版本号
	htmlmin = require('gulp-htmlmin'),				//压缩HTML
	browserSync = require('browser-sync').create();
	reload      = browserSync.reload;				//浏览器自动刷新
	del = require('del');							//也是个删除···

var sourcePath = {									//源文件路径
		all: 'src/**/*',
		html: 'src/**/*.html',
		css: 'src/css/**/*.css',
		js: 'src/js/**/*.js',
		img: 'src/img/**/*'
	},
	destinationPath = {								//目的文件路径
		html: 'dist/',
		css: 'dist/assets/css',
		js: 'dist/assets/js',
		img: 'dist/assets/img'
	},
	revPath = {										//版本文件路径
		json: 'src/rev/**/*.json',
		css: 'src/rev/css',
		js: 'src/rev/js',
		img: 'src/rev/img'
	},
	condition = true;								//条件变量

//压缩Html/更新引入版本号
gulp.task('html', function () {
	return gulp.src([revPath.json, sourcePath.html])
		.pipe(gulpif(
			condition, htmlmin({collapseWhitespace: true})
		))
		.pipe(revCollector())
		.pipe(gulp.dest(destinationPath.html));
});

/*引入版本号压缩css并生成版本号*/
gulp.task('css', function(){
	return gulp.src([revPath.json, sourcePath.css])
		.pipe(revCollector())
		// .pipe(sass({style: 'extended'}))			//sass转css
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		// .pipe(rename({suffix: '.min'}))				//重命名
		.pipe(minifycss())							//压缩
		.pipe(gulp.dest(destinationPath.css))
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest(revPath.css))
		.pipe(reload({stream: true}))
		.pipe(notify({message: 'Styles task complete'}));
});

/*压缩js并生成版本号*/
gulp.task('js', function(){
	return gulp.src(sourcePath.js)
		.pipe(rev())
		//.pipe(jshint('.jshintrc'))			//校验js
		//.pipe(jshint.reporter('default'))		//校验js
		//.pipe(concat('main.js'))				//合并
		//.pipe(uglify())						//压缩
		//.pipe(obfuscate())					//混淆
		//.pipe(rename({suffix: '.min'}))		//重命名
		.pipe(gulp.dest(destinationPath.js))
		.pipe(rev.manifest())
		.pipe(gulp.dest(revPath.js))
		.pipe(notify({message: 'Script task complete'}));
});

/*压缩图片并生成版本号*/
gulp.task('img', function(){
	return gulp.src(sourcePath.img)
		.pipe(rev())
		.pipe(cache(imagemin({
				optimizationLevel: 5,
				progressive: true,
				interlaced: true,
				// use: [pngquant()]		//使用pngquant深度压缩png图片的imagemin插件
			}),
			{
      			key: function(file) {
        			return file.contents.toString('utf8') + file.path;
        		}
      		}
		))
		.pipe(gulp.dest(destinationPath.img))
		.pipe(rev.manifest())
		.pipe(gulp.dest(revPath.img))
		.pipe(notify({message: 'Images task complete'}));
});

gulp.task('clean', function(cb){
	del([destinationPath.html, destinationPath.js, destinationPath.img, destinationPath.css, revPath.json], cb);
});

gulp.task('default', ['clean'], function(){
	runSequence('img', 'js', 'css', 'html');
});

gulp.task('watch', function(){
	gulp.watch(sourcePath.all).on('change', function(){
		runSequence('img', 'js', 'css', 'html');
	});
	// gulp.watch(sourcePath.js, ['js']);
	// gulp.watch(sourcePath.img, ['img']);
	// gulp.watch(sourcePath.html, ['html']);

  	// browserSync.init(['src/*.html'], {
   //      server: "src/"
   //  });

    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });

    gulp.watch("**/*.html").on("change", browserSync.reload);

    // gulp.watch(['dist/**']).on('change', reload);
    // gulp.watch("*.html").on("change", reload);
});

