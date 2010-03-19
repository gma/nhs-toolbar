require File.join(File.dirname(__FILE__), "spec_helper")

describe "api" do
  include RequestSpecHelper

  def data_sets
    JSON.parse(last_response.body)
  end
  
  def get_search(query = "")
    path = "/api/search"
    get path, query.empty? ? {} : { :q => query }
  end
  
  it "should return JSON" do
    get_search
    last_response.headers["Content-Type"].should == "application/json"
  end
  
  it "should return an empty list of data sets if keyword not specified" do
    get_search
    data_sets.should == []
  end
  
  it "should return list of data sets that match a keyword" do
    get_search("asthma")
    data_sets.first["data-set"].should == "asthma"
  end
end
