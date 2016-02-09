# Brony Stack
##### a webstack boilerplate created @ awesomenesstv by [scneptune](http://twitter.com/scneptune)

-------------

### What's under the hood?

  - Gulp
  - Node.js
  - Express
  - SCSS
  - CSS Autoprefixing and Image compression
  - ES6 Transpilation via Babel
  - BrowserSync

### How do we get it running?

1) install `node` first and foremost.
2) check into this directory and run `npm install` (this should grab all you dependency needs)
3) create a `.env` file with the line `SERVER_ENVIROMENT = "develop" ` or `SERVER_ENVIROMENT = "production"` depending on your build status
4) run the express server via `node index.js`
5) start up your gulp instance in a new window by first installing gulp globally via `npm install gulp -g` and then `gulp` (`gulp` will run the default development processes needed for compilation.
6) when you are ready to ship a deployment build, switch out the SERVER_ENVIROMENT env variable and run `gulp deploy`. 

--------------

![Brony Stack](http://i.giphy.com/WUVZThyNTCU00.gif)

