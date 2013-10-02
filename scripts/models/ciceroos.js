define(["jquery","underscore","backbone", "settings"], 

    function($,_,Backbone,settings){

        var CiceroosModel = Backbone.Model.extend({
        });

        var CiceroosCollection = Backbone.Collection.extend({

            model : CiceroosModel,

            parse: function(response) {
                return response.results;
            },

            __makeUrl: function(apiEndpoint,q){
                var base = "http://api.ciceroos.com/development/" + apiEndpoint;
                var query = q || {};
                query.keyAPI = settings.ciceroosApiKey;

                var queryStr = _.reduce(_.keys(query), function(memo,k){
                    return memo + k + "=" + encodeURIComponent(query[k]) + "&";
                },"?");

                if(queryStr[queryStr.length - 1] === "&"){
                    queryStr = queryStr.substring(0,queryStr.length-1);
                }

                return base + queryStr;
            }
        });

        var SemanticSearchCollection = CiceroosCollection.extend({
            initialize : function(models,options){
                this.url = this.__makeUrl("SemanticSearch",options);
            }
        });

        var NearbyPOICollection = CiceroosCollection.extend({
            initialize : function(models,options){
                this.url = this.__makeUrl("NearbyPOI",options);
            }
        });

        return {

            makeQuery : function(q, city){
                return q + " " + city;
            },

            semanticSearch : function(q, category, country, language){
                var collection = new SemanticSearchCollection([],{
                    q : q, 
                    country : country || "Italy", 
                    d : category || 1, 
                    lang : language || "it"
                });

                return collection;
            },

            nearbyPOISearch : function(lat, lon, radius, country, language){
                var collection = new NearbyPOICollection([],{
                    lat : lat,
                    lng : lon,
                    radius : radius || 5,
                    lang : language || "it",
                    country : country || "Italy"
                });

                return collection;
            }
        };
    }
);