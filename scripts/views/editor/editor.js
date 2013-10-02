define(["jquery","underscore","marionette","postal","text!./editor.html",
    "views/editor/location.textbox",
    "views/editor/category.selector",
    "views/editor/map",
    "views/editor/result",
    "models/category"
    ],

    function($,_,Marionette,postal,template,LocationTextBox,
        CategorySelector, Map, Result,
        Categories
        ){

        var Editor = Marionette.Layout.extend({
            template : template,
            regions : {
                "findLocation" : ".find-location",
                "selectCategories" : ".select-categories",
                "displayMap" : ".show-map",
                "displayResult" : ".show-result"
            },

            initialize : function(){
                this.findLocationBox = new LocationTextBox();
                
                this.categorySelector = new CategorySelector({
                    collection : Categories.getCategories()
                });

                this.map = new Map();

                this.result = new Result({ model : this.model });

                this.channel = postal.channel();
                this.channel.subscribe("map:create", _.bind(function(){
                    this.result.show();
                },this));
            },

            onRender : function(){
                this.findLocation.show(this.findLocationBox);
                this.selectCategories.show(this.categorySelector);
                this.displayMap.show(this.map);
                this.displayResult.show(this.result);
            }
        });

        return Editor;
    }
);