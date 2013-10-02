define(function(){

    var Address = function(placeDetails){
        //placeDetails come from google places autocomplete API
        this.placeDetails = placeDetails;
    };

    Address.prototype = {
        getLat : function(){
            return this.placeDetails.lat;
        },

        getLon : function(){
            return this.placeDetails.lon;
        },

        getName : function(){
            return this.placeDetails.name;
        },

        getAddress : function(){
            return this.placeDetails.address; 
        },

        getCity : function(){
            var m = /([0-9]{5})(.*),/.exec(this.placeDetails.address);
            var city = m ? m[2] : null;

            if(!city){
                m = /.+,(.+),.+,.+/.exec(this.placeDetails.address);
                city = m ? m[2] : null;
            }

            if(!city){
                m = /.+,(.+),.+/.exec(this.placeDetails.address);
                city = m ? m[1] : null;
            }

            return city;
        },

        getCountry : function(){
            var m = /([0-9]{5}.*),(.*)$/.exec(this.placeDetails.address);
            return m ? m[2] : null;
        }
    };

    return Address;
});