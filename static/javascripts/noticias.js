
var baseURL = 'http://chile-datos.degu.cl/';

function removeBaseURL(url) {
  return url.gsub(baseURL, '');
}

function identifyCurrentNode() {
  var about = $$('body')[0].readAttribute('about');
  if (about != null) {
    var selector = '#site-menu a[href="' + removeBaseURL(about) + '"]';
    $$(selector)[0].addClassName('current-node');
  }
}

function tableOfContents() {
  var news = $$('ul[id="news-list"] li a');
  if (news.size() > 0) {
    news.each(function(a) {
      var relativeURL = a.readAttribute('href');
      new Ajax.Request(relativeURL, {
	method: 'get',
	onSuccess: function(response) {
	  var xml = response.responseXML;
	  var title       = xml.getElementById('dc:title').innerHTML;
	  var description = xml.getElementById('dc:description');
	  var date        = xml.getElementById('dc:date');
	  var creator     = xml.getElementById('dc:creator');
	  a.update(title);
	  var news = new Element('div', {'about': baseURL + relativeURL});
	  news.insert(new Element('h2', {'property': 'dc:title'}).update(title));
	  news.insert(description);
	  var source = new Element('div');
	  source.setStyle({'float':'right'});
	  source.insert(new Element('a', {'rel': 'dc:source', 'href': relativeURL}).update('[leer más]'));
	  news.insert(source);
	  $('content').insert(news);
	},
	onFailure: function(response) {
	  a.update('fails');
	}
      });
    });
  }
}

window.onload = function() {
  identifyCurrentNode();
  tableOfContents();
};