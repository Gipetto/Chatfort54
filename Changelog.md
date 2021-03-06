# 0.4.1

- Upgrade Rollbar JS to 1.8.5

# 0.4

- clean up unused imports
- improved error handling when loading message history
- localize message date display relative to browser
- add day separators
- (attempt to) assign consistent colors to users


# 0.3.2

- Improved reconnection logic.
- Fix rollbar js loading


# 0.3.1

- Adding in missing JS load that appears to have been previously handled by parent ip-messaging library.


# 0.3.0

- Fix `/tldr` not found message.
- Move info messages in to Status Box.
- Add rudimentary Rollbar integration.


# 0.2.8

- Fix Base64 decoding for Safari.


# 0.2.7

- Update `updateLastConsumedMessageIndex` on the channel when a user has viewed a message.
- Improved error handling (If I'm lucky).
- Added `/tldr command-name` command
- Restyled sidebar.


# 0.2.6

- Add `Tester` command to assist in, well, testing and debug.
- Be more verbose in showing error data to the user.
- Improved `info` and `error` message styling.
- Add config option to control the loading of minified IPMessaging JS.


# 0.2.5

- Cache bust the RequireJS urls until we have a proper versioning setup.
- Add typing status indicator.
- Control the height of the text input based on screen size.


# 0.2.4

- Fix issue where message meta wouldn't show up after an emote.
- Allow chatApp command registration.
- Implement RequireJS for code separation.


# 0.2.3

- Better help formatting.
- More help documentation.


# 0.2.2

- Add command processing to message handling.
- Add help overlay via command processing.
- Sane-itize the css and markup.


# 0.2.1

- Use JS browser fingerprinting to generate a device id.


# 0.2.0

- Refresh access token when it expires.
- Emote.
- Load version number from file instead of from yaml config.
- Fix date formatting.
- General cleanup.
- Mobile friendliness.


# 0.1.1

- Properly format javascript dates.
- Log promise rejections, error handling TBD.
- Don't output meta information if a user is responding to its own message within 10 minutes.
- Don't cache any output, set cache control to private.


# 0.1.0

- Initial working version.
- Log-in users based on MyBB cookie.
- Users can post formatted text.
- Users can see a list of others, but not if they're active.