import { createRestAPIClient } from "masto";
import { readFileSync } from "fs";

const molochs = readFileSync("README.txt").toString().trim().split("\n");

let index = parseInt(process.env.INDEX || "0");
let interval = parseInt(process.env.INTERVAL || "1800000") // 2 molochs per hour

async function post() {
  const masto = createRestAPIClient({
    url: process.env.URL,
    accessToken: process.env.TOKEN,
  });

  const moloch = molochs[index];
  const status = await masto.v1.statuses.create({ status: moloch });

  // down on the rocks of Time!
  index++;
  if (index == molochs.length) {
    index = 0;
    interval *= 2;
  }

  console.log(new Date(), status.url, moloch, index, interval);
}

async function postAndSchedule() {
  await post();
  const wait = parseInt(interval * (1 + Math.random()));
  setTimeout(async () => await postAndSchedule(), wait);
}

postAndSchedule();

await new Promise(() => "They jumped off the roof! to solitude!");

