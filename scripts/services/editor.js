define(["underscore", "postal","models/widget","models/address","models/ciceroos"], 

    function(_,postal,Widget,Address,CiceroosApi){

        var __channel;
        var __widget;
        var __currentAddress;
        var queries = {};

        return {
            initialize : function() {

                __channel = postal.channel();

                __widget = Widget.newWidget();

                __channel.subscribe("pois:fetched", function(pois){
                    __widget.addPOIs(pois);
                });

                __channel.subscribe("pois:removed", function(pois){
                    __widget.removePOIs(pois);
                });

                __channel.subscribe("address:changed", function(location){
                    __currentAddress = new Address(location);

                    __widget.set({
                        address : __currentAddress.getAddress(),
                        lat : __currentAddress.getLat(),
                        lon : __currentAddress.getLon()
                    });

                    __widget.save();
                });

                __channel.subscribe("category:selection-changed", function(category){
                            
                    if(!__currentAddress){
                        return;
                    }

                    var query = CiceroosApi.makeQuery(category.query, __currentAddress.getCity());

                    if(category.selected){
                        queries[query] = CiceroosApi.semanticSearch(query, category.category);
                        queries[query].fetch({ success : function(r){
                            console.log("got results for " + query, r);
                            
                            var pois = _.map(r.toJSON(), function(p){
                                p.pointer = category.pointer;
                                return p;
                            });

                            postal.publish({
                                topic : "pois:fetched",
                                data : pois
                            });
                        }});

                        

                    } else {
                        if(queries[query]){
                            postal.publish({
                                topic : "pois:removed",
                                data : queries[query].toJSON()
                            });
                        }
                    }
                });

                __channel.subscribe("category:deselect-all", function(category){
                    _.each(_.keys(queries), function(q){
                        postal.publish({
                            topic : "pois:removed",
                            data : queries[q].toJSON()
                        });
                    });
                });

            },

            getWidget : function(){
                return __widget;
            },

            getCurrentAddress : function(){
                return __currentAddress;
            }
        };
});