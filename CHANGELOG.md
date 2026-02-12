# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed critical logic error in `LocalTime.js` where `indexOf()` was incorrectly used for cache lookup.
- Improved cache validation in `LocalTime.js` to prevent collisions.
- Fixed timezone comparison in `LocalTime.js` using Temporal API `.id`.
- Fixed bug in `JsonParse.js` where single-line comments were not correctly terminated by `\n`.

### Changed
- Refactored project structure: moved `ProgramData.js` and `ProgramSelection.js` to `src/data/` and `model.js` to `src/store/`.
- Refactored `LocalTime.js` to use `toLocaleString()` for robust time formatting.
- Modernized ISO date generation in `LocalTime.js`.
- Standardized `localStorage` handling for boolean values.
- Cleaned up unused code and improved robustness of configuration checks in `LocalTime.js`.

### Added
- Initial unit test suite for `LocalTime.js` using Vitest.
- Mocking infrastructure for `localStorage` and `Temporal` in tests.
- Unit test suite for `JsonParse.js` covering comments, nested structures, and multiple entities.
- Unit test suite for `Format.js`.

## [0.1.0] - 2026-02-12
- Initial release.
