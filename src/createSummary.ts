import * as github from "@actions/github";
import fs from "fs";

export default async ({
  filepath,
  summaryTitle = "Custom check summary",
  token,
  index,
  sha,
}: {
  sha: string;
  filepath: string;
  token: string;
  summaryTitle?: string;
  index: number;
}) => {
  const octokit = github.getOctokit(token);
  const { repo } = github.context;

  console.log(`Creating summary from file: ${filepath}`);

  // create title for custom check summary
  const titlePrefix = `${summaryTitle} ${index}:`;
  const fileTitle = filepath
    .split("/")
    .slice(-1)[0]
    .replace(/[-_]/g, " ")
    .replace(/\.(md|html|log)/, "");
  const title = [titlePrefix, `"${fileTitle}"`].join(" ");

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
