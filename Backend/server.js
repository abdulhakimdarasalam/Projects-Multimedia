const app = require("./src/app");
const sequelize = require("./src/config/db");

const { Project } = require("./src/models");
// Impor untuk Cron Job
const cron = require("node-cron");
const { Op } = require("sequelize");

require("./src/models");

const PORT = process.env.PORT || 4000;

sequelize.sync({}).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  console.log("Scheduler pengecekan deadline project telah aktif.");

  cron.schedule("0 0 * * *", async () => {
    console.log(
      "CRON JOB: Mulai mengecek project yang sudah lewat deadline..."
    );

    try {
      const [updatedCount] = await Project.update(
        { status: "completed" },
        {
          where: {
            status: "ongoing",
            end_date: {
              [Op.lt]: sequelize.fn("CURDATE"),
            },
          },
        }
      );

      if (updatedCount > 0) {
        console.log(
          `CRON JOB: Berhasil menyelesaikan ${updatedCount} project.`
        );
      } else {
        console.log("CRON JOB: Tidak ada project yang perlu di-update.");
      }
    } catch (error) {
      console.error("CRON JOB ERROR:", error.message);
    }
  });
});
