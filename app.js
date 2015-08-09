var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');


var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('QuizAlg 2015'));
app.use(session({
    secret: process.env.SESSION_SECRET || '<mysecret>',
    resave: true,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos:
app.use(function (req, res, next) {
    //guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    //hacer visible req.session en las vistas
    res.locals.session = req.session;

    /*if (req.session.time){
        var lastTime = new Date().getTime();
        var interval = lastTime - req.session.time;
        
        if (interval > 120000) {
            delete req.session.time;
            req.session.autoLogout = true; 
            res.redirect("/logout");
        } else {
            req.session.time = lastTime;
        }
    }
    */
    
    next();
});


app.use(function(req, res, next) {
    if (req.session.user) { // Comprobamos si existe usuario

        var newTime = new Date();

        if (!req.session.newHour) {
            req.session.newHour = newTime.getTime();
            req.session.hour = newTime.toLocaleString();
        } else {
            if ((newTime-req.session.newHour)/1000 > 120) {
                req.session.autoLogout = true;
                delete req.session.newHour;
                delete req.session.user;
            } else {
                req.session.newHour = newTime.getTime();
                req.session.hour = newTime.toLocaleString();
            }
        }
    }

    res.locals.session = req.session;
    next();

});



app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


/* MW para controlar la expiración de la sesión 
app.use(function(req, res, next){
    var time = new Date().getTime();
    if (req.session.user) {
        if ((time - req.session.last) >= 120000){
            delete req.session.time;
            req.session.autoLogout = true;
            res.redirect('/logout');//req.session.destroy();
        } else {
            req.session.last = time;
        }
    }
    next();
});
*/
module.exports = app;
