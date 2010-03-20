var nhsInject = (function(){

var settings = {
  apiUrl: 'http://grahamashton.name/api'
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
    app.showDataSet(dataSets[0]);
  },
  
  showDataSet: function(dataSet) {
    var chart = new Highcharts.Chart({
       chart: {
          renderTo: 'nhs-injection-presenter',
          defaultSeriesType: 'column'
       },
       title: {
          text: 'Monthly Average Rainfall'
       },
       subtitle: {
          text: 'Source: WorldClimate.com'
       },
       xAxis: {
          categories: [
             'Jan', 
             'Feb', 
             'Mar', 
             'Apr', 
             'May', 
             'Jun', 
             'Jul', 
             'Aug', 
             'Sep', 
             'Oct', 
             'Nov', 
             'Dec'
          ]
       },
       yAxis: {
          min: 0,
          title: {
             text: 'Rainfall (mm)'
          }
       },
       legend: {
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          style: {
             left: '100px',
             top: '70px',
             bottom: 'auto'
          }
       },
       tooltip: {
          formatter: function() {
             return '<b>'+ this.series.name +'</b><br/>'+
                this.x +': '+ this.y +' mm';
          }
       },
       plotOptions: {
          column: {
             pointPadding: 0.2,
             borderWidth: 0
          }
       },
            series: [{
          name: 'Tokyo',
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

       }, {
          name: 'New York',
          data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

       }, {
          name: 'London',
          data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

       }, {
          name: 'Berlin',
          data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

       }]
    });
  }  
};

$(document).ready(function() {
  app.setupAjaxCallbacks();
  app.searchForDataSets(app.getKeywords());
});

return app; // This is passed to the global var 'nhsInject'
}());
