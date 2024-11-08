import { createRestAPIClient } from "masto";
import { readFileSync } from "fs";

const BASE_INTERVAL = 30 * 60 * 1000; // 30 minutes
const MOLOCHS = readFileSync("README.txt").toString().trim().split("\n");

let index = 0;

async function post() {
  const masto = createRestAPIClient({
    url: process.env.URL,
    accessToken: process.env.TOKEN,
  });

  const moloch = MOLOCHS[index];
  index = (index + 1) % MOLOCHS.length;

  const status = await masto.v1.statuses.create({ status: moloch });

  console.log(status.url);
  console.log(moloch);
}

async function postAndSchedule() {
  const interval = parseInt(BASE_INTERVAL * (1 + Math.random()));
  setTimeout(async () => await postAndSchedule(), interval);
  await post();
}

postAndSchedule();

await new Promise(() => "wait forever");

