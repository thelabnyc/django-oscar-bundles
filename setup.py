#!/usr/bin/env python
import codecs
import os.path
from setuptools import setup
from versiontag import get_version, cache_git_tag


packages = [
    'bundles',
    'bundles.api',
    'bundles.dashboard',
    'bundles.migrations',
    'bundles.templatetags',
    'bundles.tests',
]

setup_requires = [
    'versiontag>=1.1.0',
]

requires = [
    'Django>=1.8.12',
    'django-oscar>=1.2.1',
    'django-oscar-api>=1.0.4',
]


def fpath(name):
    return os.path.join(os.path.dirname(__file__), name)

def read(fname):
    return codecs.open(fpath(fname), encoding='utf-8').read()

cache_git_tag()

setup(
    name='django-oscar-bundles',
    description="An extension on top of django-oscar providing product bundle functionality.",
    version=get_version(pypi=True),
    long_description=open('README.rst').read(),
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Framework :: Django :: 1.8',
        'Framework :: Django :: 1.9',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: ISC License (ISCL)',
        'Operating System :: Unix',
        'Operating System :: MacOS :: MacOS X',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
    author='Craig Weber',
    author_email='crgwbr@gmail.com',
    url='https://gitlab.com/thelabnyc/django-oscar-bundles',
    license='ISC',
    packages=packages,
    include_package_data=True,
    install_requires=requires,
    setup_requires=setup_requires
)
