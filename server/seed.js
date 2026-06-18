// Run with: node server/seed.js
require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const os = require('os');
const fs = require('fs');
const path = require('path');

const User = require('./server/models/User');
const Post = require('./server/models/Post');
const Comment = require('./server/models/Comment');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

const buildMongoOptions = () => {
  const cert = process.env.MONGODB_CERT;
  const key = process.env.MONGODB_KEY;
  if (!cert || !key) return {};
  const pemContent = cert.replace(/\|/g, '\n') + '\n' + key.replace(/\|/g, '\n');
  const pemPath = path.join(os.tmpdir(), 'mongo-x509-seed.pem');
  fs.writeFileSync(pemPath, pemContent, { mode: 0o600 });
  return { tls: true, tlsCertificateKeyFile: pemPath, authMechanism: 'MONGODB-X509', authSource: '$external' };
};

const SEED_POSTS = [
  {
    username: 'bob_builder',
    title: 'Build a Raised Garden Bed from Scratch',
    description: '<p>A <strong>raised garden bed</strong> is one of the best weekend projects you can do. It costs under $50 in materials and gives you years of great harvests. Perfect for beginners and experienced gardeners alike.</p>',
    instructions: '<h2>Materials</h2><ul><li>4x cedar planks (8ft × 2in × 6in)</li><li>Corner brackets (4x)</li><li>Wood screws (3 inch)</li><li>Landscape fabric</li><li>Topsoil and compost mix</li></ul><h2>Steps</h2><ol><li>Cut planks to form a 4ft × 8ft rectangle</li><li>Attach corners with brackets and screws</li><li>Line the bottom with landscape fabric</li><li>Fill with 60% topsoil, 40% compost</li><li>Plant your seeds and water well</li></ol>',
    category: 'hobbies',
    difficulty: 'beginner',
    tags: ['garden', 'wood', 'outdoor'],
    reactions: ['like', 'love', 'like'],
    avgRating: 87,
    ratings: [{ userId: 'seed1', score: 90 }, { userId: 'seed2', score: 84 }],
    viewCount: 342,
  },
  {
    username: 'techmaker_pete',
    title: 'Build a Raspberry Pi Home Dashboard',
    description: '<p>Turn a $35 Raspberry Pi into a <strong>wall-mounted smart home dashboard</strong> showing weather, calendar, news and home automation controls. Great IT project for the weekend!</p>',
    instructions: '<h2>What you need</h2><ul><li>Raspberry Pi 4 (2GB+)</li><li>7-inch touchscreen display</li><li>SD card (32GB)</li><li>Python 3.x</li></ul><h2>Steps</h2><ol><li>Flash Raspberry Pi OS to SD card</li><li>Connect the touchscreen via HDMI or DSI</li><li>Install Chromium and set to kiosk mode</li><li>Create a simple HTML/JS dashboard page</li><li>Set to autostart on boot via systemd</li></ol>',
    category: 'it-dev',
    difficulty: 'intermediate',
    tags: ['raspberry-pi', 'python', 'smarthome'],
    reactions: ['like', 'love'],
    avgRating: 92,
    ratings: [{ userId: 'seed3', score: 95 }, { userId: 'seed4', score: 89 }],
    viewCount: 518,
  },
  {
    username: 'mike_constructs',
    title: 'Pour a Perfect Concrete Patio — Step by Step',
    description: '<p>Pouring concrete yourself saves thousands compared to hiring a contractor. This guide covers a <strong>12×16 ft patio</strong> — the most common backyard project size.</p>',
    instructions: '<h2>Tools needed</h2><ul><li>Concrete mixer or wheelbarrow</li><li>2×4 lumber for forms</li><li>Level and stakes</li><li>Bull float and trowel</li><li>Wire mesh or rebar</li></ul><h2>Process</h2><ol><li>Mark and excavate 4 inches deep</li><li>Build wooden forms and level them</li><li>Add gravel base and wire mesh</li><li>Mix and pour concrete in sections</li><li>Screed, float, and finish surface</li><li>Cure for 7 days before use</li></ol>',
    category: 'construction',
    difficulty: 'advanced',
    tags: ['concrete', 'patio', 'outdoor'],
    reactions: ['like', 'love', 'like', 'like'],
    avgRating: 78,
    ratings: [{ userId: 'seed5', score: 80 }, { userId: 'seed6', score: 76 }],
    viewCount: 923,
  },
  {
    username: 'sarah_fixes',
    title: 'Fix a Leaky Kitchen Faucet in 30 Minutes',
    description: '<p>A dripping faucet wastes up to <strong>3,000 gallons per year</strong>. This repair takes 30 minutes, costs under $15 in parts, and requires no plumber.</p>',
    instructions: '<h2>Parts needed</h2><ul><li>Replacement cartridge (check your faucet brand)</li><li>O-rings set</li><li>Plumber\'s grease</li></ul><h2>Steps</h2><ol><li>Turn off water supply valves under sink</li><li>Remove faucet handle (usually one screw under cap)</li><li>Pull out the old cartridge</li><li>Take it to hardware store to match exactly</li><li>Insert new cartridge and reassemble</li><li>Turn water back on slowly and test</li></ol>',
    category: 'home-improvement',
    difficulty: 'beginner',
    tags: ['plumbing', 'kitchen', 'repair'],
    reactions: ['like', 'love'],
    avgRating: 95,
    ratings: [{ userId: 'seed7', score: 98 }, { userId: 'seed8', score: 92 }],
    viewCount: 1204,
  },
  {
    username: 'woodcraft_dan',
    title: 'Make a Solid Oak Workbench for Your Garage',
    description: '<p>Every serious maker needs a <strong>solid workbench</strong>. This design is simple, sturdy, costs about $200 in lumber, and will last decades. I\'ve been using mine for 15 years.</p>',
    instructions: '<h2>Materials</h2><ul><li>Oak 4×4 for legs (8ft pieces × 4)</li><li>2×6 for top (8ft × 6 boards)</li><li>2×4 for stretchers</li><li>Lag bolts and wood glue</li></ul><h2>Build steps</h2><ol><li>Cut legs to 34 inches (comfortable standing height)</li><li>Build two H-frames for the base</li><li>Connect frames with stretchers front and back</li><li>Glue and clamp the top boards edge-to-edge</li><li>Attach top to base with lag bolts from below</li><li>Sand and apply linseed oil finish</li></ol>',
    category: 'building',
    difficulty: 'intermediate',
    tags: ['woodworking', 'workshop', 'oak'],
    reactions: ['like', 'love', 'like'],
    avgRating: 91,
    ratings: [{ userId: 'seed9', score: 94 }, { userId: 'seed10', score: 88 }],
    viewCount: 677,
  },
];

const SEED_COMMENTS = [
  { username: 'garden_lover_72', content: 'Built this last spring and it has been amazing. Used cedar as suggested and it held up through winter perfectly!' },
  { username: 'first_timer', content: 'Great guide for beginners. Added photos to each step which helped me a lot.' },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoURI, buildMongoOptions());
  console.log('Connected!');

  const postCount = await Post.countDocuments();
  if (postCount > 0) {
    console.log(`Database already has ${postCount} posts. Skipping seed.`);
    process.exit(0);
  }

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('Demo1234!', 10);
  const usernames = ['bob_builder', 'techmaker_pete', 'mike_constructs', 'sarah_fixes', 'woodcraft_dan'];
  for (const username of usernames) {
    const exists = await User.findOne({ username });
    if (!exists) {
      await new User({ username, password: hashedPassword, verified: true }).save();
      console.log(`  Created user: ${username}`);
    }
  }

  console.log('Seeding posts...');
  const posts = await Post.insertMany(SEED_POSTS);
  console.log(`  Created ${posts.length} posts`);

  console.log('Seeding comments...');
  for (const comment of SEED_COMMENTS) {
    await new Comment({ postId: posts[0]._id, ...comment }).save();
  }
  console.log(`  Created ${SEED_COMMENTS.length} comments`);

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
