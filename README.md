MazeWorld Randoms API
=====================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An API for returning random items from the MazeWorld items database.  Relies upon [datafiles](https://github.com/antoligy/mzw-data-files).


Contents
--------

  - [Requirements](#requirements)
  - [Running Locally](#running-locally)


Requirements
------------

The MazeWorld Randoms API requires [Node.js](https://nodejs.org/en/) 7.x and [yarn](https://yarnpkg.com/lang/en/).


Running Locally
---------------

``` git submodule init && git submodule update ```

This will retrieve the submodule housing the data files for the MzW Randoms API.  If you do not have access to these, you may create dummy data files for the meantime.

``` yarn start ```

This will spawn a local server on port 3000, which can be accessed at http://localhost:3000/.
