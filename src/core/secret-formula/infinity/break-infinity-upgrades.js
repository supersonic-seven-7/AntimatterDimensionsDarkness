import { DC } from "../../constants";

function rebuyable(config) {
  const effectFunction = config.effect || (x => x);
  const { id, maxUpgrades, description, isDisabled, noLabel, onPurchased } = config;
  return {
    rebuyable: true,
    id,
    cost: () => config.initialCost * Math.pow(config.costIncrease, player.infinityRebuyables[config.id]),
    maxUpgrades,
    description,
    effect: () => effectFunction(player.infinityRebuyables[config.id]),
    isDisabled,
    // There isn't enough room in the button to fit the EC reduction and "Next:" at the same time while still
    // presenting all the information in an understandable way, so we only show it if the upgrade is maxed
    formatEffect: config.formatEffect ||
      (value => {
        const afterECText = config.afterEC ? config.afterEC() : "";
        return value === config.maxUpgrades
          ? `Currently: ${formatX(10 - value)} ${afterECText}`
          : `Currently: ${formatX(10 - value)} | Next: ${formatX(10 - value - 1)}`;
      }),
    formatCost: value => format(value, 2, 0),
    noLabel,
    onPurchased
  };
}

export const breakInfinityUpgrades = {
  totalAMMult: {
    id: "totalMult",
    cost: 1e4,
    description: "Antimatter Dimensions gain a multiplier based on total antimatter produced",
    effect: () => Math.pow(player.records.totalAntimatter.exponent + 1, 5),
    formatEffect: value => formatX(value, 2, 2)
  },
  currentAMMult: {
    id: "currentMult",
    cost: 5e4,
    description: "Antimatter Dimensions gain a multiplier based on current antimatter",
    effect: () => Math.pow(Currency.antimatter.exponent + 1, 5),
    formatEffect: value => formatX(value, 2, 2)
  },
  galaxyBoost: {
    id: "postGalaxy",
    cost: 5e10,
    description: () => `Apply a cube to the Dimboost Multiplier and a small buff to Tickspeed`,
    effect: 3
  },
  infinitiedMult: {
    id: "infinitiedMult",
    cost: 1e5,
    description: "Antimatter Dimensions gain a multiplier based on Infinities",
    effect: () => 1 + Currency.infinitiesTotal.value.pLog10() * 100,
    formatEffect: value => formatX(value, 2, 2)
  },
  achievementMult: {
    id: "achievementMult",
    cost: 1e6,
    description: "Antimatter Dimensions gain a multiplier based on Achievements completed",
    effect: () => Math.max(Math.pow((Achievements.effectiveCount - 30), 4) / 40, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  slowestChallengeMult: {
    id: "challengeMult",
    cost: 1e7,
    description: "Antimatter Dimensions gain a multiplier based on how fast your slowest challenge run is",
    effect: () => Decimal.clampMin(Math.pow((50 / Time.worstChallenge.totalMinutes), 2), 1),
    formatEffect: value => formatX(value, 2, 2),
    hasCap: true,
    cap: DC.D2E9
  },
  infinitiedGen: {
    id: "infinitiedGeneration",
    cost: 2e7,
    description: "Passively generate Infinities based on your fastest Infinity",
    effect: () => player.records.bestInfinity.time,
    formatEffect: value => {
      if (value === Number.MAX_VALUE && !Pelle.isDoomed) return "No Infinity generation";
      let infinities = DC.D1;
      infinities = infinities.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infinities = infinities.times(getAdjustedGlyphEffect("infinityinfmult"));
      const timeStr = Time.bestInfinity.totalMilliseconds <= 50
        ? `${TimeSpan.fromMilliseconds(100).toStringShort()} (capped)`
        : `${Time.bestInfinity.times(2).toStringShort()}`;
      return `${quantify("Infinity", infinities)} every ${timeStr}`;
    }
  },
  autobuyMaxDimboosts: {
    id: "autobuyMaxDimboosts",
    cost: 5e6,
    description: "Unlock the buy max Dimension Boost Autobuyer mode"
  },
  autobuyerSpeed: {
    id: "autoBuyerUpgrade",
    cost: 1e15,
    description: "Autobuyers unlocked or improved by Normal Challenges work twice as fast"
  },
  tickspeedCostMult: rebuyable({
    id: 0,
    initialCost: 1e5,
    costIncrease: 3,
    maxUpgrades: 8,
    description: "Reduce post-infinity Tickspeed Upgrade cost multiplier scaling",
    afterEC: () => (EternityChallenge(11).completions > 0
      ? `After EC11: ${formatX(Player.tickSpeedMultDecrease, 2, 2)}`
      : ""
    ),
    noLabel: true,
    onPurchased: () => GameCache.tickSpeedMultDecrease.invalidate()
  }),
  dimCostMult: rebuyable({
    id: 1,
    initialCost: 1e6,
    costIncrease: 200,
    maxUpgrades: 7,
    description: "Reduce post-infinity Antimatter Dimension cost multiplier scaling",
    afterEC: () => (EternityChallenge(6).completions > 0
      ? `After EC6: ${formatX(Player.dimensionMultDecrease, 2, 2)}`
      : ""
    ),
    noLabel: true,
    onPurchased: () => GameCache.dimensionMultDecrease.invalidate()
  }),
  ipGen: rebuyable({
    id: 2,
    initialCost: 1e7,
    costIncrease: 5,
    maxUpgrades: 10,
    effect: value => Player.bestRunIPPM.times(value / 10),
    description: () => {
      let generation = `Generate ${formatInt(10 * player.infinityRebuyables[2])}%`;
      if (!BreakInfinityUpgrade.ipGen.isCapped) {
        generation += ` ➜ ${formatInt(10 * (1 + player.infinityRebuyables[2]))}%`;
      }
      return `${generation} of your best IP/min from your last 10 Infinities`;
    },
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${format(value, 2, 1)} IP/min`,
    noLabel: false
  })
};
