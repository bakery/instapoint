define(["jquery","parse","underscore"],function($,Parse,_){
    var Widget = Parse.Object.extend("Widget", {

        __firstSync : true,

        initialize : function(){
            this.on("sync", this.onSync, this);
        },

        onSync : function(){
            if(this.__firstSync){
                this.__firstSync = false;
                this.trigger("create");
            }
        },

        toJSON : function(){
            var json = Parse.Object.prototype.toJSON.apply(this);
            json.widgetURL = window.location.protocol + "//" + window.location.host + 
                "/#/v/" + json.objectId + "/";
            return json;
        },

        addPOIs : function(pois){
            var ps = this.get("pois") || [];
            
            _.each(pois, function(p){ ps.push(p); });

            this.set({ pois : ps });
            return this.save();
        },

        removePOIs : function(pois){
            var ps = this.get("pois") || [];
            var ids = _.map(pois, function(p){ return p.idPOI; });
            this.set({ 
                pois : _.filter(ps, function(p){ return ids.indexOf(p.idPOI) === -1;  })
            });
            return this.save();
        }

    });

    return {
        newWidget : function(){
            return new Widget();
        },

        getWidgetById : function(id){
            var dfd = $.Deferred();
            new Parse.Query(Widget).get(id, {
              success: function(object) {
                dfd.resolve(object);
              },

              error: function(object, error) {
                dfd.reject();
              }
            });
            return dfd.promise();
        }
    };
});