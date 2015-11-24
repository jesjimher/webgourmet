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

/* Populates recipe list according to current search filter */
function populate_list(filter) {
    // Remember selected item id, if any
    var selected=$("ul.recipelist li.selected");
    var selid=null;
    if (selected.length>0)
        selid=selected.first().attr("id");

    // Remove all recipes and re-add just those that respect the filter
    $("ul.recipelist li").remove();
    var items = [];
    $.each( recipes, function( key, val ) {
        if (val.title.toLowerCase().search(filter.toLowerCase())>=0)
            items.push( "<li id='" + key + "'>" + val.title + "</li>" );
    });
    $("ul.recipelist").append(items);

    /* Re-select previously selected items, if any */
    if (selid!=null)
        $("ul.recipelist li").filter('[id="'+selid+'"]').addClass("selected");
    /* Re-bind event handlers for the new li's */
    $("li").click(activate_detail);
    $("ul.recipelist li").mouseenter(function(e){
        $("ul.recipelist li.selected").removeClass("selected");
        $(e.target).addClass("selected");
    });
}

/* Event handler for clicking in a recipe. Fills recipe info and activates recipe detail div */
function activate_detail(eventObject) {
    id=eventObject.target.id;
    currentrecipe=id;

    /* Fill recipe info */
    $("#yields").val(recipes[id].yields);
    $("#yieldunits").text(recipes[id].yieldunits);
    $("#instructions").html(recipes[id].instructions);

    /* Generate ingredient list */
    fill_ingredients(id,recipes[id].yields);

    /* Switch visibility of divs, and change title */
    $("#recipelist").hide(100);
    $("#recipedetail").show(100,function(){$("#title").text(recipes[id].title);});

    /* Create history entry so back button event can be catched, and just closes the current recipe instead of actually going back */
    history.pushState({},"recipedetail");
}

/* Mobile detection. Not used right now, just in case */
var isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

$( document ).ready(function() {
    $.getJSON("recipes.json",function(data) {

        /* Re-index data by id */
        for(i=0;i<data.length;i++)
            recipes[data[i].id]=data[i];

        /* Populate list of recipes with an empty filter */
        populate_list("");

        /* Activate recipe detail div when clicking on a recipe name */
        $("li").click(activate_detail);
    });

    /* Handler for recipe filtering */
    $("#filter").on("input",function(){
        populate_list($("#filter").val());
    });

    /* Handler to increment/decrement yield number */
    $("#incb").click(function(){
        $("#yields").get(0).stepUp();
        $("#yields").change();
    });
    $("#decb").click(function(){
        $("#yields").get(0).stepDown();
        $("#yields").change();
    });
    /* Handler for manually editing yield number */
    $("#yields").on("change",function(){
        newmultiplier=parseFloat($("#yields").val().replace(",","."));
        fill_ingredients(currentrecipe,newmultiplier);
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

    /* Set initial focus to filter */
    $("#filter").focus();

    /* Key handlers for navigating recipe list */
    $("body").keydown(function(e){
        if ($("div#recipelist").is(":visible")) {
            selec=$('ul.recipelist li.selected');
            /* Key down */
            if (e.which==40) {
                if (selec.length>0) {
                    if (selec.next().length>0) {
                        selec.next().addClass("selected");
                        selec.removeClass("selected");
                    }
                }
                else
                    $("ul.recipelist li").first().addClass("selected");
            }
            /* Key up */
            if (e.which==38) {
                if (selec.length>0) {
                    if (selec.prev().length>0) {
                        selec.prev().addClass("selected");
                        selec.removeClass("selected");
                    }
                }
            }
            /* Enter */
            if (e.which==13) {
                selec.click();
            }
        }
    });



});
