(function() {
  var ID;
  var CONNECTED = false;
  var COUNTER = 0;
  var NAME = "";
  var X = 0;
  var Y = 0;

  $(document).ready(function() {
    var socket = io.connect(window.location.protocol + window.location.hostname);

    //socket is connected
    socket.on('new', function(data) {
      CONNECTED = true;
      ID = data.id;
    });

    //Other cursors need updating
    socket.on('update', function(data) {
      if (("x" in data) && ("y" in data)) {
        updateCursorPos(data.id, data.x, data.y);
      }
      if ("text" in data) {
        updateCursorText(data.id, data.text);
      }
      if ("name" in data) {
        updateCursorName(data.id, data.name);
      }
    });

    //Create cursors of other clients
    socket.on('create', function(data) {
      createCursor(data);
    });

    //Update counter
    socket.on('counter', function(data) {
      COUNTER = data.count;
      $('#counter-number').text(COUNTER);
    });

    //Delete a cursor
    socket.on('del', function(data) {
      removeCursor(data.id);
    });

    $(document).mousemove(function(evt) {
      X = evt.pageX;
      Y = evt.pageY;
      if (CONNECTED) socket.emit('update', {id: ID, x: X, y: Y});
    });

    $(document).keypress(function(e) {
      if (e.keyCode == 13) {
        if ($('#input-container').css('display') === "none") {
          $('#input-box').attr('placeholder', 'Text Message');
          $('#input-container').show();
          $('#input-box').focus();
        } else {
          var text = $('#input-box').val();
          if (text) {
            if (!NAME) {
              //Name hasn't been set yet
              NAME = text;
              socket.emit('update', {id: ID, name: NAME});
            } else {
              //Name has already been set so this is a message
              socket.emit('update', {id: ID, text: text});
            }
            $('#input-box').val("");
            $('#input-container').hide();
          }
        }
      }
    });

  });

  function updateCursorPos(id, x, y) {
    $("#cursor" + id).css({left: x, top: y, display: "block"});
  }

  function updateCursorName(id, name) {
    $('p.cursor-name', '#cursor' + id).text(name);
  }

  function updateCursorText(id, text) {
    $('p.cursor-text', '#cursor' + id).text(text);
  }

  function createCursor(data) {
    var text = ("text" in data) ? data.text : "",
        name = ("name" in data) ? data.name : "";

    var newDiv = "<div id='cursor" + data.id + "' class='cursor'> \
        <p class='cursor-text'>" + text + "</p> \
        <img class='cursor-img' src='Cursor-24.png'> \
        <p class='cursor-name'>" + name + "</p> \
      </div>";
    $('body').append(newDiv);
    $("#cursor" + data.id).css({left: data.x, top: data.y, display: data.display});
  }

  function removeCursor(id) {
    $("#cursor" + id).remove();
  }

})();