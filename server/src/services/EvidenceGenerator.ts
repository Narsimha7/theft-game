import { EvidenceItem, EvidenceType, Role } from '@theft/shared';

export class EvidenceGenerator {
  /**
   * Generates a coherent pool of evidence correlated with actual players and roles
   */
  static generateEvidencePool(
    players: Array<{ id: string; username: string; role: Role }>
  ): EvidenceItem[] {
    const evidenceList: EvidenceItem[] = [];
    const thief = players.find(p => p.role === 'THIEF');
    const undercovers = players.filter(p => p.role === 'UNDERCOVER');
    const police = players.filter(p => p.role === 'POLICE');

    const now = new Date();

    // 1. CCTV Footage (Points towards thief or suspicious decoy)
    if (thief) {
      evidenceList.push({
        id: `ev-cctv-${Date.now()}-1`,
        type: 'CCTV',
        description: `Security camera 04 captured a silhouette matching operative ${thief.username}'s build tampering with the vault keypad at 23:42.`,
        reliability: 0.88,
        suspectId: thief.id,
        suspectName: thief.username,
        timestamp: '23:42:15',
        isMisleading: false
      });
    }

    // 2. Fingerprint Check (Found on safe or lockbox)
    if (undercovers.length > 0) {
      const uc = undercovers[0];
      evidenceList.push({
        id: `ev-fp-${Date.now()}-2`,
        type: 'FINGERPRINT',
        description: `Partial latent prints recovered from the server room terminal match records for ${uc.username}.`,
        reliability: 0.74,
        suspectId: uc.id,
        suspectName: uc.username,
        timestamp: '23:48:30',
        isMisleading: false
      });
    }

    // 3. Location / Badge Records (Alibi verification)
    if (police.length > 0) {
      const innocent = police[0];
      evidenceList.push({
        id: `ev-loc-${Date.now()}-3`,
        type: 'LOCATION',
        description: `Card access log registers ${innocent.username} checking into the main lobby during the time of the alarm.`,
        reliability: 0.95,
        suspectId: innocent.id,
        suspectName: innocent.username,
        timestamp: '23:35:10',
        isMisleading: false
      });
    }

    // 4. Witness Statement (Can be ambiguous or misleading)
    if (thief) {
      evidenceList.push({
        id: `ev-wit-${Date.now()}-4`,
        type: 'WITNESS',
        description: `Guard testimony states someone in dark stealth clothing dropped a keycard near the back service elevator.`,
        reliability: 0.62,
        suspectId: thief.id,
        suspectName: thief.username,
        timestamp: '23:50:00',
        isMisleading: false
      });
    }

    // 5. Encrypted Phone / Radio Intercept (Decoy or Undercover transmission)
    if (undercovers.length > 0) {
      const uc = undercovers[0];
      evidenceList.push({
        id: `ev-phone-${Date.now()}-5`,
        type: 'PHONE_RECORD',
        description: `Encrypted burner radio ping detected on frequency 418.2 MHz, originating near ${uc.username}'s assigned sector.`,
        reliability: 0.78,
        suspectId: uc.id,
        suspectName: uc.username,
        timestamp: '23:52:12',
        isMisleading: false
      });
    }

    // 6. Misleading security log planted by Undercover
    if (police.length > 1) {
      const innocentPolice = police[1];
      evidenceList.push({
        id: `ev-decoy-${Date.now()}-6`,
        type: 'SECURITY_LOG',
        description: `Security firewall alert indicates terminal bypass attempt using badge credentials assigned to ${innocentPolice.username}.`,
        reliability: 0.55,
        suspectId: innocentPolice.id,
        suspectName: innocentPolice.username,
        timestamp: '23:46:05',
        isMisleading: true
      });
    }

    return evidenceList;
  }
}
