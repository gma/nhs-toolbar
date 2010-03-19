#!/usr/bin/env ruby

require 'rubygems'
require 'dm-core'
require 'yaml'
require 'sinatra'

DataMapper.setup :default, 'mysql://root:root@localhost/nhs_choices' 

class Post
  include DataMapper::Resource

  has n, :links

  property :text, Text
  property :title, Text
  property :url, Text
  property :keywords, Text
  property :id, Serial
end

class Link
    include DataMapper::Resource
    belongs_to :post
    
    property :html, Text
    property :link_url, Text
    property :type, Text
    property :id, Serial 
end

def link_list(post,type,headline)
  output = ''
  links = post.links(:type=>type)
  if links.length > 0 
    output << "<h1>#{headline}</h1>"
    output << "<ul>"
    links.each { |l|
      output << "<li>"+l.html+"</li>"
    }
    output << "</ul>"
  end
  output
end

def heading
  <<-eos
    <html>
    <head>
    <style>
      ul li {
          line-height: 1.4em;
          font-family: verdana, helvetica, arial, sans-serif;
          font-size: 12px;
          color: rgb(13, 48, 89);
      }
      h1 {
          color: rgb(102, 102, 102);
          font-size: 12px;
          font-weight: normal;
      }
      </style>
      <base target="_top" href="http://www.nhs.uk"> 
      </head>
      <body>
   eos
end

get '/links_for' do
  content_type 'text/html', :charset => 'utf-8'
  output = heading
  puts params[:url]
  link = Link.first(:link_url => params[:url])
  puts link
  if link
    post = link.post
    output << %{<img src="http://www.nhs.uk/img/header/choices-logo.gif"/>}
    output << %{<p><a href="#{post.url}">Read about this article on NHS Choices</a></p>}
    output << link_list(post,'science','Or go straight to the science:')
    output << link_list(post,'related','Related articles from NHS Choices')
    
  end
  output << "</body></head>"
end
