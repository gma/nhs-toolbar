// ==UserScript==
// @name           NHS Toolbar
// @namespace      dharmafly.com
// @include        http://news.bbc.co.uk/*
// ==/UserScript==

(function(){
    var
        url = 'http://dharmafly.com/nhs-toolbar/nhs-widget.js',
        window = unsafeWindow,
        document = window.document,
        script = document.createElement('script');
        
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);    
    document.getElementsByTagName('head')[0].appendChild(script);
}());
