#!/usr/bin/env python
from setuptools import setup, find_packages, Distribution
import codecs
import os.path

# Make sure versiontag exists before going any further
Distribution().fetch_build_eggs("versiontag>=1.2.0")

from versiontag import get_version, cache_git_tag  # NOQA


packages = find_packages("src")

requires = [
    "django>=2.2",
    "django-oscar>=3.0",
    "django-oscar-api>=2.0.0",
    "phonenumbers>=8.8.8",
]

extras_require = {
    "development": [
        "coverage>=4.4.2",
        "flake8>=3.2.1",
        "ipdb>=0.10.3",
        "psycopg2cffi>=2.7.7",
        "sorl-thumbnail>=11.04",
        "sphinx>=1.5.2",
        "tox>=2.6.0",
        "unittest-xml-reporting>=3.0.4",
        "versiontag>=1.2.0",
    ],
}


def fpath(name):
    return os.path.join(os.path.dirname(__file__), name)


def read(fname):
    return codecs.open(fpath(fname), encoding="utf-8").read()


cache_git_tag()

setup(
    name="django-oscar-bundles",
    description="An extension on top of django-oscar providing product bundle functionality.",
    version=get_version(pypi=True),
    long_description=open("README.rst").read(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: ISC License (ISCL)",
        "Operating System :: Unix",
        "Operating System :: MacOS :: MacOS X",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
    ],
    author="Craig Weber",
    author_email="crgwbr@gmail.com",
    url="https://gitlab.com/thelabnyc/django-oscar/django-oscar-bundles/",
    license="ISC",
    package_dir={"": "src"},
    packages=packages,
    include_package_data=True,
    install_requires=requires,
    extras_require=extras_require,
)
