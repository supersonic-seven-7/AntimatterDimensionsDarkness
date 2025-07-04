import { DC } from "../../constants";

const specialInfinityGlyphDisabledEffectText = () => (PelleRifts.chaos.milestones[1].canBeApplied
  ? "The Pelle-Specific effect from Infinity Glyphs is also disabled."
  : "");

export const eternityChallenges = [
  {
    id: 1,
    description: "Time Dimensions are disabled.",
    goal: DC.E55400,
    goalIncrease: DC.E20000,
    reward: {
      description: "Time Dimension multiplier based on time spent this Eternity",
      effect: completions =>
        Decimal.pow(Math.max(player.records.thisEternity.time * 100, 1), 0.5 + (completions * 0.1)),
      formatEffect: value => formatX(value, 2, 1)
    },
    // These will get notation-formatted and scrambled between for the final goal
    scrambleText: ["1e2600", "1e201600"],
  },
  {
    id: 2,
    description: "Infinity Dimensions are disabled.",
    goal: DC.E1080,
    pelleGoal: DC.E1750,
    goalIncrease: DC.E200,
    reward: {
      description: "1st Infinity Dimension multiplier based on Infinity Power",
      effect: completions => Currency.infinityPower.value.pow(1.5 / (70 - completions * 10)).clampMin(1),
      cap: DC.E1E6,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 3,
    description: "Antimatter Dimensions 5-8 don't produce anything. Dimensional Sacrifice is disabled.",
    goal: DC.E6375,
    pelleGoal: DC.E975,
    goalIncrease: DC.E1550,
    reward: {
      description: () => `Increase the multiplier for buying ${formatInt(10)} Antimatter Dimensions`,
      effect: completions => Decimal.pow(completions * 1.44, 2),
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  {
    id: 4,
    description: `all Infinity multipliers and generators are disabled. The goal must be reached within a certain
      number of Infinities or else you will fail the Challenge.`,
    goal: DC.E18000,
    goalIncrease: DC.E45000,
    restriction: completions => Math.max(16 - 4 * completions, 0),
    checkRestriction: restriction => Currency.infinities.lte(restriction),
    formatRestriction: restriction => (restriction === 0
      ? "without any Infinities"
      : `in ${quantifyInt("Infinity", restriction)} or less`),
    failedRestriction: "(Too many Infinities for more)",
    reward: {
      description: "Infinity Dimension multiplier based on unspent IP",
      effect: completions => Currency.infinityPoints.value.pow(0.01 + completions * 0.0025),
      cap: DC.E1E6,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 5,
    description: () => `Dimension Boost costs scaling is massively increased.`,
    goal: DC.E10250,
    pelleGoal: DC.E1400,
    goalIncrease: DC.E1650,
    reward: {
      description: "Improve the Eternity Point Formula",
      effect: completions => 3083 - (completions * 200),
      formatEffect: value => `log(x)/3,083 ➜ log(x)/${formatInt(value)}`
    }
  },
  {
    id: 6,
    // The asterisk, if present, will get replaced with strings generated from the scramble text
    description: () => {
      if (Enslaved.isRunning) return "you *. The cost of upgrading your max Replicanti Boosters is massively reduced.";
      return "you cannot gain Dimension Boosts normally. The cost of upgrading your max Replicanti" +
              " Boosters is massively reduced.";
    },
    goal: DC.E13400,
    pelleGoal: DC.E1500,
    goalIncrease: DC.E11000,
    reward: {
      description: "Further reduce Antimatter Dimension cost multiplier growth",
      effect: completions => completions * 0.2,
      formatEffect: value => {
        const total = Math.round(Player.dimensionMultDecrease + Effects.sum(EternityChallenge(6).reward)) - value;
        return `-${format(value, 2, 1)} (${formatX(total, 2, 1)} total)`;
      }
    },
    scrambleText: ["cannot gain Dimension Boosts normally", "c㏰'퐚 gai鸭 Dim꟢si랜onﻪﶓB⁍osts㮾 䂇orma㦂l"],
  },
  {
    id: 7,
    description:
      "1st Time Dimensions produce 8th Infinity Dimensions and 1st Infinity Dimensions produce " +
      "7th Antimatter Dimensions. Tickspeed also directly applies to Infinity and Time Dimensions.",
    goal: DC.E1000,
    pelleGoal: DC.E2700,
    goalIncrease: DC.E75,
    effect: () => TimeDimension(1).productionPerSecond,
    reward: {
      description: "1st Time Dimension produces 8th Infinity Dimensions",
      effect: completions => TimeDimension(1).productionPerSecond.pow(completions * 2).minus(1).clampMin(0),
      formatEffect: value => `${format(value, 2, 1)} per second`
    }
  },
  {
    id: 8,
    description: () => `you can only upgrade Infinity Dimensions ${formatInt(50)} times and Replicanti
      upgrades ${formatInt(40)} times. Infinity Dimension and Replicanti upgrade autobuyers are disabled.`,
    goal: DC.E6375,
    pelleGoal: DC.E2800,
    goalIncrease: DC.E26000,
    reward: {
      description: "Infinity Power strengthens Replicanti Boosters",
      effect: completions => {
        const infinityPower = Math.log10(Currency.infinityPower.value.pLog10() + 1);
        return Math.max(0, Math.pow(infinityPower, 0.1 * completions));
      },
      formatEffect: value => `${formatPercents(value, 2)} Strength`
    }
  },
  {
    id: 9,
    description: () => `you cannot buy Tickspeed upgrades. Infinity Power instead multiplies
      Time Dimensions with greatly reduced effect. ${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E1100,
    pelleGoal: DC.E2900,
    goalIncrease: DC.E700,
    reward: {
      description: "Infinity Dimension multiplier based on Time Shards",
      effect: completions => Currency.timeShards.value.pow(completions * 2).clampMin(1),
      cap: DC.E1E6,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 10,
    description: () => {
      let description = `Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from
        Infinities to Antimatter Dimensions (Infinities${formatPow(950)}). ${specialInfinityGlyphDisabledEffectText()}`;
      EternityChallenge(10).applyEffect(v => description += ` Currently: ${formatX(v, 2, 1)}`);
      return description;
    },
    goal: DC.E3000,
    pelleGoal: DC.E3200,
    goalIncrease: DC.E300,
    effect: () => Decimal.pow(Currency.infinitiesTotal.value, 950).clampMin(1).pow(TimeStudy(31).effectOrDefault(1)),
    reward: {
      description: "Time Dimension multiplier based on Infinities",
      effect: completions => {
        const mult = Currency.infinitiesTotal.value.times(2.783e-6).pow(0.4 + 0.1 * completions).clampMin(1);
        return mult.powEffectOf(TimeStudy(31));
      },
      formatEffect: value => {
        // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
        const mult = formatX(value, 2, 1);
        return TimeStudy(31).canBeApplied
          ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (After TS31: ${mult})`
          : mult;
      }
    }
  },
  {
    id: 11,
    description: () => `all Dimension multipliers and powers are disabled except for the multipliers from
      Infinity Power and Dimension Boosts (to Antimatter Dimensions). ${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E450,
    pelleGoal: DC.E11200,
    goalIncrease: DC.E200,
    pelleGoalIncrease: DC.E1400,
    reward: {
      description: "Further reduce Tickspeed cost multiplier growth",
      effect: completions => completions * 0.07,
      formatEffect: value => {
        const total = Math.round(Player.tickSpeedMultDecrease + Effects.sum(EternityChallenge(11).reward)) - value;
        return `-${format(value, 2, 2)} (${formatX(total, 2, 2)} total)`;
      }
    }
  },
  {
    id: 12,
    description: () => (PlayerProgress.realityUnlocked()
      ? `the game runs ×${formatInt(1000)} slower; all other game speed effects are disabled. The goal must be reached
        within a certain amount of time or you will fail the Challenge. ${specialInfinityGlyphDisabledEffectText()}`
      : `the game runs ×${formatInt(1000)} slower. The goal must be reached
        within a certain amount of time or you will fail the Challenge.`),
    goal: DC.E110000,
    pelleGoal: DC.E208000,
    goalIncrease: DC.E12000,
    restriction: completions => Math.max(10 - 2 * completions, 1) / 10,
    checkRestriction: restriction => Time.thisEternity.totalSeconds < restriction,
    formatRestriction: restriction => `in ${quantify("in-game second", restriction, 0, 1)} or less.`,
    failedRestriction: "(Too slow for more)",
    reward: {
      description: "Infinity Dimension cost multipliers are reduced",
      effect: completions => 1 - completions * 0.008,
      formatEffect: value => `x${formatPow(value, 3, 3)}`
    }
  }
];
