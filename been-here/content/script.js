var Greeter = {
  view : function() {
    return m('div', { style: 'position: absolute; bottom: 0; right: 0; margin-bottom: 30px; margin-right: 30px; background: #66E96C; padding: 12px; border-radius: 24px;' }, 'I know this place!');
  }
};

var defaults = {
  domains   : [],
  localhost : true
};

chrome.storage.sync.get(defaults, function(items) {
  var whitelist = items.domains;
  if (items.localhost)
    whitelist.push('localhost');

  if (whitelist.indexOf(window.location.hostname) > -1) {
    var div = document.createElement("div");
    div.setAttribute('id', 'extension-root');
    document.body.insertBefore(div, window.document.body.firstChild);
    m.mount(document.getElementById('extension-root'), Greeter);
  }
});
