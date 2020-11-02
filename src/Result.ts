import { analyze } from './AxePage';
import { showStory } from './StorybookPage';
import type { Result as AxeResult, NodeResult } from 'axe-core';
import type { Page } from 'playwright';
import { getDisabledRules, ProcessedStory } from './ProcessedStory';
import { exportAxeAsSarifTestResult } from './SarifOutputter';

/**
 * Violations reported by Axe for a story.
 */
export type Result = {
  name: string;
  violations: AxeResult[];
};

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = ['bypass', 'landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Run Axe on a browser page for a story.
 */
export async function fromPage(page: Page, story: ProcessedStory): Promise<Result> {
  await showStory(page, story);

  const storyDisabledRules = getDisabledRules(story);
  const disabledRules = [...defaultDisabledRules, ...storyDisabledRules];
  const result = await analyze(page, disabledRules);

  const sarifFileName = `${story.storybookId}.sarif`;
  await exportAxeAsSarifTestResult(sarifFileName, result);

  return {
    name: story.name,
    violations: result.violations,
  };
}

/**
 * Determine if a result is passing or not. A result is passing if it has no violations.
 */
export function isPassing(result: Result): boolean {
  return result.violations.length === 0;
}

/**
 * Pretty-print the violations of a result.
 */
export function formatViolations(result: Result): string {
  if (isPassing(result)) { return ''; }

  return [
    'Detected the following accessibility violations!',
    '',
    ...result.violations.map(formatViolation),
  ].join('\n');
}

function formatViolation(violation: AxeResult, index: number) {
  return [
    `${index + 1}. ${violation.id} (${violation.help})`,
    '',
    `   For more info, visit ${violation.helpUrl}.`,
    '',
    '   Check these nodes:',
    '',
    ...violation.nodes.map(formatNode),
  ].join('\n');
}

function formatNode(node: NodeResult) {
  if (node.failureSummary) {
    return [
      `   - html: ${node.html}`,
      `     ${formatSummary(node.failureSummary, 14)}`,
      '',
    ].join('\n');
  }
  return `   - html: ${node.html}\n`;
}

/**
 * Pretty print a node's failure summary.
 *
 * The summary is a string with newlines and tabs within it. We want to split the line up so the
 * first line can be placed on the same line as "summary: ", and all the other lines are on their
 * own lines, but indented far enough to be lined up with the first line.
 *
 * @example
 *
 * formatSummary("Foo\nBar\nBaz", 9)
 *
 * // summary: Foo
 * //          Bar
 * //          Baz
 */
function formatSummary(summary: string, indentation: number) {
  const [firstLine, ...trailingLines] = summary.split('\n');

  const indentedTrailingLines = trailingLines.map((line) => {
    return ' '.repeat(indentation) + line;
  });

  return [
    `summary: ${firstLine}`,
    ...indentedTrailingLines,
  ].join('\n');
}