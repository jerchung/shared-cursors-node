Rewrote shared cursors in node so I could host it on heroku

http://protected-caverns-7161.herokuapp.com

Heroku currently does not support websockets, so instead I used xhr long-polling so it may be a bit slow.

Open multiple windows to test.  Mouse cursor is represented by 5x5 black square
