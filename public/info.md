# About ConClár for MetropolCon 2026 (Fork with i18n Support)

ConClár is an online program guide tool for conventions developed in React.
It is intended to work in all modern browsers. It is designed to work equally well on mobile and desktop devices.

**ConClár is Copyright James Shields, 2022, and made available as an open source project under the MIT licence.**

ConClár is inspired by Eemeli Aro's [KonOpas](https://github.com/eemeli/konopas). As this uses a number of unsupported libraries, 
ConClár was developed as a completely 
new application, rather than trying to patch up the old code.
ConClár can be hosted on most webservers. 
The programme data is stored as JSON, and is compatible with KonOpas files. 

The version is a fork of [ConClár](https://github.com/lostcarpark/conclar), enhanced with internationalization (i18n) support
and implemented for **MetropolCon 2026, the 2026 EuroCon**.
It is hosted on GitHub at https://github.com/MacPatric/conclar.

**What's different in this fork:**
- **React 19**: Upgraded to React 19
- **Internationalization (i18n)**: Full support for multiple languages using react-i18next
- **Language files**: Currently includes English and German translations
- **Easy translation**: Most user-facing text can be translated via JSON files
- **Unit tests**: Includes many unit tests for key functionalities
