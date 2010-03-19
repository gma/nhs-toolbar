// ==UserScript==
// @name           DATAGOV
// @namespace      http://www.techbelly.com
// @description    Insert data.gov datasets into BBC news website
// @include        http://news.bbc.co.uk/*
// ==/UserScript==

var myframe = document.createElement("iframe");
myframe.id = "datagov";
myframe.setAttribute("style", "padding : 0; border:0; height:500px");
myframe.setAttribute("target", "_blank");
myframe.setAttribute("src","http://localhost:4567/links_for?url="+encodeURI(window.location.href));
myframe.setAttribute("scrolling","no");

var sidebar = document.getElementsByClassName("storyextra");
if (sidebar.length >= 1) {
	var seealso = document.getElementsByClassName("seeAlsoH")[0];
	sidebar[0].insertBefore(myframe,seealso);
}