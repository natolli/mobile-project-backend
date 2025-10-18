const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");

const jobsDirectory = path.join(__dirname, "jobs");

const startScheduler = () => {
  fs.readdirSync(jobsDirectory).forEach((file) => {
    if (file.endsWith(".js")) {
      const job = require(path.join(jobsDirectory, file));
      if (cron.validate(job.cronTime)) {
        cron.schedule(job.cronTime, job.run);
        logger.info(`Scheduled job from ${file} to run.`);
      } else {
        logger.warn(`Invalid cron time for job in ${file}`);
      }
    }
  });
};

module.exports = { startScheduler };
