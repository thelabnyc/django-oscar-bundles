# Changes

## v2.3.0 (2025-04-03)

### Feat

- add support for Django 5.0

### Fix

- **deps**: update react monorepo to ^19.1.0
- **deps**: update dependency phonenumbers to ^9.0.2
- **deps**: update dependency phonenumbers to v9
- **deps**: update dependency django to ^4.2.20
- **deps**: update dependency react-select to ^5.10.1
- **deps**: update dependency core-js to ^3.41.0
- **deps**: update dependency phonenumbers to ^8.13.55
- **deps**: update dependency django-stubs-ext to ^5.1.3
- **deps**: update dependency django to ^4.2.19
- **deps**: update dependency phonenumbers to ^8.13.54
- **deps**: update dependency react-select to ^5.10.0

### Refactor

- add pyupgrade / django-upgrade precommit hooks

## v2.2.3 (2025-01-24)

### Fix

- add type annotations (#28357)
- **deps**: update dependency phonenumbers to ^8.13.53
- **deps**: update dependency django to ^4.2.18
- **deps**: update react monorepo to v19
- list bundle types via GET instead of OPTIONS request
- **deps**: update dependency core-js to ^3.40.0
- **deps**: update dependency react-modal to ^3.16.3
- **deps**: update dependency react-select to ^5.9.0
- **deps**: update dependency phonenumbers to ^8.13.52
- **deps**: update dependency io-ts to ^2.2.22
- **deps**: update dependency django to ^4.2.17
- **deps**: update dependency phonenumbers to ^8.13.51
- **deps**: update dependency phonenumbers to ^8.13.50
- **deps**: update dependency react-select to ^5.8.3
- **deps**: update dependency phonenumbers to ^8.13.49
- **deps**: update dependency core-js to ^3.39.0
- **deps**: update dependency tslib to ^2.8.1
- **deps**: update dependency react-select to ^5.8.2
- **deps**: update dependency phonenumbers to ^8.13.48
- **deps**: update dependency tslib to ^2.8.0
- remove @babel/plugin-syntax-dynamic-import plugin
- **deps**: update dependency phonenumbers to ^8.13.47
- **deps**: update dependency phonenumbers to ^8.13.46

## v2.2.2 (2024-09-25)

### Fix

- **deps**: update dependency django-oscar-api to v3.3.0
- **deps**: update dependency react-select to ^5.8.1
- **deps**: update dependency django-oscar to v3.2.5
- pin django-oscar version due to breaking changes in patch versions
- **deps**: update dependency phonenumbers to ^8.13.45
- **deps**: update dependency django to ^4.2.16

## v2.2.1 (2024-08-31)

### Fix

- **deps**: update dependency phonenumbers to ^8.13.44
- **deps**: update dependency tslib to ^2.7.0
- **deps**: update dependency core-js to ^3.38.1
- **deps**: update dependency phonenumbers to ^8.13.43
- **deps**: update dependency django to ^4.2.15

## v2.2.1b0 (2024-08-08)

### Fix

- **deps**: update dependency core-js to ^3.38.0
- **deps**: update dependency phonenumbers to ^8.13.42
- **deps**: update dependency fp-ts to ^2.16.9
- **deps**: update dependency django to ^4.2.14
- **deps**: update dependency tslib to ^2.6.3
- **deps**: update dependency fp-ts to ^2.16.8
- **deps**: update dependency regenerator-runtime to ^0.14.1
- **deps**: update dependency react-select to ^5.8.0
- **deps**: update dependency react-modal to ^3.16.1
- **deps**: update dependency phonenumbers to ^8.13.40
- **deps**: update dependency lunr to ^2.3.9
- **deps**: update dependency js-cookie to ^3.0.5
- **deps**: update dependency io-ts to ^2.2.21
- **deps**: update dependency fp-ts to ^2.16.7
- **deps**: update dependency django to ^4.2.13
- **deps**: update dependency core-js to ^3.37.1
- **deps**: update dependency classnames to ^2.5.1
- **deps**: update dependency phonenumbers to v8.13.39
- **deps**: update dependency phonenumbers to v8.13.38
- **deps**: update dependency tslib to v2.6.3
- **deps**: update dependency react-select to v5.8.0
- **deps**: update dependency regenerator-runtime to ^0.14.0
- **deps**: update dependency fp-ts to v2.16.6
- **deps**: update dependency core-js to v3.37.1
- **deps**: update dependency classnames to v2.5.1
- **deps**: update dependency phonenumbers to v8.13.37
- **deps**: update dependency js-cookie to v3.0.5
- **deps**: update dependency io-ts to v2.2.21
- **deps**: update dependency django-oscar to v3.2.4
- **deps**: update dependency django to v4.2.13

## v2.2.0

- Add support for django-oscar 3.2.2
- Add support for django 4.2

## v2.1.0

- Added the ability to temporarily deactivate a bundle.
- Add Python 3.11 to test suite.
- Add Oscar 3.2 to test suite.
- Fix deprecation warnings for Django 4.0 and 4.1
- Upgrade JS build process from Node.js v14 to v18.

## v2.0.1

- Fix bug in bundle edit form when removing suggested parents.

## v2.0.0

- Oscar 3.0 Compatibility

## v1.0.0


## v0.4.1

- Fix bug breaking image uploads in the bundle group API.

## v0.4.0

- Add support for django-oscar 2.x.
- Drop support for django-oscar 1.x.

## v0.3.3

- Internationalization

## v0.3.2

- Make "Headline" field a TextField so it can store long HTML strings.

## v0.3.1

- Add new "Headline" field to bundle groups for holding UI text.

## v0.3.0

- MAJOR rewrite of bundle functionality with a much improved dashboard interface.

## v0.2.8

- Fix Django 2.0 Deprecation warnings.

## v0.2.7

- Adds support for Django 1.11 and Oscar 1.5

## v0.2.6

- Improve testing with tox.

## v0.2.5

- Updated dependencies

## v0.2.4

- Add view caching to bundles API

## v0.2.3

- Fix 500 when deleting a bundle group

## v0.2.2

- Add searching and filtering

## v0.2.1

- Added working bundle group bundle_set editing in dashboard

## v0.2.0

- Add optional bundle groupings

## v0.1.0

- Initial release.
- Renamed package to `oscarbundles` for consistency.
