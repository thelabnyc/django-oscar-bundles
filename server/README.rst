=========================
django-oscar-bundles
=========================

An extension on top of django-oscar providing product bundle functionality.

Use Cases
=========

Bundles can be used to recommend groups of products from another groups products.
Bundles do not include offers - however it may be used in combination with an offer.

- The user has a bed and a mattress in their cart - recommend a sheet set.
- The user has a pillow in their cart - recommend adding another pillow and sheet set with copy about a discount. The discount is set up in Oscar's offer section.
- Add a bundle group for a bed base and mattress. Each product has varients with sizes. Enter common copy and images on the group retaled to the parent product. Add bundles for various sizes (Queen size bed matches queen size mattress and medium sized pillow)

Changelog
=========

2.0.0
------------------
- Oscar 3.0 Compatibility

1.0.0
------------------

0.4.1
------------------
- Fix bug breaking image uploads in the bundle group API.

0.4.0
------------------
- Add support for django-oscar 2.x.
- Drop support for django-oscar 1.x.

0.3.3
------------------
- Internationalization

0.3.2
------------------
- Make "Headline" field a TextField so it can store long HTML strings.

0.3.1
------------------
- Add new "Headline" field to bundle groups for holding UI text.

0.3.0
------------------
- MAJOR rewrite of bundle functionality with a much improved dashboard interface.

0.2.8
------------------
- Fix Django 2.0 Deprecation warnings.

0.2.7
------------------
- Adds support for Django 1.11 and Oscar 1.5

0.2.6
------------------
- Improve testing with tox.

0.2.5
------------------
- Updated dependencies

0.2.4
------------------
- Add view caching to bundles API

0.2.3
------------------
- Fix 500 when deleting a bundle group

0.2.2
------------------
- Add searching and filtering

0.2.1
------------------
- Added working bundle group bundle_set editing in dashboard

0.2.0
------------------
- Add optional bundle groupings

0.1.0
------------------
- Initial release.
- Renamed package to `oscarbundles` for consistency.
