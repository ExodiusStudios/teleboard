const {series, dest} = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');
const path = require('path');
const fs = require('fs');

// Declare constants
const tsProject = ts.createProject('tsconfig.json');
const distDir = path.join(__dirname, 'dist');
const distTempDir = path.join(__dirname, 'dist-temp');

// Typescript source files
function typescript() {
	return tsProject.src()
		.pipe(sm.init())
		.pipe(tsProject())
		.pipe(sm.write())
		.pipe(dest(distTempDir));
}

// Clean the distribution files
function cleanDist(cb) {
	if(fs.existsSync(distDir)) {
		fs.rmdir(distDir, { recursive: true }, cb);
	} else {
		cb();
	}
}

// Save the distribution files
function moveCache() {
	return src(distTempDir + '/**/*').pipe(dest(distDir));
}

// Finish the compilation process
function clearCache(cb) {
	if(fs.existsSync(distTempDir)) {
		fs.rmdir(distTempDir, { recursive: true }, cb);
	} else {
		cb();
	}
}

exports.default = series(clearCache, typescript, cleanDist, moveCache, clearCache);