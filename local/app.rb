require "json"

DATA_SETS = {
  "asthma" => {
    "summary" => "Some data about asthma diagnosis, or somat...",
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
      }
    ]
  }
}

helpers do
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
  keywords = params[:q].nil? ? [] : params[:q].split(",")
  if keywords.include?("asthma")
    DATA_SETS.each do |name, data|
      if name =~ /asthma/
        data_sets << { "name" => name }
      end
    end
  end
  jsonp_callback(data_sets.to_json, params[:callback])
end

get "/api/data-set/:name" do
  content_type "application/json"
  set = DATA_SETS[params[:name]]
  set.nil? && raise(Sinatra::NotFound)
  jsonp_callback(set.to_json, params[:callback])
end
