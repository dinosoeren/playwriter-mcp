# Changelog

## 0.0.68

### Features

- **Optional auto-connect build**: Set `PLAYWRITER_AUTO_CONNECT=1` or pass
  `--playwriter-auto-connect` to the Vite build so the extension attaches to
  all eligible tabs on install/startup and new tabs without clicking the icon.
  Use `pnpm build:auto-connect` for a cross-platform one-liner.

### Bug Fixes

- **Improved connection reliability**: Use `127.0.0.1` instead of `localhost` to avoid DNS/IPv6 resolution issues
- **Global connection timeout**: Added 15-second global timeout wrapper around `connect()` to prevent hanging forever when individual timeouts fail
- **Better WebSocket handling**: Added `settled` flag to properly handle timeout/open/error/close race conditions

### Changes

- **Faster retry loop**: Reduced retry attempts from 30 to 5 since `maintainLoop` retries every 3 seconds anyway
- **Allow own extension pages**: Added `OUR_EXTENSION_IDS` to allow attaching to our own extension pages while blocking other extensions

## 0.0.67

- Initial changelog
