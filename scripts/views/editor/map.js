define(["jquery","underscore","marionette","postal","views/editor/info.window","text!./map.html"], 

    function($,_,Marionette,postal,InfoWindow,template){

        var Map = Marionette.Layout.extend({
            template : template,
              
            attributes : {
                "style" : "position:relative;"
            },

            poiMarkers : {

            },

            currentAddress : null,

            initialize : function(){

                this.mapOptions = {
                    zoom: 13,
                    center: new google.maps.LatLng(-34.397, 150.644),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl : false,
                    mapTypeControl : false
                };


                this.channel = postal.channel();
                this.channel.subscribe(
                    "address:changed", 
                    _.bind(this.onAddressChanged,this)
                );

                this.channel.subscribe(
                    "pois:fetched",
                    _.bind(this.onGotPois,this)
                );

                this.channel.subscribe(
                    "pois:removed",
                    _.bind(this.onPoisRemoved,this)  
                );

                this.channel.subscribe(
                    "category:selection-changed",
                    _.bind(this.onCategorySelectionChanged,this)
                );

                this.infoWindow = new InfoWindow();
            },

            onRender : function(){
                $(this.el).append(this.infoWindow.render().el);
            },

            onAddressChanged : function(location){
                
                this.currentAddress = location;

                if(this.map){
                    this.__plotAddressMarker(
                        location.lat,location.lon,location.address
                    );
                }
            },

            onCategorySelectionChanged : function(category){
                if(category.selected){
                    if($('.map-section').hasClass("disabled")){
                        $('.map-section').removeClass("disabled");
                        this.__renderMap();

                        $('html, body').animate({
                                scrollTop: $('.select-categories').offset().top
                        }, 800);
                    }
                }
            },

            onGotPois : function(pois){

                _.each(pois, function(p){
                    this.__plotPOIMarker(p.latitude,p.longitude,p.address,p.name,p.pointer,p.idPOI); 
                    console.log("icon:"+p.pointer);
                }, this);

                

                console.log("map got pois", pois);
            },

            onPoisRemoved : function(pois){
                console.log("map REMOVED pois", pois);  

                _.each(pois, function(p){
                    this.__removePOIMarker(p.idPOI);    
                }, this);
            },

            renderMap : function(){
                this.__renderMap();
            },

            __renderMap : function(){
                this.map = new google.maps.Map(
                    this.$(".map")[0], 
                    this.mapOptions
                );  

                if(this.currentAddress){
                    this.__plotAddressMarker(
                        this.currentAddress.lat,this.currentAddress.lon,this.currentAddress.address
                    );
                }
            },

            __removePOIMarker : function(id){
                var marker = this.poiMarkers[id];
                if(marker){
                    marker.setMap(null);
                    this.poiMarkers[id] = null;
                }
            },

            __showPOIInformation : function(data){
                postal.publish({
                    topic : "infowindow:show",
                    data : data
                });
            },

            __plotPOIMarker : function(lat,lon,address,name,icon,id){
                if(!this.poiMarkers[id]){
                    var poiMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, lon),
                        map: this.map,
                        icon: icon
                    });

                    
                    google.maps.event.addListener(poiMarker, 'click', _.bind(function() {
                        
                        var selectedMarker = _.find(_.values(this.poiMarkers), function(m){
                            if (m !== null){
                                return m.get("selected");
                            }
                        });

                        if(selectedMarker){
                            selectedMarker.set("selected",false);

                            var activeIcon = selectedMarker.getIcon();
                            if(activeIcon.indexOf("selected.png") != -1){
                                activeIcon = activeIcon.substr(0, activeIcon.indexOf("-selected.png")) + ".png";
                                selectedMarker.setIcon(activeIcon);
                                console.log(selectedMarker.getIcon());
                            }
                            console.log('deactivate active');
                        }

                        poiMarker.set("selected",true);
                        console.log('new selected');
                        this.map.panTo(poiMarker.getPosition());

                        //swith to selected icon
                        icon = poiMarker.getIcon();
                        if(icon.indexOf("selected.png") == -1){
                            icon = icon.substr(0, icon.length - 4) + '-selected.png';
                            poiMarker.setIcon(icon);
                            console.log(poiMarker.getIcon());
                        }

                        this.__showPOIInformation({ 
                            name : name, 
                            address : address,
                            lat : lat,
                            lon : lon,
                            icon : poiMarker.getIcon()
                        });

                    },this));

                    this.poiMarkers[id] = poiMarker;
                }
            },

            __plotAddressMarker : function(lat,lon,address){
                
                this.map.panTo(new google.maps.LatLng(lat, lon));


                if(this.__addressMarker){
                    this.__addressMarker.setPosition(new google.maps.LatLng(lat, lon));
                    this.__addressMarker.setTitle(address);
                } else {
                    this.__addressMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, lon),
                        map: this.map,
                        title: address
                    });
                }
            }
        });

        return Map;
});