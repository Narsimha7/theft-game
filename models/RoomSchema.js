/**
 * MongoDB Data Model for Covert Social Deduction Game
 * 
 * Collection: "rooms"
 * 
 * Each document represents a game room session.
 */

// Example MongoDB Document:
const sampleRoomDocument = {
  roomCode: "882-EX",
  status: "VOTING", // "WAITING", "CLUE_PHASE", "VOTING", "REVEAL", "FINISHED"
  round: 1,
  countdownSeconds: 105,
  civilianWord: "Vault",
  undercoverWord: "Keypad",
  players: [
    {
      id: "marcus",
      name: "Marcus",
      badge: "Det. #719",
      role: "Detective",
      clue: "Vault",
      votes: 1,
      status: "Active"
    },
    {
      id: "elena",
      name: "Elena",
      badge: "Det. #402",
      role: "Detective",
      clue: "Safehouse",
      votes: 0,
      status: "Active"
    },
    {
      id: "alex",
      name: "Alex",
      badge: "Suspect #310",
      role: "Undercover",
      clue: "Keypad",
      votes: 3,
      status: "Prime Suspect"
    },
    {
      id: "devon",
      name: "Devon",
      badge: "Det. #512",
      role: "Detective",
      clue: "Bank",
      votes: 0,
      status: "Active"
    },
    {
      id: "sora",
      name: "Sora",
      badge: "Det. #830",
      role: "Detective",
      clue: "Alarm",
      votes: 1,
      status: "Active"
    }
  ],
  ballots: [
    { voter: "devon", target: "alex" },
    { voter: "elena", target: "alex" },
    { voter: "marcus", target: "alex" },
    { voter: "alex", target: "marcus" },
    { voter: "sora", target: "sora" }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

module.exports = { sampleRoomDocument };
