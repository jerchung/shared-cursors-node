http://protected-caverns-7161.herokuapp.com

This is a random side-project I made using node.js and socket.io
The position of the mouse cursor of everyone currently connected to the page is visible on each client's browser window

Initially, enter a name and press enter.
Then, to send a message, press enter to get message window, enter your message, then press enter again to send the message to other clients.

Currently, your own name and message are not displayed under your cursor in your window, but everyone else can see it.

Heroku currently does not support websockets, so instead I used xhr long-polling so it may be a bit slow.

Open multiple windows to test.  Mouse cursor is by an image of a cursor
