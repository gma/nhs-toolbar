(function(){

var 
    console = window.console || {log:function(){}},
    _ = console.log,
    
    documentReady = (function(){
	    // onDocumentReady abstraction
	    // adapted from jQuery 1.4
	
	    var doc = document,
		    docEl = doc.documentElement,
		    addEventListener = doc.addEventListener,
		    attachEvent = doc.attachEvent,
		    readyFns = [],
		    ready,
		    bound,
		    dcl = 'DOMContentLoaded',
		    orsc = 'onreadystatechange',
		    atTopLevel;
		
	    function onReady(fn) {
		
		    readyFns.push(fn);
		
		    if ( ready ) { return fn(); }
		    if ( bound ) { return; }
		
		    bound = true;
		
		    if ( addEventListener ) {
			    doc.addEventListener(dcl, DOMContentLoaded, false);
			    window.addEventListener('load', fireReady, false); // fallback to window.onload
		    } else {
			    if ( attachEvent ) {
				
				    // IE Event model
				
				    doc.attachEvent(orsc, DOMContentLoaded);
				    window.attachEvent('onload', fireReady); // fallback to window.onload
				
				    try {
					    atTopLevel = !window.frameElement;
				    } catch(e) {}
				
				    if ( docEl.doScroll && atTopLevel ) {
					    scrollCheck();
				    }
				
			    }
		    }
		
	    }
	
	    function scrollCheck() {
		
		    if (ready) { return; }
		
		    try {
			    // http://javascript.nwbox.com/IEContentLoaded/
			    docEl.doScroll("left");
		    } catch(e) {
			    setTimeout(scrollCheck, 1);
			    return;
		    }
		
		    // DOM ready
		    fireReady();
		
	    }
	
	    function fireReady() {
		
		    if (ready) { return; }
		    ready = true;
		
		    for (var i = 0, l = readyFns.length; i < l; i++) {
			    readyFns[i]();
		    }
		
	    }
	
	    function DOMContentLoaded() {
		
		    if ( addEventListener ) {
			    doc.removeEventListener(dcl, DOMContentLoaded, false);
			    fireReady();
		    } else {
			    if ( attachEvent && doc.readyState === 'complete' ) {
				    doc.detachEvent(orsc, DOMContentLoaded);
				    fireReady();
			    }
		    }
		
	    }
	
	    return onReady;
	
    }());


function getScript(src, callback){
    var
        head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
        
    script.src = src;
    script.addEventListener('load', callback, true);
    head.appendChild(script);
}

function getScripts(srcs, callback, inOrder) {				
	var length = srcs.length,
		loaded = 0;
	
	if (inOrder) {
		// Recursive, each callback re-calls getScripts
		// with a shifted array.
		getScript(srcs.shift(), function() {
			if (length === 1) {
				callback();
			} else {
				getScripts(srcs, callback);
			}
		});
	} else {
		// Plain old loop
		// Doesn't call callback until all scripts have loaded.
		for (var i = 0; i < length; ++i) {
			getScript(srcs[i], function(){
				if (++loaded === length) {
					callback();
				}
			});
		}
	}	
}

function addStylesheet(src){
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = '@import url(' + src + ')';
    document.getElementsByTagName('head')[0].appendChild(style);
}


documentReady(function(){
    addStylesheet('http://grahamashton.name/css/playground.css');
    addStylesheet('http://dharmafly.com/nhs-toolbar/nhs-widget.css');

    getScripts(
        [
            'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
            'http://grahamashton.name/javascripts/json2.min.js',
            'http://grahamashton.name/javascripts/highcharts.js',
            'http://grahamashton.name/javascripts/application.js'
        ],
        function(){        
            $('body')
                //.append('<div id="nhs-inject"><h1><a class="nhs" href="http://www.nhs.uk">NHS</a></h1></div>');
                .append('<div id="nhs-inject"></div>');
        },
        true
    );
});

}());
