// RUN node pack.js to bundle the widget code into widget.js, before starting frontend server

const esbuild = require('esbuild');
const dotenv = require('dotenv');

const envResult = dotenv.config({ path: '../../.env' });
if (envResult.error) {
  console.error('Error loading .env file:', envResult.error);
  process.exit(1);
}

// Any occurrence of process.env.SERVER_URL in the widget code will be replaced by the value from .env
const defineEnv = Object.keys(envResult.parsed).reduce((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(envResult.parsed[key]);
  return acc;
}, {});

esbuild.build({
  entryPoints: ['tracker.js'],
  bundle: true,
  minify: true,
  outfile: 'widget.js',
  define: defineEnv,
})
.then(() => {
    console.log('Bundle created as widget.js');
})
.catch((error) => {
    console.error(error);
    process.exit(1);
});
