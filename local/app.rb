require "json"
require File.join(File.dirname(__FILE__), *%w[.. lib shellescape])

DATA_SETS = {
  "asthma" => {
    "summary" => "Total count of diagnosed primary asthma cases by gender.",
    "type" => "series",
    "labels" => [
      "1998-99",
      "1999-00",
      "2000-01",
      "2001-02",
      "2002-03",
      "2003-04",
      "2004-05",
      "2005-06",
      "2006-07",
      "2007-08"
    ],
    "series" => [
      {
        "name" => "Women",
        "data" => [
          43643,
          41775,
          38789,
          39125,
          39267,
          46302,
          50265,
          48601,
          50879,
          47399
        ]
      },
      {
        "name" => "Men",
        "data" => [
          36825,
          35149,
          32411,
          32726,
          32508,
          33740,
          38358,
          35181,
          37890,
          34399
        ]
      }
    ]
  }
}

helpers do
  def keywords_from_query_string
    params[:q].nil? ? [] : params[:q].split(",")
  end
  
  def keywords_from_url
    keywords = []
    options = %w[
      title headings paragraphs remove-subphrases remove-stopwords
    ].map { |opt| "--#{opt}" }.join(" ")
    command = "kwexplorer #{options} --max-words 2 --url #{params[:url].shellescape}"
    `#{command}`.each_line do |line|
      keywords << line.split[0...-1].join(" ")
    end
    keywords
  end
  
  def jsonp_callback(json, callback)
    callback.nil? ? json : "#{callback}(#{json})"
  end
end

get "/api-test" do
  haml(:api_test, :layout => :playground)
end

get "/api/search" do
  content_type "application/json"
  data_sets = []
  keywords = []
  params[:q] && keywords += keywords_from_query_string
  params[:url] && keywords += keywords_from_url
  data_sets = keywords.map do |keyword|
    DATA_SETS[keyword] && { "name" => keyword }
  end.compact
  jsonp_callback(data_sets.to_json, params[:callback])
end

get "/api/data-set/:name" do
  content_type "application/json"
  set = DATA_SETS[params[:name]]
  set.nil? && raise(Sinatra::NotFound)
  jsonp_callback(set.to_json, params[:callback])
end
