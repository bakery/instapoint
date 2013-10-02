define(function(){
    return {
        isInIframe : function(){
            return ! (window.self === window.top); 
        }
    };
});