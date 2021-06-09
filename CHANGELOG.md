# Changelog

## Unreleased

- [breaking] Drop support for Node 10 [#28](https://github.com/chanzuckerberg/axe-storybook-testing/pull/28)

## 3.0.2 (2021-04-08)

- [fix] Make ts-dedent a regular, instead of dev, dependency [#27](https://github.com/chanzuckerberg/axe-storybook-testing/pull/27)
- Update all dependencies

## 3.0.1 (2021-03-03)

- [fix] Lower supported Node version from 12 to 10 [#25](https://github.com/chanzuckerberg/axe-storybook-testing/pull/25)
- Update dependencies [#26](https://github.com/chanzuckerberg/axe-storybook-testing/pull/26)

## 3.0.0 (2021-03-02)

- [fix] Upgrade playwright to v1.8.0
- [new] A `--storybook-address` option has been added. Provide a URL where your storybook server is hosted to test those stories instead of using a static build directory. [#23](https://github.com/chanzuckerberg/axe-storybook-testing/pull/23)
- [breaking] Rename `disabled` option to `skip`, to match percy-storybook [#24](https://github.com/chanzuckerberg/axe-storybook-testing/pull/24)

## 2.0.1 (2021-01-22)

- [fix] Handle errors during browser initialization - [#22](https://github.com/chanzuckerberg/axe-storybook-testing/pull/22)
- [maintenance] Refactor browser functionality into a single class - [#13](https://github.com/chanzuckerberg/axe-storybook-testing/pull/13)
- [maintenance] Group suite files into a suite/ directory - [#19](https://github.com/chanzuckerberg/axe-storybook-testing/pull/19)

## 2.0.0 (2021-01-04)

- [breaking] axe-core is now a peer dependency (anyone using this library will need to install axe-core themselves) - [#11](https://github.com/chanzuckerberg/axe-storybook-testing/pull/11)
- [new] A `--format` option has been added. The only possible value of it currently is `spec` (which is also the default) - [#10](https://github.com/chanzuckerberg/axe-storybook-testing/pull/10)
- Removed the mocha dependency and implemented our own test formatting - [#8](https://github.com/chanzuckerberg/axe-storybook-testing/pull/8)
- Updated all dependencies
- [new] A `--failing-impact` option has been added. Specify at what impact level you consider failing - [#9](https://github.com/chanzuckerberg/axe-storybook-testing/pull/9)

## 1.3.0 (2020-10-27)

- [new] Add --pattern option - [#4](https://github.com/chanzuckerberg/axe-storybook-testing/pull/4)
- Add .nvmrc file - [#3](https://github.com/chanzuckerberg/axe-storybook-testing/pull/3)

## 1.2.0 (2020-10-13)

- [new] Add --timeout option
- [fix] Update all dependencies
- [fix] Only parse CLI options once
- Remove unnecessary dev dependencies

## 1.1.2 (2020-09-25)

- [fix] Use `Result.isPassing` to determine if a result... is passing
- Update documentation
- Add `.node-version` file
- Add `demo:setup` script to make local testing easier

## 1.1.1 (2020-09-23)

This release is the same as v1.1.0, but the repo/package has been renamed from axe-storybook to axe-storybook-testing. The new name hopefully better reflects what it does.

## 1.1.0 (2020-09-23)

- [new] Start up Chromium with --force-prefers-reduced-motion, to help prevent animations from causing flakiness. Unfortunately, this doesn't do anything for Firefox or Webkit.

## 1.0.0 (2020-09-20)

v1 release! 🎉

- [breaking] Rename `--build_dir` option to `--build-dir`
- [new] Improve performance by around 5x, by using Storybook's client API to render stories, instead of page navigations.
- [fix] Disable the 'bypass' rule by default.
- [fix] Force one call to `axe.run` to finish before the next can start, preventing [dequelabs/axe-core#1041](https://github.com/dequelabs/axe-core/issues/1041) when things go wrong in a test.
- Update dependencies.
- Change the Mocha reporter to "spec".
- Add integration tests.
- Use types from @storybook/client-api, instead of writing our own, for story data.

## 0.3.0 (2020-09-17)

- [new] Add more information to the failure messages
- [fix] Improve performance by only injecting axe-core onto the page once (and not for every test).
- Update all dependencies

## 0.2.1 (2020-09-16)

- [new] Group checks by the stories's component title
- [fix] Ensure the top-level Mocha `describe` is displayed, by waiting to "write" the tests until the stories have been found

## 0.2.0 (2020-09-14)

- [breaking] Remove `--debug` option
- [new] Add `--headless` option (defaults to true)
- [new] Add `--browser` option (defaults to chromium. Accepts chromium, firefox, or webkit)
- [new] Display the violating html in results
- [fix] Don't log `undefined` to the console when there are test failures
- Switch to [Playwright](https://playwright.dev/), instead of Puppeteer
- Remove AxePuppeteer, and write our own AxePlaywright integration
- Write Mocha tests, instead of doing our own formatting of results

## 0.1.0 (2020-09-11)

Initial release!
