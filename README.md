# About ConClár for MetropolCon 2026 (Fork with i18n Support)

ConClár is an online program guide tool for conventions developed in React.
It is intended to work in all modern browsers. It is designed to work equally well on mobile and desktop devices.

**ConClár is Copyright James Shields, 2022, and made available as an open source project under the MIT licence.**

ConClár is inspired by Eemeli Aro's [KonOpas](https://github.com/eemeli/konopas). As this uses a number of unsupported libraries,
ConClár was developed as a completely
new application, rather than trying to patch up the old code.
ConClár can be hosted on most webservers.
The programme data is stored as JSON, and is compatible with KonOpas files.

This version is a fork of [ConClár](https://github.com/lostcarpark/conclar), enhanced with internationalization (i18n) support
and implemented for **MetropolCon 2026, the 2026 EuroCon**.
It is hosted on GitHub at https://github.com/MacPatric/conclar.

**What's different in this fork:**
- **React 19**: Upgraded to React 19
- **Internationalization (i18n)**: Full support for multiple languages using react-i18next
- **Language files**: Currently includes English and German translations
- **Easy translation**: Most user-facing text can be translated via JSON files
- **Unit tests**: Includes many unit tests for key functionalities

## Getting Started

ConClár requires `npm` to install its dependencies. This is part of [Node.js](https://nodejs.org/), so start by going to the [Node.js download page](https://nodejs.org/en/download/). Grab the latest installer for your operating system, and install it. You should do this on your local computer, not your webserver.

Next create a local directory for your ConClár project. You can put this anywhere in your filesystem.

Next you need to get the code from GitHub. You can either use the download link
to get a Zip file, or clone the project with the `git` command. If you are
customising for your convention, you should consider creating a fork so that you
can merge in future changes.

ConClár requires a configuration file called in the `/src/` directory called
`config.json`. To avoid local customizations getting pushed to the main
repository, this not included. Instead, there is a sample config file that is a
good starting point. You should copy this to the correct name. If you have a
fork of the project, you may want to remove `/src/config.json` from
`.gitignore`, to track your convention's customizations. You can copy the
example with the following command:

```cp src/config_example.json src/config.json```

Once you've done that, run the following from a command prompt in the directory you created above:

```npm install```

This will install everything needed to run the project.

## Available Scripts

In the project directory, you can run:

```npm start```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

```npm run build```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [React app deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Customisation

### Internationalization (i18n)

This fork includes full internationalization support using react-i18next. User-facing text is now stored in language files rather than in `config.json`.

#### Language Files

Translation files are located in `src/locales/`:
- `en.json` - English translations
- `de.json` - German translations

Each language file contains translations organized by feature area:

```json
{
  "app_title": "MetropolCon 2026 Programme Guide",
  "navigation": {
    "program": "Programme",
    "people": "People",
    "myschedule": "My Schedule"
  },
  "program": {
    "no_items": "No items found.",
    "search": {
      "search_label": "Search title, desc, or people"
    }
  }
}
```

#### Adding a New Language

1. Copy `src/locales/en.json` to `src/locales/[language-code].json`
2. Translate all values (keep keys unchanged)
3. Edit `src/i18n.js` to import and register the new language:

```javascript
import newLanguage from './locales/new-language.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    de: { translation: deTranslations },
    'new-language': { translation: newLanguage }
  },
  // ...
});
```

#### Customizing Translations

To customize text for your convention, edit the appropriate language file(s). The following settings that were previously in `config.json` are now in the language files:

**Previously in config.json, now in language files:**
- `APP_TITLE` → `app_title`
- `NAVIGATION.*` → `navigation.*`
- `HELP_TEXT.*` → `help_text.*`
- `LOCATIONS.LABEL` → `locations.label`
- `APPLICATION.LOADING.MESSAGE` → `application.loading.message`
- `PROGRAM.LIMIT.*` → `program.limit.*`
- `PROGRAM.MY_SCHEDULE.*` → `program.my_schedule.*`
- `TAGS.*` → `tags.*`
- `FILTER.RESET.LABEL` → `filter.reset.label`
- `PERMALINK.*` → `permalink.*`
- `EXPAND.*` → `expand.*`
- `LOCAL_TIME.*` → `local_time.*`
- `TIME_FORMAT.*` → `time_format.*`
- `DURATION.*` → `duration.*`
- `START_TIME.*` → `start_time.*`
- `SHOW_PAST_ITEMS.*` → `show_past_items.*`
- `PEOPLE.*` (labels and text) → `people.*`
- `SETTINGS.*` → `settings.*`
- `INFORMATION.*` → `information.*`
- `FOOTER.*` → `footer.*`
- `DEBUG_MODE.*` (labels) → `debug_mode.*`

All other settings remain in `config.json`.

### Configuration File

The main place for technical customisations is the `src/config.json` file. Settings currently available include:

- `APP_ID`: A unique id to distinguish between instances of multi-year conventions.
- `PROGRAM_DATA_URL`: The address of the file containing programme data.
- `PEOPLE_DATA_URL`: The address of the file listing people. If these are the same, both will be read from one file, but programme data must come before people data.
- `FETCH_OPTIONS`: A JSON object containing options to pass when fetching data. See JavaScript [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/fetch) documentation for available valies. Typical examples:
  - `"cache": "reload"` - Should always be used so beck end program updates will be read.
  - `"credentials": "omit"` - Use if source is not using a certificate from a recognised authority, e.g. a self signed cert.
  - `"headers": { "Origin": "http://example.com" }` - Headers sent in the fetch. Origin may be required for Cross Origin Resource Sharing (CORS).
- `TIMEZONE`: The name of the timezone where your convention takes place. Viewers outside convention timezone will see times in convention time, and their local time below it.
- `TIMEZONE_CODE`: The short code for the convention timezone. Set to blank to get browser code for timezone (not recommended, as it may not select the most elegant short code).
- `INTERACTIVE`: Set to `false` to get a non-interactive, expanded view of the schedule. The info page is also included, but not the participant list, individual participant pages, or individual item pages (regardless of the `PERMALINK.SHOW_PERMALINK` setting).
- `HEADER`: Add an optional image to the header of the pages.
- `HEADER.IMG_SRC`: Set to the image filename to display. May be a file in the public directory. Leave blank for no image.
- `HEADER.IMG_ALT_TEXT`: Set to the alt text that should display for the image.
- `HEADER.LINEFEED_AFTER_URL`: If true, place a line feed after the image.
- `NAVIGATION.EXTRA`: An array of extra menu links. Each entry should take the form: `{ "LABEL": "Octocon Home", "URL": "https://octocon.com" }`. To have no extra links, set to `"EXTRA": []` or delete `EXTRA` entry altogether. Note: Navigation labels are now in language files (see i18n section above).
- `LOCATIONS.SEARCHABLE`: Whether the location list can be searched by typing. (Searching can be inconvenient on touch screens.)
- `LOCATIONS.MAPPING`: Array of locations, with links to show on map. Each room should be specified as: `{ "KEY": "Room name", "MAP_URL": "link to map" }`.
- `PROGRAM.LIMIT.SHOW`: If true, "limit number of items" drop-down will be displayed.
- `PROGRAM.LIMIT.OPTIONS`: Options for limit drop-down - should be an array of integers.
- `PROGRAM.LIMIT.DEFAULT`: Default for limit drop-down.
- `PROGRAM.LIMIT.SHOW_MORE.NUM_EXTRA`: Number of items to add when "Show more" pressed.
- `PROGRAM.MY_SCHEDULE.SHARE.MAX_LENGTH`: Maximum number of characters in each link.
- `TAGS.SEARCHABLE`: Whether the tag list can be searched by typing (unless separated).
- `TAGS.HIDE`: If true, hide the tags drop-down. Tags still displayed on items.
- `TAGS.SEPARATE`: An array of tag prefixes to separate into individual drop-downs, and if drop-down is searchable or hidden. Tags should be specified as follows: `{ "PREFIX": "type", "PLACEHOLDER": "Select type", "SEARCHABLE": true|false, "HIDE": true|false }`. Note: PLACEHOLDER is now in language files.
- `TAGS.FORMAT_AS_TAG`: If set to true, turns Grenadine item format into a KonOpas-style "type" tag.
- `TAGS.DAY_TAG.GENERATE`: If set to true, will generate tags for each day of the convention.
- `TAGS.DAY_TAG.DAYS`: Object with key values pairs for day names. Keys are day numbers from 1 (Monday) to 7 (Sunday).
- `TAGS.DAY_TAG.SEARCHABLE`: Whether day tag list can be searched by typing.
- `TAGS.DAY_TAG.HIDE`: If true, hide day tags drop-down. Day tags still shown on items if GENERATE true.
- `TAGS.DONTLIST`: An array of tags not to list in the drop-downs and programme item tag lists.
- `HIDE_BEFORE.HIDE`: If true hide "hide before" dropdown. If false, show dropdown containing times to hide items before.
- `HIDE_BEFORE.TIMES`: Array of times to list in hide before drop-down. Each entry should be specified as follows: { "TIME": "time in hh:mm:ss format", "LABEL_24H": "24 hour label", "LABEL_12H": "12 hour label" }. Time should be in convention timezone.
- `PERMALINK.SHOW_PERMALINK`: If true, display a "permalink" icon when each program item is expanded.
- `EXPAND.SPRING_CONFIG`: Config to apply to the configuration of the 'spring' when expanding items. This may be a simply duration, such as `{ "duration": 100 }` to expand in 100ms, or can configure more dynamic spring effects, such as `{ mass: 1, tension: 1000, friction: 30 }`. Full list of options in [react-spring documentation](https://react-spring.io/common/configs).
- `ITEM_DESCRIPTION.PURIFY_OPTIONS`: Pass additional options to DOMPurify when processing item descriptions. For the available options, see [the DOMPurify documentation](https://github.com/cure53/DOMPurify#can-i-configure-dompurify). Format options as JSON, _e.g._, `{"FORBID_ATTR": ["style"]}`.
- `LINKS`: An array of link types expected in the program data.  Individual entries should take the form `{"NAME": "signup", "TEXT": "Click to sign up", "TAG": ""}`.  `NAME` should be the name of the link as it appears in the links object in the program data.  `TEXT` is the text that should appear on this link in ConClár.  `TAG` is an optional tag to add to every program item which includes a matching link.  If using prefixed tags, include the prefix, *e.g.*, `"type:Workshop"`.
- `TIME_FORMAT.DEFAULT_12HR`: Set to true if you want time displayed in 12 hour format by default.
- `TIME_FORMAT.SHOW_CHECKBOX`: If set to false, users will not be given option to change between 12 and 24 hour time.
- `DURATION.SHOW_DURATION`: If true, `mins` from program data will be displayed.
- `SHOW_PAST_ITEMS.SHOW_CHECKBOX`: Set to true to show the option during the convention; otherwise past programme items are shown by default.
- `SHOW_PAST_ITEMS.ADJUST_MINUTES`: Some wiggle room (in minutes) in order not to hide past items immediately as they start.
- `PEOPLE.THUMBNAILS.SHOW_THUMBNAILS`: Set to false to not show member thumbnails (useful to remove spurious controls if pictures not in file).
- `PEOPLE.THUMBNAILS.SHOW_CHECKBOX`: Set to false to hide "Show thumbnails" checkbox.
- `PEOPLE.THUMBNAILS.DEFAULT_IMAGE`: Set to default thumbnail for participants with no photo. Can be filename of image in public directory, or external URL. Leave blank for no default thumbnail.
- `PEOPLE.SORT.SHOW_CHECKBOX`: Set to false to hide "Sort by full name" checkbox. Useful if your data only contains "name for publications".
- `PEOPLE.TAGS.SEARCHABLE`: Whether the tag list can be searched by typing (unless separated).
- `PEOPLE.TAGS.HIDE`: If true, hide the tags drop-down. Tags still displayed on items.
- `PEOPLE.TAGS.SEPARATE`: An array of tag prefixes to separate into individual drop-downs, and if drop-down is searchable or hidden. Tags should be specified as follows: `{ "PREFIX": "type", "PLACEHOLDER": "Select type", "SEARCHABLE": true|false, "HIDE": true|false }`. Note: PLACEHOLDER is now in language files.
- `PEOPLE.SEARCH.SHOW_SEARCH`: Set to false to hide "people" search box.
- `PEOPLE.BIO.PURIFY_OPTIONS`: Pass additional options to DOMPurify when processing participant bios. For more details, see `ITEM_DESCRIPTION.PURIFY_OPTIONS` above.
- `INFORMATION.MARKDOWN_URL`: The address of the markdown file containing additional information about the convention.
- `TIMER.FETCH_INTERVAL_MINS`: Number of minutes between refreshes of program data.
- `TIMER.TIMER_TICK_SECS`: Number of seconds between checks of timer.
- `DEBUG_MODE.ENABLE`: If true, display banner showing online status, and allowing manual data fetch.

**Note:** Many text labels and messages that were previously in `config.json` have been moved to language files (`src/locales/en.json`, `src/locales/de.json`, etc.). See the Internationalization section above for details on customizing user-facing text.

To customise the site heading, edit the `src/components/Header.js` file.

The convention information page is composed in Markdown using the provided file, `public/info.md`. Markdown is a common standard for formatting text that is easy to follow and safer than HTML. There is a handy cheat sheet.

To change the styling, edit `src/App.css`. Note that the current styling is temporary, and a better default theme with easier customisation is planned.

To change the home screen app name, edit `public/manifest.json`.

## Hosting

ConClár is fairly simple to host on most webservers. However it does require that all requests get directed to index.html. Instruction for this on Apache and Nginx are included below.

After running `npm run build` just copy the build directory to the public directory of your webserver.

### Hosting in a subdirectory

If you need to put ConClár in a subdirectory on your webserver, you'll need to carry out the following additional steps:

1. Edit the `package.json` file and add a `homepage` setting as shown below.
2. Set appropriate settings for the webserver to find the `index.html` in the subdirectory.
3. Use `npm run build` to prepare the application to upload.

The `package.json` file should start as follows:

```
  {
    "name": "conclar",
    "version": "0.1.0",
    "private": true,
    "homepage": "/guide",
  ...
```

### Hosting on Apache

On Apache, the easiest way to direct traffic to `index.html` is by way of a `.htaccess` file. A default .htaccess is included in the `public` directory. This will get copied to the `build` directory, but may get hidden when you copy to your webserver. The contents are as follows:

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
    RewriteRule . /index.html [L]
</IfModule>
```

If you are hosting in a subdirectory, modify `.htaccess` as follows (replace "guide" with the folder you are hosting in):

```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /guide/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-l
    RewriteRule . /guide/index.html [L]
</IfModule>
```

### Hosting on Nginx

On Nginx, the following needs to go in your `.conf` file:

```
    location / {
            try_files $uri /index.html;
    }
```

For hosting in a subdirectory, this should be altered as follows:

```
    location /guide {
            try_files $uri /guide/index.html;
    }
```

## File Format

The ConClár file format is designed to be compatible with KonOpas, and in most cases data files for KonOpas can be used without modification.

Full details of the file format are in a separate [Data Structure document](https://github.com/lostcarpark/conclar/blob/main/docs/conclar_file_specs.md).

## Credits

ConClár is Copyright James Shields, 2022, and made available as an open source project under the MIT licence.

Thanks to:

- Eemeli Aro for developing KonOpas, which was the inspiration for ConClár.
- M. C. DeMarco for work on styling and lots of helpful suggestions.
- Leane Verhulst for testing and documentation contributions.
- Annemarie Nungent for checking my Irish.
- Fionna O'Sullivan for proofreading and awesome suggestions.

The included "rainbow head" thumbnail image is a public domain image available on [Open Clipart](https://openclipart.org/detail/296715/rainbow-head-2).
