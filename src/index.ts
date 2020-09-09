import createDebug from 'debug';
import yargs from 'yargs';
import getIframePath from './getIframePath';
import getOutputFormat from './getOutputFormat';
import getResults from './getResults';
import getStories from './getStories';
import selectStories from './selectStories';
import * as args from './args';

const debug = createDebug('axe-storybook');

export async function run() {
  const argv = yargs
    .options(args.options)
    .usage(args.usage)
    .help()
    .alias('help', 'h')
    .argv;

  if (argv.help) {
    yargs.showHelp();
    return;
  }

  const options = {
    // Configure debug logging if flag specified, or if it was already enabled via DEBUG env var
    debug: argv.debug || debug.enabled,
    buildDir: argv.build_dir,
    outputFormat: getOutputFormat(argv.output_format),
    failOnEmpty: !!argv.fail_on_empty,
    iframePath: getIframePath(argv.build_dir),
  };

  // Enable debug logging based on options.
  debug.enabled = options.debug;

  const rawStories = await getStories(options.iframePath);
  debug('rawStories %s', JSON.stringify(rawStories));

  const selectedStories = selectStories(rawStories);
  debug('selectedStories %o', selectedStories);

  if (selectedStories.length === 0) {
    const message = 'axe-storybook found no stories in the static storybook.';
    if (options.failOnEmpty) {
      throw new Error(message);
    }
    if (options.outputFormat == 'text') {
      // eslint-disable-next-line no-console
      console.log(message);
    } else if (options.outputFormat == 'json') {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify({ exitReason: message }));
    }
    return;
  }

  const results = await getResults(selectedStories, options.iframePath);
  console.log(results);

  return Promise.resolve(results);
}
