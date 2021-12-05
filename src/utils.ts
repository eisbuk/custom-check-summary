import { Context } from "@actions/github/lib/context";
import { EmitterWebhookEvent } from "@octokit/webhooks";

import path from "path";
import fs from "fs";

/**
 * Read relavant SHA for given action ("workflow_run", "pull_request" or "push")
 * or throw err if SHA not found
 * @param {Context} context GitHub context for a trigger action
 * @returns {string} relevant sha (head commit)
 */
export const getSha = (context: Context): string => {
  const { eventName } = context;

  let payload;
  switch (eventName) {
    case "pull_request":
      payload =
        context.payload as EmitterWebhookEvent<"pull_request">["payload"];
      return payload.pull_request.head.sha;

    case "workflow_run":
      payload =
        context.payload as EmitterWebhookEvent<"workflow_run">["payload"];
      return payload.workflow_run.head_commit.id;

    // if not "pull_request" nor "workflow_run"
    // try for "push" or throw err
    default:
      payload = context.payload as EmitterWebhookEvent<"push">["payload"];

      if (!payload.head_commit?.id)
        throw new Error(
          "Unsupported event, this action is only supported for: workflow_run, pull_request, push"
        );
      return payload.head_commit.id;
  }
};

/**
 * Gets filepaths of all files to create summaries from
 * @param dirname in which to look for files
 * @returns array of full paths to supported files from provided folder
 */
export const getFiles = (dirname: string) =>
  new Promise<[string[], Error | null]>((res) => {
    fs.readdir(dirname, (err, files) => {
      if (err) {
        return res([[], err]);
      }

      const filePaths = files.reduce((acc, fName) => {
        // filter out non html/md/log files
        const validFile = Boolean(fName.match(/\.(md|html|log)/));
        return !validFile ? acc : [...acc, path.join(dirname, fName)];
      }, [] as string[]);
      return res([filePaths, null]);
    });
  });
