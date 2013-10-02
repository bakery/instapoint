define(["jquery","underscore","marionette","text!./result.html"],

    function($,_,Marionette,template){

        var Result = Marionette.ItemView.extend({
            template : template,

            events : {
                "focus textarea" : "onSnippetFocus"
            },

            modelEvents : {
                "create change" : "render"
            },

            onSnippetFocus : function(){
                var $this = this.$("textarea");
                $this.select();

                // Work around Chrome's little problem
                $this.mouseup(function() {
                    // Prevent further mouseup intervention
                    $this.unbind("mouseup");
                    return false;
                });
            }

        });

        return Result;
    }
);