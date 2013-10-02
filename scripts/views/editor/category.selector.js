define(["jquery","underscore","marionette","postal","models/category", 
    "text!./category.selector.html",
    "text!./category.item.html"],


    function($,_,Marionette,postal,Categories,template,itemTemplate){


        var CategoryItem = Marionette.ItemView.extend({
            template : itemTemplate,
            tagName : "li",
            className : "category-name",

            events : {
                "click" : "onClick"
            },

            modelEvents : {
                "change" : "onModelChange"
            },

            onClick : function(){
                this.model.toggleSelection();
            },

            onModelChange : function(){
                if (this.model.get("selected")) {
                    $(this.el).addClass("selected");
                } else {
                    $(this.el).removeClass("selected");
                }
            }
        });


        var CategorySelector = Marionette.CompositeView.extend({
            template : template,
            itemView : CategoryItem,
            
            initialize : function(){
                this.channel = postal.channel();
                this.channel.subscribe("address:changed", function(location){
                    $('.select-categories').removeClass('disabled');
                    $('html, body').animate({
                            scrollTop: $('.select-categories').offset().top
                    }, 800);
                    Categories.deselectAll();
                });
            },

            appendHtml: function(collectionView, itemView, index){
                collectionView.$el.find(".categories").append(itemView.el);
            }
        });

        return CategorySelector;
    }
);