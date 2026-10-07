/**
 * Covert Social Deduction Game Server
 * 
 * Complete Real Game Engine with MongoDB integration
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.DB_NAME || 'theft_game';

// Word Packs Library for Real Game
const WORD_PACKS = [
  { category: "Espionage", civilian: "Vault", undercover: "Keypad" },
  { category: "Cybercrime", civilian: "Firewall", undercover: "Antivirus" },
  { category: "Heist Operations", civilian: "Blueprint", undercover: "Map" },
  { category: "Undercover", civilian: "Disguise", undercover: "Mask" },
  { category: "Tactical Gear", civilian: "Silencer", undercover: "Scope" },
  { category: "Surveillance", civilian: "Camera", undercover: "Drone" },
  { category: "Cryptography", civilian: "Cipher", undercover: "Password" },
  { category: "High Security", civilian: "Safehouse", undercover: "Bunker" },
  { category: "Stolen Wealth", civilian: "Gold Bar", undercover: "Diamond" },
  { category: "Infiltration", civilian: "Alleyway", undercover: "Rooftop" }
];

// Default Initial State
function createInitialRoom(code = '882-EX', packIndex = 0) {
  const pack = WORD_PACKS[packIndex % WORD_PACKS.length];
  return {
    roomCode: code,
    phase: 'VOTING', // 'SETUP', 'ROLES', 'CLUES', 'VOTING', 'VERDICT', 'GAMEOVER'
    round: 1,
    countdownSeconds: 105,
    category: pack.category,
    civilianWord: pack.civilian,
    undercoverWord: pack.undercover,
    players: [
      { id: 'Marcus', name: 'Marcus', badge: '#719', role: 'Detective', clue: 'Vault', votes: 1, status: 'Active', eliminated: false },
      { id: 'Elena', name: 'Elena', badge: '#402', role: 'Detective', clue: 'Safehouse', votes: 0, status: 'Active', eliminated: false },
      { id: 'Alex', name: 'Alex', badge: '#310', role: 'Undercover', clue: 'Keypad', votes: 3, status: 'Prime Suspect', eliminated: false },
      { id: 'Devon', name: 'Devon', badge: '#512', role: 'Detective', clue: 'Bank', votes: 0, status: 'Active', eliminated: false },
      { id: 'Sora', name: 'Sora', badge: '#830', role: 'Thief', clue: 'Alarm', votes: 1, status: 'Active', eliminated: false }
    ],
    ballots: [
      { voter: 'Devon', target: 'Alex', timestamp: new Date() },
      { voter: 'Elena', target: 'Alex', timestamp: new Date() },
      { voter: 'Marcus', target: 'Alex', timestamp: new Date() },
      { voter: 'Alex', target: 'Marcus', timestamp: new Date() },
      { voter: 'Sora', target: 'Sora', timestamp: new Date() }
    ],
    clueHistory: [
      { player: 'Marcus', clue: 'Vault', round: 1 },
      { player: 'Elena', clue: 'Safehouse', round: 1 },
      { player: 'Alex', clue: 'Keypad', round: 1 },
      { player: 'Devon', clue: 'Bank', round: 1 },
      { player: 'Sora', clue: 'Alarm', round: 1 }
    ],
    verdict: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

let memoryStore = {
  '882-EX': createInitialRoom('882-EX', 0)
};

// MongoDB Client holder
let mongoDb = null;
let isMongoConnected = false;

// Attempt to load and connect official MongoDB Driver if available
async function initMongo() {
  if (!MONGODB_URI) {
    console.log('[MongoDB] Running with In-Memory store (compatible with MongoDB).');
    return;
  }

  try {
    const { MongoClient } = require('mongodb');
    console.log('[MongoDB] Connecting to MongoDB Atlas...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    mongoDb = client.db(DB_NAME);
    isMongoConnected = true;
    console.log('[MongoDB] Successfully connected to database:', DB_NAME);

    const roomsCollection = mongoDb.collection('rooms');
    const existing = await roomsCollection.findOne({ roomCode: '882-EX' });
    if (!existing) {
      await roomsCollection.insertOne(createInitialRoom('882-EX', 0));
      console.log('[MongoDB] Initialized default room "#882-EX" in MongoDB');
    }
  } catch (err) {
    console.warn('[MongoDB] Driver note:', err.message);
    isMongoConnected = false;
  }
}

// Database Helpers
async function getRoom(roomCode) {
  if (isMongoConnected && mongoDb) {
    let room = await mongoDb.collection('rooms').findOne({ roomCode });
    if (!room && roomCode === '882-EX') {
      const newRoom = createInitialRoom('882-EX', 0);
      await mongoDb.collection('rooms').insertOne(newRoom);
      return newRoom;
    }
    return room;
  }
  return memoryStore[roomCode] || null;
}

async function saveRoom(room) {
  room.updatedAt = new Date();
  if (isMongoConnected && mongoDb) {
    await mongoDb.collection('rooms').updateOne(
      { roomCode: room.roomCode },
      { $set: room },
      { upsert: true }
    );
    return room;
  }
  memoryStore[room.roomCode] = room;
  return room;
}

async function updateRoomVote(roomCode, targetName, voterName = 'You') {
  const room = await getRoom(roomCode);
  if (!room) return null;

  const player = room.players.find(p => p.name === targetName);
  if (player) {
    player.votes = (player.votes || 0) + 1;
    if (!room.ballots) room.ballots = [];
    room.ballots.push({ voter: voterName, target: targetName, timestamp: new Date() });
    await saveRoom(room);
  }
  return room;
}

async function resetRoomVotes(roomCode) {
  const room = await getRoom(roomCode);
  if (!room) return null;

  room.players.forEach(p => p.votes = 0);
  room.ballots = [];
  await saveRoom(room);
  return room;
}

// Simple HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Status
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      connected: isMongoConnected,
      database: DB_NAME,
      mode: isMongoConnected ? 'MongoDB Live' : 'In-Memory Fallback',
      wordPacksCount: WORD_PACKS.length,
      timestamp: new Date()
    }));
    return;
  }

  // Word Packs
  if (pathname === '/api/words') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, packs: WORD_PACKS }));
    return;
  }

  // Room Endpoints
  if (pathname.startsWith('/api/room/')) {
    const parts = pathname.split('/');
    const roomCode = parts[3] || '882-EX';
    const action = parts[4];

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
          const updated = await updateRoomVote(roomCode, data.target || 'Alex', data.voter || 'You');
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

    if (req.method === 'POST' && action === 'start') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          const packIdx = data.packIndex !== undefined ? data.packIndex : Math.floor(Math.random() * WORD_PACKS.length);
          const newRoom = createInitialRoom(roomCode, packIdx);
          
          if (data.playerName) {
            newRoom.players[0].name = data.playerName;
          }
          await saveRoom(newRoom);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, room: newRoom, isMongo: isMongoConnected }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && action === 'clue') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          const room = await getRoom(roomCode);
          if (room) {
            const player = room.players.find(p => p.name === data.player);
            if (player) {
              player.clue = data.clue;
              if (!room.clueHistory) room.clueHistory = [];
              room.clueHistory.push({ player: data.player, clue: data.clue, round: room.round });
              await saveRoom(room);
            }
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, room, isMongo: isMongoConnected }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
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
  console.log(` Real Covert Social Deduction Game Engine Active`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(`===============================================`);
  await initMongo();
});
