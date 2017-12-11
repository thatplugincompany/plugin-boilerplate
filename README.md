# ThatPluginCompany Plugin Boilerplate

A standardized, organized, object-oriented foundation for building high-quality WordPress plugins.

## Installation

1. Rename `plugin-boilerplate.php` and change the plugin name at the top of the file.
2. Change the name, description and config in `package.json`. Make sure the name only contains letters, numbers and spaces.
3. If necessary, change the minimum PHP version in `plugin-boilerplate.php`. It appears twice, once in the file header and once in the version check.
4. Run the following commands:
```sh
$ yarn install
$ yarn dev
```
5. Start developing!

To enable automatic reloading with BrowserSync, include a proxy URL like so: `yarn dev --url http://thatplugincompany.dev`

To build a distributable zip file, run `yarn build`.
