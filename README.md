
## Getting Started

First Install development dependencies, ensure you have nodejs installed and install the following tools:

[Gulp](http://gulpjs.com/) command line utility:

  `npm install -g gulp`

[Bower](http://bower.io/) command line utility:
  
  `npm install -g bower`

[Karma](http://karma-runner.github.io/0.12/index.html) command line utility:
  
  `npm install -g karma`


###Ensure node tools and gulp plugins are up to date:

  `npm install`

will install dependencies defined in **package.json** file

  `bower install`

will install front end dependencies defined in **bower.json** file.

## Tasks

- To see a list of options tasks and sub tasks

  `gulp`

- To build project files for development, serve browser and watch all project files:

  `gulp serve`

- To build project files for production, serve browser and watch all project files:

  `gulp serve:dist`

- To run unit tests

  `gulp test`

## Usage

### Node Modules
  
  - `/node_modules` is a dynamic directory where npm modules are installed.

  - `package.json` is the configuration file for npm modules.

### Bower
 
 - `/bower_components` is a dynamic directory where bower components are installed.

 -  `bower.json` is the configuration file for your bower components.


### Gulp
Gulp related files are in `/gulp`
  
  - config file `/gulp/config.js`

  - tasks are in `/gulp/tasks`

  - utility functions in `/gulp/util`


### Application files

The `/src` directory should contain all the files needed for the application.

  - `src/app` all files related to the `admin-dashboard` application.

    - `src/app/filters` all `admin-dashboard` filters.

    - `src/app/libs` third party code that cannot be installed via bower.

    - `src/app/modules` modules that are dependencies of the `admin-dashboard` module.

    - `src/app/services` all `admin-dashboard` services.

    - `src/app/views` `admin-dashboard` views.

  - `src/images` all `admin-dashboard` images.

    - `src/images/sprites` all images that are to be compiled into a single sprite sheet.

  - `src/sass` top level styles for `admin-dashboard`.

    - `src/sass/styles.scss` all SASS files should be imported through here.

### Dynamic directories
**No code or assets should be saved to either of these directories.**

 - `/build` application files will be compiled for development.

 - `/dist` application files will be compiled for distribution.

### Style Guide

From development environment go to [http://localhost:3000/#/style-guide](http://localhost:3000/#/style-guide) to view style guide.


### Unit Tests

Additional matchers for the Jasmine BDD JavaScript testing library have been added to this project, refer to [Jasmine Matchers](https://github.com/JamieMason/Jasmine-Matchers) for more.
