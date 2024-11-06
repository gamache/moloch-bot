import { createRestAPIClient } from "masto";
import { readFileSync } from 'fs';

const INTERVAL = 30 * 60 * 1000; // 30 minutes
const MOLOCHS = readFileSync("molochs.txt").toString().trim().split("\n");

let index = 0;

async function post() {
  const masto = createRestAPIClient({
    url: process.env.URL,
    accessToken: process.env.TOKEN,
  });

  const moloch = MOLOCHS[index];
  index = (index + 1) % MOLOCHS.length;

  const status = await masto.v1.statuses.create({
    status: moloch,
  });

  console.log(status.url);
  console.log(moloch);
}

async function postAndSchedule() {
  setTimeout(async () => await postAndSchedule(), INTERVAL);
  await post();
}

postAndSchedule();

await new Promise(() => 1312); // wait forever

