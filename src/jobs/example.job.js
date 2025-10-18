const logger = require("../utils/logger");

const run = () => {
  // This is a sample job that runs every minute
  logger.info("Example cron job is running!");
  // Add your job logic here
};

module.exports = {
  run,
  // cronTime: '*/1 * * * *' // Every minute
  cronTime: "* * * * *", // Every minute for standard cron
};
