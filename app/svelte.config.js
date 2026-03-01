import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: 'index.html' }) // SPA mode for S3/CloudFront
	}
};

export default config;
