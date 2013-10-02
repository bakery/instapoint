define(["jquery","backbone","marionette","parse","settings",
    "services/editor",
    "services/viewer",
    "views/editor/editor",
    "views/viewer/viewer",
    "tools/frame.detector",
    "tools/marionette.override"],

    function($,Backbone,Marionette,Parse,settings,EditorService,ViewerService,Editor,Viewer,FrameDetector){

        // set up the app instance
        var application = new Marionette.Application();
        
        application.addRegions({
            mainRegion: "#content",
            header: "header",
            footer: "footer"
        });

        application.on('initialize:after', function() {

            $("header").removeClass("hidden");

            Parse.initialize(settings.parseApplicationId, settings.parseApplicationKey);
    
            var ApplicationRouter = Backbone.Router.extend({

                routes: {
                    "v/:id/" : "view",
                    ".*": "landing"
                },

                view : function(id) {
                    
                    if(FrameDetector.isInIframe()){
                        $("body").addClass("frame");
                    }


                    $.when(ViewerService.initialize(id))
                        .done(function(widget){
                            $("#content").removeClass("loading");
                            application.mainRegion.show(new Viewer({ model : widget }));
                            console.log("got widget", widget);
                        })
                        .fail(function(){ alert("there's no such widget"); });  
                },

                landing: function() {
                    EditorService.initialize();
                    $("#content").removeClass("loading");
                    application.mainRegion.show(new Editor({model : EditorService.getWidget()}));
                }
            });

            var router = new ApplicationRouter();
            Backbone.history.start({pushState: false});

        });

        // export the app from this module
        return application;
    }
);
