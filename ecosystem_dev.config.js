module.exports = {
    apps: [
        {
            name:"MEETeUX-GoD-Test",
            script: "dist/index.js",
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],
    deploy: {
        develop: {
            user: 'node',
            host: 'god.meeteux.fhstp.ac.at',
            ref: 'origin/develop',
            repo: "https://github.com/fhstp/meeteux-god.git",
            path: '/srv/develop',
            'post-deploy': 'cp ../.env ./ && npm install && pm2 startOrRestart ecosystem.config.js --env production'
        }
    }
}