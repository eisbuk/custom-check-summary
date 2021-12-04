import * as core from "@actions/core";
import path from "path";
import fs from "fs";

import createSummary from "./createSummary";

const getFiles = (dirname: string) =>
  new Promise<[string[], Error | null]>((res) => {
    fs.readdir(dirname, (err, files) => {
      if (err) {
        return res([[], err]);
      }

      const filePaths = files.map((fName) => path.join(dirname, fName));
      return res([filePaths, null]);
    });
  });

(async () => {
  // load action inputs
  const token = core.getInput("GITHUB_TOKEN");
  const dirname = core.getInput("FILE_DIR");
  const summaryTitle = core.getInput("SUMMARY_TITLE") as string | undefined;

  const dirpath = path.join(process.cwd(), dirname);
  const [filesToRead, err] = await getFiles(dirpath);
  if (err) throw err;

  const createSummaryJobs = filesToRead.map((filepath, index) =>
    createSummary({ filepath, token, index: index + 1, summaryTitle })
  );
  await Promise.all(createSummaryJobs);
})();

// const getCheckRunContext = (): { sha: string; runId: number } => {
//   if (github.context.eventName === "workflow_run") {
//     core.info(
//       "Action was triggered by workflow_run: using SHA and RUN_ID from triggering workflow"
//     );
//     const event = github.context
//       .payload as EventPayloads.WebhookPayloadWorkflowRun;
//     if (!event.workflow_run) {
//       throw new Error(
//         "Event of type 'workflow_run' is missing 'workflow_run' field"
//       );
//     }
//     return {
//       sha: event.workflow_run.head_commit.id,
//       runId: event.workflow_run.id,
//     };
//   }

//   const runId = github.context.runId;
//   if (github.context.payload.pull_request) {
//     core.info(
//       `Action was triggered by ${github.context.eventName}: using SHA from head of source branch`
//     );
//     const pr = github.context.payload
//       .pull_request as EventPayloads.WebhookPayloadPullRequestPullRequest;
//     return { sha: pr.head.sha, runId };
//   }

//   return { sha: github.context.sha, runId };
// };
