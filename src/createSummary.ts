import * as github from "@actions/github";
import fs from "fs";
import path from "path";

export default async ({
  filename,
  dirname,
  summaryTitle,
  token,
}: {
  filename: string;
  dirname: string;
  token: string;
  summaryTitle?: string;
}) => {
  const octokit = github.getOctokit(token);

  const {
    repo,
    payload: {
      head_commit: { id: sha },
    },
  } = github.context;

  // create title for custom check summary
  const title =
    `${summaryTitle}: ` +
    filename.replace(/[-_]/g, " ").replace(/.(md|html|log)/, "");

  // create empty (in-progress) summary
  const {
    data: { id },
  } = await octokit.rest.checks.create({
    head_sha: sha,
    name: title,
    status: "in_progress",
    output: {
      title,
      summary: "",
    },
    ...repo,
  });

  // read file to update
  const summary = await new Promise<string>((res) => {
    const filepath = path.join(dirname, filename);
    fs.readFile(filepath, (err, data) => {
      if (err) throw err;
      res(data.toString());
    });
  });

  // update check summary
  await octokit.rest.checks.update({
    check_run_id: id,
    status: "completed",
    conclusion: "success",
    output: {
      title,
      summary,
    },
    ...repo,
  });
};
