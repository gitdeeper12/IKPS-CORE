"""Setup configuration for IKPS-CORE package."""

from setuptools import setup, find_packages

with open('README.md', 'r', encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='ikps-core',
    version='2.1.0',
    author='Samir Baladi',
    author_email='gitdeeper@gmail.com',
    description='DSFT-TD V2.1: Dynamic Semantic Field Theory - Temporal Framework for Semantic Force Dynamics in Dialogue Systems',
    long_description=long_description,
    long_description_content_type='text/markdown',
    license='MIT',
    url='https://samirbaladi.github.io/ikps-documentation/',
    project_urls={
        'Source': 'https://github.com/gitdeeper12/IKPS-CORE',
        'Documentation': 'https://samirbaladi.github.io/ikps-documentation/',
        'Zenodo': 'https://doi.org/10.5281/zenodo.20303214',
        'OSF': 'https://osf.io/muwt4',
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
        'Topic :: Text Processing :: Linguistic',
    ],
    keywords='semantic, field-theory, dialogue, NLP, entropy, force-dynamics, observer-effect, temporal-modeling',
    packages=find_packages(where='src', exclude=['tests', 'benchmarks', 'validation', 'scripts']),
    package_dir={'': 'src'},
    python_requires='>=3.8',
    install_requires=[
        'numpy>=1.19.0',
        'scipy>=1.5.0',
    ],
    extras_require={
        'dev': ['pytest>=6.0', 'black', 'isort'],
        'benchmark': ['pandas', 'matplotlib'],
    },
    include_package_data=True,
    zip_safe=False,
)
