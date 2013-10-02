define(["jquery","underscore","json","backbone","postal","text!data/categories.json"],
    function($,_,JSON,Backbone,postal,categoriesJSON){

        var Category = Backbone.Model.extend({
            defaults : {
                selected : false
            },

            initialize : function(){
                this.on("change:selected", this.onSelectedChange, this);
            },

            onSelectedChange : function(){
                postal.publish({
                    topic : "category:selection-changed",
                    data : this.toJSON()
                });
            },

            toggleSelection : function(){
                this.set({ selected : !this.get("selected") });
            }
        });

        var CategoryCollection = Backbone.Collection.extend({
            model : Category
        });

        var __categories = new CategoryCollection(
            _.map(JSON.parse(categoriesJSON), function(c){
                return new Category(c);  
            })
        ); 

        return {
            getCategories : function(){
                return __categories;
            },

            deselectAll : function(){
                _.each(__categories.models,function(m){
                    m.set({ selected : false });
                });

                postal.publish({
                    topic : "category:deselect-all"
                });                
            }
        };
    }
);