require "json"

get "/api/search" do
  content_type "application/json"
  data_sets = []
  if params[:q] == "asthma"
    data_sets << {
      "data-set" => "asthma"
    }
  end
  data_sets.to_json
end
