var express, app, env, cookieParser,
    bodyParser, srcRootPath, rootAssetPath,
    router, serveFavicon;

require('dotenv').config();

console.log(process.env);
env = (process.env.SERVER_ENVIRONMENT ? process.env.SERVER_ENVIRONMENT : "develop");

//TODO: refactor this out with the path.js lib
function env_compile_src(env) {
  switch (env) {
    case "develop":
      return __dirname + "/src/";
    break;
    case "production":
      return __dirname + "/dist/";
    break;
    default:
      return __dirname + "/src/";
    break;
  }
}
srcRootPath = env_compile_src(env);
rootAssetPath = srcRootPath + (env === "develop" ? "precompiled/" : "");

//package dependencies
express = require('express');
app = express();
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
serveFavicon = require('serve-favicon');
router = require(srcRootPath + 'app/routes');

app.set('views', srcRootPath + "app/views")
app.set('view engine', 'html');

//don't uncomment until your src/precompiled/images/ dir exists.
// app.use(serveFavicon(rootAssetPath + 'images/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/assets', express.static(rootAssetPath));

app.use('/', router)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// rudimentary error handling client side.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (env === "develop" ? err : {})
  });
});


app.engine('html', require('hbs').__express);

app.listen((process.env.SERVER_PORT || 9000));
