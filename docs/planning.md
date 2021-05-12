# Planning

### Learning Objectives

- TypeScript
- React Router
- Spotify API
- OAuth 2.0
- WebSockets
- Async Await

### Scope

- Connect directly to Spotify SDK for playback control
- Express server handles Auth, WS connections
- React app handles all Spotify API requests
- User can play and pause a track, playing through the browser
- User can go to next prev/track in playlist
- Once SDK is ready, user asks peers for playback state
- User syncs playback with peers

### Next Steps

- Connect new componenets to old Home, linhok up appropriately
  - In ROOM routes, If user does not have a userId cookie, reroute them to home
- Set room host if you are the first in a room OR only create a room via the 'new room' button
- Work on sending and receiving WS updates (only from room 'host')
- Dial in OAuth so tokens refresh seamlessly before expiry
- Show loading animation on playback controls until track is actually playing

### Bugs
