Scaffolding FronEnd
==================

Installation
------------

- Prerequisites (see _Technology Stack_):

    * [NodeJS](https://nodejs.org/en/) with [npm](https://www.npmjs.com/)
    * [Gulp](http://gulpjs.com/)
    * [Bower](http://bower.io/)
    * [EditorConfig](http://editorconfig.org/)


- Install:
    ```bash
    cd ~/code
    git clone [gitrepo]
    cd Scaffold
    git checkout develop
    npm install
    bower install
    ```

Run server
----------

```bash
gulp serve
```

- Your default web browser should have opened [http://localhost:9000/](http://localhost:9000/)


Build
-----

```bash
gulp build
```

That will create all the build files under the `dist` directory.

If on top of creating the builds you want to start a local server, run:

```bash
gulp serve:build
```

Technology Stack
---------------

- [Sass](http://sass-lang.com "Sass")
- [Borwserify](http://browserify.org/)
- [BabelJS](https://babeljs.io/)
- Handlebars
- jquery

Naming & Selectors
------------------
- Use BEM methodology [https://en.bem.info/method/](https://en.bem.info/method/)
- All JS target ids and classes should be prefaced with `js-classname`, **CSS selectors should not be used as JS targets**
- Classes only for CSS
- As flat a CSS structure as possible (avoid nesting, specificity wars at all costs)
- **Please do not use !important**
- **Mobile first** - Use min-width media queries are extremely helpful when it comes to coding responsive websites because it reduces code complexity.
