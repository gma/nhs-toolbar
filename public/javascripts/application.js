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
    $('#ajax-status').ajaxError(function (event, request, ajaxOptions, exception) {
      $(this).fadeOut();
    });
  },
  
  searchForDataSets: function(keywordList) {
    // var url = settings.apiUrl + '/search?url=http://en.wikipedia.org/wiki/Epilepsy' + '&callback=?';
    // var url = settings.apiUrl + '/search?url=http://www.asthma.org.uk' + '&callback=?';
    var url = settings.apiUrl + '/search?url=' + window.location.href + '&callback=?';
    $.getJSON(url, function(dataSets) {
      if (dataSets.length) {        
        var container = $('#nhs-inject');
        if (! container.length){
            container = $('body');
        }
      
        $('<div/>', { id: 'nhs-injection-button' })
          .append('<a/>').find('a')
            .text('Show related data')
            .click(function() { app.chooseDataSet(dataSets); })
          .end()
          .fadeIn()
          .appendTo(container);
      }
    });
  },
  
  createCloseButton: function(container) {
    var close = function() {
      container.fadeOut(function() {
        container.remove();
      });
      return false;
    };
    
    $(document).keydown(function(ev) {
      if (ev.which === 27) { // ESC key
        close();
      }
    });
    
    $("<a/>")
      .attr("href", "")
      .css({
        position: "absolute",
        top: "-18px",
        left: "-18px",
        width: "40px",
        height: "42px",
        background: "url(http://www.quizthemarket.com/images/close-survey.png) no-repeat",
        outline: "0"
      })
      .click(close)
      .appendTo(container);
  },
  
  createOverlay: function() {
    if (! $('#nhs-injection-presenter').length) {
      $('<div/>', { id: 'nhs-injection-presenter' }).appendTo('#nhs-inject');
    }
    var presenter = $('#nhs-injection-presenter').first();
    presenter
      .css({
        left: $(window).width() / 2 - presenter.width() / 2,
        top: '6em'
      });
    app.createCloseButton(presenter);
    return presenter;
  },
  
  createChooser: function(dataSets, overlay) {
    var chooser = $('<div/>', { id: 'chooser' }).appendTo(overlay);
    var heading = 'Available data that is relevant to this page...';
    $('<p/>', { margin: '0' }).text(heading).appendTo(chooser);
    var list = $('<ul/>').appendTo(chooser);
    $.each(dataSets, function(i, dataSet) {
      $('<li/>').text(dataSet['summary'])
        .click(function() {
          $('#chooser').remove();
          app.showDataSet(dataSet);
        })
        .appendTo(list);
    });
  },  
  
  chooseDataSet: function(dataSets) {
    var overlay = app.createOverlay();
    overlay.fadeIn('fast', function() {
      if (dataSets.length > 1) {
        app.createChooser(dataSets, overlay);
      }
      else {
        app.showDataSet(dataSets[0]);
      }
    });
  },
  
  showDataSet: function(dataSet) {
    $('#nhs-injection-presenter')
      .append($('<div/>', { id: 'nhs-injection-graph-container' }));
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
         renderTo: 'nhs-injection-graph-container',
         defaultSeriesType: 'column',
         margin: [50, 50, 75, 50]
      },
      title: {
         text: data['summary'],
         style: {
           color: '#eee'
         }
      },
      xAxis: {
        labels: {
          rotation: -45,
          align: 'right',
          style: {
            font: 'normal 13px Verdana, sans-serif',
            color: '#eee'
          }
        },
        categories: data['labels']
      },
      yAxis: {
        labels: {
          style: {
            color: '#eee'
          }
        },
        min: 0,
        title: {
           text: ''
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
              this.x +': '+ this.y;
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
  $('#nhs-inject').append('<div/>', { id: 'ajax-status' });
  app.setupAjaxCallbacks();
  app.searchForDataSets();
});

return app; // This is passed to the global var 'nhsInject'
}());
