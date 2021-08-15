const {series, dest} = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');
const rimraf = require('rimraf');
const path = require('path');

// Declare constants
const tsProject = ts.createProject('tsconfig.json');
const distDir = path.join(__dirname, 'dist');

// Cleaning the distribution files
function clean(cb) {
	rimraf(distDir, cb);
}

// Typescript source files
function typescript() {
	return tsProject.src()
		.pipe(sm.init())
		.pipe(tsProject())
		.pipe(sm.write())
		.pipe(dest(distDir));
}

exports.clean = clean;
exports.default = series(clean, typescript);