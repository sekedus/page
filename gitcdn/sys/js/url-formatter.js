(function (window, document) {

  "use strict";
  
  // https://stackoverflow.com/a/49849482/7598333
  function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  }
  
  function setDevURLValue(newURL) {
    urlEl.classList.add('valid');
    urlEl.classList.remove('invalid');
  
    devEl.classList.add('valid');
    devEl.classList.remove('invalid');
    devEl.value = newURL;
    devEl.select();
  }
  
  function invalidURL(empty) {
    urlEl.classList.remove('valid');
    if (empty) {
      urlEl.classList.remove('invalid');
    } else {
      urlEl.classList.add('invalid');
    }
    devEl.classList.remove('valid');
    devEl.value = '';
  }
  
  
  var gitHost = document.querySelector('#url-host input[type=radio]:checked').value;
  var repoDomain = 'https://'+ gitHost +'/repo';
  
  var urlEl = document.querySelector('#url');
  var devEl = document.querySelector('#url-dev');
  
  document.querySelector('[readonly]').placeholder = 'https://'+ gitHost +'/'+ document.querySelector('[readonly]').placeholder;
  
  document.querySelectorAll('#url-host input[type="radio"]').forEach(function(item) {
    item.addEventListener('click', function() {
      gitHost = this.value;
      repoDomain = 'https://'+ gitHost +'/repo';
      if (devEl.value != '') devEl.value = devEl.value.replace(/.*?\/repo/, repoDomain);
    });
  });

  urlEl.addEventListener('input', function() {
    if (urlEl.value == '') {
      invalidURL(true);
      return;
    }
    
    var url = new URL('https://'+ urlEl.value.replace(/^https?:\/\//, ''));
    var lh = url.hostname;
    var lp = url.pathname;
    var type = lh.search(/^raw\./) != -1 ? 'raw' : lh.search(/^gist\./) != -1 ? 'gist' : lh;
    var pr = /\/(blob|raw)\//;
    
    if (isValidURL(url.href) && (lh.search(/github/) != -1 || lp.search(pr) != -1)) {
      if (type == 'raw' || (type == 'gist' && lp.search(pr) != -1)) {
        setDevURLValue(repoDomain + lp);
      } else if (type == 'github.com' && lp.search(pr) != -1) {
        setDevURLValue(repoDomain + lp.replace(pr, '/'));
      } else {
        invalidURL();
      }
    } else {
      invalidURL();
    }
  }, false);

}(window, document));
