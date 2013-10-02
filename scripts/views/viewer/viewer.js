define(["jquery","underscore","postal","marionette","views/editor/map","text!./viewer.html"],

    function($,_,postal,Marionette,Map,template){

        var Viewer = Marionette.Layout.extend({
            template : template,
            className : "container viewer",
            
            regions : {
                "displayMap" : ".show-map"
            },

            initialize : function(){
                this.map = new Map();
            },

            onRender : function(){
                this.displayMap.show(this.map);
                this.map.renderMap();

                postal.publish({ 
                    topic : "address:changed",
                    data : this.model.toJSON()
                });

                postal.publish({
                    topic : "pois:fetched",
                    data : this.model.toJSON().pois
                });
                
            }
        });

        return Viewer;
    }
);