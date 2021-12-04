import * as core from "@actions/core";
import path from "path";

import createSummary from "./createSummary";

(async () => {
  const token = core.getInput("GITHUB_TOKEN");
  const dirname = path.join(process.cwd(), "temp");
  const filename = "temp.md";

  await createSummary({ filename, dirname, token });
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
