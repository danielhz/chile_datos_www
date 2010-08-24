#! /usr/bin/ruby

require 'rubygems'
require 'rdiscount'
require 'tenjin'
require 'rexml/document'
require 'time'

APPLICATION_PATH = File.dirname(File.expand_path(__FILE__))
DISQUS_DEVELOPER = 1 # testing = 1, producción = 0
ENTRY_TEMPLATE   = File.join(APPLICATION_PATH, "req_template.html")
INDEX_TEMPLATE   = File.join(APPLICATION_PATH, "index_template.html")
#FEED_TEMPLATE    = File.join(APPLICATION_PATH, "index_template.xml")
TEMPLATE_ENGINE  = Tenjin::Engine.new()

entries = []
Dir['req-*.text'].sort.each do |entry|
  puts "processing entry: #{entry}"
  text = RDiscount.new(File.new(entry, 'r').read).to_html
  xml = REXML::Document.new("<div id=\"entry-content\">\n#{text}\n</div>")
  options = {
    :title => xml.elements["//h1"].text,
    :description => xml.elements["//p[@property='dc:description']"].text,
    :disqus_developer => DISQUS_DEVELOPER
  }
  xml.elements.delete("//h1")
  xml.elements.delete("//p[@property='dc:description']")
  options[:content] = xml.to_s

  document = REXML::Document.new(TEMPLATE_ENGINE.render(ENTRY_TEMPLATE, options))
  # Adding title to head
  h1 = document.elements["//h1"]
  head = document.elements["//head"]
  title = head.add_element "title"
  title.text = h1.text + " - Guía 1 de buenas prácticas para la publicación - Chile Datos"
  # Centering images in paragrafs
  document.elements.each("//div[@class='entry']/p/img/..") do |p|
    p.attributes['class'] = 'centered-image'
  end
  # Writing file
  html_file = entry.gsub(/.text$/,'.html')
  file = File.new(html_file, 'w')
  file << document.to_s
  file.close
  # Indexing entry
  entries << {
    :title => options[:title],
    :url   => html_file,
#    :date  => document.elements["//span[@property='dc:date']"].text,
    :description => options[:description]
  }
end

puts "processing index"
#options = {:entries => entries.sort { |x,y| y[:date] <=> x[:date] }}
text = RDiscount.new(File.new('index.text', 'r').read).to_html
xml = REXML::Document.new("<div id=\"intro-content\">\n#{text}\n</div>")

options = {
  :title => xml.elements["//h1"].text,
  :description => xml.elements["//p[@property='dc:description']"].text,
  :entries => entries
}

xml.elements.delete("//h1")
xml.elements.delete("//p[@property='dc:description']")

options[:content] = xml.to_s

html = File.new('index.html', 'w')
html << TEMPLATE_ENGINE.render(INDEX_TEMPLATE, options)
html.close
