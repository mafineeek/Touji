var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var del = require("del");

// Task which would transpile typescript to javascript
gulp.task("typescript", function () {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

// Task which would delete the old dist directory if present
gulp.task("build-clean", function () {
  return del(["./dist"]);
});

// Task which would just create a copy of the current views directory in dist directory
gulp.task("views", function () {
  return gulp.src("./dashboard/views/**/*.ejs").pipe(gulp.dest("./dist/dashboard/views"));
});

// Task which would just create a copy of the current static assets directory in dist directory
gulp.task("assets", function () {
  return gulp
    .src("./dashboard/public/**/*")
    .pipe(gulp.dest("./dist/dashboard/public/"));
});

gulp.task(
  "locales", () => {
    return gulp.src('./data/language/**/*.json').pipe(gulp.dest('./dist/data/language/'));
  }
)

// The default task which runs at start of the gulpfile.js
gulp.task(
  "default",
  gulp.series("build-clean", "typescript", "views", "assets", "locales"),
  () => {
    console.log("Done");
  }
);
