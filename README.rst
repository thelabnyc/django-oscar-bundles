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
