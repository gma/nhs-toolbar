require "json"
require File.join(File.dirname(__FILE__), *%w[.. lib shellescape])

DATA_SETS = {
  "prostate_deaths" => {
    "keywords" => "prostate, cancer",
    "source" => "http://info.cancerresearchuk.org/cancerstats/types/prostate/mortality",
    "summary" => "Death rates for prostate cancer (UK)",
    "type" => "series",
    "labels" => [
          "1971",
          "1972",
          "1973",
          "1974",
          "1975",
          "1976",
          "1977",
          "1978",
          "1979",
          "1980",
          "1981",
          "1982",
          "1983",
          "1984",
          "1985",
          "1986",
          "1987",
          "1988",
          "1989",
          "1990",
          "1991",
          "1992",
          "1993",
          "1994",
          "1995",
          "1996",
          "1997",
          "1998",
          "1999",
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007"
      ],
      "series" => [
        {
          "name" => "Women",
          "data" => [
              19.9,
              20.1,
              20.4,
              20.6,
              20.2,
              20.6,
              20.5,
              20.4,
              20.9,
              21.2,
              21.3,
              21.5,
              22.2,
              24.8,
              25.6,
              25.9,
              26.5,
              27.3,
              28.3,
              28.7,
              29.8,
              30.1,
              29.6,
              29.5,
              29.6,
              28.9,
              27.7,
              27.4,
              27.2,
              26.1,
              27.3,
              27.0,
              27.2,
              26.7,
              25.5,
              24.9,
              24.6
          ]
        }
      ]
    },
  "epilepsy_deaths" => {
    "keywords" => "epilepsy",
    "source" => "http://www.statistics.gov.uk/cci/article.asp?id=1543",
    "summary" => "Death rates for epilepsy (underlying cause) per 100,000 population.",
    "type" => "series",
    "labels" => [
        "1993",
        "1994",
        "1995",
        "1996",
        "1997",
        "1998",
        "1999",
        "2000"
      ],
      "series" => [
        {
          "name" => "Women",
          "data" => [
            1.09,
            1.10,
            1.14,
            1.08,
            1.14,
            1.10,
            1.24,
            1.06
          ]
        },
        {
          "name" => "Men",
          "data" => [
            1.73,
            1.73,
            1.75,
            2.01,
            1.90,
            1.94,
            1.89,
            2.01
          ]
        }
      ]
    },
  "asthma_totals" => {
    "keywords" => "asthma, respiratory disease",
    "summary" => "Total count of diagnosed primary asthma cases by gender",
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
  },
  "latest_asthma" => {
    "keywords" => "asthma, respiratory disease",
    "summary" => "Diagnosed primary asthma cases in 2007",
    "type" => "series",
    "labels" => [
      "0-4",
      "5-14",
      "15-24",
      "25-34",
      "35-44",
      "45-54",
      "55-64",
      "65-74",
      "75-84",
      "85-120"
    ],
    "series" => [
      {
        "name" => "Women",
        "data" => [
          4445,
          4820,
          5118,
          5690,
          7108,
          6282,
          4644,
          3677,
          3724,
          1856
        ]
      },
      {
        "name" => "Men",
        "data" => [
          8387,
          7598,
          2665,
          2670,
          3646,
          3106,
          2288,
          2110,
          1429,
          487
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
  data_sets = []
  keywords.each do |keyword|
    DATA_SETS.each do |name, data|  
      data["keywords"].split(",").each do |tag|
        if keyword == tag.strip
          data_sets << { "name" => name, "summary" => data["summary"] }
        end
      end
    end
  end
  jsonp_callback(data_sets.uniq.to_json, params[:callback])
end

get "/api/data-set/:name" do
  content_type "application/json"
  set = DATA_SETS[params[:name]]
  set.nil? && raise(Sinatra::NotFound)
  jsonp_callback(set.to_json, params[:callback])
end
