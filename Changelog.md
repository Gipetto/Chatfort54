# 0.2.5

- Cache bust the RequireJS urls until we have a proper versioning setup.


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