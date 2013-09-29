(function() {
  var ID;

  $(document).ready(function() {
    var socket = io.connect(window.location.protocol + window.location.hostname);
    socket.on('new', function(data) {
      newCursor(data.id);
    });
    socket.on('update', function(data) {
      updateCursor(data.id, data.x, data.y);
    });
    socket.on('create', function(data) {
      createCursor(data);
    });
    socket.on('del', function(data) {
      removeCursor(data.id);
    });

    $(document).mousemove(function(evt) {
      socket.emit('update', {id: ID, x: evt.pageX, y: evt.pageY});
    });

  });

  function newCursor(id) {
    ID = id;
  }

  function updateCursor(id, x, y) {
    $("#cursor" + id).css({left: x, top: y, display: "block"});
  }

  function createCursor(data) {
    var newDiv = "<div id='cursor" + data.id + "' class='cursor'></div>";
    $("#body").append(newDiv);
    $("#cursor" + data.id).css({left: data.x, top: data.y, display: data.display});
  }

  function removeCursor(id) {
    $("#cursor" + id).remove();
  }

})();