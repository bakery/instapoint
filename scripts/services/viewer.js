define(["models/widget"],function(Widget){
    return {
        initialize : function(id){
            return Widget.getWidgetById(id)
        }
    };
});