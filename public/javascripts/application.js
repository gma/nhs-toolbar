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
  
  searchForDataSets: function(keywordList) {
    // var url = settings.apiUrl + '/search?url=' + document.location + '&callback=?';
    var url = settings.apiUrl + '/search?url=http://www.asthma.org.uk' + '&callback=?';
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
    console.log(dataSet["name"]);
    var url = settings.apiUrl + '/data-set/' + dataSet['name'] + '?callback=?';
    $.getJSON(url, function(data) {
      if (data["type"] == "series") {
        app.plotBarChart(data);
      }
    });
  },
  
  plotBarChart: function(data) {
    var chart = new Highcharts.Chart({
      chart: {
         renderTo: 'nhs-injection-presenter',
         defaultSeriesType: 'column'
      },
      title: {
         text: data['summary']
      },
      xAxis: {
         categories: data['labels']
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Count'
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
      series: data['series']
    });    
  }
  
};

$(document).ready(function() {
  app.setupAjaxCallbacks();
  app.searchForDataSets();
});

return app; // This is passed to the global var 'nhsInject'
}());
