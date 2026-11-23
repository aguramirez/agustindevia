const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const svgPath = path.join(__dirname, '..', 'public', 'icon-512.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Foreground SVG with transparent background and safe-zone padding (centered in 108dp canvas)
const foregroundSvg = `
<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100, 168) scale(2.0)">
    <path d="M77.4316 49.4968L70.7829 49.4969L55.2691 2.21685" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <path d="M3.55859 54.6685L55.2724 2.21657" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="2.21625" y1="-2.21625" x2="45.1255" y2="-2.21625" transform="matrix(-0.709987 -0.704215 -0.704215 0.709987 33.6113 88.6511)" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="2.21625" y1="-2.21625" x2="26.5109" y2="-2.21625" transform="matrix(-0.710271 0.703929 0.703929 0.710271 54.0137 68.429)" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="2.21625" y1="-2.21625" x2="15.5114" y2="-2.21625" transform="matrix(0.721056 0.692877 0.692877 -0.721056 41.2324 56.146)" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="2.21625" y1="-2.21625" x2="8.31857" y2="-2.21625" transform="matrix(0.723435 -0.690393 -0.690393 -0.723435 33.6113 63.4189)" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <path d="M40.4961 67.2271L36.7316 63.7292" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <path d="M77.4316 49.4971L84.0804 49.4972L99.5942 2.2171" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <path d="M151.305 54.6687L99.5909 2.21681" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="121.263" y1="85.5169" x2="151.728" y2="55.2996" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="103.982" y1="68.4151" x2="121.238" y2="85.5168" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="113.566" y1="59.2799" x2="103.98" y2="68.4918" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <line x1="118.117" y1="63.4924" x2="113.702" y2="59.2794" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
    <path d="M114.367 67.2271L118.132 63.7292" stroke="#4b00ad" stroke-width="4.43251" stroke-linecap="round"/>
  </g>
</svg>
`;

const SIZES = [
  { folder: 'mipmap-mdpi', launcher: 48, foreground: 108 },
  { folder: 'mipmap-hdpi', launcher: 72, foreground: 162 },
  { folder: 'mipmap-xhdpi', launcher: 96, foreground: 216 },
  { folder: 'mipmap-xxhdpi', launcher: 144, foreground: 324 },
  { folder: 'mipmap-xxxhdpi', launcher: 192, foreground: 432 },
];

async function generate() {
  for (const { folder, launcher, foreground } of SIZES) {
    const dir = path.join(resDir, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 1. ic_launcher.png (Square)
    await sharp(Buffer.from(svgContent))
      .resize(launcher, launcher)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // 2. ic_launcher_round.png (Circular)
    const circleSvg = `<svg width="${launcher}" height="${launcher}"><circle cx="${launcher/2}" cy="${launcher/2}" r="${launcher/2}" fill="white"/></svg>`;
    const circleMask = Buffer.from(circleSvg);
    
    await sharp(Buffer.from(svgContent))
      .resize(launcher, launcher)
      .composite([{
        input: circleMask,
        blend: 'dest-in'
      }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // 3. ic_launcher_foreground.png (Adaptive icon foreground)
    await sharp(Buffer.from(foregroundSvg))
      .resize(foreground, foreground)
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`✓ Generados iconos en ${folder}`);
  }
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
