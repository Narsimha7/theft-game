# MongoDB Integration Guide

This application is built with a **simple, direct document model** specifically designed for MongoDB.

---

## 1. The MongoDB Document Structure

In MongoDB, everything for a game room session is stored as a single, intuitive document in the **`rooms`** collection.

### Collection: `rooms`
```json
{
  "_id": "67039a8f10283b...",
  "roomCode": "882-EX",
  "status": "VOTING",
  "round": 1,
  "countdownSeconds": 105,
  "civilianWord": "Vault",
  "undercoverWord": "Keypad",
  "players": [
    { "id": "Marcus", "name": "Marcus", "badge": "#719", "role": "Detective", "clue": "Vault", "votes": 1, "status": "Active" },
    { "id": "Elena",  "name": "Elena",  "badge": "#402", "role": "Detective", "clue": "Safehouse", "votes": 0, "status": "Active" },
    { "id": "Alex",   "name": "Alex",   "badge": "#310", "role": "Undercover", "clue": "Keypad", "votes": 3, "status": "Prime Suspect" },
    { "id": "Devon",  "name": "Devon",  "badge": "#512", "role": "Detective", "clue": "Bank", "votes": 0, "status": "Active" },
    { "id": "Sora",   "name": "Sora",   "badge": "#830", "role": "Detective", "clue": "Alarm", "votes": 1, "status": "Active" }
  ],
  "ballots": [
    { "voter": "Devon", "target": "Alex", "timestamp": "2026-10-07T10:30:00Z" },
    { "voter": "Elena", "target": "Alex", "timestamp": "2026-10-07T10:30:01Z" },
    { "voter": "Marcus", "target": "Alex", "timestamp": "2026-10-07T10:30:02Z" }
  ],
  "createdAt": "2026-10-07T10:00:00Z",
  "updatedAt": "2026-10-07T10:30:02Z"
}
```

### Why this design is simple and powerful:
1. **Single Query:** 1 find operation `db.rooms.findOne({ roomCode: '882-EX' })` fetches the entire game state.
2. **Atomic Voting Updates:** Casting a vote uses an atomic MongoDB operator:
   ```javascript
   db.rooms.updateOne(
     { roomCode: '882-EX', 'players.name': 'Alex' },
     { 
       $inc: { 'players.$.votes': 1 },
       $push: { ballots: { voter: 'You', target: 'Alex', timestamp: new Date() } }
     }
   );
   ```
3. **No Joins Needed:** Perfect for real-time multiplayer lobbies and social deduction games.

---

## 2. Setting Up Your MongoDB Connection

### Option A: Free MongoDB Atlas (Cloud - Recommended)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Database Access**, create a database user (e.g. username `covert_admin`, set a password).
4. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   ```
   mongodb+srv://covert_admin:<password>@cluster0.mongodb.net/covert_game?retryWrites=true&w=majority
   ```
6. Open `.env` in this directory and paste it:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://covert_admin:YOUR_PASSWORD@cluster0.mongodb.net/covert_game?retryWrites=true&w=majority
   DB_NAME=covert_game
   ```

### Option B: Local MongoDB
If running MongoDB locally on your computer:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/covert_game
DB_NAME=covert_game
```

---

## 3. Running the App with MongoDB

1. **Install dependencies** (if using standard npm):
   ```powershell
   npm install
   ```

2. **Start the server**:
   ```powershell
   npm start
   ```
   *(Or run directly: `node server.js` / `agy-node server.js`)*

3. **Open the game**:
   Navigate to:
   ```
   http://localhost:3000
   ```
   - If connected to MongoDB, the top bar will show: **`🟢 MongoDB Live`**.
   - If the MongoDB URI is not set yet, the server automatically runs in **`🟢 In-Memory (Ready for Mongo)`** mode so your application never crashes!

---

## 4. REST API Endpoints

The server exposes clean REST routes matching the MongoDB document structure:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Returns MongoDB connection health & database name |
| `GET` | `/api/room/:roomCode` | Fetches the full room document from MongoDB |
| `POST` | `/api/room/:roomCode/vote` | Persists a vote for a suspect into MongoDB |
| `POST` | `/api/room/:roomCode/reset` | Resets all votes and ballots in MongoDB |
