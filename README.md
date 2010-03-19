# NHS Injection API

The NHS Injection API is part of the broader NHS Injection project, for the
DotGovLabs hack day organise by [Rewired State](http://rewiredstate.org/
"Rewired State").

## Notes for developers

To run the server you'll need to install Sinatra. The easiest way to get setup
is via Bundler:

    $ gem install bundler
    $ bundle install

Now you can run a local server on your computer:

    $ bundle exec shotgun app.rb

Test the client side code at this URL: http://localhost:9393/api-test

The code for the API is in `local/app.rb`. To run the API tests type:

    $ bundle exec spec spec/api_spec.rb
