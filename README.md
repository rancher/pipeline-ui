pipeline-ui
--------

Pipeline UI for Rancher 1.6

## Usage

Prerequisites:
* [Bower](from http://bower.io/)
* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) 0.12.x (with NPM)
* [Yarn](https://yarnpkg.com/en/docs/install) (Note Path Setup)

If you're on a Mac and use Homebrew, you can follow these steps:
```bash
  brew install node watchman yarn
  yarn global add bower
```

Setup:
```bash
  git clone 'https://github.com/rancher/ui'
  cd 'ui'
  ./scripts/update-dependencies
```

Run development server:
```bash
  yarn start
```

Connect to UI at https://localhost:8000/. This is intended only for development, see below for distributing customizations.

Run development server pointed at another instance of the Rancher API
```bash
  RANCHER="http://rancher:8080/" yarn start
```

RANCHER can also be `hostname[:port]` or `ip[:port]`.

### Compiling for distribution

Rancher releases include a static copy of the UI passed in during build as a tarball.  To generate that, run:
```bash
  ./scripts/build-static
```

### Running Tests

```bash
  yarn global add ember-cli
```

* `ember test`
* `ember test --server`

### Bugs & Issues
Please submit bugs and issues to [rancher/rancher](//github.com/rancher/rancher/issues) with a title starting with `[Pipeline] `.

Or just [click here](//github.com/rancher/rancher/issues/new?title=%5BPipeline%5D%20) to create a new issue.


#### Useful links

* ember: http://emberjs.com/
* ember-cli: http://www.ember-cli.com/
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

License
=======
Copyright (c) 2014-2017 [Rancher Labs, Inc.](http://rancher.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
