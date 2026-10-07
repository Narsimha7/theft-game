import { Role, GamePhase } from '@theft/shared';

export class AntiCheatValidator {
  /**
   * Validate if a player can vote in the current state
   */
  static canVote(
    phase: GamePhase,
    isAlive: boolean,
    hasAlreadyVoted: boolean
  ): { valid: boolean; reason?: string } {
    if (phase !== 'VOTING') {
      return { valid: false, reason: 'Voting is only permitted during the VOTING phase.' };
    }
    if (!isAlive) {
      return { valid: false, reason: 'Eliminated players cannot cast votes.' };
    }
    if (hasAlreadyVoted) {
      return { valid: false, reason: 'You have already submitted your ballot for this round.' };
    }
    return { valid: true };
  }

  /**
   * Validate if a player can perform Police actions
   */
  static canPerformPoliceAction(
    role: Role,
    phase: GamePhase,
    isAlive: boolean,
    actionsLeft: number
  ): { valid: boolean; reason?: string } {
    if (role !== 'POLICE') {
      return { valid: false, reason: 'Only verified Police operatives can perform investigation actions.' };
    }
    if (phase !== 'INVESTIGATION') {
      return { valid: false, reason: 'Investigation actions can only be taken during the INVESTIGATION phase.' };
    }
    if (!isAlive) {
      return { valid: false, reason: 'Eliminated police officers cannot investigate.' };
    }
    if (actionsLeft <= 0) {
      return { valid: false, reason: 'No investigation action points remaining for this round.' };
    }
    return { valid: true };
  }

  /**
   * Validate if a player can perform Thief objectives
   */
  static canPerformThiefAction(
    role: Role,
    phase: GamePhase,
    isAlive: boolean
  ): { valid: boolean; reason?: string } {
    if (role !== 'THIEF') {
      return { valid: false, reason: 'Only the Thief can trigger heist actions.' };
    }
    if (phase !== 'INVESTIGATION' && phase !== 'DISCUSSION') {
      return { valid: false, reason: 'Heist actions can only be executed during investigation or discussion.' };
    }
    if (!isAlive) {
      return { valid: false, reason: 'An eliminated Thief cannot continue heist operations.' };
    }
    return { valid: true };
  }
}
