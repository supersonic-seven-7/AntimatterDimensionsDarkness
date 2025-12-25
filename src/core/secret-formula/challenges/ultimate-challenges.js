import { DC } from "../../constants";

export const ultimateChallenges = [
  {
    id: 1,
    description: () =>
      `You are locked inside all Normal Challenges AT THE SAME TIME. This includes
      Challenge ${formatInt(9)} and Challenge ${formatInt(12)}.`,
    goal: Decimal.NUMBER_MAX_VALUE,
    isQuickResettable: true,
    reward: {
      description: "You can Break Infinity",
    },
    unlockReq: Decimal.NUMBER_MAX_VALUE,
  },
  {
    id: 2,
    description: () =>
      `You are trapped in every Infinity Challenge AT THE SAME TIME.`,
    goal: DC.E1_6E6,
    isQuickResettable: true,
    reward: {
      description:
        "Delay Infinity Dimension Purchase Caps based on Dimension Boosts",
      effect: () => Math.log10(DimBoost.purchasedBoosts + 1) + 1,
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockReq: DC.E3_6E6,
  },
  {
    id: 3,
    description: () =>
      `You are trapped in every Eternity Challenge AT THE SAME TIME.`,
    goal: Decimal.NUMBER_MAX_VALUE,
    isQuickResettable: true,
    reward: {
      description: () =>
        `Increase Tachyon Amplifier Power based on record Antimatter inside this challenge
        (Currently: ${format(player.records.thisReality.bestAMUC3, 2, 2)})`,
      effect: () => (Decimal.min(Math.pow(Math.max(Decimal.log10(player.records.thisReality.bestAMUC3) / Decimal.log10(Decimal.NUMBER_MAX_VALUE), 1), 0.5) - 1, 0.8).div(320)).add(Decimal.max(((Math.pow(Math.max((Decimal.log10(player.records.thisReality.bestAMUC3) / Decimal.log10(Decimal.NUMBER_MAX_VALUE)) / 3.24, 1), 0.1) - 1) / 320), 0)).add(0.001).toNumber(),
      formatEffect: value => `+${format(value, 2, 4)}`
    },
    unlockReq: DC.E3E9,
  }
];
