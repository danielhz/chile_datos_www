
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
  // var p = $('abstract');
  // var ul = new Element('ul');
  var news = $$('ul[id="news-list"] li a');
  if (news.size() > 0) {
    news.each(function(a) {
      a.update('u');
      new Ajax.request(a.readAttribute('href'), {
	onSuccess: function(response) {
	  var xml = response.responseXML();
	  a.update('e');
	}
      });
      // var a = new Element('a', {'href': '#' + e.readAttribute('id')}).update(e.innerHTML);
      // var li = new Element('li');
      // li.insert(a);
      // ul.insert(li);
    });
    // p.insert(new Element('h2').update('Contenidos'));
    // p.insert(ul);
  }
}

window.onload = function() {
  identifyCurrentNode();
  tableOfContents();
};