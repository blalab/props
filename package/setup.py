"""
Props Package
Custom handlers, blueprints, and utilities for the Props extension
"""

from setuptools import setup, find_packages

setup(
    name="renglo-props",
    version="1.0.0",
    description="Props custom handlers, blueprints, and utilities",
    author="Renglo Team",
    license="MIT",
    packages=find_packages(),
    python_requires=">=3.12",
    install_requires=[
        "requests>=2.32.0",  # for api calls
    ],
    include_package_data=True,
    package_data={
        'props': ['blueprints/*.json'],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.12",
    ],
)
