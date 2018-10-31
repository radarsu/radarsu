const packageJson = require('./package.json');
const script = "./dist/index.js";

module.exports = {
    apps: [{
        name: `${packageJson.name}-dev`,
        script,
        env: {
            NODE_ENV: "development",
        },
        args: "",
    }, {
        name: `${packageJson.name}-prod`,
        script,
        env: {
            NODE_ENV: "production",
        },
        args: "",
    }],
};
