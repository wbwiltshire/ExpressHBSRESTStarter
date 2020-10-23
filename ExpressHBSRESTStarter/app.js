const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')('ExpressHBSRESTStarter');
const favicon = require('serve-favicon');
const https = require('https');                        // built-in
const fs = require('fs');                              // built-in
const hbs = require('hbs');
const logger = require('morgan');
const path = require('path');
const repo = require('./repository');

//Load the data
var configurationFile = 'customer.json';
var customers = JSON.parse(
    fs.readFileSync(configurationFile, 'utf8')
);
repo.loadCustomers(customers);

var routes = require('./routes/index');
var customerapi = require('./routes/api/customer');
var customer = require('./routes/customer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var blocks = {};
hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});
hbs.registerHelper('contentFor', function (name, options) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(options.fn(this));
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/customer', customer);
app.use('/api/customer', async (req, res, next) => {
     return customerapi(req, res, next);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

global.httpsAgent = new https.Agent({
     rejectUnauthorized: true,
     cert: fs.readFileSync('./certs/servercert.pem'), 		// Load certificate
     key: fs.readFileSync('./certs/serverkey.pem'),		// Load public/private key
     ca: fs.readFileSync('./certs/scwswbw10ca-cert.pem')    // Load certificate authority bundle
});

const port = process.env.PORT || 3000;
const httpsOptions = {
     key: fs.readFileSync('./certs/serverkey.pem'),			// Load public/private key (Password: scwswbw10)
     cert: fs.readFileSync('./certs/servercert.pem'),			// Load certificate
     ca: fs.readFileSync('./certs/scwswbw10ca-cert.pem')
}

const server = https.createServer(httpsOptions, app).listen(port, () => {
     console.log('httpsOptions: ', httpsOptions);
     console.log('server running at ' + port);
});