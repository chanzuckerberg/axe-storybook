/* eslint-env node, mocha */
import assert from 'assert';
import each from 'lodash/each';
import groupBy from 'lodash/groupBy';
import playwright from 'playwright';
import * as AxePage from './AxePage';
import * as Options from './Options';
import * as ProcessedStory from './ProcessedStory';
import * as Result from './Result';
import * as StorybookPage from './StorybookPage';

const options = Options.parse();

async function writeTests() {
  // Get a browser page and navigate to Storybook's static iframe.
  const browser = await playwright[options.browser].launch({ headless: options.headless });
  const context = await browser.newContext({ bypassCSP: true });
  const page = await context.newPage();
  await page.goto('file://' + options.iframePath);

  // Load the stories from Storybook's static iframe. Then process and organize them.
  const rawStories = await StorybookPage.getStories(page);
  const processedStories = ProcessedStory.fromStories(rawStories);
  const storiesByComponent = groupBy(processedStories, 'componentTitle');

  // Get the page ready for running axe on it.
  await AxePage.prepare(page);

  describe(`[${options.browser}] accessibility`, function () {
    after(async function () {
      await browser.close();
    });

    each(storiesByComponent, (stories, componentTitle) => {
      describe(componentTitle, () => {
        stories.forEach((story) => {
          const testFn = ProcessedStory.isEnabled(story) ? it : it.skip;

          testFn(story.name, async function () {
            const result = await Result.fromPage(page, story);

            if (result.violations.length === 0) {
              assert.ok('Nice');
            } else {
              assert.fail('\n' + Result.formatViolations(result));
            }
          });
        });
      });
    });
  });

  // Magic function injected by Mocha, signalling that the tests have been defined and are ready to
  // be ran. Only works because `delay: true` is passed to the Mocha constructor in index.ts.
  run();
}

writeTests();
