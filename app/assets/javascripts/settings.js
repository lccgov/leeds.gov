(function (global, $) {
  'use strict'

  var LCC = global.LCC || {}
  LCC.Settings = LCC.Settings || {}

  LCC.Settings.NewsUrl = ((_spPageContextInfo.webServerRelativeUrl.length === 1) ? _spPageContextInfo.webServerRelativeUrl.substr(1) : _spPageContextInfo.webServerRelativeUrl) + "/news"; 

  global.LCC = LCC
  
})(window, jQuery); 