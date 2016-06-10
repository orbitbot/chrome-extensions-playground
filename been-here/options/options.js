// Data operations

var Options = {
  domains   : [],
  localhost : true,
};

var OptionsApi = {
  _set  : function() {
            chrome.storage.sync.set(Options, OptionsApi.get);
          },
  get   : function() {
            chrome.storage.sync.get(Options, function(items) {
              Options.localhost = items.localhost;
              Options.domains = items.domains;
              m.redraw();
            });
          },
  clear : function() {
            chrome.storage.sync.clear(function() {
              // clear doesn't seem to have an effect before options window is closed...
              // (onChanged is called, retrieved options in .get are identical to before clear)
              window.close();
            });
          },
  add   : function(domain) {
            if (Options.domains.indexOf(domain) === -1) {
              Options.domains.push(domain);
              OptionsApi._set();
            }
          },
  remove: function(domain) {
            var index = Options.domains.indexOf(domain);
            if (index !== -1) {
              Options.domains.splice(index, 1);
              OptionsApi._set();
            }
          },
  toggle: function() {
            Options.localhost = !Options.localhost;
            OptionsApi._set();
          }
};

chrome.storage.onChanged.addListener(OptionsApi.get);

// mithril helper

m.set = function(obj, prop, modify) {
  return function(value) { obj[prop] = modify ? modify(value) : value };
};

// UI components

var Row = {
  view : function(vnode) {
    return m('.option', Object.assign({ key : vnode.attrs.title }, vnode.attrs.rAttrs), [ vnode.attrs.title, vnode.attrs.action ]);
  }
};

var OptionsUi = {
  oninit : function(vnode) {
    OptionsApi.get();
    this.input = '';
  },
  view : function(vnode) {
    return  m('div#container', [
              m('.section', [
                m(Row, {
                  title  : m('h3', 'Restore defaults'),
                  action : m('button', { onclick : OptionsApi.clear }, 'Reset')
                }),
                m(Row, {
                  title  : m('h3', 'Show greeter on localhost'),
                  action : m('input', { type : 'checkbox', checked : Options.localhost, onclick : OptionsApi.toggle.bind(OptionsApi) })
                }),
              ]),
              m('.section.domain', [
                Options.domains.map(function(domain) {
                  return m(Row, {
                    title  : domain,
                    action : m('button', { onclick : OptionsApi.remove.bind(OptionsApi, domain) }, 'Remove')
                  })
                }),
              ]),
              m(Row, {
                rAttrs : { style: 'padding: 1em 0;' },
                title  : m('input', { type: 'text', style : 'width: 80%;', value: this.input, onchange: m.withAttr('value', m.set(this, 'input')) }),
                action : m('button', { onclick : OptionsApi.add.bind(OptionsApi, this.input) }, 'Add')
              })
            ]);
  }
};

m.mount(document.getElementById('options'), OptionsUi);
