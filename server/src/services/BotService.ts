import { PlayerPublic, Role } from '@theft/shared';

const BOT_PRESETS = [
  { username: 'Marcus_AI', avatar: 'avatar-detective-2' },
  { username: 'Elena_AI', avatar: 'avatar-detective-3' },
  { username: 'Devon_AI', avatar: 'avatar-detective-4' },
  { username: 'Sora_AI', avatar: 'avatar-detective-5' },
  { username: 'Kabir_AI', avatar: 'avatar-detective-6' }
];

const BOT_CHAT_PHRASES = [
  "I was reviewing the perimeter entrance when the alarm tripped.",
  "Check camera 04 logs—someone definitely tampered with the keypad.",
  "My badge access records will confirm I was in the lobby.",
  "The phone record intercept is suspicious. Why was a burner active?",
  "I think the Undercover operative is deliberately diverting suspicion.",
  "We need to focus on who had physical clearance to the vault.",
  "Look closely at the reliability rating of that security log.",
  "I'm ready to cast my vote when the council opens."
];

export class BotService {
  private static botIndex = 0;

  static createBot(): PlayerPublic {
    const preset = BOT_PRESETS[this.botIndex % BOT_PRESETS.length];
    this.botIndex++;
    const botId = `bot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      id: botId,
      username: `${preset.username}`,
      avatar: preset.avatar,
      isHost: false,
      isReady: true,
      isAlive: true,
      hasVoted: false,
      isBot: true
    };
  }

  static getRandomChatPhrase(): string {
    return BOT_CHAT_PHRASES[Math.floor(Math.random() * BOT_CHAT_PHRASES.length)];
  }

  static pickVoteTarget(
    botRole: Role,
    alivePlayers: PlayerPublic[],
    botId: string,
    thiefId?: string
  ): string {
    const candidates = alivePlayers.filter(p => p.id !== botId);
    if (candidates.length === 0) return botId;

    // Undercover bot tries to protect the thief
    if (botRole === 'UNDERCOVER' && thiefId) {
      const nonThiefCandidates = candidates.filter(p => p.id !== thiefId);
      if (nonThiefCandidates.length > 0) {
        return nonThiefCandidates[Math.floor(Math.random() * nonThiefCandidates.length)].id;
      }
    }

    // Default: vote for a random candidate
    return candidates[Math.floor(Math.random() * candidates.length)].id;
  }
}
