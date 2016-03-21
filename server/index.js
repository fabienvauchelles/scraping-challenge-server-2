/**
 * MAIN: Configuration and main application
 */

const AntiScrapingUA = require('./anti-scraping/ua'),
    AntiScrapingDelay = require('./anti-scraping/delay'),
    bodyParser = require('koa-bodyparser'),
    compress = require('koa-compress'),
    errorHandler = require('koa-error'),
    hbs = require('koa-hbs'),
    Koa = require('koa'),
    logger = require('koa-logger'),
    mongoose = require('mongoose'),
    serve = require('koa-static'),
    winston = require('winston');


const config = require('./config');


// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {timestamp: true});
winston.level = 'debug';


// Connect to database
mongoose.connect(config.mongo.url);
mongoose.connection.on('error', (err) => {
    winston.error('Mongoose error: ', err);
    process.exit(1);
});


// Configure KOA framework
const app = new Koa();
app.name = 'Scraping challenge 2';
app.proxy = true;


if (config.debug) {
    app.use(logger());
}

app.use(errorHandler());
app.use(compress());
app.use(bodyParser());
app.use(hbs.middleware(config.template));


// Anti Scraping
const antiscrapingUA = new AntiScrapingUA(config.antiscraping.ua),
    antiscrapingDelay = new AntiScrapingDelay(config.antiscraping.delay);
antiscrapingDelay.start();


// Assets
app.use(serve('assets'));

// Define routes
app.use(require('./app')(config, antiscrapingUA, antiscrapingDelay));


// Start server
app.listen(config.port);
winston.info('%s server listening at http://localhost:%d', app.name, config.port);


module.exports = app;
