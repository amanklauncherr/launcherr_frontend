module.exports = {
    apps: [
      {
        name: 'nextjs-app',
        script: 'node_modules/next/dist/bin/next',
        args: 'start',
        instances: 'max', // Scale based on available CPUs
        exec_mode: 'cluster', // Enable clustering for better performance
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          PORT: 8001, // Specify the port your Next.js app will run on
        },
      },
    ],
  };
  