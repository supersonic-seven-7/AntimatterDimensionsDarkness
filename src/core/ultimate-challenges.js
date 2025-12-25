import { DC } from "./constants";
import { GameMechanicState } from "./game-mechanics";

export function tryCompleteUltimateChallenges() {
  if (Achievement(121).isUnlocked) {
    const toComplete = UltimateChallenges.all.filter(x => x.isUnlocked && !x.isCompleted);
    for (const challenge of toComplete) challenge.complete();
  }
}

class UltimateChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this._challenge = challenge;
  }

  get isEffectActive() {
    return this._challenge.isCompleted;
  }
}

class UltimateChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._reward = new UltimateChallengeRewardState(config.reward, this);
  }
  
  get isQuickResettable() {
    return this.config.isQuickResettable;
  }

  get unlockReq() {
    return this.config.unlockReq;
  }

  get isUnlocked() {
    if (PlayerProgress.realityUnlocked()) return true;
    if (this.id === 1) return PlayerProgress.eternityUnlocked();
    if (this.id === 2) return player.records.thisEternity.maxAM.gte(DC.E3_6E6) || (Achievement(133).isUnlocked && !Pelle.isDoomed);
    if (this.id === 3) return player.records.thisReality.maxAM.gte(DC.E3E9);
    return PlayerProgress.realityUnlocked();
  }

  get isRunning() {
    return player.challenge.ultimate.current === this.id;
    if (this.id === 1) player.break = false;
  }

  requestStart() {
    if (!this.isUnlocked) return;
    if (GameEnd.creditsEverClosed) return;
    if (!player.options.confirmations.challenges) {
      this.start();
      return;
    }
    Modal.startUltimateChallenge.show(this.id);
  }

  start() {
    if (!this.isUnlocked || this.isRunning) return;
    if (this.id === 1 || this.id === 2) {
      // Forces big crunch reset but ensures IP gain, if any.
      bigCrunchReset(true, true);
    }
    if (this.id === 3) {
      eternity(true);
    }
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = 0;
    player.challenge.eternity.current = 0;
    player.challenge.ultimate.current = this.id;
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
    if (this.id !== 1) player.break = true;
  }

  get isCompleted() {
    return (player.challenge.ultimate.completedBits & (1 << this.id)) !== 0;
  }

  complete() {
    player.challenge.ultimate.completedBits |= 1 << this.id;
    EventHub.dispatch(GAME_EVENT.ULTIMATE_CHALLENGE_COMPLETED);
    player.break = true;
  }

  get isEffectActive() {
    return this.isRunning;
  }

  get goal() {
    if (this.id === 1) return Decimal.NUMBER_MAX_VALUE;
    if (this.id === 2) return DC.E1_6E6;
    if (this.id === 3) return DC.E1E15;
  }

  get reward() {
    return this._reward;
  }

  updateChallengeTime() {
    const bestTimes = player.challenge.ultimate.bestTimes;
    if (bestTimes[this.id - 1] <= player.records.thisInfinity.time) {
      return;
    }
    player.challenge.ultimate.bestTimes[this.id - 1] = player.records.thisInfinity.time;
    GameCache.ultimateChallengeTimeSum.invalidate();
  }

  exit() {
    player.challenge.ultimate.current = 0;
    bigCrunchReset(true, false);
    if (!Enslaved.isRunning) Tab.dimensions.antimatter.show();
  }
}

export const UltimateChallenge = UltimateChallengeState.createAccessor(GameDatabase.challenges.ultimate);

Object.defineProperty(UltimateChallenge, "current", {
  get: () => (player.challenge.ultimate.current > 0
    ? UltimateChallenge(player.challenge.ultimate.current)
    : undefined),
});

Object.defineProperty(UltimateChallenge, "isRunning", {
  get: () => UltimateChallenge.current !== undefined,
});

export const UltimateChallenges = {
  all: UltimateChallenge.index.compact(),
  completeAll() {
    for (const challenge of UltimateChallenges.all) challenge.complete();
  },
  clearCompletions() {
    player.challenge.ultimate.completedBits = 0;
  },
  get nextUC() {
    return UltimateChallenges.all.find(x => !x.isUnlocked);
  },
  get nextUCUnlockReq() {
    return this.nextUC?.unlockReq;
  },
  get completed() {
    return UltimateChallenges.all.filter(x => x.isCompleted);
  }
};
