require "rubygems"
require "spec"
require "spec/interop/test"
require "rack/test"
require "sinatra"

Test::Unit::TestCase.send :include, Rack::Test::Methods

set :environment, :test

require File.join(File.dirname(__FILE__), "..", "app")

module RequestSpecHelper
  def app
    Sinatra::Application
  end
  
  def body
    last_response.body
  end
end
