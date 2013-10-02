define(["jquery","underscore","marionette","postal","text!./location.textbox.html"],

    function($,_,Marionette,postal,template){

        var LocationTextbox = Marionette.Layout.extend({
            template : template,

            onDomRefresh : function(){

                var defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(37.05518, 7.33887),
                    new google.maps.LatLng(46.58907, 16.34766)
                );

                this.searchBox = new google.maps.places.SearchBox(
                    this.$("input[type='text']")[0],
                    {bounds: defaultBounds}
                );

                google.maps.event.addListener(
                    this.searchBox, 
                    'places_changed', 
                    _.bind(this.onPlaceSelected, this)
                );

                this.$("input[type='text']").focus();
            },

            onPlaceSelected : function() {

                var place = this.searchBox.getPlaces();

                if(_.isArray(place)){
                    place = place[0];
                }


                postal.publish({
                    topic : "address:changed",
                    data : {
                        address : place.formatted_address,
                        name : place.name,
                        lon : place.geometry.location.lng(),
                        lat : place.geometry.location.lat()
                    }
                });
            }

        });

        return LocationTextbox;
    }
);