define(["jquery","underscore","marionette","postal","handlebars","text!./info.window.html"],
    function($,_,Marionette,postal,Handlebars,template){

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function prettyName(text){
            var parts = text.split(' ');
            parts = _.map(parts, function(w){ return w.toLowerCase(); });
            parts = _.map(parts, function(w){ return w.length > 3 ? capitalize(w) : w; });

            //first one is always capped
            parts[0] = capitalize(parts[0]);

            return parts.join(' ');
        }

        Handlebars.registerHelper('prettyName', function(text) {
            return new Handlebars.SafeString(prettyName(text));
        });

        Handlebars.registerHelper('prettyAddress', function(text) {
            var parts = text.split(',');
            var longestPart = '';

            _.each(parts, function(p){
                if(p.length > longestPart.length){
                    longestPart = p;
                }
            });

            return new Handlebars.SafeString(prettyName(longestPart));
        });


        var InfoWindow = Marionette.ItemView.extend({
            template : template,
            className : "marker-info-window hidden",

            initialize : function(){
                this.channel = postal.channel();
                this.channel.subscribe("infowindow:show", _.bind(this.onShowWindow,this)); 
                this.channel.subscribe("address:changed", _.bind(this.onAddressChange, this));
            },

            serializeData : function(){
                return this.model;
            },

            onShowWindow : function(data){
                $(this.el).addClass("hidden");
                
                this.model = data;
                this.render();
            },

            onAddressChange : function(){
                this.model = null;
                this.render();
            },

            onRender : function(){
                if(this.model){
                    $(this.el).removeClass("hidden");
                }else{
                    $(this.el).addClass("hidden");
                }
            }
        });

        return InfoWindow;
    }
);