import { Role } from '@theft/shared';

export interface AssignedRole {
  playerId: string;
  role: Role;
}

export class RoleDistributor {
  /**
   * Distributes roles strictly according to game balance rules:
   * 4-6 players:  1 Thief, 1 Undercover, remainder Police
   * 7-8 players:  1 Thief, 2 Undercover, remainder Police
   * 9-10 players: 1 Thief, 2 Undercover, remainder Police
   */
  static assignRoles(playerIds: string[]): Map<string, Role> {
    const total = playerIds.length;
    if (total < 4) {
      throw new Error(`Minimum 4 players required to distribute roles. Current: ${total}`);
    }

    let thiefCount = 1;
    let undercoverCount = total >= 7 ? 2 : 1;
    let policeCount = total - thiefCount - undercoverCount;

    const rolePool: Role[] = [];
    for (let i = 0; i < thiefCount; i++) rolePool.push('THIEF');
    for (let i = 0; i < undercoverCount; i++) rolePool.push('UNDERCOVER');
    for (let i = 0; i < policeCount; i++) rolePool.push('POLICE');

    // Fisher-Yates Shuffle
    for (let i = rolePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rolePool[i], rolePool[j]] = [rolePool[j], rolePool[i]];
    }

    const assignedMap = new Map<string, Role>();
    playerIds.forEach((id, index) => {
      assignedMap.set(id, rolePool[index]);
    });

    return assignedMap;
  }
}
