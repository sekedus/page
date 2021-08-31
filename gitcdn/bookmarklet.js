/*

Test: 
https://github.com/schme16/gitcdn.xyz/blob/master/README.md
https://github.com/microsoft/monaco-editor/blob/v0.27.0/website/index/index.css
https://gist.github.com/kottenator/9d936eb3e4e3c3e02598
https://gist.github.com/ourmaninamsterdam/4626375

*/

function git_cdn() {
  var g_text = '<div class="input-group">';
  g_text += '<div class="input-group-button">';
  g_text += '<select class="btn btn-sm">';
  g_text += '<option value="gitcdn.herokuapp.com">gitcdn.herokuapp.com</option>';
  g_text += '<option value="gitcdn.link">gitcdn.link</option>';
  g_text += '<option value="gitcdn.xyz">gitcdn.xyz</option>';
  g_text += '</select>';
  g_text += '</div>';
  g_text += '<input id="cdn-latest-commit" class="form-control input-sm input-monospace" style="min-width:250px;border-radius:0;" type="text" value="'+ g_cdn +'" readonly>';
  g_text += '<div class="input-group-button">';
  g_text += '<clipboard-copy for="cdn-latest-commit" aria-label="Copy to clipboard" class="btn btn-sm zeroclipboard-button" tabindex="0" role="button"><svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-paste"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg></clipboard-copy>';
  g_text += '</div>';
  g_text += '</div>';
  
  var g_result = document.createElement('div');
  g_result.className = 'Header-item cdn-latest-commit';
  g_result.style.cssText = 'margin-left:20px;';
  g_result.innerHTML = g_text;
  
  var g_notif = document.querySelector('.Header .Header-item:last-child');
  if (!document.querySelector('.cdn-latest-commit')) {
    g_notif.parentElement.appendChild(g_result);
    
    document.querySelector('.cdn-latest-commit select').addEventListener('change', function() {
      g_cdn = 'https://'+ this.value +'/cdn'+ g_path;
      document.querySelector('.cdn-latest-commit input').value = g_cdn;
    });
    
    document.querySelector('.cdn-latest-commit input').addEventListener('click', function() {
      this.select();
    });
  }
}

var g_list, g_user, g_repo, g_tag, g_file, g_type, g_elem, g_path, g_cdn;
var g_wl = window.location;
var g_host = 'gitcdn.herokuapp.com';

if (g_wl.hostname.search(/^gist\./) != -1) {
  g_list = g_wl.pathname.match(/\/([^\/]+)\/(.*)$/);
  g_user = g_list[1];
  g_version = g_list[2];
  g_type = g_version +'/raw';
} else {
  g_list = g_wl.pathname.match(/\/([^\/]+)\/([^\/]+)\/(?:[^\/]+)\/([^\/]+)\/(.*)$/);
  g_user = g_list[1];
  g_repo = g_list[2];
  g_tag = g_list[3];
  g_file = g_list[4];
  g_type = g_repo +'/commit';
}

var g_chk = setInterval(function() {
  g_elem = document.querySelector('a[href^="/'+ g_user +'/'+ g_type +'/"]');
  if (g_elem) {
    clearInterval(g_chk);
    if (g_wl.hostname.search(/^gist\./) != -1) {
      var g_url = g_elem.href;
      g_path = new URL(g_url).pathname;
    } else {
      var g_commit = g_elem.href.match(/commit\/(.*)$/)[1];
      g_path = '/'+ g_user +'/'+ g_repo +'/'+ g_commit +'/'+ g_file;
    }
    g_cdn = 'https://'+ g_host +'/cdn'+ g_path;
    git_cdn();
  }
}, 100);
