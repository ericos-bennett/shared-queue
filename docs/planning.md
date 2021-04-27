# Planning

### Learning Objectives
- TypeScript
- React Router
- Spotify API
- OAuth 2.0
- WebSockets
- Async Await

### Next Steps
- Sync up track, isPlayed, and progressMs for new user when they join (BUGS!)
- Add copy to homepage
- Restyle homepage
- Restyle room page
- Set up on Heroku, run more tests in production (deploy directly from GitHub master)

### Bugs

##### Happy Path
- When joining a playing room on incognito / Lauren's acct, always pauses right away after playing
- Invalid URI (console.computed) on page load
- "It is recommended that a robustness level be specified. Not specifying the robustness level could result in unexpected behavior." (Spotfiy SDK)
- On page join, if peer is paused, your device is not yet active, so seek call gets 404'd
- Uncaught TypeError: Cannot read property 'getClientDescriptor' of undefined
    at t.e._onLocalPlayerDisabled (index.js:50)
    at t.e._dispatchFromStore (index.js:18)
    at t.e.emitSync (index.js:18)

##### Less Critical
- If the authorized user has more than one session tab open, sends multiple spotify API requests
- Clicking next/prev while paused doesn't change image or playback progress bar
- Deleting the playing track should move playback to next track in playlist