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
            .text('Show related data')
            .click(function() { app.chooseDataSet(dataSets); })
          .end()
          .fadeIn()
          .appendTo('body');
      }
    });
  },
  
  chooseDataSet: function(dataSets) {
    $('<div/>', { id: 'nhs-injection-presenter' }).appendTo('body');
    var presenter = $('#nhs-injection-presenter');
    presenter
      .css({ left: $(window).width() / 2 - presenter.width() / 2 })
      .fadeIn();
    // When we get more data sets, let's show a chooser...
    showDataSet(dataSets[0]);
  },
  
  showDataSet: function(dataSet) {
    
  }  
};

$(document).ready(function() {
  app.setupAjaxCallbacks();
  app.searchForDataSets(app.getKeywords());
});
