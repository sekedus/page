$(document).ready(function() {
  $('[data-toggle="pill"]').click(function(event) {
    var target = $(this.getAttribute('href'));
    var me_wait = setInterval(function() {
      if (target.length && target.hasClass('active') && window.screen.width <= 991) {
        clearInterval(me_wait);
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 'slow');
      }
    }, 10);
  });

  $('textarea').each(function(i, area) {
    $(area).on('change keyup paste blur focus', function() {
      var enc = $(area).attr("data-id");
      var decode = ($(area).attr("data-type") === "encode") ? 0 : 1
      var data = $(area).val();

      doEncoding(data, enc, decode, function(ret) {
        $("#"+ enc +"_output").text(ret);
        if (ret == '') {
          $('.output').removeClass('active');
        } else {
          $('.output').addClass('active');
        }
      });
    })
  });
  
  $('.btn-clipboard').html('<svg xmlns="http://www.w3.org/2000/svg" width=".92em" height="1em" viewBox="0 0 1000 1000"><path fill="currentColor" d="M128 768h256v64H128v-64z m320-384H128v64h320v-64z m128 192V448L384 640l192 192V704h320V576H576z m-288-64H128v64h160v-64zM128 704h160v-64H128v64z m576 64h64v128c-1 18-7 33-19 45s-27 18-45 19H64c-35 0-64-29-64-64V192c0-35 29-64 64-64h192C256 57 313 0 384 0s128 57 128 128h192c35 0 64 29 64 64v320h-64V320H64v576h640V768zM128 256h512c0-35-29-64-64-64h-64c-35 0-64-29-64-64s-29-64-64-64-64 29-64 64-29 64-64 64h-64c-35 0-64 29-64 64z" /></svg>');

  var clipboard = new ClipboardJS('.btn-clipboard', {
    target: function(trigger) {
      return trigger.nextElementSibling;
    }
  });

  clipboard.on('success', function(e) {
    $(e.trigger).addClass('btn-success');
    setTimeout(function() { $(e.trigger).removeClass('btn-success'); }, 1000);
    e.clearSelection();
  });
  clipboard.on('error', function(e) {
    $(e.trigger).addClass('error');
  });
  
  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 'slow');
  });
});



function doEncoding(data, encType, decode, callback) {
  var ret = "Error";

  //URL-encoding
  if (encType === "url") {
    ret = "";
    if (decode) {
      ret = data.replace(/%([a-zA-Z0-9]{2})/g,function(match) { return String.fromCharCode(parseInt(match.slice(1),16))});
    } else {
      for(i=0; i < data.length; i++)
      {
        ret += "%" + data[i].charCodeAt(0).toString(16);
      }
    }
  }

  if (encType === "html") {
    ret = "";
    if (decode) {
      ret = data.replace(/&#x(\d{2});/g,function(match) { return String.fromCharCode(parseInt(match.slice(3).replace(";",""),16))});
    } else {
      for(i=0; i < data.length; i++)
      {
        ret += "&#x" + data[i].charCodeAt(0).toString(16) + ";";
      }      
    }
  }

  if (encType === "aschex") {
    ret = "";
    if (decode) {
      ret = data.replace(/([0-9a-fA-F]{2})/g,function(match) { return String.fromCharCode(parseInt(match,16))});
    } else {
      for(i=0; i < data.length; i++)
      {
        ret += data[i].charCodeAt(0).toString(16);
      }     
    }
  }

  if (encType === "jshex") {
    ret = "";
    if (decode) {
      ret = data.replace(/(\\x[0-9a-fA-F]{2})/g,function(match) { return String.fromCharCode(parseInt(match.slice(2),16))});
    } else {
      for(i=0; i < data.length; i++)
      {
        ret += "\\x" + data[i].charCodeAt(0).toString(16);
      }     
    }
  }

  if (encType === "inthex") {
    ret = "";
    if (decode) {
      ret = parseInt(data.toUpperCase().replace(/[^a-f0-9A-F]/gi,""),16);
    } else {
      ret = parseInt(data).toString(16).toUpperCase();
    }
  }

  if (encType === "ascbin") {
    ret = "";
    if (decode) {
      ret = data.replace(/([0-1]{16})/g,function(match) { return String.fromCharCode(parseInt(match,2))});
    } else {
      for(i=0; i < data.length; i++)
      {
        binchar = data[i].charCodeAt(0).toString(2);
        for(j = 16 - binchar.length; j > 0; j--) {
          binchar = "0" + binchar;
        }

        ret += binchar ;
      }     
    }
  }

  if (encType === "intbin") {
    ret = "";
    if (decode) {
      ret = parseInt(data.replace(/[^0-1]/gi,""),2);
    } else {
      ret = parseInt(data).toString(2);
    }
  }

  if (encType === "ascoct") {
    ret = "";
    if (decode) {
      ret = data.replace(/([0-7]{3})/g,function(match) { return String.fromCharCode(parseInt(match,8))});
    } else {
      for(i=0; i < data.length; i++)
      {
        binchar = data[i].charCodeAt(0).toString(8);
        for(j = 3 - binchar.length; j > 0; j--) {
          binchar = "0" + binchar;
        }

        ret += binchar ;
      }     
    }
  }

  if (encType === "intoct") {
    ret = "";
    if (decode) {
      ret = parseInt(data.replace(/[^0-7]/gi,""),8);
    } else {
      ret = parseInt(data).toString(8);
    }
  }

  if (encType === "jsoct") {
    ret = "";
    if (decode) {
      ret = data.replace(/(\\[0-7]{3})/g,function(match) { return String.fromCharCode(parseInt(match.slice(1),8))});
    } else {
      for(i=0; i < data.length; i++)
      {
        binchar = data[i].charCodeAt(0).toString(8);
        for(j = 3 - binchar.length; j > 0; j--) {
          binchar = "0" + binchar;
        }

        ret += "\\" + binchar ;
      }     
    }
  }

  if (encType === "b64") {
    ret = "";
    if (decode) {
      ret = $.base64.decode(data);
    } else {
      ret = $.base64.encode(data);
    }
  }

  if (encType === "uni") {
    ret = "";
    if (decode) {
      ret = data.replace(/(\\u[0-9a-fA-F]{4})/g,function(match) { return String.fromCharCode(parseInt(match.slice(2),16))});
    } else {
      for(i=0; i < data.length; i++)
      {
        binchar = data[i].charCodeAt(0).toString(16);
        for(j = 4 - binchar.length; j > 0; j--) {
          binchar = "0" + binchar;
        }
        ret += "\\u" + binchar;
      }     
    }
  }

  console.log(ret);
  callback(ret);
}
