function showResult(u) {
  if (u == '') {
    result.classList.add('error');
    result.innerHTML = 'Error!';
    return;
  }
  u = u.replace(/(https?:\/\/)(?:www\.)?([^\/]*\/)[^\?]*\?a\=(.*)/, '$1$2$3');
  result.innerHTML = '<input type="text" class="url" placeholder="' + u +'" value="' + u +'"/><button id="copy">Copy</button>';
  
  copy.onclick = function() {
    var url = result.querySelector('.url');
    url.focus();
    url.select();
    document.execCommand('copy');
  }
}

function getUrl(u) {
  var x = new XMLHttpRequest();
  x.onreadystatechange = function() {
    if (x.readyState == XMLHttpRequest.DONE) {
      var r = x.responseURL;
      showResult(r);
      console.log('url:', r);
    }
  }
  x.open('GET', u, true);
  x.send();
}

var domain = 'idsly.bid';
var api = 'e4bc2cce6f6863d4b703c5ba58ff311546a051fc';
var input = document.querySelector('.sflink .domain');
var result = document.querySelector('.sflink .result');

generate.onclick = function () {
  if ((input.value == '') || (input.value.indexOf('http') == -1)) {return alert('Please enter a valid URL')}
  var link = 'https://' + domain + '/st/?api=' + api + '&url=' + encodeURIComponent(input.value);
  result.classList.remove('no-items');
  result.innerHTML = 'loading...';
  getUrl(link);
}
