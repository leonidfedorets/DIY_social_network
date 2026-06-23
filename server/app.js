const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const os = require('os');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o => origin.startsWith(o.trim()));
    const isVercel = origin.endsWith('.vercel.app');
    if (allowed || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));
app.use(cookieParser());

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';

const buildMongoOptions = () => {
  const cert = process.env.MONGODB_CERT;
  const key = process.env.MONGODB_KEY;

  if (!cert || !key) return {};

  // Write cert+key to a temp file (required by the MongoDB Node driver)
  const pemContent = cert.replace(/\|/g, '\n') + '\n' + key.replace(/\|/g, '\n');
  const pemPath = path.join(os.tmpdir(), 'mongo-x509.pem');
  fs.writeFileSync(pemPath, pemContent, { mode: 0o600 });

  return {
    tls: true,
    tlsCertificateKeyFile: pemPath,
    authMechanism: 'MONGODB-X509',
    authSource: '$external',
  };
};

mongoose.connect(mongoURI, buildMongoOptions());

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

app.use('/api/posts', require('./routes/post'));
app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;
