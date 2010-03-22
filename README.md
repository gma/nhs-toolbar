# NHS Toolar

The NHS Toolbar was written for the
DotGovLabs hack day organise by [Rewired State](http://rewiredstate.org/
"Rewired State").

Check the [project home page](http://rewiredstate.org/projects/nhs-toolbar) for more information. Screenshots are [on Flickr](http://www.flickr.com/photos/bengriffiths/sets/72157623538428741/).

## Notes for developers

To run the API server you'll need to install Sinatra. The easiest way to get
setup is via Bundler:

    $ cd api
    $ gem install bundler
    $ bundle install

Now you can run a local server on your computer:

    $ bundle exec shotgun app.rb

Test the client side code at this URL: http://localhost:9393/api-test

The code for the API is in `app.rb`. To run the tests type:

    $ bundle exec rake spec
