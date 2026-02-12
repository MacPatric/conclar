# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed critical logic error in `LocalTime.js` where `indexOf()` was incorrectly used for cache lookup.
- Improved cache validation in `LocalTime.js` to prevent collisions.
- Fixed timezone comparison in `LocalTime.js` using Temporal API `.id`.

### Changed
- Refactored `LocalTime.js` to use `toLocaleString()` for robust time formatting.
- Modernized ISO date generation in `LocalTime.js`.
- Standardized `localStorage` handling for boolean values.
- Cleaned up unused code and improved robustness of configuration checks in `LocalTime.js`.

## [0.1.0] - 2026-02-12
- Initial release.
