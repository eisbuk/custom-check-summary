import * as core from "@actions/core";
import * as github from "@actions/github";
import path from "path";

import { getSha, getFiles } from "./utils";
import createSummary from "./createSummary";

(async () => {
  // load action inputs
  const token = core.getInput("GITHUB_TOKEN");
  const dirname = core.getInput("FILE_DIR");
  const summaryTitle = core.getInput("SUMMARY_TITLE") as string | undefined;

  // get sha for current event
  const sha = getSha(github.context);

  // load filepaths of files to create summaries from
  const dirpath = path.join(process.cwd(), dirname);
  console.log(`Looking for log files in ${dirname}`);
  const [filesToRead, err] = await getFiles(dirpath);
  if (err) throw err;
  if (!filesToRead.length) {
    console.log("No summary files found, exiting gracefully");
    return;
  }

  const createSummaryJobs = filesToRead.map((filepath, index) =>
    createSummary({ filepath, token, index: index + 1, summaryTitle, sha })
  );
  await Promise.all(createSummaryJobs);
})();
