var settings = {
  apiUrl: 'http://localhost:9393/api'
};

var app = {
  setupAjaxCallbacks: function() {
    $('#ajax-status').ajaxStart(function() {
      $(this).text("Loading...").show();
    });
    $('#ajax-status').ajaxStop(function() {
      $(this).fadeOut();
    });
    $('body').ajaxError(function (event, request, ajaxOptions, exception) {
      console.log("XHR Response: " + JSON.stringify(request));
    });
  },
  
  getKeywords: function() {
    var
      keywords = {},
      keywordList = [];
    
    $('p, :header').each(function() {
      var text = $.trim($(this).text());
      $.each(text.split(/[\s\n\r\t]+/), function(i, keyword) {
        keywords[keyword] = 1;
      });
    });
    
    $.each(keywords, function(keyword){
      keywordList.push(keyword);
    });
    
    return keywordList;
  },
  
  searchForDataSets: function(keywordList) {
    var url = settings.apiUrl + '/search?q=' + keywordList.join(',') + '&callback=?';
    $.getJSON(url, function(dataSets) {
      if (dataSets.length) {
        $('<div/>', { id: 'nhs-injection-button' })
          .append('<a/>').find('a')
            .attr({ href: '#' })
            .text('Show related data')
          .end()
          .fadeIn()
          .appendTo('body');
      }
    });
  }
  
};

$(document).ready(function() {
  console.log('woohoo');
  
  app.setupAjaxCallbacks();
  app.searchForDataSets(app.getKeywords());
});
