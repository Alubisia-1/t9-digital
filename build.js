#!/usr/bin/env node

/**
 * T9 Digital Production Build Script
 * Optimizes and prepares the website for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build configuration
const buildConfig = {
  sourceDir: '.',
  buildDir: './dist',
  publicPath: '/',
  minify: true,
  sourceMaps: false,
  optimizeImages: true,
  generateSitemap: true,
  version: Date.now().toString()
};

// Utility functions
const log = (message) => console.log(`[BUILD] ${message}`);
const error = (message) => console.error(`[ERROR] ${message}`);

// Ensure build directory exists
if (!fs.existsSync(buildConfig.buildDir)) {
  fs.mkdirSync(buildConfig.buildDir, { recursive: true });
}

/**
 * Minify CSS
 */
function minifyCSS(cssContent) {
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
    .replace(/,\s+/g, ',') // Remove space after commas
    .replace(/:\s+/g, ':') // Remove space after colons
    .replace(/{\s+/g, '{') // Remove space after opening braces
    .replace(/}\s+/g, '}') // Remove space after closing braces
    .trim();
}

/**
 * Minify JavaScript
 */
function minifyJS(jsContent) {
  // Conservative minification to avoid breaking syntax
  // In production, use a proper minifier like Terser
  return jsContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/(?!.*['"`]).*$/gm, '') // Remove line comments (but not in strings)
    .replace(/^\s*\n/gm, '') // Remove empty lines
    .replace(/\n\s*\n/g, '\n') // Reduce multiple line breaks
    .replace(/\s*;\s*\n/g, ';\n') // Clean up semicolons
    .trim();
}

/**
 * Minify HTML
 */
function minifyHTML(htmlContent) {
  return htmlContent
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .trim();
}

/**
 * Build process
 */
async function build() {
  log('Starting production build...');

  try {
    // Clean build directory
    log('Cleaning build directory...');
    if (fs.existsSync(buildConfig.buildDir)) {
      fs.rmSync(buildConfig.buildDir, { recursive: true, force: true });
    }
    fs.mkdirSync(buildConfig.buildDir, { recursive: true });

    // Process HTML
    log('Processing HTML...');
    let htmlContent = fs.readFileSync('index.html', 'utf8');

    // Update asset paths for production
    htmlContent = htmlContent.replace(/src="script\.js"/g, `src="script.min.js?v=${buildConfig.version}"`);
    htmlContent = htmlContent.replace(/href="styles\.css"/g, `href="styles.min.css?v=${buildConfig.version}"`);

    // Add production meta tags
    const productionMeta = `
    <!-- Production Build Meta -->
    <meta name="build-version" content="${buildConfig.version}">
    <meta name="build-date" content="${new Date().toISOString()}">

    <!-- Performance Hints -->
    <link rel="preload" href="styles.min.css?v=${buildConfig.version}" as="style">
    <link rel="preload" href="script.min.js?v=${buildConfig.version}" as="script">

    <!-- Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">

    <!-- Additional PWA Meta -->
    <meta name="theme-color" content="#00d4ff">
    <meta name="msapplication-navbutton-color" content="#00d4ff">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    `;

    htmlContent = htmlContent.replace('</head>', `${productionMeta}</head>`);

    if (buildConfig.minify) {
      htmlContent = minifyHTML(htmlContent);
    }

    fs.writeFileSync(path.join(buildConfig.buildDir, 'index.html'), htmlContent);

    // Process CSS
    log('Processing CSS...');
    let cssContent = fs.readFileSync('styles.css', 'utf8');

    if (buildConfig.minify) {
      cssContent = minifyCSS(cssContent);
    }

    fs.writeFileSync(path.join(buildConfig.buildDir, 'styles.min.css'), cssContent);

    // Process JavaScript
    log('Processing JavaScript...');
    let jsContent = fs.readFileSync('script.js', 'utf8');

    // Add production configuration
    const productionConfig = `
    // Production configuration
    window.T9_CONFIG = {
      environment: 'production',
      version: '${buildConfig.version}',
      debug: false,
      analytics: {
        enabled: true,
        trackingId: 'GA_MEASUREMENT_ID' // Replace with actual GA4 ID
      },
      performance: {
        monitoring: true,
        reportingEndpoint: '/api/performance'
      }
    };
    `;

    jsContent = productionConfig + jsContent;

    if (buildConfig.minify) {
      jsContent = minifyJS(jsContent);
    }

    fs.writeFileSync(path.join(buildConfig.buildDir, 'script.min.js'), jsContent);

    // Generate robots.txt
    log('Generating robots.txt...');
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://yourdomain.com/sitemap.xml

# Block crawling of admin areas (if any)
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$

# Allow crawling of important pages
Allow: /
Allow: /about
Allow: /services
Allow: /portfolio
Allow: /contact

# Crawl delay (optional)
Crawl-delay: 1
`;

    fs.writeFileSync(path.join(buildConfig.buildDir, 'robots.txt'), robotsTxt);

    // Generate sitemap.xml
    log('Generating sitemap.xml...');
    const currentDate = new Date().toISOString().split('T')[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/#portfolio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
`;

    fs.writeFileSync(path.join(buildConfig.buildDir, 'sitemap.xml'), sitemapXml);

    // Copy additional files
    log('Copying additional files...');
    const filesToCopy = [
      'DEPLOYMENT.md',
      'ABOUT_SECTION_FIX.md',
      'URGENT_FIXES_COMPLETE.md'
    ];

    filesToCopy.forEach(file => {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(buildConfig.buildDir, file));
      }
    });

    // Generate build report
    log('Generating build report...');
    const buildReport = {
      timestamp: new Date().toISOString(),
      version: buildConfig.version,
      environment: 'production',
      files: {
        'index.html': fs.statSync(path.join(buildConfig.buildDir, 'index.html')).size,
        'styles.min.css': fs.statSync(path.join(buildConfig.buildDir, 'styles.min.css')).size,
        'script.min.js': fs.statSync(path.join(buildConfig.buildDir, 'script.min.js')).size
      },
      optimizations: {
        minified: buildConfig.minify,
        versioning: true,
        caching: true
      }
    };

    fs.writeFileSync(
      path.join(buildConfig.buildDir, 'build-report.json'),
      JSON.stringify(buildReport, null, 2)
    );

    log(`Build completed successfully!`);
    log(`Build directory: ${path.resolve(buildConfig.buildDir)}`);
    log(`Build version: ${buildConfig.version}`);
    log(`Total files generated: ${Object.keys(buildReport.files).length + 3}`); // +3 for robots, sitemap, report

  } catch (err) {
    error(`Build failed: ${err.message}`);
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build, buildConfig };