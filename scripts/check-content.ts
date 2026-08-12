/**
 * Validates every Markdown document without starting Next.js.
 *
 * Run with `npm run content:check`. Exits non-zero on the first problem so it
 * can be used in CI or a pre-commit hook.
 */
import { ContentError } from '../src/lib/content/errors';
import { findContentFiles } from '../src/lib/content/files';
import { loadDocument } from '../src/lib/content/parse';
import { loadCategoryConfig } from '../src/lib/content/categories';

interface Problem {
  file: string;
  message: string;
}

async function main(): Promise<void> {
  const problems: Problem[] = [];

  try {
    await loadCategoryConfig();
  } catch (error) {
    problems.push({
      file: 'content/categories.json',
      message: error instanceof Error ? error.message : String(error),
    });
  }

  const files = await findContentFiles();
  const routes = new Map<string, string[]>();
  let withFrontmatter = 0;

  for (const file of files) {
    try {
      const document = await loadDocument(file);
      if (document.hasFrontmatter) withFrontmatter += 1;

      const owners = routes.get(document.href);
      if (owners) owners.push(document.filePath);
      else routes.set(document.href, [document.filePath]);
    } catch (error) {
      problems.push({
        file: file.filePath,
        message:
          error instanceof ContentError || error instanceof Error ? error.message : String(error),
      });
    }
  }

  for (const [route, owners] of routes) {
    if (owners.length > 1) {
      problems.push({
        file: owners.join(', '),
        message: `Two documents resolve to the same route (${route}).`,
      });
    }
  }

  console.log(`Checked ${files.length} Markdown files.`);
  console.log(`  ${withFrontmatter} with frontmatter, ${files.length - withFrontmatter} inferred.`);
  console.log(`  ${routes.size} unique routes.`);

  if (problems.length > 0) {
    console.error(`\n${problems.length} problem(s) found:\n`);
    for (const problem of problems) console.error(problem.message.trim(), '\n');
    process.exitCode = 1;
    return;
  }

  console.log('\nNo problems found.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
