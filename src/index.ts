import * as github from "@actions/github";
import * as core from "@actions/core";

(async () => {
  const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
  const TEST_INPUT = core.getInput("TEST_INPUT");

  const octokit = github.getOctokit(GITHUB_TOKEN);

  const { context } = github;
  const { eventName, payload } = context;

  const sha = github.context.payload.head_commit.id;
  const { repo } = github.context;

  console.log("Event name > ", eventName);

  console.log("Sha > ", sha);

  await octokit.rest.checks.create({
    head_sha: sha,
    name: "Test summary title",
    status: "in_progress",
    output: {
      title: "Test summary",
      summary: `This is you test input > ${TEST_INPUT}`,
    },
    ...repo,
  });
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
