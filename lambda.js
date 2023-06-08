"use strict";
require("source-map-support/register");
const serverlessExpress = require("@vendia/serverless-express");
const db = require("./src/db");
const app = require("./src/app");

let serverlessExpressInstance;

function asyncTask() {
  return new Promise((resolve) => {
    db().then(resolve);
  });
}

async function setup(event, context) {
  await asyncTask();
  serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context);
}

function handler(event, context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context);
  return setup(event, context);
}

exports.handler = handler;
