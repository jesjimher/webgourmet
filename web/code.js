recipes={};
currentrecipe=0;

/* Fill ingredients ul with specified multiplier */
function fill_ingredients(recipeid,multiplier) {
    original_multiplier=recipes[recipeid].yields;
    if (original_multiplier==0)
        original_multiplier=1;

    /* If yield number is undefined (0 value), don't scale anything */
    mult=multiplier;
    if (mult==0)
        mult=1;

    $("ul#ingredients").empty();
    $.each(recipes[id].ingredients,function(key,val) {
        finalamount=(val.amount/original_multiplier)*mult;
        /* Format decimals if it's not a round number */
        if ((finalamount % 1)!=0)
            finalamount=finalamount.toFixed(2);
        /* Don't show it if there's no quantity */
        if (finalamount==0)
            finalamount="";
/*        if (finalamount!=Math.trunc(finalamount)) {
            var f=new Fraction(finalamount-Math.trunc(finalamount));
            finalamount=Math.trunc(finalamount) + " " + f.numerator + '/' + f.denominator;
        }*/

        $("ul#ingredients").append("<li>"+finalamount+" "+val.unit+" "+val.item+"</li>");
    });
}

var isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
if (isMobile)
    alert("Móvil");

$( document ).ready(function() {
    $.getJSON("recipes.json",function(data) {

        /* Re-index data by id */
        for(i=0;i<data.length;i++)
            recipes[data[i].id]=data[i];

        /* Populate list of recipes */
        var items = [];
        $.each( recipes, function( key, val ) {
            items.push( "<li id='" + key + "'>" + val.title + "</li>" );
        });

        $( "<ul/>", {
            "class": "recipelist",
            html: items.join( "" )
        }).appendTo( "div#recipelist" );

        /* Activate recipe detail div when clicking on a recipe name */
        $("li").click(function(eventObject) {
            id=eventObject.target.id;
            currentrecipe=id;

            $("#yields").val(recipes[id].yields);
            $("#yieldunits").text(recipes[id].yieldunits);
            $("#instructions").html(recipes[id].instructions);

            fill_ingredients(id,recipes[id].yields);

            /* Switch visibility of divs, and change title */
            $("#recipelist").hide(100);
            $("#recipedetail").show(100,function(){$("#title").text(recipes[id].title);});

            /* Create history entry so back button closes the recipe instead of actually going back */
            history.pushState({},"recipedetail");
        });

    });

    /* back-button presses just goes back to recipe list */
    $(window).bind('popstate',function(){
        $("#recipedetail").hide(100);
        $("#recipelist").show(100,function(){$("#title").text("Lista de recetas");});
    });

    /* Go back to recipe list */
    $("#backbutton").click(function() {
        history.back();
    });

    /* Escape key goes back to recipe list */
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            history.back();
        }
    });

    /* Adjust ingredients when changing yields */
    $("#yields").change(function(){
        newmultiplier=$("#yields").val();
        fill_ingredients(currentrecipe,newmultiplier);
    });

});
