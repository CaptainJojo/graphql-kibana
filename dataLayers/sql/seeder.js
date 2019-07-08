const cliProgress = require('cli-progress');

const Seeder = callback => async (Database) => {
    const progress = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
    console.log(`\n<--- Start seeded: ${callback.name} --->\n`);
    await callback({ Database, progress });
    progress.stop();
    console.log(`\n<--- End seeded: ${callback.name} --->\n`);
};

module.exports = Seeder;