const fs = require('fs');
const path = require('path');

const seatMatrixPath = path.join(__dirname, '../src/data/2025-26/seat_matrix.json');
const distIndexPath = path.join(__dirname, '../dist/index.html');
const distCollegeDir = path.join(__dirname, '../dist/college');

try {
  console.log('Starting SSG pre-rendering for colleges...');

  if (!fs.existsSync(distIndexPath)) {
    throw new Error(`dist/index.html not found at ${distIndexPath}. Please build the project first.`);
  }

  if (!fs.existsSync(seatMatrixPath)) {
    throw new Error(`seat_matrix.json not found at ${seatMatrixPath}`);
  }

  const indexHtml = fs.readFileSync(distIndexPath, 'utf8');
  const data = JSON.parse(fs.readFileSync(seatMatrixPath, 'utf8'));
  const colleges = data.colleges || [];

  console.log(`Loaded ${colleges.length} colleges from seat matrix.`);

  // Create dist/college folder if it doesn't exist
  if (!fs.existsSync(distCollegeDir)) {
    fs.mkdirSync(distCollegeDir, { recursive: true });
  }

  let count = 0;

  for (const college of colleges) {
    if (!college.college_code) continue;

    const collegeCode = college.college_code.trim();
    // Clean college name by removing extra whitespaces and trailing CAP info
    let collegeName = college.college_name.split(/\s{2,}/)[0].trim();
    // Make sure we have a nice, readable name
    if (collegeName.endsWith(',')) {
      collegeName = collegeName.slice(0, -1);
    }

    const collegeUrl = `https://www.futureu.dev/college/${collegeCode}`;
    const pageTitle = `${collegeName} — Cutoffs, Seats & Predictions | FutureU`;
    const pageDescription = `Check 2025-26 cutoff ranks, seat matrix, and admission probability for ${collegeName} on FutureU. 100% free and privacy-focused.`;
    const ogImage = `https://www.futureu.dev/og-image.png`; // structured preview image or logo

    // Generate pre-rendered html content
    let prHtml = indexHtml;

    // Replace Title
    prHtml = prHtml.replace(/<title>[^<]+<\/title>/g, `<title>${pageTitle}</title>`);
    
    // Replace Meta Description
    prHtml = prHtml.replace(/<meta name="description" content="[^"]*"/g, `<meta name="description" content="${pageDescription}"`);
    
    // Replace Canonical Link
    prHtml = prHtml.replace(/<link rel="canonical" href="[^"]*"/g, `<link rel="canonical" href="${collegeUrl}"`);

    // Replace Open Graph Tags
    prHtml = prHtml.replace(/<meta property="og:url" content="[^"]*"/g, `<meta property="og:url" content="${collegeUrl}"`);
    prHtml = prHtml.replace(/<meta property="og:title" content="[^"]*"/g, `<meta property="og:title" content="${pageTitle}"`);
    prHtml = prHtml.replace(/<meta property="og:description" content="[^"]*"/g, `<meta property="og:description" content="${pageDescription}"`);

    // Replace Twitter Tags
    prHtml = prHtml.replace(/<meta name="twitter:title" content="[^"]*"/g, `<meta name="twitter:title" content="${pageTitle}"`);
    prHtml = prHtml.replace(/<meta name="twitter:description" content="[^"]*"/g, `<meta name="twitter:description" content="${pageDescription}"`);

    // Inject og:image & twitter:image if they are not already in the template html
    if (!prHtml.includes('property="og:image"') && !prHtml.includes("property='og:image'")) {
      const imageMetaTags = `
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:image" content="${ogImage}" />`;
      prHtml = prHtml.replace('</head>', `${imageMetaTags}\n  </head>`);
    } else {
      prHtml = prHtml.replace(/<meta property="og:image" content="[^"]*"/g, `<meta property="og:image" content="${ogImage}"`);
      prHtml = prHtml.replace(/<meta name="twitter:image" content="[^"]*"/g, `<meta name="twitter:image" content="${ogImage}"`);
    }

    // Write file to dist/college/[collegeCode]/index.html
    const targetDir = path.join(distCollegeDir, collegeCode);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), prHtml, 'utf8');
    count++;
  }

  console.log(`Successfully pre-rendered static HTML files for ${count} colleges.`);
} catch (err) {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
}
