/**
 * Covert Social Deduction Game Server
 * 
 * Simple REST API with MongoDB integration
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'covert_game';

// In-Memory Fallback State (Matches MongoDB Document Structure)
const defaultRoomData = {
  roomCode: '882-EX',
  status: 'VOTING',
  round: 1,
  countdownSeconds: 105,
  civilianWord: 'Vault',
  undercoverWord: 'Keypad',
  players: [
    { id: 'Marcus', name: 'Marcus', badge: '#719', role: 'Detective', clue: 'Vault', votes: 1, status: 'Active' },
    { id: 'Elena', name: 'Elena', badge: '#402', role: 'Detective', clue: 'Safehouse', votes: 0, status: 'Active' },
    { id: 'Alex', name: 'Alex', badge: '#310', role: 'Undercover', clue: 'Keypad', votes: 3, status: 'Prime Suspect' },
    { id: 'Devon', name: 'Devon', badge: '#512', role: 'Detective', clue: 'Bank', votes: 0, status: 'Active' },
    { id: 'Sora', name: 'Sora', badge: '#830', role: 'Detective', clue: 'Alarm', votes: 1, status: 'Active' }
  ],
  ballots: [
    { voter: 'Devon', target: 'Alex' },
    { voter: 'Elena', target: 'Alex' },
    { voter: 'Marcus', target: 'Alex' },
    { voter: 'Alex', target: 'Marcus' },
    { voter: 'Sora', target: 'Sora' }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

let memoryStore = {
  '882-EX': JSON.parse(JSON.stringify(defaultRoomData))
};

// MongoDB Client holder
let mongoDb = null;
let isMongoConnected = false;

// Attempt to load and connect official MongoDB Driver if available
async function initMongo() {
  if (!MONGODB_URI) {
    console.log('[MongoDB] Notice: MONGODB_URI is not set. Running with In-Memory MongoDB-compatible store.');
    console.log('[MongoDB] To connect real MongoDB, set MONGODB_URI in your .env or environment variables.');
    return;
  }

  try {
    const { MongoClient } = require('mongodb');
    console.log('[MongoDB] Connecting to MongoDB at:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    mongoDb = client.db(DB_NAME);
    isMongoConnected = true;
    console.log('[MongoDB] Successfully connected to database:', DB_NAME);

    // Ensure default room exists in MongoDB
    const roomsCollection = mongoDb.collection('rooms');
    const existing = await roomsCollection.findOne({ roomCode: '882-EX' });
    if (!existing) {
      await roomsCollection.insertOne(JSON.parse(JSON.stringify(defaultRoomData)));
      console.log('[MongoDB] Initialized default room "#882-EX" in MongoDB');
    }
  } catch (err) {
    console.warn('[MongoDB] Could not connect to MongoDB:', err.message);
    console.warn('[MongoDB] Falling back to In-Memory MongoDB-compatible store.');
    isMongoConnected = false;
  }
}

// Database Helper Functions (Abstracts MongoDB & Memory)
async function getRoom(roomCode) {
  if (isMongoConnected && mongoDb) {
    let room = await mongoDb.collection('rooms').findOne({ roomCode });
    if (!room && roomCode === '882-EX') {
      const newRoom = JSON.parse(JSON.stringify(defaultRoomData));
      await mongoDb.collection('rooms').insertOne(newRoom);
      return newRoom;
    }
    return room;
  }
  return memoryStore[roomCode] || null;
}

async function updateRoomVote(roomCode, targetName, voterName = 'You') {
  if (isMongoConnected && mongoDb) {
    const result = await mongoDb.collection('rooms').findOneAndUpdate(
      { roomCode, 'players.name': targetName },
      { 
        $inc: { 'players.$.votes': 1 },
        $push: { ballots: { voter: voterName, target: targetName, timestamp: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    return result;
  }

  // Memory fallback
  const room = memoryStore[roomCode];
  if (room) {
    const player = room.players.find(p => p.name === targetName);
    if (player) {
      player.votes += 1;
      room.ballots.push({ voter: voterName, target: targetName, timestamp: new Date() });
      room.updatedAt = new Date();
    }
    return room;
  }
  return null;
}

async function resetRoomVotes(roomCode) {
  if (isMongoConnected && mongoDb) {
    await mongoDb.collection('rooms').updateOne(
      { roomCode },
      { 
        $set: { 
          'players.$[].votes': 0,
          ballots: [],
          updatedAt: new Date()
        } 
      }
    );
    return await getRoom(roomCode);
  }

  const room = memoryStore[roomCode];
  if (room) {
    room.players.forEach(p => p.votes = 0);
    room.ballots = [];
    room.updatedAt = new Date();
    return room;
  }
  return null;
}

// Simple HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      connected: isMongoConnected,
      database: DB_NAME,
      mode: isMongoConnected ? 'MongoDB Live' : 'In-Memory Fallback',
      timestamp: new Date()
    }));
    return;
  }

  if (pathname.startsWith('/api/room/')) {
    const parts = pathname.split('/');
    const roomCode = parts[3] || '882-EX';
    const action = parts[4]; // 'vote', 'reset', etc.

    if (req.method === 'GET' && !action) {
      const room = await getRoom(roomCode);
      if (!room) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Room not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, room, isMongo: isMongoConnected }));
      return;
    }

    if (req.method === 'POST' && action === 'vote') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          const target = data.target || 'Alex';
          const updated = await updateRoomVote(roomCode, target, data.voter || 'You');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, room: updated, isMongo: isMongoConnected }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && action === 'reset') {
      const reset = await resetRoomVotes(roomCode);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, room: reset, isMongo: isMongoConnected }));
      return;
    }
  }

  // Static File Serving
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.code);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start Server & Init MongoDB
server.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(` Covert Social Deduction Server Active`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(`===============================================`);
  await initMongo();
});
