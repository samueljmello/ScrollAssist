/*
    
ScrollAssist - jQuery plugin written by Samuel Mello (samueljmello@gmail.com)

version 1.0.0

*/
var ScrollAssist = {

    // array for section boundaries
    sections: []

    // percentage they have to scroll before triggering - set to 0 for none
,   percentage: 0.10
    
    // the timeout to wait before triggering the event (prevents too much load)
,   timeout: 100
    
    // timer property for setTimeout
,   timer: null
    
    // last position scrolled to
,   lastPosition: 0
    
    // transition speed of the scroll to animation
,   transition: 500
    
    // default elements
,   elements: jQuery("section.scrollAssist")
    
    // flag for first load
,   firstLoad: true

,   load: function() {

        var scrObj = this;

        // reset sections
        scrObj.sections = [];

        // get each section into our points array
        scrObj.elements.each(function(e){

            var pos = jQuery(this).position();

            // set all properties
            var t = pos.top;
            var l = pos.left;

            var w = jQuery(this).outerWidth();
            var h = jQuery(this).outerHeight();

            var r = (parseInt(l) + parseInt(w));
            var b = (parseInt(t) + parseInt(h));

            var tZ = (parseInt(t) - (parseInt(h) * parseFloat(scrObj.percentage)))
            var bZ = (parseInt(b) + (parseInt(h) * parseFloat(scrObj.percentage)))

            // make sure to account for margin using outerWidth() and outerHeight() to get right and bottom
            scrObj.sections.push({
                el: this
            ,   top: t
            ,   right: r
            ,   bottom: b
            ,   left: l
            ,   topZone: tZ
            ,   bottomZone: bZ
            });
        });

        // binds (only on first load)
        if (scrObj.firstLoad === true) {

            jQuery(document).on("scroll", function(e) {

                // call detect
                scrObj.detect(e);

            });

            jQuery(window).on("resize", function(e) {

                // call detect
                scrObj.load();

            });

            scrObj.firstLoad = false;
        }


    }
,   goTo: function(event,section) {

        // cancel scroll event
        event.preventDefault();
        event.stopPropagation();

        // jquery animate scroll
        jQuery('html, body').animate({
            scrollTop: section.top
        }, this.transition);

    }
,   detect: function(event) {

        if ( this.sections.length <= 0 ) {
            return false;
        }

        // clear the timeout holder
        clearTimeout(this.timer);

        // set the event
        var scrEvent = event;
        var scrObj = this;

        // set the timeout holder
        this.timer = setTimeout(function() {

            var top = jQuery(document).scrollTop();
            var bot = (parseInt(top) + parseInt(jQuery(window).height()));

            // if scrolling up
            if (top < scrObj.lastPosition) {

                for (var x = (scrObj.sections.length - 1); x >= 0; x--) {

                    var sec = scrObj.sections[x];

                    // if this isn't the first slide and we are before this section and not into the previous section already, scroll to previous
                    if (x > 0 && top < sec.topZone && bot > scrObj.sections[(x - 1)].bottom) {

                        scrObj.goTo(scrEvent,scrObj.sections[(x - 1)]);
                        break;
                    }
                }
            }
            // if scrolling down
            else if (top > scrObj.lastPosition) {

                for (var x = 0; x < scrObj.sections.length; x++) {

                    var sec = scrObj.sections[x];

                    // if this isn't the last slide and we are after this section and not into the next section arleady; scroll to next
                    if (x < (parseInt(scrObj.sections.length) - 1) && bot > sec.bottomZone && top < scrObj.sections[(x + 1)].top) {

                        scrObj.goTo(scrEvent,scrObj.sections[(x + 1)]);
                        break;
                    }
                }
            }

            // scroll last position to detect up / down
            scrObj.lastPosition = top;

        }, this.timeout);
    }
}

// add jquery function
jQuery.fn.ScrollAssist = function(settings) {

    if ( jQuery == undefined ) {
        alert('jQuery can not be accessed.');
        return false;
    }
    
    var newObject = new ScrollAssist;

    // if settings are provided
    if (settings != undefined) {

        // three configurable options:
        //  -   boundary percentage
        //  -   scroll event timeout
        //  -   scroll transition speed 

        if ( settings.percentage != undefined && !isNaN(settings.percentage)) {
            newObject.percentage = settings.percentage;
        }
        if ( settings.timeout != undefined && !isNaN(settings.timeout)) {
            newObject.timeout = settings.timeout;
        }
        if ( settings.transition != undefined && !isNaN(settings.transition)) {
            newObject.transition = settings.transition;
        }
    }

    //set objects from jquery
    newObject.elements = this;

    // perform load sequence
    newObject.load();

    // return object
    return newObject;
};