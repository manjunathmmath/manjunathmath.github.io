var headerOffset = 0;
var sectionHeaderOffset = 0;
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var scrollY;
var homeSectionArray = [];
var isUserDragging = false;
var scrollTimer, mapCenterTimer;
var allNewsItems = '';
var allEventsItems = '';
var allEventsOnlyItems = '';
var bodyScrollTop;
var disableHelpPopup;
var utmCode = '';

$(document).ready(function() {
    //$('body').append('Main Load');
    //RESPONSIVE JS
    enquire.register("screen and (min-width: 600px) and (max-width: 1023px)", {
        match : function() {
            $('#header-logo-wrapper').attr('class', 'col-sm-3 col-xs-3');
            $('#header-search').attr('class', 'col-sm-8 col-xs-8');
            $('#sub-search-links-wrapper').attr('class', 'col-sm-5 col-xs-5');
            $('#sub-search-links-wrapper').after($('#super-nav'));
            $('#super-nav').attr('class', 'col-sm-7 col-xs-12');
        },
        unmatch : function() {
            $('#header-logo-wrapper').attr('class', 'col-sm-4 col-xs-4');
            $('#header-search').attr('class', 'col-sm-4 col-xs-4');
            $('#sub-search-links-wrapper').attr('class', 'col-sm-12 col-xs-12');
            $('#header-search').append($('#sub-search-links-wrapper'));
            $('#header-search').after($('#super-nav'));
            $('#super-nav').attr('class', 'col-sm-3 col-xs-12');
        },
        setup : function() {},
        destroy : function() {}
    });
    
    enquire.register("screen and (max-width: 599px)", {
        match : function() {
            //$('body').append('<br />Enquire Match');
            $('#header-search-mobile-panel').prepend($('#cse-search-box'));
            $('#page-home #home-banner-area').after($('#page-home #float-nav'));
            $('#header-logo-wrapper').attr('class', 'col-xs-10');
            $('#main-menu-button-container').attr('class', 'col-xs-2');
            $('#site-header').prepend($('#sub-search-links-wrapper'));
            $('#site-header').append($('#super-nav'));
                        
            /*$('#footer-content h1').click(function() {
                $('ul', $(this).parent()).toggle();
                $(this).toggleClass('toggle-menu-toggle');
            });*/
        },
        unmatch : function() {    
            $('#header-search').append($('#cse-search-box'));
            $('#main-menu-panel').after($('#page-home #float-nav'));
            $('#header-logo-wrapper').attr('class', 'col-sm-3 col-xs-3');
            $('#main-menu-button-container').attr('class', 'col-sm-1 col-xs-1');
            $('#header-search').append($('#sub-search-links-wrapper'));
            $('#header-search').after($('#super-nav'));
            
        },
        setup : function() {},    
        destroy : function() {}
    });
    
    
    /*$('body').bind('touchstart mousedown', function() {
        isUserDragging = true;
        console.log(111);
    }).bind('touchend mouseup', function() {
        isUserDragging = false;
        console.log(222);
    });*/
    
    //HOME ROTATOR
    if($('#home-banner-area .wowslider-container').length) {
        $('#home-banner-area .wowslider-container').wowSlider({effect:"fade",prev:"",next:"",duration:10*100,delay:50*100,width:960,height:360,gestures:false,autoPlay:true,autoPlayVideo:false,playPause:false,stopOnHover:false,loop:false,bullets:0,caption:true,captionEffect:"slide",controls:true,responsive:2,fullScreen:false,onBeforeStep:function(curIdx,count){ return (curIdx+1 + Math.floor((count-1)*Math.random())) },images:0}); //function(curIdx,count){ return (curIdx+1 + Math.floor((count-1)*Math.random())) }
    }
    
    //INITS
    initMenus();
    initFitText();
    initBreadcrumbs();
    initFloatNav();
    responsiveImages();
    responsiveTables();
    initExpandableLists();
    panelSizing();
    initScrollBars();
    if(disableHelpPopup != true) { initChatPop(); }
    initMisc();
    
    var myVar = setInterval(myTimer, 2000);
    function myTimer() {
        updateWindowDimension();
        panelSizing();
        if (typeof initSearchBar == 'function') {
            initSearchBar();
        }
        clearInterval(myVar);
        //$('body').append('<br />TIMER');
    }
    //OTHER INITS
    if($('.internal-page-content .wowslider-container').length) {
        $('.internal-page-content .wowslider-container').wowSlider({effect:"parallax",prev:"",next:"",duration:10*100,delay:100*100,width:960,height:360,autoPlay:true,autoPlayVideo:false,playPause:false,stopOnHover:false,loop:false,bullets:0,caption:false,captionEffect:"parallax",controls:true,responsive:2,fullScreen:false,onBeforeStep:0,images:0});
    }
    //PANEL SIZING
    $(window).resize(function() {
        //$('body').append('<br />2: ' + headerOffset + ', ' + sectionHeaderOffset);
        updateWindowDimension();
        panelSizing();
        updateMaps();
        homeSectionOffsetArray();
        trimNewsEvents();
        initBreadcrumbs();
        
        //console.log('Orientation Change: ' + w + ' x ' + h + ', scrollY: ' + scrollY);
    });
    
    
    //GLOBAL MENU CLOSE
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#main-menu-panel').length && !$(event.target).closest('#main-menu-button-container').length && !$(event.target).closest('.section-submenu-panel').length && !$(event.target).closest('.section-submenu').length) {
            closeMainMenu();
            closeSubmenus();
        }
    });


    $('.section-submenu-panel .right-nav').click(function() { closeSubmenus(); });
    
    
    //DISABLE BODY SCROLLING ON MAIN MENU OPEN
    $('body').on({
        'mousewheel DOMMouseScroll': function(e) {
            if ($(e.target).closest('#main-menu-panel').length || $(e.target).closest('.section-submenu-panel').length) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    
    //MAIN MENU BUTTON
    $('#main-menu-button').click(function() {
        setMainMenu();
        updateScrollBars();
    });
    
    //INTERNAL DROPDOWN
    $('.dropdown-menu').each(function() {
		var arrDropdownItems = new Array();
		var arrDropdownItemsSorted = new Array();
		var currentDropdown = $(this);
		
		
        $('> li', currentDropdown).each(function(e) {
            $(this).attr('id', $(this).attr('id') + (e + 1));
			
			var ddContentID = $('.dd-content', $(this)).attr('id');
			$('.dd-content', $(this)).attr('id', ddContentID + (e + 1));
			
            $('.content-list', $(this).closest('.widget-dropdown')).append($('.dd-content', $(this)));
			
			arrDropdownItems.push($(this));
        });
        currentDropdown.prepend('<li id="dd-item-intro" role="presentation"><a role="menuitem" href="#">--</a></li>');
        currentDropdown.attr('data-button-value', $('.button-value', currentDropdown.closest('.widget-dropdown')).html());
		
		if($(currentDropdown).data('alpha-sort') != 'No') {
    		$($('> li', currentDropdown).get().reverse()).each(function(e) {
    			var sorting = this;
    			$($('> li', currentDropdown).get().reverse()).each(function(i) {
    				if($('a', $(this))[0].innerText.localeCompare($('a', sorting)[0].innerText) > 0) {
    					this.parentNode.insertBefore(sorting.parentNode.removeChild(sorting), this);
    				}
    			});
    		});
	    }
	    
		//console.log(arrDropdownItems);
    });
    
    /*$('.content-list').each(function() {
        $('> div', $(this)).each(function(e) {
            if(e != 0) {
                $(this).attr('id', $(this).attr('id') + e);
            }
        });
    });*/
    
    $('.dropdown-toggle').on('click', function() {
        $('.dropdown-menu', $(this).closest('.dropdown')).toggle();
    });
    
    $('.dropdown-menu li a').on('click', function(e) {
        $('.dropdown-menu', $(this).closest('.dropdown')).hide();
        $('.dd-content', $(this).closest('.widget-dropdown')).hide();
        
        $('#dd-content-' + $(this).parent().attr('id').replace('dd-item-', ''), $(this).closest('.widget-dropdown')).show();
        if($(this).parent().attr('id').replace('dd-item-', '') == 'intro') {
            $('.button-value', $(this).closest('.dropdown')).html($(this).closest('.dropdown-menu').attr('data-button-value'));
        } else {
            $('.button-value', $(this).closest('.dropdown')).html($(this).html());
        }
        
        if(!$('.title', $(this).closest('.widget-dropdown')).hasClass('hide-item')) {
            var widgetScroll = $('.title', $(this).closest('.widget-dropdown')).offset().top - headerOffset - 10;
        } else {
            var widgetScroll = $('.dropdown', $(this).closest('.widget-dropdown')).offset().top - headerOffset - 10;
        }
        
        $('html, body').animate({
            scrollTop: widgetScroll
        }, 500);
        
        setCookie('RedDot_ActiveDropdownID', $(this).closest('.widget-dropdown').attr('id'), 1);
        setCookie('RedDot_ActiveDropdownText', $(this).html(), 1);
        setCookie('RedDot_ActiveDropdownIndex', $(this).parent().attr('id').replace('dd-item-', ''), 1);
        setCookie('RedDot_ActiveDropdownOffset', $(this).closest('.widget-dropdown').offset().top - headerOffset - 10, 1);
        
        return false;
    });
    
    //Add unique ID to each dropdown on page.
    $('.widget-dropdown').each(function(i) { $(this).attr('id', 'widget-dropdown-' + (i+1)); });
    
    
    
    /*function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + ';domain=.ivytech.edu;path=/';
    } 
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }*/
    
    
    //LIVE CHAT ICON
    /*$('#menu-live-chat').click(function() {
        window.open('http://www.ivytech.edu/help', 'Live Chat', 'height=930, width=700');
        return false;
    });*/
        
    
    //SUBMENU PANEL
    $('.home-section .section-submenu').click(function() {
        $('.section-content-container .section-submenu-panel', $(this).closest('.home-section')).toggle();
        $('.section-submenu .section-submenu-arrow', $(this).parent()).toggleClass('section-submenu-arrow-toggle');
        
        $('body').animate({
            scrollTop: $(this).parent().offset().top - headerOffset
        }, 500, function() {
            if(w <= 599) {
                if(!$('body').hasClass('elem-fixed')) {
                    bodyScrollTop = $('body').scrollTop();
                    $('body').css('top', '-' + bodyScrollTop + 'px'); 
                    $('body').addClass('elem-fixed');
                } else {
                    $('body').removeClass('elem-fixed');
                    window.scrollTo(0, bodyScrollTop);
                }
            }
        });
        
        updateScrollBars();
    });
    
    $('.section-submenu-panel .overview ul li a[href^="#"]').click(function() {
        $('.section-content-container .section-submenu-panel', $(this).closest('.home-section')).toggle();
        $('.section-submenu .section-submenu-arrow', $(this).parent()).toggleClass('section-submenu-arrow-toggle');
    });
    
    //MOBILE CAMPUS LOCATIONS
    // $('#list-campus-locations li > a').click(function() {
        // $('div', $(this).parent()).toggle();
        // return false;
    // });
    
    // $('#list-campus-locations li div a').each(function() {
        // if((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)) {
            // $(this).attr('href', 'maps:' + $(this).attr('href'));
        // }
            
    // });
    
    
    //STATIC FOOTER MENU
    var resetScrollTop = $('html, body');
    
    //Mobile Search Icon
    $('#home-search').click(function() {
        if($('#header-search-mobile-panel').css('display') == 'none') {
            //$('#menu-search .float-search-icon').addClass('float-search-icon-alt');
            $('#header-search-mobile-panel').show();
            $('#header-search-mobile-panel').animate({
                opacity: '10'
            }, 1000);
        } else {
            //$('#menu-search .float-search-icon').removeClass('float-search-icon-alt');
            $('#header-search-mobile-panel').animate({
                opacity: '0'
            }, 500, function() {
                $('#header-search-mobile-panel').hide();
            });
        }
        
        return false;
    });
    
    if($('#float-nav').length >= 1) {
        $('#toggle-menu').click(function() {
            if(parseInt($('#float-nav').css('right').replace('px', '')) < 0) {
                $('#float-nav').animate({
                  right: '0px'
                }, 500);
            } else {
                $('#float-nav').animate({
                  right: -$('#float-nav').width() + 25 + 'px'
                }, 500);
            }
        
            $('#toggle-menu').toggleClass('toggle-menu-toggle');
        });
    }
    
    $('#menu-next-section').click(function() {
        closeMainMenu();
        
        for(i = 0; i <= homeSectionArray.length - 1; i++) {
            if(scrollY >= homeSectionArray[i] && scrollY < homeSectionArray[i + 1]) {
                //console.log('NEXT');
                resetScrollTop = homeSectionArray[i + 1];
                $('html, body').animate({
                    scrollTop: homeSectionArray[i + 1]
                }, 1000);
                break;
            }
        }
    });
    
    $('#menu-back-to-top').click(function() {
        closeMainMenu();
        resetScrollTop = $('html, body');
        $('html, body').animate({
          scrollTop: 0
        }, 1000);
    });
    
    $('#home-banner-down-arrow a').click(function() {
        $('html, body').animate({
          scrollTop: homeSectionArray[1]
        }, 1000);
        
        return false;
    });
    
    if($('#home-banner-message a').length >= 1) {
    	$('#home-section-background-target').remove();
    }
    
    
    //SECTION SCROLLING
    //homeSectionOffsetArray();
    
    function checkScrollY() {
        homeSectionOffsetArray();
        
        scrollY = $(window).scrollTop();
        
        if(w >= 600) {
            if(scrollY <= headerOffset) {
                $('#menu-next-section').hide();
                $('#menu-back-to-top').hide();
            } else {
                $('#menu-next-section').show();
                $('#menu-back-to-top').show();
            }
            
            for(i = 0; i <= homeSectionArray.length - 1; i++) {
                if(i == homeSectionArray.length - 1 && scrollY >= homeSectionArray[i]) {
                    $('#menu-next-section').hide();
                    break;
                }
            }
            if($('#float-nav').length >= 1) {
                if(parseInt($('#float-nav').css('right').replace('px', '')) < 0) {
                    $('#float-nav').css('right', -$('#float-nav').width() + 25 + 'px');
                }
            }
        }
        /*if(w <= 599) {
            if(scrollY <= headerOffset) {
                $('#float-search').animate({
                  right: '-50px'
                }, 500);
                $('#header-search').animate({
                  bottom: '0px'
                }, 500);
            } else {
                $('#float-search').animate({
                  right: '0px'
                }, 500);
                $('#header-search').animate({
                  bottom: '-50px'
                }, 500);
            }
        }*/
    }
    checkScrollY();
    
    var isMapLoaded = false;
    function checkMapLoad() {
        if($('.map-canvas').length != 0) {
            if(scrollY + h >= $('.map-canvas').closest('.home-section').offset().top + 100 && isMapLoaded == false) {
                isMapLoaded = true;
                mapInitializer();
            }
        }
    }

    var isVideoLoaded = false;
    function checkVideoLoad() {
        if($('#video-rotator-community-college').length != 0) {
            if(scrollY + h >= $('#video-rotator-community-college').closest('.home-section').offset().top + 100 && isVideoLoaded == false) {
                isVideoLoaded = true;
                videoInitializer();
            }
        }
    }
    if(w >= 600) {
        checkMapLoad();
        checkVideoLoad();
    }
    
    function resetSectionStates() {
        if(w <= 599 && $('.widget-dropdown').length != 0) {
            if(scrollY + headerOffset >= $('.widget-dropdown').closest('.home-section').offset().top + 400) {
                $('.dd-content').hide();
                $('#dd-content-intro').show();
                $('.button-value').html('select a campus...');
            }
            if(scrollY + headerOffset <= $('.widget-dropdown').closest('.home-section').offset().top - 100) {
                $('.dd-content').hide();
                $('#dd-content-intro').show();
                $('.button-value').html('select a campus...');
            }
        }
        
        if($('#section-programs').length != 0) {
            if(scrollY + headerOffset >= $('#section-programs').offset().top + 400) {
                updateProgramPanels();
            }
            if(scrollY + headerOffset <= $('#section-programs').offset().top - 100) {
                updateProgramPanels();
            }
        }
    }
    //resetSectionStates();
    
    $(window).scroll(function(e) {
        if(isUserDragging != true) {
            isUserDragging = true;
            window.clearTimeout(scrollTimer);
            scrollTimer = setTimeout(scrollFunction, 500);
        }
        //closeSubmenus();
    });
    
    function scrollFunction() {
        isUserDragging = false;
        
        scrollY = $(window).scrollTop();
        if(w >= 769) {
            for(i = 0; i <= homeSectionArray.length - 1; i++) {
                if(i != 0 && i != 'undefined' && scrollY >= homeSectionArray[i] - 100 && scrollY <= homeSectionArray[i]) {
                    $(this).scrollTop(homeSectionArray[i]);
                }
            }
        }
        
        checkScrollY();
        //resetSectionStates();
        
        if(w >= 600) {
            checkMapLoad();
            checkVideoLoad();
        }
    }
    
    
    //PROGRAMS HOMEPAGE PANEL
    $('.programs-panel .programs-panel-image, .programs-panel .programs-panel-header, .programs-panel .programs-panel-caption').click(function() {
        updateWindowDimension();
        var target = $(this).parent().parent().attr('id');
        $('.programs-panel').each(function() {
            if(w >= 769) {
                if($(this).parent().attr('id') != target) {
                    $(this).parent().toggle();
                } else {
                    $('.programs-panel-content-container', $(this).parent()).toggle();
                    $('.programs-panel-content-container', $(this).parent()).css('height', $('.programs-panel', $(this).parent()).height() + 'px');
                }
            }
            
            if(w >= 600 && w <= 768) {
                if($(this).parent().attr('id') != target) {
                    $(this).parent().toggle();
                } else {
                    $(this).toggle();
                    $('.programs-panel-content-container', $(this).parent()).toggle();
                    $('.programs-panel-content-container', $(this).parent()).css('height', $('#programs-container').height() - 100 + 'px');
                }
            }
            
            if(w <= 599) {
                if($(this).parent().attr('id') != target) {
                    $(this).parent().toggle();
                } else {
                    $(this).toggle();
                    $('.programs-panel-content-container', $(this).parent()).toggle();
                }
            }
        });
        
        updateScrollBars();
        
        $('html, body').scrollTop($('#section-degrees-programs').offset().top - headerOffset);
        
        return false;
    });
    $('.programs-panel-content-container .close-panel a').click(function() {
        updateProgramPanels();
        return false;
    });
    
    
    ////SUBMENU TOGGLING
    //MAIN MENU
    $('#main-menu-panel .left-nav li a').each(function(e) {
        if($(this).attr('href') == '' || $(this).attr('href') == '#') {
            $(this).click(function() {
                if(w >= 600) {
                    $('#main-menu-panel .right-nav #main-menu-subitems-' + $(this).attr('id').replace('main-menu-item-', '')).show();
                    toggleMainSubmenus($(this).attr('id').replace('main-menu-item-', ''));
                } else {
                    if($(this).hasClass('bold-text')) {
                        $(this).removeClass('bold-text');
                        $('div', $(this).parent()).hide();
                    } else {
                        $('#main-menu-panel .left-nav ul > li > a').removeClass('bold-text');
                        $('#main-menu-panel .left-nav .submenu-subitems').parent().hide();
                        $(this).addClass('bold-text');
                        $('div', $(this).parent()).show();
                    }
                }
                    
                //var megaMenuTop = $('#main-menu-panel .left-nav .overview').css('top');
                //var megaMenuThumbTop = $('#main-menu-panel .left-nav .thumb').css('top');
                updateScrollBars();
                //$('#main-menu-panel .left-nav .overview').css('top', megaMenuTop);
                //$('#main-menu-panel .left-nav .thumb').css('top', megaMenuThumbTop);
                
                return false;
            });
        }
        
        toggleMainSubmenus(1);
    });
    function toggleMainSubmenus(index) {
        if(w >= 600) {
            /*$('#main-menu-panel .right-nav .overview > div').each(function(e) {
                if(e != index - 1) { $(this).hide(); }
            });
            $('#main-menu-panel .left-nav li a').each(function(e) {
                if(e == index - 1) { $(this).attr('class', 'active'); } else { $(this).removeClass('active'); }
            });*/
            
            
            $('#main-menu-panel .right-nav .overview > div').each(function(e) {
                if(parseInt($(this).attr('id').replace('main-menu-subitems-', '')) != index) {
                    $(this).hide();
                }
            });
        }
    }
    
    //PAGE MENU
    $('.section-submenu-panel .left-nav li a').each(function(e) {
        var thisParent = $(this).closest('.section-submenu-panel');
        if($(this).attr('href') == '' || $(this).attr('href') == '#') {
            $(this).click(function() {
                if(w >= 600) {
                    $('.right-nav .submenu-subitems-' + $(this).attr('class').replace('submenu-item-', ''), thisParent).show();
                    toggleSubmenus($(this).attr('class').replace('submenu-item-', ''), thisParent);
        
                    var menuCookie = $(this).attr('class').replace('submenu-item-', '') + '|' + $(this).html().replace('&amp;', '&');
                    document.cookie = 'ivytechopenmenu=' + menuCookie + '; path=/';
                    //console.log('Cookie: ' + menuCookie);
                } else {
                    if($(this).hasClass('bold-text')) {
                        $(this).removeClass('bold-text');
                        $('div', $(this).parent()).hide();
                    } else {
                        $('.section-submenu-panel .left-nav ul > li > a').removeClass('bold-text');
                        $('.section-submenu-panel .left-nav .submenu-subitems').parent().hide();
                        $(this).addClass('bold-text');
                        $('div', $(this).parent()).show();
                    }
                }
                //var pageMenuTop = $('.left-nav .overview', thisParent).css('top');
                //var pageMenuThumbTop = $('.left-nav .thumb', thisParent).css('top');
                updateScrollBars();
                //$('.left-nav .overview', thisParent).css('top', pageMenuTop);
                //$('.left-nav .thumb', thisParent).css('top', pageMenuThumbTop);
                                
                return false;
            });
        }
        if(w >= 600) {
            if($('.right-nav .submenu-instructions', thisParent).length == 1) {
                toggleSubmenus(0, thisParent);
                $('.right-nav .submenu-instructions', thisParent).show();
            } else {
                toggleSubmenus(1, thisParent);
            }
        }
    });
    
    var menuGetCookie = getCookie('ivytechopenmenu').split('|');
    var menuText = $('.submenu-item-' + menuGetCookie[0]).html();
    
    //console.log('Get Index: ' + menuGetCookie[0]);
    //console.log('Get Text: ' + menuGetCookie[1]);
    //console.log('Menu HTML: ' + $('.submenu-item-' + menuGetCookie[0]).html());
    
    if(menuGetCookie[1] == menuText && menuGetCookie[1] != null) {
        //console.log('Match: ' + menuGetCookie[1] + ', ' + menuText);
        toggleSubmenus(menuGetCookie[0], $('.section-submenu-panel').first());
    } else {
        //console.log('No Match');
        toggleSubmenus(1, $('.section-submenu-panel').first());
    }
    function toggleSubmenus(index, parent) {
        if(w >= 600) {
            $('.right-nav .overview > div', parent).each(function(e) {
                if(parseInt($(this).attr('class').replace('submenu-subitems-', '')) != index) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        }
    }
    
    //ACCORDION FUNCTIONS
    $('.accordion-panel li').click(function() {
        $('.item-content', $(this)).toggle();
        $($(this)).toggleClass('active');
        
        $('.accordion-panel .scroll-pane').data("plugin_tinyscrollbar").update();
    });
    
    //HOMEPAGE YOUTUBE PLAYLISTS
    if(w >= 600) {
        if($('#video-rotator').length != 0 && $('#video-rotator').closest('.home-section').css('display') != 'none') {
            //Homepage Videos
            $.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",{
                part : 'snippet', 
                maxResults : 20,
                playlistId : 'PLc2GkMkIIwR-CjXdUli6mUfkwKXvxcCTJ',
                key: 'AIzaSyBDkjo6JjHjItED-SWwLswbtOOuxWf_H3U'},
                function(data) {
                    $.each( data.items, function( i, item ) {
                        $('#video-rotator .ws_images ul').append('<li><a href="#"><img data-vid="' + item.snippet.resourceId.videoId + '" src="' + item.snippet.thumbnails.high.url + '" alt="' + item.snippet.title + '" title="' + item.snippet.title + '" /></a></li>');
                    });
        
                    jQuery("#video-rotator .wowslider-container").wowSlider({effect:"parallax",prev:"",next:"",gestures: false,duration:10*100,delay:100*100,width:960,height:360,autoPlay:true,autoPlayVideo:false,playPause:false,stopOnHover:false,loop:false,bullets:0,caption:false,captionEffect:"parallax",controls:true,responsive:2,fullScreen:false,onBeforeStep:function(curIdx,count){ return (curIdx+1 + Math.floor((count-1)*Math.random())) },images:0});
                }
            );
            
            $('#section-media-gallery .section-content-container .video-wrapper .close-button').click(function() {
                $('#section-media-gallery .section-content-container .video-wrapper').hide();
                $('#section-media-gallery .section-content-container .video-wrapper iframe').attr('src', '#');
            });
            
            $('#videos-banner-play-button').click(function() {
                $('#section-media-gallery .section-content-container .video-wrapper iframe').attr('src', 'https://www.youtube.com/embed/videoseries?list=PLc2GkMkIIwR-CjXdUli6mUfkwKXvxcCTJ&autoplay=1');
                $('#section-media-gallery .section-content-container .video-wrapper').show();
            });
        }
        
        ////Custom Video Rotators
        //You Can Go Back
        if($('#video-rotator-you-can-go-back').length != 0 && $('#video-rotator-you-can-go-back').closest('.home-section').css('display') != 'none') {
            $.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",{
                part : 'snippet', 
                maxResults : 20,
                playlistId : 'PLc2GkMkIIwR_MeVh4O9vsuEooXj9VE8XM',
                key: 'AIzaSyBDkjo6JjHjItED-SWwLswbtOOuxWf_H3U'},
                function(data) {
                    $.each( data.items, function( i, item ) {
                        $('#video-rotator-you-can-go-back .ws_images ul').append('<li><a href="#"><img data-vid="' + item.snippet.resourceId.videoId + '" src="' + item.snippet.thumbnails.maxres.url + '" alt="' + item.snippet.title + '" title="' + item.snippet.title + '" /></a></li>');
                    });
        
                    //jQuery("#video-rotator .wowslider-container").wowSlider({effect:"parallax",prev:"",next:"",duration:10*100,delay:100*100,width:960,height:360,autoPlay:true,autoPlayVideo:false,playPause:false,stopOnHover:false,loop:false,bullets:0,caption:false,captionEffect:"parallax",controls:true,responsive:2,fullScreen:false,onBeforeStep:0,images:0});
                    jQuery("#video-rotator-you-can-go-back .wowslider-container").wowSlider({effect:"parallax",prev:"",next:"",gestures: false,duration:10*100,delay:100*100,width:960,height:360,autoPlay:true,autoPlayVideo:false,playPause:false,stopOnHover:false,loop:false,bullets:0,caption:false,captionEffect:"parallax",controls:true,responsive:2,fullScreen:false,onBeforeStep:function(curIdx,count){ return (curIdx+1 + Math.floor((count-1)*Math.random())) },images:0});
                }
            );
            
            $('#videos-banner-play-button', $('#video-rotator-you-can-go-back ').parent()).click(function() {
                $('#section-media-gallery .section-content-container .video-wrapper iframe').attr('src', 'https://www.youtube.com/embed/videoseries?list=PLc2GkMkIIwR_MeVh4O9vsuEooXj9VE8XM&autoplay=1');
                $('#section-media-gallery .section-content-container .video-wrapper').show();
            });
            
            $('#section-media-gallery .section-content-container .video-wrapper .close-button').click(function() {
                $('#section-media-gallery .section-content-container .video-wrapper').hide();
                $('#section-media-gallery .section-content-container .video-wrapper iframe').attr('src', '#');
            });
        }
        ////END Custom Video Rotators
    }

    function videoInitializer() {
        //Homepage Community College
        if($('#video-rotator-community-college').length != 0 && $('#video-rotator-community-college').closest('.home-section').css('display') != 'none') {
            $.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",{
                part : 'snippet', 
                maxResults : 20,
                playlistId : 'PLc2GkMkIIwR8KQBEklUSKApSywZQL8M2o',
                key: 'AIzaSyBDkjo6JjHjItED-SWwLswbtOOuxWf_H3U'},
                function(data) {
                    $.each( data.items, function( i, item ) {
                        $('#video-rotator-community-college .ws_images ul').append('<li><a href="#"><img data-vid="' + item.snippet.resourceId.videoId + '" src="' + item.snippet.thumbnails.maxres.url + '" alt="' + item.snippet.title + '" /></a></li>');
                    });
        
                    jQuery("#video-rotator-community-college .wowslider-container").wowSlider({effect:"parallax",prev:"",next:"",gestures: false,duration:10*100,delay:100*100,width:960,height:360,autoPlay:true,autoPlayVideo:false,playPause:false,stopOnHover:false,loop:false,bullets:0,caption:false,captionEffect:"parallax",controls:true,responsive:2,fullScreen:false,onBeforeStep:0,images:0});
                }
            );
            
            $('#videos-banner-play-button', $('#video-rotator-community-college').parent()).click(function() {
                $('#section-media-gallery .section-content-container .video-wrapper iframe').attr('src', 'https://www.youtube.com/embed/videoseries?list=PLc2GkMkIIwR8KQBEklUSKApSywZQL8M2o&autoplay=1');
                $('#section-media-gallery .section-content-container .video-wrapper').show();
            });
            
            $('#section-media-gallery .section-content-container .video-wrapper .close-button').click(function() {
                $('#section-media-gallery .section-content-container .video-wrapper').hide();
                $('#section-media-gallery .section-content-container .video-wrapper iframe').attr('src', '#');
            });
        }
    }
    
    $('div[data-id="mobile-locations"] .dd-content ul li').each(function() {
    	switch($(this).html()) {
    		case 'Admission':
    			$(this).html('<a href="/how-to-enroll/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Admissions':
    			$(this).html('<a href="/how-to-enroll/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Advising':
    			$(this).html('<a href="/advising/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Assessment':
    			$(this).html('<a href="/assessment/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Bookstore':
    			$(this).html('<a href="/bookstore/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Financial Aid':
    			$(this).html('<a href="/financial-aid/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Bursar':
    			$(this).html('<a href="/business-office/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Testing Center':
    			$(this).html('<a href="/testing-centers/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Enrollment Center':
    			$(this).html('<a href="/enrollmentcenter/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Registrar':
    			$(this).html('<a href="/registrar/">' + $(this).html() + '</a>');
    			break;
    			
    		case 'Tutoring':
    			$(this).html('<a href="/tutoring/">' + $(this).html() + '</a>');
    			break;
    	}
    });
    
    
    //UTM Tracking Cookies
    var utmObj = window.location.search.split('&');
    var utmSourceVal;
    var utmMediumVal;
    var utmCampaignVal;
    var utmContentVal;
    $.each(utmObj, function(k, v) {
    	if(v.indexOf('utm_source') >= 0) {
    		utmSourceVal = v.split('=')[1];
    		setCookie('utm_source', utmSourceVal, 1);
    	}
    	if(v.indexOf('utm_medium') >= 0) {
    		utmMediumVal = v.split('=')[1];
    		setCookie('utm_medium', utmMediumVal, 1);
    	}
    	if(v.indexOf('utm_campaign') >= 0) {
    		utmCampaignVal = v.split('=')[1];
    		setCookie('utm_campaign', utmCampaignVal, 1);
    	}
    	if(v.indexOf('utm_content') >= 0) {
    		utmContentVal = v.split('=')[1];
    		setCookie('utm_content', utmContentVal, 1);
    	}
    });
    
    $("a.apply-cta").click(function (evt) {
      var utmSource = getCookie('utm_source');
      var utmMedium = getCookie('utm_medium');
      var utmCampaign = getCookie('utm_campaign');
      var utmContent = getCookie('utm_content');
      
      if (typeof utmSource === "string" && utmSource.length > 0) {
        var anchor = evt.currentTarget;
        var newSearch = anchor.search;
        evt.preventDefault();

        if (newSearch.length > 0) {
          newSearch += "&";
        } else {
          newSearch = "?";
        }
        newSearch += ("utm_source=" + encodeURIComponent(utmSource));
        anchor.search = newSearch;
      }
      if (typeof utmMedium === "string" && utmSource.length > 0) {
        var anchor = evt.currentTarget;
        var newSearch = anchor.search;
        evt.preventDefault();

        if (newSearch.length > 0) {
          newSearch += "&";
        } else {
          newSearch = "?";
        }
        newSearch += ("utm_medium=" + encodeURIComponent(utmMedium));
        anchor.search = newSearch;
      }
      if (typeof utmCampaign === "string" && utmSource.length > 0) {
        var anchor = evt.currentTarget;
        var newSearch = anchor.search;
        evt.preventDefault();

        if (newSearch.length > 0) {
          newSearch += "&";
        } else {
          newSearch = "?";
        }
        newSearch += ("utm_campaign=" + encodeURIComponent(utmCampaign));
        anchor.search = newSearch;
      }
      if (typeof utmContent === "string" && utmSource.length > 0) {
        var anchor = evt.currentTarget;
        var newSearch = anchor.search;
        evt.preventDefault();

        if (newSearch.length > 0) {
          newSearch += "&";
        } else {
          newSearch = "?";
        }
        newSearch += ("utm_content=" + encodeURIComponent(utmContent));
        anchor.search = newSearch;
      }
      
      window.location = anchor.href;
    });
    
    $('#footer-year').html('2018');
    
}); //END DOC READY

////GLOBAL FUNCTIONS
function setMainMenu() {
    $('#main-menu-button').toggleClass('active');
    $('#main-menu-button-container').toggleClass('active');
    $('#main-menu-panel').toggle();

    if(w <= 599) {
        if(!$('body').hasClass('elem-fixed')) {
            bodyScrollTop = $('body').scrollTop();
            $('body').css('top', '-' + bodyScrollTop + 'px'); 
            $('body').addClass('elem-fixed');
        } else {
            $('body').removeClass('elem-fixed');
            window.scrollTo(0, bodyScrollTop);
        }
    }

}
function closeMainMenu() {
    $('#main-menu-button').removeClass('active');
    $('#main-menu-button-container').removeClass('active');
    $('#main-menu-panel').hide();
}
            
function closeSubmenus() {
    $('.home-section .section-submenu').each(function() {
        $('.section-content-container .section-submenu-panel', $(this).parent().parent()).hide();
        $('.section-submenu .section-submenu-arrow', $(this).parent()).removeClass('section-submenu-arrow-toggle');
    });
}
function updateWindowDimension() {
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
function panelSizing() {
    
    headerOffset = $('#site-header').outerHeight();
    
    
    //sectionHeaderOffset = $('.home-section-headline').last().height();
    $('.submenu-container').each(function() {
        if($(this).height() >= 10) {
            sectionHeaderOffset = $(this).height();
            return false;
        }
    });
    
    $('.home-section').first().css('margin-top', headerOffset + 'px');
    
    //$('body').append('<br />1: ' + headerOffset + ', ' + sectionHeaderOffset);
    
    if(w <= 599) {
        $('#main-menu-panel').css('height', h - $('#main-menu-panel').css('top').replace('px', '') + 'px');
        $('#main-menu-panel .viewport').css('height', h - $('#main-menu-panel').css('top').replace('px', '') + 'px');
        
        $('#header-search-mobile-panel').css('height', h - headerOffset + 1 + 'px');
        $('#header-search-mobile-panel').css('top', headerOffset - 1 + 'px');
        
        $('#home-landing').css('min-height', h - sectionHeaderOffset - headerOffset + 'px');
        
        $('.section-submenu-panel').each(function() {
            if($(this).parent().outerHeight() < (h - sectionHeaderOffset - headerOffset)) {
                $(this).css('height', $(this).parent().outerHeight() + 'px');
            } else {
                $(this).css('height', h - sectionHeaderOffset - headerOffset + 'px');
            }
        });
        //$('.section-submenu-panel').css('height', h - sectionHeaderOffset - headerOffset + 'px');
        $('.section-submenu-panel .viewport').each(function() {
            $(this).css('height', $(this).closest('.section-submenu-panel').height() + 'px');
        });
    }
    
    if(w >= 600) {
        $('#main-menu-panel .left-nav .scroll-pane .viewport').css('height', h - sectionHeaderOffset - 20 + 'px');
        $('#main-menu-panel .right-nav .scroll-pane .viewport').css('height', h - headerOffset - 110 + 'px');
        $('#main-menu-panel').css('height', h - headerOffset + 'px');
        
        $('.section-submenu-panel .left-nav .scroll-pane .viewport').css('height', h - sectionHeaderOffset - headerOffset - 110 + 'px');
        $('.section-submenu-panel .right-nav .scroll-pane .viewport').css('height', h - sectionHeaderOffset - headerOffset - 140 + 'px');
    
        $('.section-content-container').each(function() {
            if($(this).attr('class').indexOf('auto-height') <= 0) {
                if($(this).parent().attr('class').indexOf('internal') <= 0) {
                    if(!$(this).parent().hasClass('no-submenu')) {
                        $(this).css('min-height', '535px');
                        $(this).css('height', h - sectionHeaderOffset - headerOffset + 'px');
                    } else {
                        $(this).css('min-height', '660px');
                        $(this).css('height', h - headerOffset + 'px');
                    }
                    
                    //$(this).closest('.home-section').css('height', h - headerOffset + 'px');
                }
            }
            //$('.section-content-container').first().css('min-height', h - sectionHeaderOffset - headerOffset + 'px');
            $('.section-content-container .section-submenu-panel').css('height', h - sectionHeaderOffset - headerOffset + 'px');
        });
        
        //$('.section-content-container > #map-canvas').css('height', h - sectionHeaderOffset - headerOffset + 'px');
        //$('.section-content-container > #map-canvas-2').css('height', h - sectionHeaderOffset - headerOffset + 'px');
        
        //$('.section-content-container > #video-rotator').css('height', h - sectionHeaderOffset - headerOffset + 'px');
        $('.section-content-container > #video-rotator .wowslider-container').css('height', h - sectionHeaderOffset - headerOffset + 'px');
        
        $('.section-content-container > .video-wrapper .iframe-wrapper').css('height', h - sectionHeaderOffset - headerOffset - 130 + 'px');
        
        if(w >= 801) {
            $('.programs-panel').css('min-height', '410px');
            $('.programs-panel').css('height', h - sectionHeaderOffset - headerOffset - 160 + 'px');
            $('.programs-panel-image').height('auto');
        }
        
        if(w <= 800) {
            $('.programs-panel-image').height($('#programs-container').height() / 2 - 140 + 'px');
        }
        
        //$('#news-panel').css('height', $('#news-panel').closest('.section-content-container').height() - 100 + 'px');
        //$('#events-panel').css('height', $('#events-panel').closest('.section-content-container').height() - 100 + 'px');
    }
}
function initBreadcrumbs() {
    if(w >= 600) {
        $('.section-breadcrumbs').first().html($('#temp-breadcrumbs').html());
        var breadcrumbWidth = $('.section-breadcrumbs').first().outerWidth();
        var bcContainerWidth = $('.section-breadcrumbs').first().closest('.submenu-container').outerWidth() - 200;
        if(breadcrumbWidth >= bcContainerWidth) {
            if($('.section-breadcrumbs').first().length) {
                var bcSplit = $('.section-breadcrumbs').first().html().split('&nbsp;&gt;&nbsp;');
                if(bcSplit.length >= 3) {
                    $('.section-breadcrumbs').first().html(bcSplit[0] + '&nbsp;&gt;&nbsp;...&nbsp;&gt;&nbsp;' + bcSplit[bcSplit.length - 2] + '&nbsp;&gt;&nbsp;' + bcSplit[bcSplit.length - 1]);
                } else {
                    $('.section-breadcrumbs').first().html($('#temp-breadcrumbs').html());
                }
            }
        }
    }
}
function initFloatNav() {
    if($('#float-nav').length) {
        $('.home-section-headline h1').each(function(e) {
            var $obj = $(this);
            $('span', $obj).remove();
            
            var floatNavTitle = $obj.closest('.home-section-headline').attr('data-float-nav-title');
            var floatNavIcon = $obj.closest('.home-section-headline').attr('data-float-nav-icon');
            
            if(floatNavTitle != undefined && floatNavTitle != '') {
                var floatNavID = floatNavTitle.replace('&', '').replace('<br />', '').replace(/  /g, '-').replace(/ /g, '-').toLowerCase();
                $obj.closest('.home-section').attr('id', 'section-' + floatNavID);
                var floatHide;
                if($obj.closest('.home-section').attr('class').indexOf('mobile-hide') >= 1) {
                    floatHide = 'mobile-hide';
                }
                $('#float-nav #menu-live-chat').before('<li id="menu-' + floatNavID + '" class="menu-nav ' + floatHide + '" title="' + floatNavTitle + '"><div class="float-nav-icon"><img src="' + floatNavIcon + '" /></div><div class="float-nav-caption">' + floatNavTitle + '</div></li>');
            }
        });
    
        $('.menu-nav').click(function() {
            closeMainMenu();
            resetScrollTop = $('#section-' + $(this).attr('id').replace('menu-', ''));
            $('html, body').animate({
              scrollTop: resetScrollTop.offset().top - headerOffset
            }, 1000);
        });
        
        // $('.menu-nav .float-nav-caption').each(function() {
            // $(this).html($(this).html().replace(/ /g, '<br />'));
        // });
    }
}
function responsiveImages() {
    //if(w >= 600) {
        $('.res-img').each(function() {
            $(this).attr('src', $(this).attr('data-desktop-src'));
        });
    //}
    
    /*$('.internal-page-content img').each(function() {
        if($(this).width() >= 1) {
            $(this).css('max-width', $(this).width());
            $(this).css('width', '98%');
            $(this).css('height', 'auto');
        }
    });*/
    
    /*$('.internal-page-content > img, .internal-page-content > p img, .internal-page-content > h2 img, .internal-page-content > h3 img').each(function() {
        if($(this).width() >= 1) {
            $(this).css('max-width', $(this).width());
            $(this).css('width', '98%');
            $(this).css('height', 'auto');
        }
    });*/
}
function responsiveTables() {
    if(w <= 600) {
        $('.responsive-table').each(function(e) {
            if($(this).attr('alt')) {
                var tableTitle = 'Click to View <em>"' + $(this).attr('alt') + '</em>"';
            } else {
                var tableTitle = 'Click to view table';
            }
            
            $(this).wrap('<div class="responsive-table-wrapper"></div>');
            $(this).closest('.responsive-table-wrapper').prepend('<p><a href="#" class="responsive-table-link">' + tableTitle + '</a></p>');
            
            $('.responsive-table-link', $(this).closest('.responsive-table-wrapper')).click(function() {
                var tableWindow = window.open('', '', 'width=800, height=600');
                var htmlHEAD = '';
                $('head link').each(function() { 
                    htmlHEAD = htmlHEAD + $(this)[0].outerHTML;
                });
                
                tableWindow.document.write('<html><he' + 'ad>' + htmlHEAD + '</head><body><div class="internal-page-content">' + $('.responsive-table', $(this).closest('.responsive-table-wrapper'))[0].outerHTML + '</div></body></html>'); 
                return false;
            });
        });
    }
}
function updateMaps() {
    if(w >= 600) {
        if(map) {
            window.clearTimeout(mapCenterTimer);
            mapCenterTimer = setTimeout(function() { map.setCenter(mapCenter); }, 1000);
            
            /*if(h <= 650) {
                map.setZoom(6);
            }
            if(h >= 651 && h <= 999) {
                map.setZoom(7);
            }
            if(h >= 1000) {
                map.setZoom(8);
            }
            if(w >= 769 && w <= 1024) {
                map.setZoom(7);
            }*/
        }
    }
}
function initMenus() {
    //Mega Menu
    $('#main-menu-panel .left-nav .overview > ul > li > a').each(function(e) {
        $(this).attr('id', '' + $(this).attr('id') + (e + 1));
    });
    
    if(w >= 600) {
        $('#main-menu-panel .left-nav .overview > ul > li').each(function(e) {
            if($('a', $(this)).attr('href') == '' || $('a', $(this)).attr('href') == '#' ) {
                $('#main-menu-panel .right-nav .overview').append('<div id="main-menu-subitems-' + (e + 1) + '"></div>');
                $('#main-menu-subitems-' + (e + 1)).append($('.ad-box', $(this)));
                $('#main-menu-subitems-' + (e + 1)).append($('.submenu-subitems', $(this)));
            }
        });
    } else {
        $('#main-menu-panel .left-nav .overview > ul > li').each(function(e) {
            if($('a', $(this)).attr('href') == '' || $('a', $(this)).attr('href') == '#' ) {
                $(this).append('<div id="main-menu-subitems-' + (e + 1) + '"></div>');
                $('#main-menu-subitems-' + (e + 1)).append($('.submenu-subitems', $(this)));
            }
        });
    }
    
    
    //Submenus
    $('.section-submenu-panel').each(function(j) {
        $('.left-nav .overview > ul > li > a', $(this)).each(function(e) {
            $(this).attr('class', '' + $(this).attr('class') + (e + 1));
        });
    });
    
    if(w >= 600) {
        $('.section-submenu-panel').each(function(j) {
            var thisRef = $(this);
            $('.left-nav .overview > ul > li', $(this)).each(function(e) {
                $('.right-nav .overview', thisRef).prepend('<div class="submenu-subitems-' + (e + 1) + '"></div>');
                if($('a', $(this)).attr('href') == '' || $('a', $(this)).attr('href') == '#' ) {
                    $(this).attr('class', 'menu-item-flyout');
                    $('.submenu-subitems-' + (e + 1), thisRef).append($('.submenu-subitems', $(this)));
                    $('.submenu-subitems-' + (e + 1), thisRef).append($('.submenu-subitems-w50', $(this)));
                    $('.submenu-subitems-' + (e + 1), thisRef).append($('.submenu-panel', $(this)));
                }
                $('.submenu-subitems-' + (e + 1), thisRef).append($('.ad-box', $(this)));
            });
        });
    } else {
        $('.section-submenu-panel').each(function(j) {
            var thisRef = $(this);
            $('.left-nav .overview > ul > li', $(this)).each(function(e) {
                if($('a', $(this)).attr('href') == '' || $('a', $(this)).attr('href') == '#' ) {
                    $(this).attr('class', 'menu-item-flyout');
                    $(this).append('<div class="submenu-subitems-' + (e + 1) + '"></div>');
                    //$('.submenu-subitems-' + (e + 1), thisRef).append($('.ad-box', $(this)));
                    $('.submenu-subitems-' + (e + 1), thisRef).append($('.submenu-subitems', $(this)));
                    $('.submenu-subitems-' + (e + 1), thisRef).append($('.submenu-panel', $(this)));
                }
            });
        });
    }
    
    $('.section-submenu-panel .overview ul li a').each(function() {
        if($(this).attr('href').indexOf('http') >= 0 || $(this).attr('href').indexOf('/files') >= 0) {
            $(this).attr('target', '_blank');
        }
    });
}
function initScrollBars() {
    $('.scroll-pane').tinyscrollbar({ wheelSpeed: 20 });
}
function updateScrollBars() {
    $('.right-nav .scroll-pane').each(function() {
        $(this).data("plugin_tinyscrollbar").update();
    });
    $('.left-nav .scroll-pane').each(function() {
        var contentPosition = $(this).data("plugin_tinyscrollbar").contentPosition;
        $(this).data("plugin_tinyscrollbar").update(contentPosition );
        //$(this).data("plugin_tinyscrollbar").contentPosition = contentPosition;
    });
    if(w <= 599) {
        $('.mobile-nav .scroll-pane').each(function() {
            $(this).data("plugin_tinyscrollbar").update();
        });
    }
    $('.panel-content-container .scroll-pane').each(function() {
        $(this).data("plugin_tinyscrollbar").update();
    });
}
function initChatPop() {
    if(w >= 600) {
        $('#chatInvite .nothanks').click(function() {
            $('#chatInvite').hide();
            document.cookie="ivytechchatpopup=1; path=/";
            return false;
        });
        $('#chatInvite .chatnow').click(function() {
            $('#chatInvite').hide();
            window.open('https://chat.edusupportcenter.com/chat/websiteChat?short_name=ivytech&key=ivytech1898', 'Live Chat', 'height=700, width=600');
            return false;
        });
        
        if(getCookie('ivytechchatpopup') != '1') {
            var chatPopTimer;
            window.clearTimeout(chatPopTimer);
            chatPopTimer = setTimeout(function() {
                $('#chatInvite').show();
            }, 150000);
        }
    }
}
function initExpandableLists() {
    $('ol > li > a').click(function(e) {
        if($(this).attr('href') == 'http://') {
            if($('a + ol', $(this).parent()).length) {
                $('a + ol', $(this).parent()).toggle();
                return false;
            }
            if($('a + ul', $(this).parent()).length) {
                $('a + ul', $(this).parent()).toggle();
                return false;
            }
        }
    });
    /*$('ol li').each(function(e) {
        $('> a', $(this)).click(function() {
            if($('a + ol', $(this).parent()).length) {
                $('a + ol', $(this).parent()).toggle();
                return false;
            }
            if($('a + ul', $(this).parent()).length) {
                $('a + ul', $(this).parent()).toggle();
                return false;
            }
        });    
    });*/
}
function initFitText() {
    //$('body').append('FitText Load');
    if($('#home-banner-message').length) {
        $('#home-banner-message').fitText(1, { minFontSize: '50px', maxFontSize: '130px' });
    }
    if($('#home-banner-submessage').length) {
        $('#home-banner-submessage').fitText(1, { minFontSize: '10px', maxFontSize: '28px' });
    }
    if($('.home-section-headline h1').length) {
        $('.home-section-headline h1').fitText(2, { minFontSize: '30px', maxFontSize: '58px' });
    }
}
function initMisc() {
    $('#results-iframe').load(function(){
        $('html,body').animate({scrollTop:0},0);
    });
    if($('img[usemap]').length) {
        $('img[usemap]').rwdImageMaps();
    }
    /*$('.internal-page-content a').each(function() {
        if($(this).attr('href')) {
            if($(this).attr('href').indexOf('gainfulemployment/') >= 0) {
                $(this).attr('href', '/ivytech' + $(this).attr('href'));
            }
        }
    });*/
    
    if($('#sc_table').length) {
        $('#sc_table').addClass('no-style');
    }
    
    if($('#table_info').length) {
        $('#table_info').addClass('no-style');
    }
    //YouTube z-index issue fix
    $('iframe[src*="youtube.com"]').each(function() {
        var vidSRC = $(this).attr('src');
        if(vidSRC.indexOf('?') <= 0) {
            $(this).attr('src', $(this).attr('src') + '?wmode=opaque');
        } else {
            $(this).attr('src', $(this).attr('src') + '&wmode=opaque');
        }
    });
    
}
function setCookie(cname, cvalue, exdays) {
    console.log('set');
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ';domain=.ivytech.edu;path=/';
    
}
    
function getCookie(cname) {
    console.log('get');
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function trimNewsEvents() {
    var maxHeight = -1;
    $('#section-events .rssRow').each(function() {
        if ($(this).height() > maxHeight)
            maxHeight = $(this).height();
    });
    $('#section-events .rssRow').each(function() {
        $(this).height(maxHeight);
    });
    if($('#section-events').length != 0 && w >= 600) {
        var timeout3 = 0;
    
        if(allEventsOnlyItems == '') {
            allEventsOnlyItems = $('#events-only-panel').html();
        }
        
        $('#events-only-panel').html(allEventsOnlyItems);
        
        var eventsOnlyPanelHeight = $('#events-only-panel').outerHeight();
        
        var eventsContainerHeight = $('#section-events .section-content-container').outerHeight();
        
        while(eventsOnlyPanelHeight > eventsContainerHeight - 100 && timeout3 <= 20) {
            $('#events-only-panel .rssFeed li').last().remove();
            eventsOnlyPanelHeight = $('#events-only-panel').outerHeight();
            timeout3++;
        }
    }
    
    if($('#section-news-events').length != 0 && w >= 600) {
        var timeout1 = 0;
        var timeout2 = 0;
        //var timeoutTimer;
        //window.clearTimeout(timeoutTimer);
    
        if(allNewsItems == '' && allEventsItems == '') {
            allNewsItems = $('#news-panel').html();
            allEventsItems = $('#events-panel').html();
        }
        
        $('#news-panel').html(allNewsItems);
        $('#events-panel').html(allEventsItems);
        
        var eventsPanelHeight = $('#events-panel').outerHeight();
        var newsPanelHeight = $('#news-panel').outerHeight();
        
        var newsEventsContainerHeight = $('#section-news-events .section-content-container').outerHeight();
        
        //timeoutTimer = setTimeout(function() {
            while(newsPanelHeight > newsEventsContainerHeight - 100 && timeout1 <= 20) {
                $('#news-panel .rssFeed li').last().remove();
                newsPanelHeight = $('#news-panel').outerHeight();
                timeout1++;
                //if(timeout1 == 20) { alert('timeout1'); }
            }
            while(eventsPanelHeight > newsEventsContainerHeight - 100 && timeout2 <= 20) {
                $('#events-panel  .rssFeed li').last().remove();
                eventsPanelHeight = $('#events-panel').outerHeight();
                timeout2++;
                //if(timeout2 == 20) { alert('timeout2'); }
            }
        //}, 2000);
    }
}
function homeSectionOffsetArray() {
    $('.home-section').each(function(index) {
        if($(this).css('display') != 'none') {
            homeSectionArray[index] = Math.round($(this).offset().top) - headerOffset;
        }
    });
}
function updateProgramPanels() {
    $('.programs-panel').each(function() {
        $(this).show();
    });
    $('.programs-panel').parent().each(function() {
        $(this).show();
    });
    $('.programs-panel-content-container').each(function() {
        $(this).hide();
    });
}
function resizeContentImages() {
    if(w >= 600) {
        $('.internal-page-content > p img, .internal-page-content > img').each(function() {
            var theImage = new Image();
            theImage.src = $(this).attr("src");
            
            if($(this).closest('.internal-page-content').width() >= 320) {
                if(theImage.width >= $(this).closest('.internal-page-content').width()) {
                    $(this).css('width', '96%');
                } else {
                    $(this).css('width', 'auto');
                }
            }
        });
    }
}
function getRSSFeed(strURL, objTarget, strLimit) {
	YUI().use('yql', function(Y) {
		var query = 'select * from rss(0,' + strLimit + ') where url = "' + strURL + '"';
		
		var q = Y.YQL(query, function(r) {
			console.log(111);
			var feedWrapperMarkup = ['<ul>', '</ul>'];
			var feedmarkup = '';
			var feed = r.query.results.item;
			
			for (var i = 0; i < feed.length; i++) {
				feedmarkup += '<li><h4><a href="' + feed[i].link + '">';
				feedmarkup += feed[i].title + '</a></h4>';
				feedmarkup += feed[i].description + '</li>';
			}

			objTarget.html(feedWrapperMarkup[0] + feedmarkup + feedWrapperMarkup[1]);
			
			trimNewsEvents();
		})
	})
}
	
// -----------------------------------------------------------------------------------
// http://wowslider.com/
// JavaScript Wow Slider is a free software that helps you easily generate delicious 
// slideshows with gorgeous transition effects, in a few clicks without writing a single line of code.
// Generated by WOW Slider 6.3
//
//***********************************************
// Obfuscated by Javascript Obfuscator
// http://javascript-source.com
//***********************************************
function ws_parallax(k,g,a){var c=jQuery;var f=c(this);var b=k.parallax||0.25;var e=c("<div>").css({position:"absolute",top:0,left:0,width:"100%",height:"100%",overflow:"hidden"}).addClass("ws_effect").appendTo(a.parent());function j(l){return Math.round(l*1000)/1000}function d(n,o,p){var l=new Date()*1;var m=function(){var q=(new Date()*1-l)/o;if(q>=1){n(1);cancelAnimationFrame(m);if(p){p()}}else{n(q);requestAnimationFrame(m)}};m()}var i=c("<div>").css({position:"absolute",left:0,top:0,overflow:"hidden",width:"100%",height:"100%",transform:"translate3d(0,0,0)"}).append(c("<img>").css({position:"absolute",transform:"translate3d(0,0,0)"})).appendTo(e);var h=i.clone().appendTo(e);this.go=function(l,r,p){var s=c(g.get(n));s={width:s.width(),height:s.height(),marginTop:s.css("marginTop"),marginLeft:s.css("marginLeft")};p=p?1:-1;var n=i.find("img").attr("src",g.get(r).src).css(s);var o=h.find("img").attr("src",g.get(l).src).css(s);var m=a.width()||k.width;var q=a.height()||k.height;d(function(v){v=c.easing.swing(v);var x=j(p*v*m),u=j(p*(-m+v*m)),t=j(-p*m*b*v),w=j(p*m*b*(1-v));if(k.support.transform){i.css("transform","translate3d("+x+"px,0,0)");n.css("transform","translate3d("+t+"px,0,0)");h.css("transform","translate3d("+u+"px,0,0)");o.css("transform","translate3d("+w+"px,0,0)")}else{i.css("left",x);n.css("left",t);h.css("left",u);o.css("left",w)}},k.duration,function(){e.hide();f.trigger("effectEnd")})}};
function ws_fade(c,a,b){var e=jQuery,g=e(this),d=e(".ws_list",b),h={position:"absolute",left:0,top:0,width:"100%",height:"100%",transform:"translate3d(0,0,0)"},f=e("<div>").addClass("ws_effect").css(h).css("overflow","hidden").appendTo(b.parent());this.go=function(i,j){var k=e(a.get(i)),m={width:k.width(),height:k.height()};k=k.clone().css(h).css(m).hide().appendTo(f);if(!c.noCross){var l=e(a.get(j)).clone().css(h).css(m).appendTo(f);l.fadeOut(c.duration,function(){l.remove()})}k.fadeIn(c.duration,function(){g.trigger("effectEnd");k.remove()})}};
 