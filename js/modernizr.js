//OLD BROWSER DIV
$(document).ready(function() {
    $('#site-header').after('<div id="outdated" class="row" style="display: none;"><h6>Your Web Browser Is Out of Date</h6><p>You are accessing the website from an unsupported or outdated browser. Please update your web browser to gain full functionality of this website.</p><p>More information about updating can be found here: <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/" target="_blank">Updating My Browser</a></p><p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p></div>');

    //Old Browser Check
    outdatedBrowser({
        bgColor: '#f25648',
        color: '#ffffff',
        lowerThan: 'transform',
        languagePath: ''
    });
});


/*!--------------------------------------------------------------------
JAVASCRIPT "Outdated Browser"
Version:    1.1.2 - 2015
author:     Burocratik
website:    http://www.burocratik.com
* @preserve
-----------------------------------------------------------------------*/
var outdatedBrowser=function(t){
    function o(t){
        s.style.opacity=t/100,s.style.filter="alpha(opacity="+t+")"}function e(t){o(t),1==t&&(s.style.display="block"),100==t&&(u=!0)}function r(){var t=document.getElementById("btnCloseUpdateBrowser"),o=document.getElementById("btnUpdateBrowser");s.style.backgroundColor=bkgColor,s.style.color=txtColor,s.children[0].style.color=txtColor,s.children[1].style.color=txtColor,o.style.color=txtColor,o.style.borderColor&&(o.style.borderColor=txtColor),t.style.color=txtColor,t.onmousedown=function(){return s.style.display="none",!1},o.onmouseover=function(){this.style.color=bkgColor,this.style.backgroundColor=txtColor},o.onmouseout=function(){this.style.color=txtColor,this.style.backgroundColor=bkgColor}}function l(){var t=!1;if(window.XMLHttpRequest)t=new XMLHttpRequest;else if(window.ActiveXObject)try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(o){try{t=new ActiveXObject("Microsoft.XMLHTTP")}catch(o){t=!1}}return t}function a(t){var o=l();return o&&(o.onreadystatechange=function(){n(o)},o.open("GET",t,!0),o.send(null)),!1}function n(t){var o=document.getElementById("outdated");return 4==t.readyState&&(o.innerHTML=200==t.status||304==t.status?t.responseText:d,r()),!1}var s=document.getElementById("outdated");this.defaultOpts={bgColor:"#f25648",color:"#ffffff",lowerThan:"transform",languagePath:"../outdatedbrowser/lang/en.html"},t?("IE8"==t.lowerThan||"borderSpacing"==t.lowerThan?t.lowerThan="borderSpacing":"IE9"==t.lowerThan||"boxShadow"==t.lowerThan?t.lowerThan="boxShadow":"IE10"==t.lowerThan||"transform"==t.lowerThan||""==t.lowerThan||"undefined"==typeof t.lowerThan?t.lowerThan="transform":("IE11"==t.lowerThan||"borderImage"==t.lowerThan)&&(t.lowerThan="borderImage"),this.defaultOpts.bgColor=t.bgColor,this.defaultOpts.color=t.color,this.defaultOpts.lowerThan=t.lowerThan,this.defaultOpts.languagePath=t.languagePath,bkgColor=this.defaultOpts.bgColor,txtColor=this.defaultOpts.color,cssProp=this.defaultOpts.lowerThan,languagePath=this.defaultOpts.languagePath):(bkgColor=this.defaultOpts.bgColor,txtColor=this.defaultOpts.color,cssProp=this.defaultOpts.lowerThan,languagePath=this.defaultOpts.languagePath);var u=!0,i=function(){var t=document.createElement("div"),o="Khtml Ms O Moz Webkit".split(" "),e=o.length;return function(r){if(r in t.style)return!0;for(r=r.replace(/^[a-z]/,function(t){return t.toUpperCase()});e--;)if(o[e]+r in t.style)return!0;return!1}}();if(!i(""+cssProp)){if(u&&"1"!==s.style.opacity){u=!1;for(var c=1;100>=c;c++)setTimeout(function(t){return function(){e(t)}}(c),8*c)}" "===languagePath||0==languagePath.length?r():a(languagePath);var d='<h6>Your browser is out-of-date!</h6><p>Update your browser to view this website correctly. <a id="btnUpdateBrowser" target="_blank" href="http://outdatedbrowser.com/">Update my browser now </a></p><p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p>';
    }
};


/* MediaMatch v.2.0.2 - Testing css media queries in Javascript. Authors & copyright (c) 2013: WebLinc, David Knight. */
window.matchMedia || (window.matchMedia = function (win) {
    'use strict';
    // Internal globals
    var _doc        = win.document,
        _viewport   = _doc.documentElement,
        _queries    = [],
        _queryID    = 0,
        _type       = '',
        _features   = {},
                    // only screen
                    // only screen and
                    // not screen
                    // not screen and
                    // screen
                    // screen and
        _typeExpr   = /\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i,
                    // (-vendor-min-width: 300px)
                    // (min-width: 300px)
                    // (width: 300px)
                    // (width)
                    // (orientation: portrait|landscape)
        _mediaExpr  = /^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/,
        _timer      = 0,
        // Helper methods
        /*
            _matches
         */
        _matches = function (media) {
            // screen and (min-width: 400px), screen and (max-width: 500px)
            var mql         = (media.indexOf(',') !== -1 && media.split(',')) || [media],
                mqIndex     = mql.length - 1,
                mqLength    = mqIndex,
                mq          = null,
                // not screen, screen
                negateType      = null,
                negateTypeFound = '',
                negateTypeIndex = 0,
                negate          = false,
                type            = '',
                // (min-width: 400px), (min-width)
                exprListStr = '',
                exprList    = null,
                exprIndex   = 0,
                exprLength  = 0,
                expr        = null,
                prefix      = '',
                length      = '',
                unit        = '',
                value       = '',
                feature     = '',
                match       = false;
            if (media === '') {
                return true;
            }
            do {
                mq          = mql[mqLength - mqIndex];
                negate      = false;
                negateType  = mq.match(_typeExpr);
                if (negateType) {
                    negateTypeFound = negateType[0];
                    negateTypeIndex = negateType.index;
                }
                if (!negateType || ((mq.substring(0, negateTypeIndex).indexOf('(') === -1) && (negateTypeIndex || (!negateType[3] && negateTypeFound !== negateType.input)))) {
                    match = false;
                    continue;
                }
                exprListStr = mq;
                negate = negateType[1] === 'not';
                if (!negateTypeIndex) {
                    type        =  negateType[2];
                    exprListStr = mq.substring(negateTypeFound.length);
                }
                // Test media type
                // Test type against this device or if 'all' or empty ''
                match       = type === _type || type === 'all' || type === '';
                exprList    = (exprListStr.indexOf(' and ') !== -1 && exprListStr.split(' and ')) || [exprListStr];
                exprIndex   = exprList.length - 1;
                exprLength  = exprIndex;
                if (match && exprIndex >= 0 && exprListStr !== '') {
                    do {
                        expr = exprList[exprIndex].match(_mediaExpr);
                        if (!expr || !_features[expr[3]]) {
                            match = false;
                            break;
                        }
                        prefix  = expr[2];
                        length  = expr[5];
                        value   = length;
                        unit    = expr[7];
                        feature = _features[expr[3]];
                        // Convert unit types
                        if (unit) {
                            if (unit === 'px') {
                                // If unit is px
                                value = Number(length);
                            } else if (unit === 'em' || unit === 'rem') {
                                // Convert relative length unit to pixels
                                // Assumed base font size is 16px
                                value = 16 * length;
                            } else if (expr[8]) {
                                // Convert aspect ratio to decimal
                                value = (length / expr[8]).toFixed(2);
                            } else if (unit === 'dppx') {
                                // Convert resolution dppx unit to pixels
                                value = length * 96;
                            } else if (unit === 'dpcm') {
                                // Convert resolution dpcm unit to pixels
                                value = length * 0.3937;
                            } else {
                                // default
                                value = Number(length);
                            }
                        }
                        // Test for prefix min or max
                        // Test value against feature
                        if (prefix === 'min-' && value) {
                            match = feature >= value;
                        } else if (prefix === 'max-' && value) {
                            match = feature <= value;
                        } else if (value) {
                            match = feature === value;
                        } else {
                            match = !!feature;
                        }
                        // If 'match' is false, break loop
                        // Continue main loop through query list
                        if (!match) {
                            break;
                        }
                    } while (exprIndex--);
                }
                // If match is true, break loop
                // Once matched, no need to check other queries
                if (match) {
                    break;
                }
            } while (mqIndex--);
            return negate ? !match : match;
        },
        /*
            _setFeature
         */
        _setFeature = function () {
            // Sets properties of '_features' that change on resize and/or orientation.
            var w   = win.innerWidth || _viewport.clientWidth,
                h   = win.innerHeight || _viewport.clientHeight,
                dw  = win.screen.width,
                dh  = win.screen.height,
                c   = win.screen.colorDepth,
                x   = win.devicePixelRatio;
            _features.width                     = w;
            _features.height                    = h;
            _features['aspect-ratio']           = (w / h).toFixed(2);
            _features['device-width']           = dw;
            _features['device-height']          = dh;
            _features['device-aspect-ratio']    = (dw / dh).toFixed(2);
            _features.color                     = c;
            _features['color-index']            = Math.pow(2, c);
            _features.orientation               = (h >= w ? 'portrait' : 'landscape');
            _features.resolution                = (x && x * 96) || win.screen.deviceXDPI || 96;
            _features['device-pixel-ratio']     = x || 1;
        },
        /*
            _watch
         */
        _watch = function () {
            clearTimeout(_timer);
            _timer = setTimeout(function () {
                var query   = null,
                    qIndex  = _queryID - 1,
                    qLength = qIndex,
                    match   = false;
                if (qIndex >= 0) {
                    _setFeature();
                    do {
                        query = _queries[qLength - qIndex];
                        if (query) {
                            match = _matches(query.mql.media);
                            if ((match && !query.mql.matches) || (!match && query.mql.matches)) {
                                query.mql.matches = match;
                                if (query.listeners) {
                                    for (var i = 0, il = query.listeners.length; i < il; i++) {
                                        if (query.listeners[i]) {
                                            query.listeners[i].call(win, query.mql);
                                        }
                                    }
                                }
                            }
                        }
                    } while(qIndex--);
                }
                
            }, 10);
        },
        /*
            _init
         */
        _init = function () {
            var head        = _doc.getElementsByTagName('head')[0],
                style       = _doc.createElement('style'),
                info        = null,
                typeList    = ['screen', 'print', 'speech', 'projection', 'handheld', 'tv', 'braille', 'embossed', 'tty'],
                typeIndex   = 0,
                typeLength  = typeList.length,
                cssText     = '#mediamatchjs { position: relative; z-index: 0; }',
                eventPrefix = '',
                addEvent    = win.addEventListener || (eventPrefix = 'on') && win.attachEvent;
            style.type  = 'text/css';
            style.id    = 'mediamatchjs';
            head.appendChild(style);
            // Must be placed after style is inserted into the DOM for IE
            info = (win.getComputedStyle && win.getComputedStyle(style)) || style.currentStyle;
            // Create media blocks to test for media type
            for ( ; typeIndex < typeLength; typeIndex++) {
                cssText += '@media ' + typeList[typeIndex] + ' { #mediamatchjs { position: relative; z-index: ' + typeIndex + ' } }';
            }
            // Add rules to style element
            if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
            } else {
                style.textContent = cssText;
            }
            // Get media type
            _type = typeList[(info.zIndex * 1) || 0];
            head.removeChild(style);
            _setFeature();
            // Set up listeners
            addEvent(eventPrefix + 'resize', _watch);
            addEvent(eventPrefix + 'orientationchange', _watch);
        };
    _init();
    /*
        A list of parsed media queries, ex. screen and (max-width: 400px), screen and (max-width: 800px)
    */
    return function (media) {
        var id  = _queryID,
            mql = {
                matches         : false,
                media           : media,
                addListener     : function addListener(listener) {
                    _queries[id].listeners || (_queries[id].listeners = []);
                    listener && _queries[id].listeners.push(listener);
                },
                removeListener  : function removeListener(listener) {
                    var query   = _queries[id],
                        i       = 0,
                        il      = 0;
                    if (!query) {
                        return;
                    }
                    il = query.listeners.length;
                    for ( ; i < il; i++) {
                        if (query.listeners[i] === listener) {
                            query.listeners.splice(i, 1);
                        }
                    }
                }
            };
        if (media === '') {
            mql.matches = true;
            return mql;
        }
        mql.matches = _matches(media);
        _queryID = _queries.push({
            mql         : mql,
            listeners   : null
        });
        return mql;
    };
}(window));


/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-setclasses-shiv !*/
!function(e,n,t){function a(e,n){return typeof e===n}function o(){var e,n,t,o,r,c,l;for(var f in s)if(s.hasOwnProperty(f)){if(e=[],n=s[f],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=a(n.fn,"function")?n.fn():n.fn,r=0;r<e.length;r++)c=e[r],l=c.split("."),1===l.length?Modernizr[l[0]]=o:(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=o),i.push((o?"":"no-")+l.join("-"))}}function r(e){var n=l.className,t=Modernizr._config.classPrefix||"";if(f&&(n=n.baseVal),Modernizr._config.enableJSClass){var a=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(a,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),f?l.className.baseVal=n:l.className=n)}var i=[],s=[],c={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){s.push({name:e,fn:n,options:t})},addAsyncTest:function(e){s.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=c,Modernizr=new Modernizr;var l=n.documentElement,f="svg"===l.nodeName.toLowerCase();f||!function(e,n){function t(e,n){var t=e.createElement("p"),a=e.getElementsByTagName("head")[0]||e.documentElement;return t.innerHTML="x<style>"+n+"</style>",a.insertBefore(t.lastChild,a.firstChild)}function a(){var e=E.elements;return"string"==typeof e?e.split(" "):e}function o(e,n){var t=E.elements;"string"!=typeof t&&(t=t.join(" ")),"string"!=typeof e&&(e=e.join(" ")),E.elements=t+" "+e,l(n)}function r(e){var n=y[e[g]];return n||(n={},v++,e[g]=v,y[v]=n),n}function i(e,t,a){if(t||(t=n),u)return t.createElement(e);a||(a=r(t));var o;return o=a.cache[e]?a.cache[e].cloneNode():p.test(e)?(a.cache[e]=a.createElem(e)).cloneNode():a.createElem(e),!o.canHaveChildren||h.test(e)||o.tagUrn?o:a.frag.appendChild(o)}function s(e,t){if(e||(e=n),u)return e.createDocumentFragment();t=t||r(e);for(var o=t.frag.cloneNode(),i=0,s=a(),c=s.length;c>i;i++)o.createElement(s[i]);return o}function c(e,n){n.cache||(n.cache={},n.createElem=e.createElement,n.createFrag=e.createDocumentFragment,n.frag=n.createFrag()),e.createElement=function(t){return E.shivMethods?i(t,e,n):n.createElem(t)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+a().join().replace(/[\w\-:]+/g,function(e){return n.createElem(e),n.frag.createElement(e),'c("'+e+'")'})+");return n}")(E,n.frag)}function l(e){e||(e=n);var a=r(e);return!E.shivCSS||f||a.hasCSS||(a.hasCSS=!!t(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),u||c(e,a),e}var f,u,d="3.7.3",m=e.html5||{},h=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g="_html5shiv",v=0,y={};!function(){try{var e=n.createElement("a");e.innerHTML="<xyz></xyz>",f="hidden"in e,u=1==e.childNodes.length||function(){n.createElement("a");var e=n.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(t){f=!0,u=!0}}();var E={elements:m.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",version:d,shivCSS:m.shivCSS!==!1,supportsUnknownElements:u,shivMethods:m.shivMethods!==!1,type:"default",shivDocument:l,createElement:i,createDocumentFragment:s,addElements:o};e.html5=E,l(n),"object"==typeof module&&module.exports&&(module.exports=E)}("undefined"!=typeof e?e:this,n),o(),r(i),delete c.addTest,delete c.addAsyncTest;for(var u=0;u<Modernizr._q.length;u++)Modernizr._q[u]();e.Modernizr=Modernizr}(window,document); 
 