
var baseURL = 'http://chile-datos.degu.cl/';

function removeBaseURL(url) {
  return url.gsub(baseURL, '');
}

function identifyCurrentNode() {
  var about = $$('body')[0].readAttribute('about');
  if (about != null) {
    var selector = '#site-menu a[href="' + removeBaseURL(about) + '"]';
    var currentNode = $$(selector)[0];
    if (currentNode != null) {
      currentNode.addClassName('current-node');
    }
  }
}

function tableOfContents() {
  var p = $('abstract');
  var ul = new Element('ul');
  var sections = $$('h2[id]');
  if (sections.size() > 0) {
    $$('h2').each(function(e) {
      var a = new Element('a', {'href': '#' + e.readAttribute('id')}).update(e.innerHTML);
      var li = new Element('li');
      li.insert(a);
      ul.insert(li);
    });
    p.insert(new Element('h2').update('Contenidos'));
    p.insert(ul);
  }
}

window.onload = function() {
  identifyCurrentNode();
  tableOfContents();
};