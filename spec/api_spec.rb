require File.join(File.dirname(__FILE__), "spec_helper")

describe "API" do
  include RequestSpecHelper

  def data_returned
    JSON.parse(last_response.body)
  end
  
  def get_search(params = {})
    get "/api/search", params
  end
  
  def get_data_set(name, params = {})
    get "/api/data-set/#{name}", params
  end
  
  describe "/api/search" do
    it "should return JSON" do
      get_search
      last_response.headers["Content-Type"].should == "application/json"
    end
  
    it "should return an empty list of data sets if no input provided" do
      get_search
      data_returned.should == []
    end
  
    it "should return list of data sets that match a keyword" do
      get_search(:q => "asthma,heart disease")
      data_returned.first["name"].should == "asthma"
    end
    
    it "should retrieve keywords from a web page" do
      pending
      # Need to setup some mocks. Being a bit hacky and just coding it up
      # right now...
    end
  end
  
  describe "/api/data-set/:name" do
    it "should return JSON" do
      get_data_set("asthma")
      last_response.headers["Content-Type"].should == "application/json"
    end

    it "should respond with 404 if data set not found" do
      get_data_set("not-likely")
      last_response.should be_not_found
    end

    describe "/api/data-set for existing data" do
      before(:each) do
        get_data_set("asthma")
      end
    
      it "should return a description of the data" do
        data_returned["summary"].should match(/Total count of diagnosed primary asthma cases by gender./)
      end
      
      it "should return the data type" do
        data_returned["type"].should == "series"
      end
      
      it "should return the data" do
        data_returned["labels"].should include("1998-99")
        data_returned["series"].first.should have_key("data")
      end
    end
    
    it "should wrap the data in a JSONP callback" do
      get_data_set("asthma", :callback => "func")
      last_response.body.should match(/^func\(/)
    end
  end
end
