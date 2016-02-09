var express, app, env, srcRootPath, rootAssetPath;

require('dotenv').config();

express = require('express');
app = express();
env = (process.env.SERVER_ENVIROMENT ? process.env.SERVER_ENVIROMENT : "develop");

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

app.set('views', srcRootPath + "app/views")
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function (req, res) {
  res.render('index');
});

app.use('/assets', express.static(rootAssetPath));


app.listen(9000);
