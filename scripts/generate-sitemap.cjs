const fs = require('fs');
const path = require('path');

// Target paths
const seatMatrixPath = path.join(__dirname, '../src/data/2025-26/seat_matrix.json');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

try {
  console.log('Generating sitemap...');

  // Check if seat matrix file exists
  if (!fs.existsSync(seatMatrixPath)) {
    throw new Error(`Seat matrix file not found at ${seatMatrixPath}`);
  }

  // Read and parse seat matrix
  const data = JSON.parse(fs.readFileSync(seatMatrixPath, 'utf8'));
  const colleges = data.colleges || [];

  // Extract unique college codes
  const collegeCodes = new Set();
  colleges.forEach(c => {
    if (c.college_code) {
      collegeCodes.add(c.college_code.trim());
    }
  });

  const baseDomain = 'https://www.futureu.dev';
  const currentDate = new Date().toISOString().split('T')[0];

  // Define static routes
  const staticRoutes = [
    '',
    '/about',
    '/colleges',
    '/faq',
    '/how-it-works'
  ];

  // Start building XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static routes
  staticRoutes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseDomain}${route}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Add college detail routes
  Array.from(collegeCodes).sort().forEach(code => {
    xml += '  <url>\n';
    xml += `    <loc>${baseDomain}/college/${code}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.6</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // Ensure public directory exists
  const publicDir = path.dirname(sitemapPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Successfully generated sitemap with ${collegeCodes.size} colleges at ${sitemapPath}`);
} catch (error) {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}
