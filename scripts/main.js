/*
    Require setup + entry point for the application
    This hybrid setup allows us to use 1 single config file across
    both runtime and test environment
*/

function testing(){
    return typeof window.__karma__ !== 'undefined';
}


require.config({
    baseUrl : "/scripts/",

    shim: {
        'underscore' : {exports: '_' },
        'backbone' : {exports: 'Backbone', deps: ['underscore']},
        'backbone.wreqr' : { deps : ['backbone']},
        'backbone.babysitter' : { deps : ['backbone']},
        'json' : {exports: 'JSON'},
        'handlebars' :  {exports: 'Handlebars'},
        'parse' : {exports: 'Parse'},
        'jquery-validation' : {deps: ['jquery']}
    },

    paths: {
        jquery: 'vendor/jquery/jquery',
        'jquery-validation': 'vendor/jquery-validation/jquery.validate',
        underscore: 'vendor/underscore/underscore',
        backbone: 'vendor/backbone/backbone',
        text : 'vendor/requirejs-text/text',
        json : 'vendor/json2/json2',
        handlebars : 'vendor/handlebars/handlebars',
        parse : 'parse/parse',
        marionette : 'lib/backbone.marionette', // TODO: move to vendor
        'backbone.wreqr' : 'lib/backbone.wreqr', // TODO: move to vendor
        'backbone.babysitter' : 'lib/backbone.babysitter', // TODO: move to vendor
        postal : 'lib/postal',
        templates: '../templates'
    }
});

if (!testing()){
    
    // require(['jquery'], function($){
    //     $(function(){
    //         require(['app'], function(Application) {
    //             Application.start();
    //         });
    //     });
    // });

    
    require(['jquery', 'app'], function($,Application) {
        $(function(){
            Application.start(); 
        });
    });
    

} else {
    var tests = [];
    for (var file in window.__karma__.files) {
        if (/specs\/.*\.js$/.test(file)) {
            tests.push(file);
        }
    }

    require.config({
        baseUrl : "/base/app/scripts",
        // ask Require.js to load these files (all our tests)
        deps : tests,
        // start test run, once Require.js is done
        callback : window.__karma__.start
    });
}