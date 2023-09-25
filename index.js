// @bun
// logic/gameplay/cards/Zone.ts
var Zone;
(function(Zone2) {
  Zone2[Zone2["DECK"] = 0] = "DECK";
  Zone2[Zone2["TOP_DECK"] = 1] = "TOP_DECK";
  Zone2[Zone2["BOTTOM_DECK"] = 2] = "BOTTOM_DECK";
  Zone2[Zone2["RANDOM_DECK"] = 3] = "RANDOM_DECK";
  Zone2[Zone2["HAND"] = 4] = "HAND";
  Zone2[Zone2["DISCARD"] = 5] = "DISCARD";
  Zone2[Zone2["NONE"] = 6] = "NONE";
})(Zone || (Zone = {}));

// logic/gameplay/deck/Deck.ts
class Deck extends Array {
  constructor() {
    super(...arguments);
  }
  discardPile = [];
  props = {};
  set(card) {
    this.splice(0, this.length, ...card);
    return this;
  }
  asArray() {
    return this;
  }
  addCard(card, amt = 1) {
    for (let i = 0;i < amt; i++) {
      this.push(card.clone().setZone(Zone.DECK));
    }
    return this;
  }
  addCards(cards) {
    this.push(...cards.map((card) => card.clone().setZone(Zone.DECK)));
    return this;
  }
  shuffle() {
    for (let i = this.length - 1;i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
  }
  reshuffle() {
    this.push(...this.discardPile.map((card) => card.setZone(Zone.DECK)));
    this.discardPile = [];
    this.shuffle();
  }
  draw(qty = 1) {
    let cards = [];
    for (let i = 0;i < qty; i++) {
      if (this.length === 0) {
        this.reshuffle();
      }
      cards.push(this.pop().setZone(Zone.HAND));
    }
    return cards;
  }
  static fromCardList(size, cards) {
    let rarityMap = {};
    for (let card of cards) {
      if (!rarityMap[card.getRarity()])
        rarityMap[card.getRarity()] = 0;
      rarityMap[card.getRarity()]++;
    }
    let rarityWeights = {};
    let total = 0;
    for (let rarity of Object.keys(rarityMap)) {
      rarityWeights[rarity] = size * Math.pow(0.75, Object.keys(rarityMap).indexOf(rarity));
      total += rarityWeights[rarity];
    }
    for (let rarity of Object.keys(rarityMap)) {
      rarityWeights[rarity] = Math.round(rarityWeights[rarity] / total * size);
    }
    let deck = new Deck;
    for (let card of cards) {
      deck.addCard(card.clone(), rarityWeights[card.getRarity()]);
    }
    return deck;
  }
}

// logic/structure/utils/CardEnums.ts
var Choices;
(function(Choices2) {
  Choices2[Choices2["PLAYER"] = 0] = "PLAYER";
  Choices2[Choices2["OPPONENT"] = 1] = "OPPONENT";
  Choices2[Choices2["CARD_IN_HAND"] = 2] = "CARD_IN_HAND";
  Choices2[Choices2["CARD_IN_DISCARD"] = 3] = "CARD_IN_DISCARD";
  Choices2[Choices2["CARD"] = 4] = "CARD";
})(Choices || (Choices = {}));
var Pointer;
(function(Pointer2) {
  Pointer2[Pointer2["SELF"] = 0] = "SELF";
  Pointer2[Pointer2["OPPONENT_MOST_CARDS"] = 1] = "OPPONENT_MOST_CARDS";
  Pointer2[Pointer2["OPPONENT_LEAST_CARDS"] = 2] = "OPPONENT_LEAST_CARDS";
  Pointer2[Pointer2["OPPONENT_RANDOM"] = 3] = "OPPONENT_RANDOM";
  Pointer2[Pointer2["PLAYER_RANDOM"] = 4] = "PLAYER_RANDOM";
  Pointer2[Pointer2["PLAYER_MOST_CARDS"] = 5] = "PLAYER_MOST_CARDS";
  Pointer2[Pointer2["PLAYER_LEAST_CARDS"] = 6] = "PLAYER_LEAST_CARDS";
  Pointer2[Pointer2["CARD_IN_HAND_LEAST_POWER"] = 7] = "CARD_IN_HAND_LEAST_POWER";
  Pointer2[Pointer2["CARD_IN_HAND_MOST_POWER"] = 8] = "CARD_IN_HAND_MOST_POWER";
  Pointer2[Pointer2["CARD_IN_HAND_RANDOM"] = 9] = "CARD_IN_HAND_RANDOM";
  Pointer2[Pointer2["CARD_IN_DISCARD_LEAST_POWER"] = 10] = "CARD_IN_DISCARD_LEAST_POWER";
  Pointer2[Pointer2["CARD_IN_DISCARD_MOST_POWER"] = 11] = "CARD_IN_DISCARD_MOST_POWER";
  Pointer2[Pointer2["CARD_IN_DISCARD_RANDOM"] = 12] = "CARD_IN_DISCARD_RANDOM";
  Pointer2[Pointer2["OPPONENT_MOST_TURNS_REMAINING"] = 13] = "OPPONENT_MOST_TURNS_REMAINING";
  Pointer2[Pointer2["OPPONENT_LEAST_TURNS_REMAINING"] = 14] = "OPPONENT_LEAST_TURNS_REMAINING";
  Pointer2[Pointer2["PLAYER_MOST_TURNS_REMAINING"] = 15] = "PLAYER_MOST_TURNS_REMAINING";
  Pointer2[Pointer2["PLAYER_LEAST_TURNS_REMAINING"] = 16] = "PLAYER_LEAST_TURNS_REMAINING";
})(Pointer || (Pointer = {}));
var Rarity;
(function(Rarity2) {
  Rarity2[Rarity2["BASIC"] = 0] = "BASIC";
  Rarity2[Rarity2["COMMON"] = 1] = "COMMON";
  Rarity2[Rarity2["UNCOMMON"] = 2] = "UNCOMMON";
  Rarity2[Rarity2["RARE"] = 3] = "RARE";
  Rarity2[Rarity2["MYTHIC"] = 4] = "MYTHIC";
  Rarity2[Rarity2["LEGENDARY"] = 5] = "LEGENDARY";
  Rarity2[Rarity2["HAXOR"] = 6] = "HAXOR";
})(Rarity || (Rarity = {}));

// logic/structure/utils/Resolver.ts
class ResolverCallback {
  callback;
  cachedValue;
  value = false;
  constructor(callback) {
    this.callback = callback;
    if (typeof callback !== "function") {
      this.value = true;
      this.cachedValue = callback;
    }
  }
  resolve(...args) {
    if (this.value) {
      return this.cachedValue;
    }
    return this.callback(...args);
  }
  getCallback() {
    return this.callback;
  }
}

// logic/gameplay/cards/Card.ts
class Card {
  name;
  abilities = [];
  power = 1;
  rarity = Rarity.COMMON;
  canPlay = new ResolverCallback(true);
  canGive = new ResolverCallback(true);
  discardable = true;
  zone = Zone.NONE;
  props = {};
  constructor(name, abilities) {
    this.name = name;
    this.abilities = abilities;
  }
  setZone(zone) {
    this.zone = zone;
    return this;
  }
  remove(cardArgs) {
    this.move(Zone.NONE, cardArgs);
  }
  move(newZone, cardArgs, props) {
    let oldZone = this.zone;
    switch (oldZone) {
      case Zone.DECK:
        cardArgs.deck.splice(cardArgs.deck.indexOf(this), 1);
        break;
      case Zone.HAND:
        if (props && props.from) {
          props.from.cih().splice(props.from.cih().indexOf(this), 1);
        } else {
          cardArgs.owner.cih().splice(cardArgs.owner.cih().indexOf(this), 1);
        }
        break;
      case Zone.DISCARD:
        cardArgs.deck.discardPile.splice(cardArgs.deck.discardPile.indexOf(this), 1);
        break;
    }
    this.fireEvents(`moveFrom_${Object.values(Zone)[oldZone]}`, cardArgs);
    if (newZone !== Zone.NONE) {
      switch (newZone) {
        case Zone.DECK:
        case Zone.RANDOM_DECK:
          cardArgs.deck.push(this);
          cardArgs.deck.shuffle();
          break;
        case Zone.TOP_DECK:
          cardArgs.deck.unshift(this);
          break;
        case Zone.BOTTOM_DECK:
          cardArgs.deck.push(this);
          break;
        case Zone.DISCARD:
          cardArgs.deck.discardPile.push(this);
          break;
        case Zone.HAND:
          if (props && props.to) {
            props.to.cih().push(this);
          } else {
            cardArgs.owner.cih().push(this);
          }
          break;
      }
      this.zone = newZone;
      if (this.zone === Zone.TOP_DECK || this.zone === Zone.BOTTOM_DECK || this.zone === Zone.RANDOM_DECK) {
        this.zone = Zone.DECK;
      }
      this.fireEvents(`moveTo_${Object.values(Zone)[this.zone]}`, cardArgs);
    } else {
      this.zone = newZone;
    }
  }
  setCanPlay(canPlay) {
    this.canPlay = new ResolverCallback(canPlay);
    return this;
  }
  setCanGive(canGive) {
    this.canGive = new ResolverCallback(canGive);
    return this;
  }
  setProps(props) {
    this.props = props;
    return this;
  }
  setProp(prop, value, args) {
    this.props[prop] = value;
    return this;
  }
  addAbility(ability) {
    this.abilities.push(ability);
    return this;
  }
  getChoices(cardArgs) {
    return this.orderAbilities().map((a) => {
      return a.informChoices({ ...cardArgs, card: this });
    }).flat();
  }
  skipDiscard() {
    this.discardable = false;
    return this;
  }
  doSkipDiscard() {
    return !this.discardable;
  }
  getProps() {
    return { ...this.props, zone: this.zone, power: this.power };
  }
  getProp(prop) {
    return this.getProps()[prop];
  }
  clone() {
    let card = new Card(this.name, this.abilities.map((ability) => ability.clone()));
    card.setPow(this.power);
    card.setRarity(this.rarity);
    card.setCanPlay(this.canPlay.getCallback());
    card.setCanGive(this.canGive.getCallback());
    card.setProps({ ...this.props });
    return card;
  }
  canBePlayed(cardArgs) {
    let abilityChecks = this.abilities.map((ability) => ability.canBePlayed(cardArgs));
    if (abilityChecks.includes(false))
      return false;
    return this.canPlay.resolve(cardArgs);
  }
  canBeGiven(opp, cardArgs) {
    let abilityChecks = this.abilities.map((ability) => ability.canBeGiven(opp, cardArgs));
    if (abilityChecks.includes(false))
      return false;
    return this.canGive.resolve(opp, cardArgs);
  }
  setRarity(rarity) {
    this.rarity = rarity;
    return this;
  }
  getRarity() {
    return this.rarity;
  }
  getAbilities() {
    return this.abilities;
  }
  getName() {
    let powStr = "";
    if (this.pow() !== 1) {
      if (this.pow() > 1) {
        powStr = ` +${this.pow() - 1}`;
      } else if (this.pow() < 1) {
        powStr = ` ${this.pow() - 1}`;
      }
    }
    return this.name + powStr;
  }
  setName(name) {
    this.name = name;
    return this;
  }
  toCardState() {
    return {
      name: this.name,
      power: this.power,
      rarity: this.rarity,
      text: this.getText(),
      props: this.props
    };
  }
  getLogText() {
    return `\xA7\xA7${this.name}\xA7card\xA7${JSON.stringify(this.toCardState())}\xA7\xA7`;
  }
  pow() {
    return Math.min(this.power, 999);
  }
  setPow(pow) {
    this.power = pow;
    if (this.power > 999) {
      this.power = 999;
    }
    return this;
  }
  explode(args) {
    this.move(Zone.NONE, args);
    let cards = [];
    if (this.getProp(`fragment`)) {
      return cards;
    } else {
      let ctr = 1;
      for (let ability of this.orderAbilities()) {
        let newCard = new Card(`${this.getName()} Fragment #${ctr}`, [
          ability.clone()
        ]).setPow(this.pow()).setRarity(this.getRarity()).setProps({ ...this.props });
        newCard.setProp(`fragment`, true);
        ctr++;
        cards.push(newCard);
      }
      return cards;
    }
  }
  orderAbilities() {
    return this.abilities.sort((a, b) => {
      if (a.constructor.name === "CostAbility" && b.constructor.name !== "CostAbility") {
        return -1;
      } else if (a.constructor.name !== "CostAbility" && b.constructor.name === "CostAbility") {
        return 1;
      } else if (a.constructor.name === "PlayerRestrictionAbility" && b.constructor.name !== "PlayerRestrictionAbility") {
        return -1;
      } else if (a.constructor.name !== "PlayerRestrictionAbility" && b.constructor.name === "PlayerRestrictionAbility") {
        return 1;
      } else if (a.constructor.name === "PlayerRestrictionAbilityNeg" && b.constructor.name !== "PlayerRestrictionAbilityNeg") {
        return -1;
      } else if (a.constructor.name !== "PlayerRestrictionAbilityNeg" && b.constructor.name === "PlayerRestrictionAbilityNeg") {
        return 1;
      } else if (a.constructor.name === "PlayerPredicateRestrictionAbility" && b.constructor.name !== "PlayerPredicateRestrictionAbility") {
        return -1;
      } else if (a.constructor.name !== "PlayerPredicateRestrictionAbility" && b.constructor.name === "PlayerPredicateRestrictionAbility") {
        return 1;
      } else if (a.hasRestriction() && !b.hasRestriction()) {
        return -1;
      } else if (!a.hasRestriction() && b.hasRestriction()) {
        return 1;
      }
      return 0;
    });
  }
  fireEvents(event, cardArgs) {
    for (let ability of this.orderAbilities()) {
      ability.fireEvents(event, cardArgs);
    }
  }
  play(owner, opps, deck, choices) {
    let ctr = 0;
    if (this.canBePlayed({ owner, opps, deck, card: this })) {
      for (let ability of this.orderAbilities()) {
        let c = choices ? choices[ctr] : undefined;
        ability.fireEvents("play", { owner, opps, deck, card: this, choices: c });
        ctr++;
      }
    }
  }
  draw(owner, opps, deck) {
    for (let ability of this.orderAbilities()) {
      ability.fireEvents("draw", { owner, opps, deck, card: this });
    }
  }
  give(owner, opps, deck) {
    for (let ability of this.orderAbilities()) {
      ability.fireEvents("give", { owner, opps, deck, card: this });
    }
  }
  discard(owner, opps, deck) {
    for (let ability of this.orderAbilities()) {
      ability.fireEvents("discard", { owner, opps, deck, card: this });
    }
  }
  getText() {
    let abilities = this.orderAbilities();
    return abilities.map((ability) => ability.getText()).join("\n");
  }
  getFormulatedText(cardArgs) {
    let abilities = this.orderAbilities();
    return abilities.map((ability) => ability.getFormulatedText(cardArgs)).join("\n");
  }
  getFormulas() {
    let abilities = this.orderAbilities();
    return abilities.map((ability) => {
      if (ability.hasFormula()) {
        return ability.getFormula();
      }
      return "";
    });
  }
  getTraits(c) {
    let abilities = this.orderAbilities();
    let trait_list = abilities.map((ability) => {
      return ability.ai();
    });
    let traits = { profile: {} };
    for (let profile of trait_list) {
      for (let key of Object.keys(profile)) {
        let value = new ResolverCallback(profile[key]).resolve(c);
        if (traits.profile[key]) {
          traits.profile[key] += value;
        } else {
          traits.profile[key] = value;
        }
      }
    }
    return traits;
  }
  static combine(...cards) {
    let clones = cards.map((card) => card.clone());
    let newCard = new Card(clones.map((card) => card.getName()).join(" + "), [
      ...clones.map((card) => card.getAbilities()).flat()
    ]);
    newCard.setPow(Math.floor(clones.map((card) => card.pow()).reduce((a, b) => a + b, 0) / clones.length));
    newCard.setRarity(Math.floor(clones.map((card) => card.getRarity()).reduce((a, b) => a + b, 0) / clones.length));
    newCard.setCanPlay((cardArgs) => {
      for (let card of clones) {
        if (!card.canBePlayed(cardArgs)) {
          return false;
        }
      }
      return true;
    });
    let props = {};
    for (let card of clones) {
      props = { ...props, ...card.getProps() };
    }
    newCard.setProps(props);
    return newCard;
  }
}

// logic/gameplay/player/bots/BehaviorProfile.ts
var BotType = {
  Jesse: {
    collectResource: 10,
    spendResource: -15,
    affectsSelf: 5,
    affectsOpponents: 20,
    changesGame: 5,
    meme: 10,
    oppWinSetback: 50,
    discardOpponentCards: 10
  },
  Ian: {
    collectResource: 20,
    spendResource: 10,
    drawsCards: 10,
    changesGame: 10,
    affectsSelf: 15,
    discardsCards: -10,
    unlockUpgrades: 10
  }
};
var BehaviorProfile_default = BotType;

// logic/gameplay/player/bots/Bot.ts
class Bot {
  optimality = 1;
  profile = {};
  profileName = "";
  constructor(profile = "") {
    if (BehaviorProfile_default[profile]) {
      this.profileName = profile;
    } else {
      this.profileName = Object.keys(BehaviorProfile_default)[Math.floor(Math.random() * Object.keys(BehaviorProfile_default).length)];
    }
    this.profile = BehaviorProfile_default[this.profileName];
  }
  getProfileName() {
    return this.profileName;
  }
  getProfile() {
    return this.profile;
  }
  static makeSpecificChoice(args, choice) {
    let madeChoices = [];
    if (choice.pointer instanceof Function) {
      madeChoices.push(choice.pointer(args));
    } else {
      switch (choice.pointer) {
        case Pointer.SELF:
          madeChoices.push(args.owner);
          break;
        case Pointer.OPPONENT_MOST_CARDS:
          madeChoices.push(...args.opps.sort((a, b) => b.inHand() - a.inHand()));
          break;
        case Pointer.OPPONENT_LEAST_CARDS:
          madeChoices.push(...args.opps.sort((a, b) => a.inHand() - b.inHand()));
          break;
        case Pointer.OPPONENT_RANDOM:
          let shuffled = args.opps.sort(() => Math.random() - 0.5);
          madeChoices.push(...shuffled);
          break;
        case Pointer.CARD_IN_DISCARD_LEAST_POWER:
          madeChoices.push(...args.deck.discardPile.sort((a, b) => {
            if (!a || !b) {
              return 0;
            }
            return a.pow() - b.pow();
          }));
          break;
        case Pointer.CARD_IN_DISCARD_MOST_POWER:
          madeChoices.push(...args.deck.discardPile.sort((a, b) => {
            if (!a || !b) {
              return 0;
            }
            return b.pow() - a.pow();
          }));
          break;
        case Pointer.CARD_IN_DISCARD_RANDOM:
          madeChoices.push(...args.owner.cih().sort(() => Math.random() - 0.5));
          break;
        case Pointer.CARD_IN_HAND_LEAST_POWER:
          madeChoices.push(...args.owner.cih().sort((a, b) => {
            if (!a || !b) {
              return 0;
            }
            return a.pow() - b.pow();
          }));
          break;
        case Pointer.CARD_IN_HAND_MOST_POWER:
          madeChoices.push(...args.owner.cih().sort((a, b) => {
            if (!a || !b) {
              return 0;
            }
            return b.pow() - a.pow();
          }));
          break;
        case Pointer.CARD_IN_HAND_RANDOM:
          madeChoices.push(...args.owner.cih().sort(() => Math.random() - 0.5));
          break;
        case Pointer.PLAYER_RANDOM:
          madeChoices.push(...[args.owner, ...args.opps].sort(() => Math.random() - 0.5));
          break;
        case Pointer.PLAYER_MOST_CARDS:
          madeChoices.push(...[args.owner, ...args.opps].sort((a, b) => b.inHand() - a.inHand()));
          break;
        case Pointer.PLAYER_LEAST_CARDS:
          madeChoices.push(...[args.owner, ...args.opps].sort((a, b) => a.inHand() - b.inHand()));
          break;
        case Pointer.PLAYER_MOST_TURNS_REMAINING:
          madeChoices.push(...[args.owner, ...args.opps].sort((a, b) => b.getTurns() - a.getTurns()));
          break;
        case Pointer.PLAYER_LEAST_TURNS_REMAINING:
          madeChoices.push(...[args.owner, ...args.opps].sort((a, b) => a.getTurns() - b.getTurns()));
          break;
        case Pointer.OPPONENT_MOST_TURNS_REMAINING:
          madeChoices.push(...args.opps.sort((a, b) => b.getTurns() - a.getTurns()));
          break;
        case Pointer.OPPONENT_LEAST_TURNS_REMAINING:
          madeChoices.push(...args.opps.sort((a, b) => a.getTurns() - b.getTurns()));
          break;
      }
    }
    return madeChoices;
  }
  optimalityCrux(decisions) {
    let optimus = this.optimality;
    let opts = decisions.length;
    let FUNC = (x) => {
      let COEFF = 2 * opts;
      let EXPONENT_E = -(1 - optimus) * x;
      return COEFF * (1 - 1 / (1 + Math.E ** EXPONENT_E));
    };
    let rand = Math.random() * 100;
    return decisions[Math.floor(FUNC(rand))];
  }
  selectChoices(choices, args) {
    if (!args.card) {
      return [];
    } else {
      let toMake = args.card.getChoices(args);
      let made = [];
      for (let choice of toMake) {
        made.push(this.optimalityCrux(Bot.makeSpecificChoice(args, choice)));
      }
    }
  }
  evaluate(card, c) {
    let weights = card.getTraits(c);
    let sum = 0;
    for (const weight in weights.profile) {
      if (this.profile[weight]) {
        try {
          sum += weights.profile[weight] * this.profile[weight];
        } catch {
          console.log(`Error evaluating card ${card.getName()} with weight ${weight}`);
        }
      }
    }
    return sum;
  }
}

// logic/abilities/core/BaseAbility.ts
class BaseAbility {
  text;
  callback;
  choices = new ResolverCallback([]);
  formula = `{pow}`;
  canPlay = new ResolverCallback(true);
  canGive = new ResolverCallback(true);
  props = {};
  events = {};
  traits = {};
  constructor(text, choices, callback) {
    this.text = text;
    this.callback = callback;
    this.choices = new ResolverCallback(choices);
    this.addEvent("play", (cardArgs) => {
      this.exec(cardArgs);
    });
  }
  ai() {
    return this.traits;
  }
  sai(aiWeights, meta) {
    this.traits = { ...aiWeights };
    return this;
  }
  isCostAbility() {
    return this.props["cost_ability"] ?? false;
  }
  clone() {
    let ability = new BaseAbility(this.text, this.choices.resolve(), this.callback);
    ability.setFormula(this.formula);
    ability.setCanPlay(this.canPlay.getCallback());
    ability.setCanGive(this.canGive.getCallback());
    ability.sai(this.ai());
    return ability;
  }
  getChoices() {
    return this.choices.resolve();
  }
  getCallback() {
    return this.callback;
  }
  setCanPlay(canPlay) {
    this.canPlay = new ResolverCallback(canPlay);
    return this;
  }
  setCanGive(canGive) {
    this.canGive = new ResolverCallback(canGive);
  }
  canBePlayed(cardArgs) {
    let choices = this.choices.resolve(cardArgs);
    if (choices.length > 0) {
      for (let choice of choices) {
        if (choice.choice === Choices.OPPONENT) {
          if (cardArgs.opps.length === 0) {
            return false;
          }
        } else if (choice.choice === Choices.CARD_IN_DISCARD) {
          if (!cardArgs.deck) {
            return false;
          }
          if (cardArgs.deck.discardPile.length === 0) {
            return false;
          }
        } else if (choice.choice === Choices.CARD_IN_HAND) {
          if (cardArgs.owner.cih().length <= 1) {
            return false;
          }
        }
      }
    }
    return this.canPlay.resolve(cardArgs);
  }
  canBeGiven(opp, cardArgs) {
    return this.canGive.resolve(opp, cardArgs);
  }
  setText(text) {
    this.text = text;
    return this;
  }
  hasRestriction() {
    return typeof this.canPlay === "function" || !this.canPlay;
  }
  getText() {
    return this.text.replace("{formula}", this.textualizeFormula());
  }
  getFormulatedText(cardArgs) {
    return this.text.replace("{formula}", this.calcFormula(cardArgs));
  }
  informChoices(args) {
    return this.choices.resolve(args);
  }
  setFormula(formula) {
    this.formula = formula;
    return this;
  }
  textualizeFormula() {
    let formula = this.formula;
    for (let prop in this.props) {
      formula = formula.replace(`{${prop}}`, this.props[prop]);
    }
    return formula;
  }
  calcFormula(cardArgs) {
    let formula = this.textualizeFormula();
    formula = formula.replace("{pow}", cardArgs.card.pow().toString());
    return (0, eval)(formula);
  }
  makeChoices(args) {
    let madeChoices = [];
    for (let choice of this.informChoices(args)) {
      let choiceResult = Bot.makeSpecificChoice(args, choice);
      let priority = 0;
      let restriction = choice.restriction ?? ((args2) => true);
      if (restriction(args) || madeChoices.indexOf(choiceResult[priority]) !== -1 && choice.distinct) {
        while (madeChoices.indexOf(choiceResult[priority]) !== -1 && priority < choiceResult.length - 1) {
          priority++;
        }
      }
      if (priority >= choiceResult.length) {
        madeChoices.push(null);
      }
      madeChoices.push(choiceResult[priority]);
    }
    return madeChoices;
  }
  exec(cardArgs) {
    this.callback(cardArgs, cardArgs.choices ?? this.makeChoices(cardArgs));
  }
  on(name, func) {
    this.addEvent(name, func);
    return this;
  }
  addEvent(name, func) {
    if (!this.events[name])
      this.events[name] = [];
    this.events[name].push(func);
  }
  removeEvent(name) {
    if (this.events[name]) {
      delete this.events[name];
    }
    return this;
  }
  getEvent(name) {
    return this.events[name];
  }
  hasFormula() {
    return this.text.indexOf("{formula}") !== -1;
  }
  getFormula() {
    return this.formula;
  }
  fireEvents(name, cardArgs) {
    if (this.events[name]) {
      for (let func of this.events[name]) {
        func(cardArgs);
      }
    }
    if (this.events[`temp_${name}`]) {
      for (let func of this.events[`temp_${name}`]) {
        func(cardArgs);
      }
      delete this.events[`temp_${name}`];
    }
  }
  getProps() {
    return this.props;
  }
  getProp(prop) {
    return this.props[prop];
  }
  setProp(prop, value) {
    this.props[prop] = value;
    return this;
  }
}

// logic/abilities/AbilityIncreasePower.ts
class AbilityIncreasePower extends BaseAbility {
  constructor(qty) {
    super(`Increase the power of a card in your hand by {formula}`, [
      { choice: Choices.CARD_IN_HAND, pointer: Pointer.CARD_IN_HAND_LEAST_POWER }
    ], (abilityArgs, madeChoices) => {
      if (abilityArgs.choices) {
        abilityArgs.choices[0].setPow(abilityArgs.choices[0].pow() + qty + abilityArgs.card.pow());
      }
    });
    this.sai({
      improvesCard: (c) => {
        return (c ? c.pow ? c.pow() : 1 : 1) + qty;
      }
    });
    this.setFormula(`{pow} + ${qty}`);
  }
}

// logic/abilities/AbilityDrawCard.ts
class AbilityDrawCard extends BaseAbility {
  constructor(qty) {
    super(`Draw {formula} cards`, [], (abilityArgs, madeChoices) => {
      abilityArgs.owner.draw(abilityArgs.deck, abilityArgs.card.pow() + qty);
    });
    this.sai({
      drawsCards: (cardArgs) => cardArgs.card.pow() + qty
    });
    this.setFormula(`{pow} + ${qty}`);
  }
}

// logic/abilities/AbilitySymDraw.ts
class AbilitySymDraw extends BaseAbility {
  constructor(qty) {
    super(`Each player draws {formula} cards`, [], (abilityArgs, madeChoices) => {
      abilityArgs.owner.draw(abilityArgs.deck, abilityArgs.card.pow() + qty);
      for (let opp of abilityArgs.opps) {
        opp.draw(abilityArgs.deck, abilityArgs.card.pow() + qty);
      }
    });
    this.sai({
      drawsCards: qty,
      drawsOpponentCards: qty
    });
    this.setFormula(`{pow} + ${qty}`);
  }
}

// logic/abilities/AbilityDiscardOppCard.ts
class AbilityDiscardOppCard extends BaseAbility {
  constructor(qty) {
    super(`Opponent discards {formula} cards at random`, [
      { choice: Choices.OPPONENT, pointer: Pointer.OPPONENT_MOST_CARDS }
    ], (abilityArgs, madeChoices) => {
      let opponent = madeChoices[0];
      for (let i = 0;i < abilityArgs.card.pow() + qty; i++) {
        if (opponent.inHand() === 0) {
          break;
        }
        opponent.discardRandom(abilityArgs);
      }
    });
    this.sai({
      affectsOpponents: (cardArgs) => cardArgs.card.pow() + qty / cardArgs.opps.length,
      discardsOpponentCards: (cardArgs) => cardArgs.card.pow() + qty
    });
    this.setFormula(`{pow} + ${qty}`);
  }
}

// logic/abilities/AbilityDiscardSelfCard.ts
class AbilityDiscardSelfCard extends BaseAbility {
  constructor(qty) {
    super(`Discard {formula} cards at random`, [], (abilityArgs, madeChoices) => {
      abilityArgs.owner.discardRandom(abilityArgs);
    });
    this.sai({
      affectsSelf: (cardArgs) => cardArgs.card.pow() + qty,
      discardsCards: (cardArgs) => cardArgs.card.pow() + qty
    });
    this.setFormula(`${qty} - {pow}`);
  }
}

// logic/abilities/AbilityDiscardHandDrawCards.ts
class AbilityDiscardHandDrawCards extends BaseAbility {
  qty;
  constructor(qty) {
    super(`Player discards hand, then draw {formula} cards`, [
      {
        choice: Choices.PLAYER,
        pointer: (cardArgs) => {
          if (cardArgs.owner.inHand() <= cardArgs.card.pow() + qty) {
            return cardArgs.owner;
          }
          for (let opp of cardArgs.opps) {
            if (opp.inHand() > cardArgs.card.pow() + qty) {
              return opp;
            }
          }
          return [cardArgs.owner, ...cardArgs.opps].sort((a, b) => a.inHand() - b.inHand())[0];
        }
      }
    ], (abilityArgs, madeChoices) => {
      let target = madeChoices.pop();
      target.cih().forEach((card) => {
        card.move(Zone.DISCARD, abilityArgs, {
          from: target
        });
      });
      target.draw(abilityArgs.deck, qty + abilityArgs.card.pow());
    });
    this.sai({
      discardsCards: 1,
      drawsCards: qty,
      discardsOpponentCards: 1,
      drawsOpponentCards: qty,
      affectsSelf: 1,
      affectsOpponents: 1
    });
    this.setFormula(`{pow} + ${qty}`);
  }
}

// logic/abilities/AbilityRemoveOtherCopiesFromGame.ts
class AbilityRemoveOtherCopiesFromGame extends BaseAbility {
  constructor() {
    super(`Remove all other copies of this card from the game`, [], (abilityArgs, madeChoices) => {
      let players = abilityArgs.opps.concat(abilityArgs.owner);
      let toRemove = [];
      for (let player of players) {
        toRemove.push(...player.cih().filter((c) => {
          if (!c || !abilityArgs.card) {
            return false;
          }
          return c.getName() === abilityArgs.card.getName();
        }));
      }
      toRemove.push(...abilityArgs.deck.discardPile.filter((c) => {
        if (!c || !abilityArgs.card) {
          return false;
        }
        return c.getName() === abilityArgs.card.getName();
      }));
      toRemove.push(...abilityArgs.deck.filter((c) => {
        if (!c || !abilityArgs.card) {
          return false;
        }
        return c.getName() === abilityArgs.card.getName();
      }));
      toRemove.forEach((c) => {
        c.remove();
      });
      abilityArgs.card.skipDiscard();
      abilityArgs.deck.shuffle();
    });
    this.sai({
      changesGame: 1
    });
  }
}

// logic/abilities/AbilityExplodeCard.ts
class AbilityExplodeCard extends BaseAbility {
  constructor() {
    super(`Explode a card in your hand. The new cards each have power {formula}.`, [
      {
        choice: Choices.CARD_IN_HAND,
        distinct: true,
        pointer: Pointer.CARD_IN_HAND_MOST_POWER,
        restriction: (card) => {
          return !card.card.getProp("fragment");
        }
      }
    ], (abilityArgs, madeChoices) => {
      let card = madeChoices[0];
      let new_cards = card.explode(abilityArgs);
      new_cards.forEach((card2) => {
        card2.move(Zone.HAND, abilityArgs);
      });
    });
    this.sai({
      drawsCards: (cardArgs) => {
        return this.calcFormula(cardArgs);
      },
      improvesCard: (cardArgs) => this.calcFormula(cardArgs)
    });
  }
}

// logic/abilities/AbilityAddResource.ts
class AbilityAddResource extends BaseAbility {
  constructor(qty, resource) {
    super(`Add {formula} ${resource}`, [], (abilityArgs) => {
      let amt = this.calcFormula(abilityArgs);
      let owned = abilityArgs.owner.getProp(`res_${resource}`) ?? 0;
      abilityArgs.owner.setProp(`res_${resource}`, owned + amt, abilityArgs);
    });
    this.setProp("resource", true);
    if (!this.getProp("produce"))
      this.setProp("produce", []);
    this.setProp("produce", [...this.getProp("produce"), resource]);
    this.setFormula(`{pow} + ${qty}`);
    this.sai({
      collectResource: qty
    });
  }
}

// logic/abilities/core/CostAbility.ts
class CostAbility extends BaseAbility {
  constructor(resource, amt) {
    super(`Pay {formula} ${resource}`, [], (abilityArgs, madeChoices) => {
      abilityArgs.owner.setProp("res_" + resource, abilityArgs.owner.getProp("res_" + resource) - Math.max(amt, 0), abilityArgs);
    });
    this.setProp("cost_ability", true);
    this.setCanPlay((cardArgs) => {
      if (!cardArgs.owner)
        return false;
      return cardArgs.owner.getProp("res_" + resource) >= amt;
    });
    this.setFormula(`${amt} - {pow}`);
    this.sai({
      spendResource: (c) => this.calcFormula(c)
    });
  }
}

// logic/abilities/AbilityAddDeck.ts
class AbilityAddDeck extends BaseAbility {
  constructor(deck_name, size = 75, unique = true, kill = false) {
    super(`Add the ${deck_name.replace("_", " ").replace(" deck", "")} deck to the game${unique ? " if it hasn't been already." : ""}`, [], (abilityArgs) => {
      if (DeckList_default[deck_name] && (!unique || !abilityArgs.deck.props[`added_${deck_name}`])) {
        abilityArgs.deck.addCards(Deck.fromCardList(size, DeckList_default[deck_name]));
        abilityArgs.deck.shuffle();
      }
    });
    if (unique && kill) {
      this.setCanPlay((abilityArgs) => {
        return !abilityArgs.deck.props[`added_${deck_name}`];
      });
    }
    this.sai({
      addCardsToDeck: size,
      changesGame: 1
    });
    this.setProp("deck", true);
  }
}

// logic/abilities/AbilityZombieRestriction.ts
class AbilityZombieRestriction extends BaseAbility {
  constructor() {
    super(`Play only if you have 0 or less res_life`, [], (abilityArgs) => {
    });
    this.setCanPlay((abilityArgs) => {
      return abilityArgs.owner.getProp("res_life") && abilityArgs.owner.getProp("res_life") <= 0;
    });
    this.sai({}, {
      pbp: ["res_life"]
    });
  }
}

// logic/abilities/core/OnDrawAbility.ts
class OnDrawAbility extends BaseAbility {
  constructor(ability) {
    super(`When this card is drawn, ${ability.getText()[0].toLowerCase() + ability.getText().substring(1)}`, ability.getChoices(), ability.getCallback);
    this.addEvent("draw", (cardArgs) => {
      this.exec(cardArgs);
    });
    this.removeEvent("play");
  }
}

// logic/abilities/AbilityAddEventToSelf.ts
class AbilityAddEventToSelf extends BaseAbility {
  constructor(events, callback) {
    super(`(event stuff)`, [], (abilityArgs, madeChoices) => {
      for (let event of events) {
        abilityArgs.owner.addEvent(event, callback);
      }
    });
    this.sai({
      affectsSelf: events.length,
      addEvents: events.length
    });
  }
}

// logic/abilities/AbilityWin.ts
class AbilityWin extends BaseAbility {
  constructor(reason) {
    super(`You win.`, [], (abilityArgs, madeChoices) => {
      abilityArgs.owner.setCanWin(true, reason);
    });
    this.sai({
      winProgress: 100
    });
  }
}

// logic/abilities/AbilitySetPropSelf.ts
class AbilitySetPropSelf extends BaseAbility {
  constructor(prop, val) {
    super(`(prop set)`, [], (abilityArgs, madeChoices) => {
      abilityArgs.owner.setProp(prop, val, abilityArgs);
    });
    this.sai({
      affectsSelf: 1
    });
  }
}

// logic/abilities/AbilityRecoverCards.ts
class AbilityRecoverCards extends BaseAbility {
  constructor(qty) {
    super(`Recover {formula} cards`, (abilityArgs) => {
      return new Array(qty).fill({ choice: Choices.CARD_IN_DISCARD, pointer: Pointer.CARD_IN_DISCARD_MOST_POWER, distinct: true });
    }, (abilityArgs, madeChoices) => {
      while (madeChoices.length > 0) {
        if (abilityArgs.deck.discardPile.length == 0) {
          break;
        }
        let choice = madeChoices.pop();
        choice.move(Zone.HAND, abilityArgs);
      }
    });
    this.setCanPlay((abilityArgs) => {
      if (!abilityArgs.deck) {
        return false;
      }
      return abilityArgs.deck.discardPile.length >= qty;
    });
    this.sai({
      drawsCards: qty
    });
    this.setFormula(`${qty}`);
  }
}

// logic/abilities/AbilityShuffleDiscardIntoDeck.ts
class AbilityShuffleDiscardIntoDeck extends BaseAbility {
  constructor() {
    super("Shuffle the discard pile into the deck", [], (abilityArgs, madeChoices) => {
      abilityArgs.deck.reshuffle();
    });
  }
}

// logic/abilities/core/PlayerRestrictionAbility.ts
class PlayerRestrictionAbility extends BaseAbility {
  constructor(requiredProp) {
    super(`Play only if you have ${requiredProp}`, [], (abilityArgs) => {
    });
    this.setCanPlay((abilityArgs) => {
      return abilityArgs.owner.getProp(requiredProp);
    });
    this.sai({}, {
      pgp: [requiredProp]
    });
  }
}

// logic/abilities/core/PlayerRestrictionAbilityNeg.ts
class PlayerRestrictionAbilityNeg extends BaseAbility {
  constructor(requiredProp) {
    super(`Play only if you don't have ${requiredProp}`, [], (abilityArgs) => {
    });
    this.sai({}, {
      pbp: [requiredProp]
    });
    this.setCanPlay((abilityArgs) => {
      return !abilityArgs.owner.getProp(requiredProp);
    });
  }
}

// logic/abilities/AbilityAddEventToAll.ts
class AbilityAddEventToAll extends BaseAbility {
  constructor(events, callback) {
    super(`(event stuff)`, [], (abilityArgs, madeChoices) => {
      for (let player of [abilityArgs.owner, ...abilityArgs.opps]) {
        for (let event of events) {
          player.addEvent(event, callback);
        }
      }
    });
    this.sai({
      addEvents: events.length,
      affectsSelf: events.length,
      affectsOpponents: (c) => c.opps.length * events.length
    });
  }
}

// logic/abilities/AbilitySetPropAll.ts
class AbilitySetPropAll extends BaseAbility {
  constructor(prop, val) {
    super(`(prop set)`, [], (abilityArgs, madeChoices) => {
      [abilityArgs.owner, ...abilityArgs.opps].forEach((player) => player.setProp(prop, val, abilityArgs));
    });
    this.sai({
      affectsSelf: 1,
      affectsOpponents: 1
    }, {
      pbp: [prop]
    });
  }
}

// logic/abilities/core/PlayerPredicateRestrictionAbility.ts
class PlayerPredicateRestrictionAbility extends BaseAbility {
  constructor(text, predicate) {
    super(`${text}`, [], (abilityArgs) => {
    });
    this.setCanPlay((abilityArgs) => {
      return predicate(abilityArgs);
    });
  }
}

// logic/abilities/core/TextAbility.ts
class TextAbility extends BaseAbility {
  constructor(text) {
    super(`${text}`, [], (abilityArgs) => {
    });
    this.sai({
      meme: 10
    });
  }
}

// logic/abilities/AbilityUnlockUpgrade.ts
class AbilityUnlockUpgrade extends BaseAbility {
  constructor(upgrade, restrict = true) {
    super(`Unlock ${upgrade.getName()} for purchase${restrict ? `. Play only if you haven't unlocked it yet.` : `.`}`, [], (abilityArgs) => {
      if (abilityArgs.owner.upgrades().filter((check) => check.getName() === upgrade.getName()).length == 0) {
        abilityArgs.owner.addUpgrade(upgrade);
      }
    });
    if (restrict) {
      this.setCanPlay((abilityArgs) => {
        return abilityArgs.owner.upgrades().filter((check) => check.getName() === upgrade.getName()).length == 0;
      });
    }
    this.sai({
      changesGame: 1,
      affectsSelf: 1,
      unlockUpgrades: (c) => {
        return c.owner.upgrades().filter((check) => check.getName() === upgrade.getName()).length == 0 ? 1 : 0;
      }
    });
  }
}

// logic/gameplay/player/systems/Upgrade.ts
class Upgrade {
  data;
  effect;
  infinite = false;
  scale = 1.1;
  level = 0;
  constructor(data, effect, infinite = false, scale = 1.1) {
    this.data = JSON.parse(JSON.stringify(data));
    this.effect = effect;
    this.infinite = infinite;
    this.scale = scale;
  }
  lvl() {
    return this.level;
  }
  getCost() {
    return this.data.cost;
  }
  getData(cardArgs) {
    return {
      name: this.getName(),
      description: this.getDescription(),
      cost: this.getCost(),
      locked: this.data.locked || !this.canPayCost(cardArgs)
    };
  }
  getName() {
    return `${this.data.name}${this.infinite && this.level > 0 ? ` Lvl. ${this.level}` : ``}`;
  }
  getDescription() {
    let text = this.data.description;
    text = text.replace(`{level}`, this.level + "");
    let matches = text.match(/{[^}]*}/g);
    if (matches) {
      for (let match of matches) {
        let code = match.substring(1, match.length - 1);
        text = text.replace(match, (0, eval)(code));
      }
    }
    return text;
  }
  canPayCost(cardArgs) {
    let available_resources = cardArgs.owner.getResources();
    for (let cost of this.data.cost) {
      if (cost.resource == "turns")
        continue;
      if (!available_resources[cost.resource])
        return false;
      if (available_resources[cost.resource] < cost.amt) {
        return false;
      }
    }
    return true;
  }
  payCost(cardArgs) {
    let available_resources = cardArgs.owner.getResources();
    for (let cost of this.data.cost) {
      if (cost.resource === "turns") {
        cardArgs.owner.addTurns(cost.amt);
        continue;
      } else {
        cardArgs.owner.setProp(`res_${cost.resource}`, available_resources[cost.resource] - cost.amt, cardArgs);
      }
    }
  }
  locked() {
    return this.data.locked;
  }
  unlock(cardArgs) {
    if (!this.data.locked) {
      this.payCost(cardArgs);
      this.effect(cardArgs, this);
      this.level++;
      if (!this.infinite) {
        this.data.locked = true;
      } else {
        for (let cost of this.data.cost) {
          cost.amt = Math.ceil(cost.amt * this.scale);
        }
      }
    }
  }
}

// logic/abilities/AbilityAddTurnsOpp.ts
class AbilityAddTurnsOpp extends BaseAbility {
  constructor(qty) {
    super(`Add {formula} turns to opponent.`, [
      { choice: Choices.OPPONENT, pointer: Pointer.OPPONENT_LEAST_TURNS_REMAINING }
    ], (abilityArgs, madeChoices) => {
      let opponent = madeChoices[0];
      opponent.addTurns(qty + abilityArgs.card?.pow());
    });
    this.setFormula(`{pow} + ${qty}`);
    this.sai({
      oppWinSetback: qty,
      affectsOpponents: (c) => qty / c.opps.length,
      winProgress: (c) => qty / c.opps.length / 2
    });
  }
}

// logic/abilities/AbilityAntivaxxer.ts
class AbilityAntivaxxer extends BaseAbility {
  constructor() {
    super(`You become innoculated with propaganda. You're an antivaxxer now.`, [], (a, m) => {
      a.owner.setProp("antivaxxer", true);
    });
    this.sai({
      meme: 100,
      changesGame: 1,
      affectsSelf: (c) => c.owner.getProp("antivaxxer") ? 0 : -10
    }, {
      pbp: ["antivaxxer", "zombie", "res_life"]
    });
  }
}

// logic/gameplay/deck/DeckList.ts
var DeckList2 = {
  radioactivity_deck: [
    new Card(`Nuclear Observation`, [
      new AbilityAddEventToSelf(["draw"], (abilityArgs) => {
        if (abilityArgs.card.getProp("radioactive")) {
          abilityArgs.owner.setProp("knowledge", (abilityArgs.owner.getProp("knowledge") ?? 0) + 5, abilityArgs);
          abilityArgs.owner.draw(abilityArgs.deck, 1);
        }
      }).setText("When you draw a radioactive card, gain {formula} knowledge and draw another card.").setFormula("{pow} + 5").sai({
        drawsCards: 1,
        affectsSelf: 1,
        collectResource: 1
      })
    ]).setRarity(Rarity.LEGENDARY),
    new Card(`Decay`, [
      new OnDrawAbility(new AbilityDiscardSelfCard(1)),
      new AbilityDiscardSelfCard(1)
    ]).setRarity(Rarity.BASIC).setProp("radioactive", true),
    new Card(`Fusion`, [
      new OnDrawAbility(new BaseAbility(`If you have other cards in your hand, combine {formula} of them at random`, [], (abilityArgs, madeChoices) => {
        let cards = abilityArgs.owner.cih();
        if (cards.length > 2) {
          let card1 = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
          let card2 = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
          let newCard = Card.combine(card1, card2);
          newCard.move(Zone.HAND, abilityArgs);
        }
      })),
      new AbilityDiscardSelfCard(1)
    ]).setRarity(Rarity.UNCOMMON).setProp("radioactive", true),
    new Card(`Fission`, [
      new OnDrawAbility(new AbilityAddEventToSelf(["temp_draw"], (abilityArgs) => {
        let card = abilityArgs.card;
        let new_cards = card.explode(abilityArgs).sort((a, b) => Math.random() - 0.5);
        new_cards.forEach((c, i) => {
          if (i == 0) {
            c.move(Zone.HAND, abilityArgs);
          } else {
            c.move(Zone.DISCARD, abilityArgs);
          }
        });
      }).setText("The next card you draw explodes. Keep one fragment at random, and discard the rest.")),
      new AbilityDiscardSelfCard(1)
    ]).setRarity(Rarity.RARE).setProp("radioactive", true)
  ],
  genetics_deck: [
    new Card(`Gene Bank`, [
      new CostAbility("metal", 20),
      new PlayerRestrictionAbility("genetics"),
      new PlayerRestrictionAbilityNeg("gene_bank"),
      new AbilitySetPropSelf("gene_bank", true).sai({
        unlockUpgrades: 1,
        winProgress: 1,
        changesGame: 1
      })
    ]).setRarity(Rarity.RARE).setProp("construction", true),
    new Card(`Analyze Card DNA`, [
      new PlayerRestrictionAbility("genetics"),
      new PlayerRestrictionAbility("gene_bank"),
      new AbilityAddResource(5, "knowledge"),
      new BaseAbility(`Analyze a card in the discard pile to add its DNA to the gene bank.`, [
        { choice: Choices.CARD_IN_DISCARD, pointer: Pointer.CARD_IN_DISCARD_RANDOM }
      ], (abilityArgs, madeChoices) => {
        if (!abilityArgs.owner.getProp("dna_research")) {
          abilityArgs.owner.setProp("dna_research", [], abilityArgs);
        }
        let card = madeChoices[0];
        for (let ability of card.getAbilities()) {
          abilityArgs.owner.getProp("dna_research").push(ability);
        }
        abilityArgs.deck.discardPile = abilityArgs.deck.discardPile.filter((c) => c !== card);
      }).sai({
        affectsSelf: 1,
        unlockUpgrades: 1,
        changesGame: 1
      })
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Spank Bank Variety`, [
      new PlayerPredicateRestrictionAbility(`if you have {formula} or more entries in your gene bank`, (abilityArgs) => {
        return (abilityArgs.owner.getProp("dna_research") ?? []).length >= 30 - abilityArgs.card.pow();
      }).setFormula(`30 - {pow}`),
      new BaseAbility(`If you have {formula} or more entries in your gene bank, you win the game on your next turn.`, [], (abilityArgs, madeChoices) => {
        abilityArgs.owner.setCanWin(true, "Genetic Superiority");
      }).setFormula(`30 - {pow}`)
    ]).setRarity(Rarity.LEGENDARY)
  ],
  explosives_deck: [
    new Card(`Grenade`, [
      new PlayerRestrictionAbility("explosives"),
      new BaseAbility("Explode a card at random in an opponents hand, then they discard half that many cards at random.", [
        { choice: Choices.OPPONENT, pointer: Pointer.OPPONENT_LEAST_CARDS }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        let card = opponent.cih()[Math.floor(Math.random() * opponent.cih().length)];
        if (card) {
          opponent.setCiH(opponent.cih().filter((c) => c !== card));
          let new_cards = card.explode({
            owner: opponent,
            opps: [...abilityArgs.opps, abilityArgs.owner].filter((p) => p !== opponent),
            deck: abilityArgs.deck,
            card
          });
          let toDiscard = Math.ceil(new_cards.length / 2);
          new_cards.forEach((c, i) => {
            c.move(Zone.HAND, abilityArgs, {
              to: opponent
            });
          });
          for (let i = 0;i < toDiscard; i++) {
            opponent.discardChoose(abilityArgs);
          }
        }
      }).sai({
        affectsOpponents: 2,
        oppWinSetback: 1,
        changesGame: 1
      })
    ]),
    new Card(`Dynamite`, [
      new PlayerRestrictionAbility("explosives"),
      new BaseAbility(`Explode all cards in the discard pile`, [], (abilityArgs, madeChoices) => {
        let cards = abilityArgs.deck.discardPile;
        abilityArgs.deck.discardPile = [];
        for (let card of cards) {
          let new_cards = card.explode(abilityArgs);
          new_cards.forEach((c, i) => {
            c.move(Zone.DISCARD, abilityArgs);
          });
        }
      }).sai({
        changesGame: 1,
        addCardsToDeck: 1
      }),
      new BaseAbility(`Destroy half the cards in the discard pile at random`, [], (abilityArgs, madeChoices) => {
        let cards = abilityArgs.deck.discardPile;
        abilityArgs.deck.discardPile = [];
        let toDiscard = Math.ceil(cards.length / 2);
        for (let i = 0;i < toDiscard; i++) {
          abilityArgs.deck.discardPile.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
        }
      }).sai({
        changesGame: 1
      }),
      new AbilityRecoverCards(1)
    ]).setRarity(Rarity.RARE),
    new Card(`Nuclear Bomb`, [
      new PlayerRestrictionAbility("explosives"),
      new BaseAbility(`Kill everyone. They discard their hands`, [], (abilityArgs, madeChoices) => {
        let players = [...abilityArgs.opps, abilityArgs.owner];
        for (let player of players) {
          player.setProp("res_life", 0, abilityArgs);
          abilityArgs.deck.discardPile.concat(player.cih());
          player.setCiH([]);
        }
      }).sai({
        oppWinSetback: 1,
        discardsOpponentCards: 1,
        discardsCards: 1
      }),
      new BaseAbility(`Kill everyone's citizens.`, [], (abilityArgs, madeChoices) => {
        let players = [...abilityArgs.opps, abilityArgs.owner];
        for (let player of players) {
          player.setProp("population", 0, abilityArgs);
        }
      }).sai({
        oppWinSetback: 1,
        affectsOpponents: 1,
        affectsSelf: 1
      }),
      new BaseAbility(`Explode all cards in the discard pile`, [], (abilityArgs, madeChoices) => {
        let cards = abilityArgs.deck.discardPile;
        abilityArgs.deck.discardPile = [];
        for (let card of cards) {
          let new_cards = card.explode(abilityArgs);
          new_cards.forEach((c, i) => {
            c.move(Zone.DISCARD, abilityArgs);
          });
        }
      }).sai({
        changesGame: 1,
        addCardsToDeck: 1
      }),
      new AbilityShuffleDiscardIntoDeck,
      new AbilityAddDeck("radioactivity_deck", 30, true)
    ]).setRarity(Rarity.HAXOR)
  ],
  academia_deck: [
    new Card(`The Scientific Process`, [
      new CostAbility("knowledge", 5),
      new AbilityUnlockUpgrade(new Upgrade({
        name: "Rapid Iteration",
        description: "When you draw a card, if you have more cards than your maximum hand size, randomly combine cards.",
        cost: [{
          amt: 25,
          resource: "knowledge"
        }]
      }, (cardArgs) => {
        cardArgs.owner.addEvent("draw", (cardArgs2) => {
          if (cardArgs2.owner.cih().length > cardArgs2.owner.getHandsize() && cardArgs2.owner.cih().length >= 2) {
            while (cardArgs2.owner.cih().length > cardArgs2.owner.getHandsize() && cardArgs2.owner.cih().length >= 2) {
              let randos = cardArgs2.owner.cih().sort(() => Math.random() - 0.5).slice(0, 2);
              let newCard = Card.combine(...randos);
              randos.forEach((c) => c.remove(cardArgs2));
              newCard.setProp(`hybrid`, true);
              newCard.move(Zone.HAND, cardArgs2);
            }
          }
        });
      }))
    ]).setRarity(Rarity.RARE),
    new Card(`Thought that Counts`, [
      new AbilityAddResource(1, "knowledge")
    ]).setRarity(Rarity.BASIC),
    new Card(`Receive Public Education`, [
      new AbilityAddResource(1, "knowledge"),
      new AbilityDrawCard(1),
      new AbilityDiscardSelfCard(1)
    ]).setRarity(Rarity.COMMON),
    new Card(`Homeschooling`, [
      new AbilityAddResource(5, "knowledge"),
      new AbilityAntivaxxer
    ]).setRarity(Rarity.RARE),
    new Card(`Go to University`, [
      new CostAbility("tadbucks", 10),
      new AbilityAddResource(5, "knowledge"),
      new AbilityDrawCard(1)
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Pseudo-Education`, [
      new AbilityAddResource(2, "knowledge"),
      new AbilityAntivaxxer,
      new AbilityAddDeck("alchemy_deck", 75, true).setText(`Invent alchemy and witchcraft. Add them to the game.`)
    ]),
    new Card(`Research: Explosives`, [
      new CostAbility("knowledge", 15),
      new AbilitySetPropSelf("explosives", true).setCanPlay((cardArgs) => {
        return !cardArgs.owner.getProp("explosives");
      }).setText("Discover explosives if you haven't already."),
      new AbilityAddDeck("explosives_deck", 35, true).setText(`Invent explosives. Add them to the game.`)
    ]).setProp("research", true),
    new Card("Research: Genetics", [
      new CostAbility("knowledge", 20),
      new AbilitySetPropSelf("genetics", true).setCanPlay((cardArgs) => {
        return !cardArgs.owner.getProp("genetics");
      }).setText("Discover genetics if you haven't already."),
      new AbilityAddDeck("genetics_deck", 35, true).setText(`Invent genetics. You learn cards are sentient. Add it to the game.`)
    ])
  ],
  basic_resource_deck: [
    new Card(`Wood Shipment`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: `Wood Shipment`,
        description: `Order {Math.floor(10 * Math.pow(1.15, {level} + 1)} wood from the Amazon`,
        cost: [{
          amt: 20,
          resource: "tadbucks"
        }],
        locked: false
      }, (c, u) => {
        c.owner.addResource("wood", Math.floor(10 * Math.pow(1.15, u.lvl())));
      }, true, 1.25))
    ]),
    new Card(`Food Shipment`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: `Wood Shipment`,
        description: `Order {Math.floor(10 * Math.pow(1.15, {level} + 1)} food from the Amazon`,
        cost: [{
          amt: 20,
          resource: "tadbucks"
        }],
        locked: false
      }, (c, u) => {
        c.owner.addResource("food", Math.floor(10 * Math.pow(1.15, u.lvl())));
      }, true, 1.25))
    ]),
    new Card(`Metal Shipment`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: `Wood Shipment`,
        description: `Order {Math.floor(10 * Math.pow(1.15, {level} + 1)} metal from the Amazon`,
        cost: [{
          amt: 20,
          resource: "tadbucks"
        }],
        locked: false
      }, (c, u) => {
        c.owner.addResource("metal", Math.floor(10 * Math.pow(1.15, u.lvl())));
      }, true, 1.25))
    ]),
    new Card(`Stone Shipment`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: `Wood Shipment`,
        description: `Order {Math.floor(10 * Math.pow(1.15, {level} + 1)} stone from the Amazon`,
        cost: [{
          amt: 20,
          resource: "tadbucks"
        }],
        locked: false
      }, (c, u) => {
        c.owner.addResource("stone", Math.floor(10 * Math.pow(1.15, u.lvl())));
      }, true, 1.25))
    ]),
    new Card(`Gather Wood`, [
      new AbilityAddResource(0, "wood")
    ]).setRarity(Rarity.BASIC).setProp("resource", true),
    new Card(`Gather Stone`, [
      new AbilityAddResource(0, "stone")
    ]).setRarity(Rarity.BASIC).setProp("resource", true),
    new Card(`Gather Metal`, [
      new AbilityAddResource(0, "metal")
    ]).setRarity(Rarity.BASIC).setProp("resource", true),
    new Card(`Gather Food`, [
      new AbilityAddResource(0, "food")
    ]).setRarity(Rarity.BASIC).setProp("resource", true),
    new Card(`Collect Taxes`, [
      new BaseAbility(`Gain {formula} Tadbucks for each citizen you have.`, [], (abilityArgs, madeChoices) => {
        abilityArgs.owner.setProp("tadbucks", (abilityArgs.owner.getProp("tadbucks") ?? 0) + abilityArgs.owner.getProp("population") * (abilityArgs.card.pow() * 10), abilityArgs);
      }).setFormula("{pow} * 10")
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Construct Cottage`, [
      new CostAbility("wood", 5),
      new CostAbility("food", 5),
      new BaseAbility(`Build a cottage. (Adds {formula} housing)`, [], (abilityArgs, madeChoices) => {
        abilityArgs.owner.setProp("housing", abilityArgs.card.pow() + (abilityArgs.owner.getProp("housing") ?? 0), abilityArgs);
      }),
      new AbilityAddEventToSelf(["turn_start"], (abilityArgs) => {
        if (abilityArgs.owner.getProp("housing") > abilityArgs.owner.getProp("population")) {
          abilityArgs.owner.setProp("population", (abilityArgs.owner.getProp("population") ?? 0) + 1, abilityArgs);
        }
      }).setText("At the start of your turn, if you have housing, people move in.")
    ]).setRarity(Rarity.COMMON).setProp("construction", true),
    new Card(`Marketplace Construction`, [
      new PlayerRestrictionAbilityNeg("marketplace"),
      new CostAbility("wood", 5),
      new CostAbility("stone", 5),
      new AbilitySetPropSelf("marketplace", true).setText("Unlocks the marketplace"),
      new BaseAbility(`Get a stimmy check of {formula} tadbucks`, [], (abilityArgs, madeChoices) => {
        abilityArgs.owner.setProp("tadbucks", (abilityArgs.owner.getProp("tadbucks") ?? 0) + abilityArgs.card.pow() * 10, abilityArgs);
      }).setFormula(`100 + (10 * {pow})`)
    ]).setRarity(Rarity.MYTHIC).setProp("construction", true),
    new Card(`Research: Improved Agricultural Practices`, [
      new CostAbility("knowledge", 8),
      new BaseAbility(`Increase the power of all cards that produce food by {formula}`, [], (abilityArgs, madeChoices) => {
        let players = [...abilityArgs.opps, abilityArgs.owner];
        for (let player of players) {
          for (let card of player.cih()) {
            if (card.getProp("produce") && card.getProp("produce").includes("food")) {
              card.setPow(card.pow() + abilityArgs.card.pow());
            }
          }
        }
        for (let card of abilityArgs.deck.discardPile) {
          if (card.getProp("produce") && card.getProp("produce").includes("food")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
        for (let card of abilityArgs.deck.asArray()) {
          if (card.getProp("produce") && card.getProp("produce").includes("food")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
      })
    ]).setRarity(Rarity.RARE).setProp("research", true),
    new Card(`Research: Improved Logging Practices`, [
      new CostAbility("knowledge", 8),
      new BaseAbility(`Increase the power of all cards that produce wood by {formula}`, [], (abilityArgs, madeChoices) => {
        let players = [...abilityArgs.opps, abilityArgs.owner];
        for (let player of players) {
          for (let card of player.cih()) {
            if (card.getProp("produce") && card.getProp("produce").includes("wood")) {
              card.setPow(card.pow() + abilityArgs.card.pow());
            }
          }
        }
        for (let card of abilityArgs.deck.discardPile) {
          if (card.getProp("produce") && card.getProp("produce").includes("wood")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
        for (let card of abilityArgs.deck.asArray()) {
          if (card.getProp("produce") && card.getProp("produce").includes("wood")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
      })
    ]).setRarity(Rarity.RARE).setProp("research", true),
    new Card(`Research: Improved Quarrying Practices`, [
      new CostAbility("knowledge", 8),
      new BaseAbility(`Increase the power of all cards that produce stone by {formula}`, [], (abilityArgs, madeChoices) => {
        let players = [...abilityArgs.opps, abilityArgs.owner];
        for (let player of players) {
          for (let card of player.cih()) {
            if (card.getProp("produce") && card.getProp("produce").includes("stone")) {
              card.setPow(card.pow() + abilityArgs.card.pow());
            }
          }
        }
        for (let card of abilityArgs.deck.discardPile) {
          if (card.getProp("produce") && card.getProp("produce").includes("stone")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
        for (let card of abilityArgs.deck.asArray()) {
          if (card.getProp("produce") && card.getProp("produce").includes("stone")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
      })
    ]).setRarity(Rarity.RARE).setProp("research", true),
    new Card(`Research: Improved Mining Practices`, [
      new CostAbility("knowledge", 8),
      new BaseAbility(`Increase the power of all cards that produce metal by {formula}`, [], (abilityArgs, madeChoices) => {
        let players = [...abilityArgs.opps, abilityArgs.owner];
        for (let player of players) {
          for (let card of player.cih()) {
            if (card.getProp("produce") && card.getProp("produce").includes("metal")) {
              card.setPow(card.pow() + abilityArgs.card.pow());
            }
          }
        }
        for (let card of abilityArgs.deck.discardPile) {
          if (card.getProp("produce") && card.getProp("produce").includes("metal")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
        for (let card of abilityArgs.deck.asArray()) {
          if (card.getProp("produce") && card.getProp("produce").includes("metal")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
      })
    ]).setRarity(Rarity.RARE).setProp("research", true)
  ],
  zombie_deck: [
    new Card(`Chomp`, [
      new AbilityZombieRestriction,
      new BaseAbility(`Deal {formula} damage to an opponent. They discard that many cards.`, [
        { pointer: Pointer.OPPONENT_MOST_CARDS, choice: Choices.OPPONENT }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        let dmg = abilityArgs.card.pow() * 5;
        if (abilityArgs.owner.getProp("res_life") <= 0) {
          opponent.setProp("res_life", opponent.getProp("res_life") - dmg, abilityArgs);
          for (let i = 0;i < dmg; i++) {
            opponent.discardChoose(abilityArgs);
          }
        }
      }).setFormula(`{pow} * 5`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Brain Munchies`, [
      new AbilityZombieRestriction,
      new BaseAbility(`Draw {formula} cards.`, [], (abilityArgs, madeChoices) => {
        if (abilityArgs.owner.getProp("res_life") <= 0) {
          abilityArgs.owner.draw(abilityArgs.deck, abilityArgs.card.pow());
        }
      }).setFormula(`{pow} + 2`)
    ]).setRarity(Rarity.COMMON),
    new Card(`X-49 Antigen`, [
      new BaseAbility(`Play only if you aren't an antivaxxer.`, [], (cardArgs, madeChoices) => {
      }).setCanPlay((cardArgs) => {
        return !cardArgs.owner.getProp("antivaxxer");
      }),
      new BaseAbility(`Heal all zombies. They give you their hands out of gratitude.`, [], (abilityArgs, madeChoices) => {
        if (!abilityArgs.owner.getProp("antivaxxer")) {
          for (let player of abilityArgs.opps) {
            player.setProp("res_life", 10, abilityArgs);
            abilityArgs.owner.setCiH(abilityArgs.owner.cih().concat(player.cih()));
            player.setCiH([]);
          }
        }
      })
    ]).setCanPlay((cardArgs) => {
      return !cardArgs.owner.getProp("antivaxxer");
    }).setRarity(Rarity.RARE),
    new Card(`Necromutation`, [
      new AbilityZombieRestriction,
      new AbilityExplodeCard,
      new AbilityIncreasePower(2)
    ]).setRarity(Rarity.RARE),
    new Card(`Rot Brains`, [
      new AbilityZombieRestriction,
      new BaseAbility(`Zombify half the cards in an opponents hand. (They can't play them unless they are a zombie)`, [
        { choice: Choices.OPPONENT, pointer: Pointer.OPPONENT_MOST_CARDS }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        let cards = opponent.cih();
        let half = Math.ceil(cards.length / 2);
        let ordered = cards.map((card, index) => card.clone()).sort(() => Math.random() - 0.5);
        for (let i = 0;i < half; i++) {
          ordered[i] = new Card(`Zombified ${ordered[i].getName()}`, [
            new AbilityZombieRestriction,
            ...ordered[i].getAbilities()
          ]).setPow(ordered[i].pow()).setRarity(ordered[i].getRarity()).setProps({ zombie: true, ...ordered[i].getProps() }).setZone(Zone.HAND);
        }
        opponent.setCiH(ordered);
      })
    ])
  ],
  alchemy_deck: [
    new Card(`Harvest Snowthistle`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: "Forage Snowthistle",
        description: "Forage snowthistle.",
        cost: [{
          amt: 1,
          resource: "turns"
        }],
        locked: false
      }, (c) => {
        c.owner.addResource("snowroot", 1);
      }, true, 1.1), false)
    ]).setRarity(Rarity.BASIC)
  ],
  gambling_deck: [
    new Card(`Lady Fortune's Favor`, [
      new PlayerRestrictionAbility("dice"),
      new CostAbility("tadbucks", 20),
      new AbilityDiscardSelfCard(1),
      new BaseAbility("Roll your dice. If you get a {formula} or more, you win the game.", [], (cardArgs, madeChoices) => {
        let result = cardArgs.owner.rollDice();
        if (result >= 100 - cardArgs.card.pow()) {
          cardArgs.owner.setCanWin(true, "had Lady Fortune's favor");
        }
      }).setFormula(`100 - {pow}`)
    ]).setRarity(Rarity.MYTHIC),
    new Card(`Street Modding`, [
      new PlayerRestrictionAbility("dice"),
      new CostAbility("tadbucks", 15),
      new BaseAbility("Add {formula} pips at random to your dice.", [], (cardArgs, madeChoices) => {
        let pips = 3 + cardArgs.card.pow();
        let dice = [...cardArgs.owner.getProp("dice") ?? [-1]];
        for (let i = 0;i < pips; i++) {
          dice[Math.floor(Math.random() * dice.length)]++;
        }
        cardArgs.owner.setProp("dice", dice, cardArgs);
      }).setFormula(`3 + {pow}`)
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Government Grade Fortunator`, [
      new PlayerRestrictionAbility("dice"),
      new CostAbility("tadbucks", 100),
      new BaseAbility("Add {formula} pips at random to your dice.", [], (cardArgs, madeChoices) => {
        let pips = 10 + cardArgs.card.pow();
        let dice = [...cardArgs.owner.getProp("dice") ?? [-1]];
        for (let i = 0;i < pips; i++) {
          dice[Math.floor(Math.random() * dice.length)]++;
        }
        cardArgs.owner.setProp("dice", dice, cardArgs);
      }).setFormula(`10 + {pow}`)
    ]).setRarity(Rarity.RARE),
    new Card(`Dimensionality Tear`, [
      new PlayerRestrictionAbility("explosives"),
      new PlayerRestrictionAbility("dice"),
      new CostAbility("tadbucks", 20),
      new CostAbility("knowledge", 10),
      new BaseAbility("Add 2 sides to your dice, each with pips equal to the total of the rest of the sides of the dice.", [], (cardArgs, madeChoices) => {
        let total = cardArgs.owner.getProp("dice").reduce((a, b) => a + b, 0);
        cardArgs.owner.setProp("dice", cardArgs.owner.getProp("dice").concat([total, total]), cardArgs);
      })
    ]).setRarity(Rarity.MYTHIC),
    new Card(`Gambling Insurance`, [
      new PlayerRestrictionAbility("casino"),
      new CostAbility("tadbucks", 50),
      new AbilityAddEventToSelf(["gamble_lose"], (abilityArgs) => {
        abilityArgs.owner.setProp("tadbucks", (abilityArgs.owner.getProp("tadbucks") ?? 0) + abilityArgs.card.pow() * 10, abilityArgs);
      }).setText("Whenever you lose at gambling, you gain {formula} Tadbucks.").setFormula(`{pow} * 10`)
    ]).setRarity(Rarity.LEGENDARY)
  ],
  currency_deck: [
    new Card(`Telemarketing`, [
      new CostAbility("tadbucks", 50),
      new AbilityUnlockUpgrade(new Upgrade({
        name: "Telemarketing",
        description: "Outsource cold-calling all your opponents, wasting their time.",
        cost: [{
          amt: 15,
          resource: "tadbucks"
        }]
      }, (c) => {
        c.opps.forEach((opponent) => {
          opponent.addTurns(2);
        });
      }, true, 1.35)).setText("Unlocks telemarketing as a way to waste your opponents time.")
    ]).setRarity(Rarity.RARE),
    new Card(`Welfare Handouts`, [
      new BaseAbility(`Cards in your hand lose all costs`, [], (abilityArgs, madeChoices) => {
        let cards = abilityArgs.owner.cih();
        for (let i = 0;i < cards.length; i++) {
          cards[i] = new Card(cards[i].getName(), [
            ...cards[i].getAbilities().map((ability) => {
              return ability.clone();
            }).filter((ability) => {
              return !ability.isCostAbility();
            })
          ]).setPow(cards[i].pow()).setRarity(cards[i].getRarity()).setProps(cards[i].getProps());
        }
      })
    ]).setRarity(Rarity.LEGENDARY),
    new Card(`Moneybags \$\$\$`, [
      new CostAbility(`tadbucks`, 2000),
      new AbilityWin("achieving wealth")
    ]).setRarity(Rarity.LEGENDARY),
    new Card(`Communism`, [
      new BaseAbility(`Collect all cards from all hands, shuffle them together, then distribute them evenly to all players`, [], (abilityArgs, madeChoices) => {
        let allCards = [];
        for (let player of [abilityArgs.owner, ...abilityArgs.opps]) {
          while (player.inHand() > 0) {
            allCards.push(player.cih().pop());
          }
        }
        allCards = allCards.sort(() => Math.random() - 0.5);
        let ctr = 0;
        while (allCards.length > 0) {
          [abilityArgs.owner, ...abilityArgs.opps][ctr % [abilityArgs.owner, ...abilityArgs.opps].length].cih().push(allCards.pop());
          ctr++;
        }
      })
    ]).setRarity(Rarity.MYTHIC),
    new Card(`The House Always Wins`, [
      new CostAbility("tadbucks", 25),
      new PlayerRestrictionAbilityNeg("casino"),
      new AbilitySetPropSelf("casino", true).setText("Unlocks membership to the casino."),
      new AbilitySetPropSelf("dice", [1, 2, 3, 4, 5, 6]).setText("Unlocks a basic 6-sided dice"),
      new AbilityAddDeck("gambling_deck", 50, true).setText(`Invent gambling. Add it to the game.`)
    ]).setRarity(Rarity.MYTHIC),
    new Card(`Payday`, [
      new BaseAbility(`Get paid. Earn {formula} Tadbucks.`, [], (abilityArgs) => {
        abilityArgs.owner.setProp("res_tadbucks", (abilityArgs.owner.getProp("res_tadbucks") ?? 0) + 15 * abilityArgs.card.pow(), abilityArgs);
      }).setFormula(`15 * {pow}`)
    ]).setRarity(Rarity.BASIC),
    new Card(`Bonus Check`, [
      new BaseAbility(`Get paid. Earn {formula} Tadbucks.`, [], (abilityArgs) => {
        abilityArgs.owner.setProp("res_tadbucks", (abilityArgs.owner.getProp("res_tadbucks") ?? 0) + 25 * abilityArgs.card.pow(), abilityArgs);
      }).setFormula(`25 * {pow}`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Corporate Sabotage`, [
      new CostAbility("tadbucks", 20),
      new AbilityDiscardOppCard(3)
    ]).setRarity(Rarity.RARE),
    new Card(`Inflationary Hedging`, [
      new CostAbility("tadbucks", 35),
      new BaseAbility(`Increase the power of all cards in your hand and the deck that mention Tadbucks by {formula}`, [], (abilityArgs, madeChoices) => {
        for (let card of abilityArgs.owner.cih()) {
          if (!card) {
            continue;
          }
          if (card === abilityArgs.card)
            continue;
          if (card.getText().toLowerCase().includes("tadbuck") || card.getName().toLowerCase().includes("tadbuck")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
        for (let card of abilityArgs.deck.asArray()) {
          if (!card) {
            continue;
          }
          if (card.getText().toLowerCase().includes("tadbuck") || card.getName().toLowerCase().includes("tadbuck")) {
            card.setPow(card.pow() + abilityArgs.card.pow());
          }
        }
      })
    ]).setRarity(Rarity.RARE),
    new Card(`Marketplace Economics`, [
      new CostAbility("tadbucks", 50),
      new AbilityAddDeck("basic_resource_deck", 75, false).setText(`Invent market economics. Add basic resources to the game.`)
    ])
  ],
  life_deck: [
    new Card(`Job Interview`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: "Get a Job",
        description: "Search for a job in Alaska.",
        cost: [{
          amt: 3,
          resource: "turns"
        }],
        locked: false
      }, (cardArgs) => {
        let p = cardArgs.owner;
        p.addUpgrade(new Upgrade({
          name: "Work",
          description: "Work for 65 Tadbucks.",
          cost: [{
            amt: 1,
            resource: "turns"
          }]
        }, (cardArgs2) => {
          cardArgs2.owner.addResource("tadbucks", 65);
        }, true, 1.5));
      }))
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Phlebotomy`, [
      new AbilityUnlockUpgrade(new Upgrade({
        name: "Blood Drawing",
        description: "Take some time to do research on your blood. You get paid for it!",
        cost: [{
          amt: 1,
          resource: "turns"
        }, {
          amt: 3,
          resource: "life"
        }]
      }, (cardArgs) => {
        cardArgs.owner.addResource("tadbucks", 5);
        cardArgs.owner.addResource("knowledge", 5);
      }, true, 1.2))
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Crusader Kings III Level of Immortality`, [
      new CostAbility("life", 2500),
      new AbilityWin("achieving immortality")
    ]).setRarity(Rarity.MYTHIC),
    new Card(`Going to the Gym`, [
      new BaseAbility(`Gain {formula} life`, [], (abilityArgs, madeChoices) => {
        abilityArgs.owner.setProp("res_life", abilityArgs.owner.getProp("res_life") + 5 * abilityArgs.card.pow(), abilityArgs);
      }).setFormula(`5 * {pow}`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Assassinate`, [
      new BaseAbility(`Kill an opponent. They discard their hand.`, [
        { pointer: Pointer.OPPONENT_MOST_CARDS, choice: Choices.OPPONENT }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        opponent.setProp("res_life", 0, abilityArgs);
        while (opponent.inHand() > 0) {
          opponent.discard(opponent.cih()[0], abilityArgs.deck);
        }
      })
    ]).setRarity(Rarity.HAXOR),
    new Card(`Soul Cancer`, [
      new BaseAbility(`Whenever you play a card, lose {formula} life`, [], (abilityArgs, madeChoices) => {
        abilityArgs.owner.addEvent("play", (abilityArgs2) => {
          if (!abilityArgs2.owner.getProp("res_life")) {
            abilityArgs2.owner.setProp("res_life", abilityArgs2.card.pow(), abilityArgs2);
          }
          abilityArgs2.owner.setProp("res_life", abilityArgs2.owner.getProp("res_life") - abilityArgs2.card.pow(), abilityArgs2);
        });
      })
    ]).setRarity(Rarity.RARE),
    new Card(`2024 Presidential Debate`, [
      new AbilityAntivaxxer,
      new AbilityDrawCard(1)
    ]).setRarity(Rarity.UNCOMMON)
  ],
  point_deck: [
    new Card("Point of Pity", [
      new BaseAbility("If you have -{formula} or fewer points, you win the game on your next turn", [], (a, m) => {
        if (a.owner.getProp("points") <= -(100 - a.card.pow())) {
          a.owner.setCanWin(true, "had a point of pity");
        }
      }).setFormula(`100 - {pow}`)
    ]).setRarity(Rarity.RARE),
    new Card("Pointlessify", [
      new BaseAbility("Reduce all point values in an opponents hand to -1. Gain points equal to the difference.", [
        {
          pointer: Pointer.OPPONENT_MOST_CARDS,
          choice: Choices.OPPONENT
        }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        let points = 0;
        for (let card of opponent.cih()) {
          if (card.getProp("point_value")) {
            if (card.getProp("point_value") > -1)
              points += card.getProp("point_value") + 1;
            card.setProp("point_value", -1);
          }
        }
        abilityArgs.owner.setProp("points", (abilityArgs.owner.getProp("points") ?? 0) + points, abilityArgs);
      })
    ]).setRarity(Rarity.RARE),
    new Card("Pontificate", [
      new BaseAbility("Gain {formula} points.", [], (a, m) => {
        a.owner.setProp("points", a.owner.getProp("points") + a.card.pow(), a);
      }),
      new BaseAbility("Randomly add points to all cards in the deck", [], (a2, m) => {
        for (let c of a2.deck) {
          if (c.getProp("point_value")) {
            c.setProp("point_value", c.getProp("point_value") + Math.floor(Math.random() * c.pow()));
          } else {
            c.setProp("point_value", [-c.pow(), 0, 0, 1, 1, c.pow()].sort((a, b) => Math.random() - 0.5)[0]);
          }
        }
      })
    ]).setRarity(Rarity.BASIC)
  ],
  faith_deck: [
    new Card(`Thoughts and Prayers`, [
      new AbilityAddResource(1, "faith"),
      new AbilityDrawCard(1),
      new BaseAbility("Slow your roll. You pray instead of getting closer to winning", [], (a, m) => a.owner.addTurns(1))
    ]).setRarity(Rarity.BASIC)
  ],
  romance: [],
  poop_deck: [
    new Card(`Pile o' Crap`, [
      new TextAbility(`\uD83D\uDCA9`)
    ]).setRarity(Rarity.BASIC).setProp("crap", true)
  ],
  basic: [
    new Card(`Just Do Better`, [
      new AbilityAddDeck("romance", 75, true).setText(`Invent romance. Add it to the game.`),
      new AbilityAddResource(5, "love"),
      new AbilityRemoveOtherCopiesFromGame
    ]).setRarity(Rarity.RARE),
    new Card(`You Could Make a Religion Outta This`, [
      new AbilityAddDeck(`faith_deck`, 75, true).setText("Invent religion."),
      new AbilityAddResource(1, "faith"),
      new AbilityRemoveOtherCopiesFromGame
    ]).setRarity(Rarity.RARE),
    new Card(`What's the Point?`, [
      new AbilityAddDeck("point_deck", 75, true).setText(`Invent points. Add points to the game.`),
      new AbilitySetPropAll("points_to_win", 100).setText("First player to 100 points wins on their next turn!"),
      new AbilityAddEventToAll(["play"], (abilityArgs) => {
        if (abilityArgs.card.getProp("point_value")) {
          let points = abilityArgs.card.getProp("point_value") ?? 0;
          points *= 0.75 + abilityArgs.card.pow() * 0.25;
          abilityArgs.owner.setProp("points", (abilityArgs.owner.getProp("points") ?? 0) + points, abilityArgs);
        }
      }).setText("Whenever someone plays a card, they get however many points that card is worth."),
      new AbilityAddEventToAll(["points_change"], (abilityArgs) => {
        if (abilityArgs.owner.getProp("points") >= abilityArgs.owner.getProp("points_to_win")) {
          abilityArgs.owner.setCanWin(true, "saw the point");
        }
      }).setText("Every time someone's score changes, check if they can win."),
      new BaseAbility("For each card in the deck, assign a random point value!", [], (abilityArgs, madeChoices) => {
        let points = [-7, -5, -3, -2, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 5, 10];
        for (let card of abilityArgs.deck.asArray()) {
          card.setProp("point_value", points[Math.floor(Math.random() * points.length)]);
        }
      }),
      new AbilityRemoveOtherCopiesFromGame
    ]).setRarity(Rarity.LEGENDARY),
    new Card(`Agonize over a Decision`, [
      new AbilityDrawCard(3),
      new AbilityDiscardSelfCard(3)
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Skip Bitch`, [
      new BaseAbility(`Skip an opponents turn`, [
        { pointer: Pointer.OPPONENT_MOST_CARDS, choice: Choices.OPPONENT }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        opponent.skip();
      })
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Megaskip Bitch`, [
      new BaseAbility(`Skip an opponents next {formula} turns`, [
        { pointer: Pointer.OPPONENT_MOST_CARDS, choice: Choices.OPPONENT }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        opponent.skip();
        opponent.skip();
      }).setFormula(`1 + {pow}`)
    ]).setRarity(Rarity.HAXOR),
    new Card(`Housing Economy Crash`, [
      new BaseAbility(`Each player discards all cards above common rarity`, [], (abilityArgs, madeChoices) => {
        let players = [abilityArgs.owner, ...abilityArgs.opps];
        for (let player of players) {
          let hand = player.cih().filter((card) => {
            if (!card) {
              return false;
            }
            return card.getRarity() > Rarity.COMMON;
          });
          for (let card of hand) {
            player.discard(card, abilityArgs.deck);
          }
        }
      })
    ]).setRarity(Rarity.RARE),
    new Card(`Tactical Cuckage`, [
      new AbilityDiscardOppCard(2),
      new AbilityDiscardSelfCard(3),
      new BaseAbility(`Make an opponent skip a turn`, [
        { pointer: Pointer.OPPONENT_MOST_CARDS, choice: Choices.OPPONENT }
      ], (abilityArgs, madeChoices) => {
        let opponent = madeChoices[0];
        opponent.skip();
      }),
      new AbilityDrawCard(1)
    ]).setRarity(Rarity.MYTHIC),
    new Card(`\u26A1\u26A1 Supercharge \u26A1\u26A1`, [
      new AbilityIncreasePower(0)
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Gifts of Giving`, [
      new AbilityDrawCard(1),
      new AbilitySymDraw(1)
    ]).setRarity(Rarity.COMMON),
    new Card(`Minor Cucking`, [
      new AbilityDiscardOppCard(1)
    ]).setRarity(Rarity.COMMON),
    new Card(`Gifted Sabotage`, [
      new AbilityDiscardSelfCard(2)
    ]).setRarity(Rarity.COMMON),
    new Card(`Basic Bitchery`, [
      new AbilityDrawCard(1)
    ]).setRarity(Rarity.BASIC),
    new Card(`Change of Perspective`, [
      new AbilityDiscardHandDrawCards(2)
    ]).setRarity(Rarity.RARE),
    new Card(`Speedbump`, [
      new BaseAbility(`Increase everyone else's cards to play by {formula}`, [], (a, m) => {
        a.opps.forEach((p) => {
          p.addTurns(a.card.pow());
        });
      })
    ]).setRarity(Rarity.BASIC),
    new Card(`Encrust in Gold`, [
      new BaseAbility(`Increase a card in your hands rarity. It gains {formula} power`, [
        { choice: Choices.CARD_IN_HAND, pointer: Pointer.CARD_IN_HAND_LEAST_POWER }
      ], (a, c) => {
        let card = c[0];
        card.setRarity(card.getRarity() + 1);
        card.setPow(card.pow() + a.card.pow() + 2);
        card.setName(`Golden ${card.getName()} \uD83D\uDCB0\uD83D\uDCB0`);
      }).setFormula(`{pow} + 2`)
    ]).setRarity(Rarity.RARE),
    new Card(`Scrap Buyback`, [
      new AbilityRecoverCards(1).setFormula(`{pow}`)
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Rough Breakup`, [
      new AbilityExplodeCard,
      new BaseAbility(`Reduce the power of cards in your hand by {formula}`, [], (a, c) => {
        a.owner.cih().forEach((card) => {
          card.setPow(card.pow() - a.card.pow());
        });
      }).setFormula(`{pow}`)
    ]),
    new Card(`Mutual Cuckage`, [
      new BaseAbility(`Increase everyone's cards to play to win by {formula}`, [], (a, m) => {
        [a.owner, ...a.opps].forEach((p) => {
          p.addTurns(10 + a.card.pow());
        });
      }).setFormula(`10 + {pow}`)
    ]).setRarity(Rarity.RARE),
    new Card(`Even the Playing Field`, [
      new PlayerPredicateRestrictionAbility(`Play only if you aren't the first player`, (cardArgs) => {
        return cardArgs.owner.getTurnPlacement() > 0;
      }),
      new BaseAbility(`Decrease your cards to play to win by {formula}`, [], (a, m) => {
        a.owner.addTurns(-(3 + a.card.pow()));
      }).setFormula(`3 + {pow}`)
    ]).setRarity(Rarity.UNCOMMON),
    new Card(`Denial`, [
      new BaseAbility(`Increase an opponent's cards to play to win by {formula}`, [
        { choice: Choices.OPPONENT, pointer: Pointer.OPPONENT_LEAST_TURNS_REMAINING }
      ], (a, m) => {
        let opp = m[0];
        opp.addTurns(a.card.pow() * 2);
      }).setFormula(`{pow} * 2`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Get a Life`, [
      new AbilityAddResource(10, "life"),
      new AbilityAddDeck("life_deck", 50, true)
    ]).setRarity(Rarity.RARE),
    new Card(`Proletariat Revolution`, [
      new PlayerPredicateRestrictionAbility(`Play only if you're the first player`, (c) => {
        return c.owner.getTurnPlacement() === 0;
      }),
      new BaseAbility(`Draw {formula} cards.`, [], (abilityArgs, madeChoices) => {
        if (abilityArgs.owner.getTurnPlacement() === 0) {
          abilityArgs.owner.draw(abilityArgs.deck, abilityArgs.card.pow() + 2);
        }
      }).setFormula(`{pow} + 2`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Beanz It`, [
      new BaseAbility(`Add "Add {formula} turns to an opponent" to a card in your hand.`, [
        { choice: Choices.CARD_IN_HAND, pointer: Pointer.CARD_IN_HAND_RANDOM }
      ], (a, m) => {
        let card = m[0];
        card.setName(`Bean-Fueled ${card.getName()} \uD83E\uDED8`);
        card.addAbility(new AbilityAddTurnsOpp(a.card.pow() - card.pow()));
      }).setFormula(`{pow}`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Community Service Project`, [
      new BaseAbility(`Add "Draw {formula} card" to a card in your hand.`, [
        { choice: Choices.CARD_IN_HAND, pointer: Pointer.CARD_IN_HAND_RANDOM }
      ], (a, m) => {
        let card = m[0];
        card.setName(`Wizened ${card.getName()}`);
        card.addAbility(new AbilityDrawCard(a.card?.pow() - card.pow()));
      }).setFormula(`{pow}`)
    ]).setRarity(Rarity.COMMON),
    new Card(`Academia`, [
      new AbilityAddDeck("academia_deck", 100, true).setText(`Invent student loans. Add academia to the game.`),
      new AbilityRemoveOtherCopiesFromGame
    ]).setRarity(Rarity.RARE),
    new Card(`Currency`, [
      new AbilityAddDeck("currency_deck", 100, true, true).setText(`Invent currency. Add currency to the game.`),
      new AbilityUnlockUpgrade(new Upgrade({
        name: "Get a Job",
        description: "Search for a job in Alaska.",
        cost: [{
          amt: 3,
          resource: "turns"
        }],
        locked: false
      }, (cardArgs) => {
        let p = cardArgs.owner;
        p.addUpgrade(new Upgrade({
          name: "Work",
          description: "Work for 50 Tadbucks.",
          cost: [{
            amt: 1,
            resource: "turns"
          }]
        }, (cardArgs2) => {
          cardArgs2.owner.addResource("tadbucks", 50);
        }, true, 1.2));
      })).setText("You also invent the idea of working for pay."),
      new AbilityRemoveOtherCopiesFromGame
    ]).setRarity(Rarity.RARE)
  ]
};
var DeckList_default = DeckList2;

// logic/gameplay/player/Player.ts
class Player {
  name;
  cards = [];
  skipped = 0;
  props = {};
  events = {};
  turnPlacement = 0;
  turnsRemaining = 25;
  canWin = false;
  winReason = "cards in hand";
  handSize = 10;
  bot = false;
  host = false;
  botProfile = undefined;
  eventList = {};
  constructor(cards, deck) {
    this.name = Math.random().toString(36).substring(7);
    this.draw(deck, cards);
    this.setProp("meta_upgrade", []);
    this.addUpgrade(new Upgrade({
      name: "Take a Crap",
      description: "Take a bathroom break to draw a card.",
      cost: [{
        amt: 1,
        resource: "turns"
      }],
      locked: false
    }, (cardArgs) => {
      cardArgs.owner.draw(cardArgs.deck, 1);
      cardArgs.deck.addCards(Deck.fromCardList(1, DeckList_default["poop_deck"]));
    }, true, 1.5));
    this.addEvent("draw", (cardArgs) => {
      if (!cardArgs.card)
        return;
      if (!this.eventList[cardArgs.card.getName()])
        this.eventList[cardArgs.card.getName()] = {
          drawn: 0,
          played: 0,
          discarded: 0,
          given: 0,
          text: ""
        };
      this.eventList[cardArgs.card.getName()].drawn++;
      this.eventList[cardArgs.card.getName()].text = cardArgs.card.getText();
    });
    this.addEvent("play", (cardArgs) => {
      if (!this.eventList[cardArgs.card.getName()])
        this.eventList[cardArgs.card.getName()] = {
          drawn: 0,
          played: 0,
          discarded: 0,
          given: 0,
          text: ""
        };
      this.eventList[cardArgs.card.getName()].played++;
      this.eventList[cardArgs.card.getName()].text = cardArgs.card.getText();
      cardArgs.owner.addTurns(-1);
    });
    this.addEvent("discard", (cardArgs) => {
      if (!cardArgs.card)
        return;
      if (!this.eventList[cardArgs.card.getName()])
        this.eventList[cardArgs.card.getName()] = {
          drawn: 0,
          played: 0,
          discarded: 0,
          given: 0,
          text: ""
        };
      this.eventList[cardArgs.card.getName()].discarded++;
      this.eventList[cardArgs.card.getName()].text = cardArgs.card.getText();
    });
    this.addEvent("give", (cardArgs) => {
      if (!this.eventList[cardArgs.card.getName()])
        this.eventList[cardArgs.card.getName()] = {
          drawn: 0,
          played: 0,
          discarded: 0,
          given: 0,
          text: ""
        };
      this.eventList[cardArgs.card.getName()].given++;
      this.eventList[cardArgs.card.getName()].text = cardArgs.card.getText();
    });
    this.addEvent("res_life_change", (cardArgs) => {
      if (this.getProp("res_life") <= 0) {
        if (!cardArgs.deck)
          return;
        if (!cardArgs.deck.props["added_zombie_deck"]) {
          cardArgs.deck.addCards(Deck.fromCardList(45, DeckList_default["zombie_deck"]));
          cardArgs.deck.shuffle();
          cardArgs.deck.props["added_zombie_deck"] = true;
        }
      }
    });
  }
  addResource(key, amt) {
    if (key.startsWith("res_"))
      key = key.substring(4);
    if (!this.getProp(`res_${key}`))
      this.setProp(`res_${key}`, 0);
    this.setProp(`res_${key}`, this.getProp(`res_${key}`) + amt);
  }
  upgrades() {
    return this.props["meta_upgrade"] || [];
  }
  addUpgrade(u) {
    if (!this.props["meta_upgrade"])
      this.props["meta_upgrade"] = [];
    this.props["meta_upgrade"].push(u);
    this.fireEvents("new_upgrade", { owner: this, opps: [], deck: undefined, card: undefined });
  }
  setHost(host = true) {
    this.host = host;
    return this;
  }
  isHost() {
    return this.host;
  }
  getResources() {
    let props = {};
    for (let key in this.props) {
      if (key.startsWith("res_")) {
        props[key.substring(4)] = this.props[key];
      }
    }
    props["turns"] = Infinity;
    return props;
  }
  getUIs() {
    return {
      marketplace: this.props["marketplace"] || false,
      gene_bank: this.props["gene_bank"] || false,
      casino: this.props["casino"] || false,
      upgrade: true
    };
  }
  getRelevantProps() {
    let props = {};
    for (let key in this.props) {
      if (!key.startsWith("meta_")) {
        props[key] = this.props[key];
      }
    }
    return props;
  }
  getPrivate(you = false) {
    return {
      name: this.name,
      cards: this.cards.length,
      handsize: this.handSize,
      skipped: this.skipped,
      props: this.getRelevantProps(),
      turnsRemaining: this.turnsRemaining,
      canWin: this.canWin,
      winReason: this.winReason,
      host: this.host,
      you,
      order: this.turnPlacement
    };
  }
  getCards(opps, deck) {
    return this.cards.map((x) => ({
      name: x.getName(),
      text: x.getFormulatedText({
        owner: this,
        opps,
        deck,
        card: x
      }),
      rarity: x.getRarity(),
      power: x.pow(),
      formula: x.getFormulas(),
      props: x.getProps(),
      playable: x.canBePlayed({
        owner: this,
        opps,
        deck,
        card: x
      })
    }));
  }
  setBot() {
    this.bot = true;
    this.botProfile = new Bot(Object.keys(BehaviorProfile_default)[Math.floor(Math.random() * Object.keys(BehaviorProfile_default).length)]);
    return this;
  }
  isBot() {
    return this.bot;
  }
  setName(name) {
    this.name = name;
    return this;
  }
  getCardStats() {
    return this.eventList;
  }
  setTurnPlacement(turnPlacement) {
    this.turnPlacement = turnPlacement;
    return this;
  }
  getTurnPlacement() {
    return this.turnPlacement;
  }
  getHandsize() {
    return this.handSize;
  }
  getBotProfile() {
    return this.botProfile;
  }
  addHandsize(mod) {
    this.handSize += mod;
    return this;
  }
  setHandsize(mod) {
    this.handSize = mod;
    return this;
  }
  propList() {
    return this.props;
  }
  on(name, func) {
    this.addEvent(name, func);
    return this;
  }
  addEvent(name, func) {
    if (!this.events[name])
      this.events[name] = [];
    this.events[name].push(func);
  }
  getWinReason() {
    return this.winReason;
  }
  fireEvents(name, cardArgs) {
    if (this.events[name]) {
      for (let func of this.events[name]) {
        func(cardArgs);
      }
    }
    if (this.events[`temp_${name}`]) {
      for (let func of this.events[`temp_${name}`]) {
        func(cardArgs);
      }
      delete this.events[`temp_${name}`];
    }
  }
  addTurns(mod) {
    this.turnsRemaining += mod;
    if (this.turnsRemaining <= 0) {
      this.setCanWin(true, "plodded across the finish line");
    }
    return this;
  }
  setTurns(mod) {
    this.turnsRemaining = mod;
    return this;
  }
  getTurns() {
    return this.turnsRemaining;
  }
  rollDice() {
    if (this.getProp("dice")) {
      let dice = this.getProp("dice");
      let roll = dice[Math.floor(Math.random() * dice.length)];
      return roll;
    }
    return -1;
  }
  setCanWin(check, reason = "cards in hand") {
    this.canWin = check;
    this.winReason = reason;
    if (this.canWin) {
      this.fireEvents("can_win", { owner: this, opps: [], card: undefined, deck: undefined });
    }
    return this;
  }
  winCheck() {
    return this.canWin;
  }
  setProp(key, value, cardArgs) {
    this.props[key] = value;
    if (cardArgs) {
      this.fireEvents(`${key}_change`, cardArgs);
    }
    return this;
  }
  getProps() {
    return this.props;
  }
  getProp(key) {
    return this.props[key] || 0;
  }
  skip() {
    this.skipped++;
  }
  skipCheck() {
    if (this.skipped > 0) {
      this.skipped--;
      return true;
    }
    return false;
  }
  toPlayerState() {
    return {
      name: this.name,
      cards: this.cards.length,
      handsize: this.handSize,
      skipped: this.skipped,
      props: this.props,
      turnsRemaining: this.turnsRemaining,
      canWin: this.canWin,
      winReason: this.winReason,
      host: this.host,
      you: false,
      order: this.turnPlacement
    };
  }
  getLogText() {
    return `\xA7\xA7${this.bot ? `<b>[${this.botProfile.getProfileName()}]</b> ` : ``}${this.host ? `<b>[HOST]</b> ` : ``}${this.name}\xA7player\xA7${JSON.stringify(this.toPlayerState())}\xA7\xA7`;
  }
  getName() {
    return this.name;
  }
  cih() {
    return this.cards;
  }
  setCiH(cards) {
    this.cards = cards;
    return this;
  }
  inHand() {
    return this.cards.length;
  }
  turnStart(cardArgs) {
    for (let card of this.cards) {
      card.fireEvents("turn_start", { ...cardArgs, card });
    }
  }
  draw(deck, qty = 1) {
    let cards = deck.draw(qty);
    for (let c of cards) {
      if (!c) {
        continue;
      }
      c.draw(this, [], deck);
      this.fireEvents("draw", {
        owner: this,
        opps: [],
        deck,
        card: c
      });
      if (qty >= 1) {
        this.cards = this.cards.concat(c);
      }
    }
  }
  play(card, opps, deck, choices) {
    this.cards.splice(this.cards.indexOf(card), 1);
    if (!card.doSkipDiscard()) {
      deck.discardPile.push(card.setZone(Zone.DISCARD));
    } else {
      card.remove({
        card,
        deck,
        owner: this,
        opps
      });
    }
    card.play(this, opps, deck, choices);
    this.fireEvents("play", {
      owner: this,
      opps,
      deck,
      card
    });
  }
  give(card, player) {
    card.give(this, [player], undefined);
    this.fireEvents("give", {
      owner: this,
      opps: [],
      deck: undefined,
      card
    });
    player.cards.push(card);
    this.cards.splice(this.cards.indexOf(card), 1);
  }
  discard(card, deck) {
    card.discard(this, [], deck);
    this.fireEvents("discard", {
      owner: this,
      opps: [],
      deck,
      card
    });
    deck.discardPile.push(card.setZone(Zone.DISCARD));
    this.cards.splice(this.cards.indexOf(card), 1);
  }
  discardRandom(cardArgs) {
    let card = this.cih()[Math.floor(Math.random() * this.cih().length)];
    if (card) {
      this.discard(card, cardArgs.deck);
    }
  }
  discardChoose(cardArgs) {
    let card = this.weightedDiscard(cardArgs);
    if (card) {
      this.discard(card, cardArgs.deck);
    } else {
      this.discardRandom(cardArgs);
    }
  }
  randomCard() {
    return this.cards[Math.floor(Math.random() * this.cards.length)];
  }
  weightedDiscard(cardArgs) {
    let max = Infinity;
    let maxCard = null;
    for (let card of this.cards) {
      if (card && this.isBot()) {
        let evaluation = this.botProfile.evaluate(card, cardArgs);
        if (evaluation < max * (0.8 + Math.random() * 0.4)) {
          max = evaluation;
          maxCard = card;
        }
      }
    }
    return maxCard;
  }
  weightedDiscardToHand(cardArgs) {
    if (this.cih().length > this.getHandsize()) {
      while (this.cih().length > this.getHandsize()) {
        let discardable = this.weightedDiscard(cardArgs);
        if (discardable || !cardArgs.deck) {
          this.discard(discardable, cardArgs.deck);
        } else {
          return;
        }
      }
    }
  }
  weightedGive(cardArgs) {
    let max = Infinity;
    let maxCard = null;
    for (let card of this.cards) {
      if (card && this.isBot()) {
        let evaluation = this.botProfile.evaluate(card, cardArgs);
        if (evaluation < max * (0.8 + Math.random() * 0.4)) {
          max = evaluation;
          maxCard = card;
        }
      }
    }
    return maxCard;
  }
  weightedPlay(cardArgs) {
    let max = (-Infinity);
    let maxCard = null;
    for (let card of this.cards) {
      if (card && this.botProfile) {
        let evaluation = this.botProfile.evaluate(card, cardArgs);
        if (evaluation > max * (0.8 + Math.random() * 0.4) && card.canBePlayed(cardArgs)) {
          max = evaluation;
          maxCard = card;
        }
      } else {
        console.log("not a bot");
      }
    }
    return maxCard;
  }
  getEvent(name) {
    return this.events[name];
  }
  removeEvent(name) {
    delete this.events[name];
    return this;
  }
  selectChoices(choices, cardArgs) {
    return [];
  }
  evaluate(card, args) {
    return 0;
  }
}

// logic/structure/utils/CommEnum.ts
var CommEnum;
(function(CommEnum2) {
  CommEnum2[CommEnum2["CONNECTED"] = 0] = "CONNECTED";
  CommEnum2[CommEnum2["DISCONNECTED"] = 1] = "DISCONNECTED";
  CommEnum2[CommEnum2["SET_NAME"] = 2] = "SET_NAME";
  CommEnum2[CommEnum2["UPDATE_PLAYER_STATE"] = 3] = "UPDATE_PLAYER_STATE";
  CommEnum2[CommEnum2["SERVER_MSG"] = 4] = "SERVER_MSG";
  CommEnum2[CommEnum2["ADD_BOT"] = 5] = "ADD_BOT";
  CommEnum2[CommEnum2["KICK_PLAYER"] = 6] = "KICK_PLAYER";
  CommEnum2[CommEnum2["TRANSFER_UPGRADE_SHOP"] = 7] = "TRANSFER_UPGRADE_SHOP";
  CommEnum2[CommEnum2["BUY_UPGRADE"] = 8] = "BUY_UPGRADE";
  CommEnum2[CommEnum2["TRANSFER_MARKETPLACE"] = 9] = "TRANSFER_MARKETPLACE";
  CommEnum2[CommEnum2["DRAW_CARD"] = 10] = "DRAW_CARD";
  CommEnum2[CommEnum2["PLAY_CARD"] = 11] = "PLAY_CARD";
  CommEnum2[CommEnum2["GIVE_CARD"] = 12] = "GIVE_CARD";
  CommEnum2[CommEnum2["DISCARD_TO_HAND"] = 13] = "DISCARD_TO_HAND";
  CommEnum2[CommEnum2["GET_CHOICES"] = 14] = "GET_CHOICES";
  CommEnum2[CommEnum2["CHOICE_LIST"] = 15] = "CHOICE_LIST";
  CommEnum2[CommEnum2["PLAY_PHASE_CONFIRM"] = 16] = "PLAY_PHASE_CONFIRM";
  CommEnum2[CommEnum2["SEND_INTERRUPTS"] = 17] = "SEND_INTERRUPTS";
  CommEnum2[CommEnum2["RESOLVE_INTERRUPT"] = 18] = "RESOLVE_INTERRUPT";
  CommEnum2[CommEnum2["ERROR"] = 19] = "ERROR";
})(CommEnum || (CommEnum = {}));

// runtime/Server.ts
import {WebSocketServer} from "ws";

// runtime/dummies/ai_heuristics.ts
function adjustAIWeights(num_sims = 100, console_output = true) {
  let cardList = [];
  let aggTraits = {};
  let iter = 0;
  let sims = 100;
  for (let s = sims;s > 0; s--) {
    let deck = Deck.fromCardList(300, DeckList_default["basic"]);
    let bots = [];
    for (let i = 0;i < 3 + sims % 3; i++) {
      bots.push(new Player(7, deck).setBot());
    }
    for (let deck2 of Object.values(DeckList_default)) {
      cardList.push(...deck2.map((card) => card.clone()));
    }
    for (let card of cardList) {
      for (let p = 0;p < bots.length; p++) {
        let cardArgs = {
          owner: bots[p],
          opps: bots.filter((b, i) => i !== p),
          card
        };
        let weightings = card.getTraits(cardArgs).profile;
        for (let trait in weightings) {
          if (!aggTraits[trait]) {
            aggTraits[trait] = 0;
          }
          aggTraits[trait] += weightings[trait];
        }
        iter++;
      }
    }
    if (console_output) {
      console.log(`${s} simulation${s > 1 ? "s" : ""} remaining... (${iter} iterations)`);
    }
  }
  for (let trait in aggTraits) {
    aggTraits[trait] /= iter;
    aggTraits[trait] = 1 / aggTraits[trait];
  }
  if (console_output) {
    console.log(aggTraits);
  }
  return aggTraits;
}

// runtime/Server.ts
class GameServer {
  players = {};
  sockets = {};
  deck;
  turnPhase = 0;
  activeTurn = "";
  logEntries = [];
  sendableLogs = [];
  serverObj = undefined;
  serverPort = 15912;
  serverConfig = {
    startingHand: 4,
    maxPlayers: 6,
    minPlayers: 1,
    fairness: true
  };
  booted = false;
  constructor() {
    this.deck = Deck.fromCardList(60, DeckList_default.basic);
    this.deck.shuffle();
  }
  reset() {
    if (this.serverObj) {
      this.serverObj.close();
    }
    this.deck = Deck.fromCardList(60, DeckList_default.basic);
    this.deck.shuffle();
    this.sockets = {};
    this.players = {};
    this.turnPhase = 0;
    this.activeTurn = "";
    this.sendableLogs = [];
    this.log("Server reset!");
    this.init(this.serverPort);
  }
  static createName() {
    let name = [
      ["Cheddar", "Swiss", "Sewer", "Moist", "Crusty", "Crunchy", "Crispy", "Bam", "Bang", "Slam", "Meow", "Bark", "Grand", "Del", "Dip", "Rich", "Povert", "Rogue", "Joleto", "Tad", "Italian", "Spicy", "Salty", "Sweet", "Sour", "Bitter", "Stinky", "Irritating", "Meaty", "Cool", "Neato", "Awesome", "Sassy"],
      ["amole", "lotion", "bacon", "slice", "sliver", "fluid", "ian", "jess", "tad", "Loaf", "Crust", "Crunch", "Crisp", "Ioli", "Head", "Ino", "Pants", "Zilla", "Shirt", "Shoes", "Hat", "Glove", "Sock", "Spaghetti", "Oritto", "Ravioli", "Gnocchi", "Chilada", "Pierogi", "Burrito", "Taco", "Enchilada", "Tamale", "Changa", "Dilla", "Nachos", "Tilla", "Chip", "Salsa", "Guacamole", "Asaurus", "Eratops"],
      [" Mc", " ", " ", " ", " ", " ", " ", " ", " Mac", " O'"],
      ["Pan", "Tad", "Crap", "Gene", "Friendly", "Spicy", "Hate", "Spinach", "Slam", "Magic", "Eraser", "Bougie", "Ball", "Supremo", "Bean", "Burger", "Bread", "Biscuit", "Bacon", "Bun", "Biscuit", "Burger", "Bread", "Kitty", "Wood", "Morning", "Soft", "Hard", "Raging", "", ""],
      ["Plumbing", "Orama", "Adic", "Tastic", "Full", "Loaf", "Fruit", "Table", "Chair", "Brian", "Brain", "Atomy", "Acist", "Ologist", "Doofus", "Dorkus", "Itis", "Person", "Biden", "Trump", "Obama", "Bush", "Clinton", "Reagan", "Carter", "Folk", "Ford", "Sandal", "Muncher", "Potato", "Whiskey", "Bourbon"]
    ].map((name2, index) => {
      let select = name2[Math.floor(Math.random() * name2.length)];
      if (index > 0 && !select.startsWith(" ")) {
        select = select.toLowerCase();
      }
      return select;
    }).join("");
    return name.split(" ").map((s) => s[0].toUpperCase() + s.substring(1).toLowerCase()).join(" ");
  }
  log(content) {
    console.log(content);
    this.logEntries.push(content.toString());
  }
  gameLog(content) {
    this.sendableLogs.push(content);
  }
  getDeck() {
    return this.deck;
  }
  addPlayer() {
    if (this.serverConfig.fairness) {
      Object.values(this.players).forEach((player) => player.addTurns(1));
    }
    let id = Math.random().toString(36).substring(7);
    this.players[id] = new Player(this.serverConfig.startingHand, this.deck).setTurnPlacement(Object.keys(this.players).length);
    this.players[id].addEvent("new_upgrade", (cardArgs) => {
      this.updateUpgradeShop(id);
    });
    if (this.activeTurn === "") {
      this.activeTurn = id;
      this.players[id].setHost();
    }
    return { id, index: Object.keys(this.players).length - 1 };
  }
  addBot() {
    if (this.serverConfig.fairness) {
      Object.values(this.players).forEach((player) => player.addTurns(1));
    }
    let id = Math.random().toString(36).substring(7);
    this.players[id] = new Player(this.serverConfig.startingHand, this.deck).setTurnPlacement(Object.keys(this.players).length).setName(GameServer.createName()).setBot();
    this.gameLog(`${this.players[id].getLogText()} joined the game as a bot.`);
    return id;
  }
  incrementPhase() {
    let cardArgs = {
      owner: this.getActive(),
      opps: Object.values(this.players).filter((x) => x !== this.getActive()),
      deck: this.deck
    };
    let CAN_GIVE = Object.keys(this.players).length >= 2 && this.getActive().cih().length >= 2 && this.getActive().cih().some((x) => x.canBeGiven(this.getActive(), {
      ...cardArgs,
      card: x
    }));
    let CAN_PLAY = this.getActive().cih().some((x) => x.canBePlayed({
      owner: this.getActive(),
      opps: Object.values(this.players).filter((x2) => x2 !== this.getActive()),
      deck: this.deck,
      card: x
    })) || this.getActive().getProp(`meta_upgrade`).some((upgrade) => {
      return upgrade.getData(cardArgs);
    });
    let CAN_DISCARD = this.getActive().cih().length > this.getActive().getHandsize();
    if (this.turnPhase === 0) {
      if (CAN_GIVE) {
        this.turnPhase = 1;
      } else if (CAN_PLAY) {
        this.turnPhase = 2;
      } else if (CAN_DISCARD) {
        this.turnPhase = 3;
      } else {
        this.incrementTurn();
      }
    } else if (this.turnPhase === 1) {
      if (CAN_PLAY) {
        this.turnPhase = 2;
      } else if (CAN_DISCARD) {
        this.turnPhase = 3;
      } else {
        this.incrementTurn();
      }
    } else if (this.turnPhase === 2) {
      if (CAN_DISCARD) {
        this.turnPhase = 3;
      } else {
        this.incrementTurn();
      }
    }
    this.updateAllStates();
  }
  incrementTurn() {
    this.gameLog(`${this.getActive().getLogText()} ended their turn.`);
    this.gameLog(`===NEW TURN===`);
    this.turnPhase = 0;
    if (Object.values(this.players).length == 0) {
      this.activeTurn = "";
      this.updateAllStates();
    } else {
      this.activeTurn = Object.keys(this.players)[(Object.keys(this.players).indexOf(this.activeTurn) + 1) % Object.keys(this.players).length];
      this.gameLog(`${this.getActive().getLogText()} begins their turn.`);
      this.updateAllStates();
      if (this.getActive().skipCheck()) {
        this.gameLog(`${this.getActive().getLogText()} is skipped.`);
        this.incrementTurn();
      } else if (this.getActive().isBot()) {
        this.playBotTurn();
      }
    }
  }
  playBotTurn() {
    let opps = Object.keys(this.players).filter((key) => key !== this.activeTurn).map((key) => this.players[key]);
    let baseArgs = {
      owner: this.getActive(),
      opps,
      deck: this.deck
    };
    this.getActive().draw(this.deck, 1);
    this.gameLog(`${this.getActive().getLogText()} draws a card.`);
    let playable = null;
    try {
      playable = this.getActive().cih().filter((x) => x.canBePlayed({ ...baseArgs, card: x }));
    } catch (e) {
      this.gameLog(`${this.getActive().getLogText()} has an error in their hand: ${e}`);
    }
    this.turnPhase = 1;
    this.updateAllStates();
    if (this.getActive().cih().length >= 2) {
      let weighted = this.getActive().weightedGive(baseArgs);
      if (weighted) {
        let target = opps[Math.floor(Math.random() * opps.length)];
        this.gameLog(`${this.getActive().getLogText()} gives ${weighted.getLogText()} to ${target.getLogText()}.`);
        this.getActive().give(weighted, target);
      }
    } else {
      this.gameLog(`${this.getActive().getLogText()} doesn't have enough cards to be generous.`);
    }
    let played = playable.length > 0;
    if (played) {
      this.turnPhase = 2;
    } else {
      this.turnPhase = 3;
    }
    this.updateAllStates();
    if (played) {
      let weighted = this.getActive().weightedPlay(baseArgs);
      if (weighted) {
        this.gameLog(`${this.getActive().getLogText()} plays ${weighted.getLogText()}.`);
        this.getActive().play(weighted, opps, this.deck);
      }
      this.turnPhase = 3;
      this.updateAllStates();
    }
    this.getActive().weightedDiscardToHand(baseArgs);
    this.incrementTurn();
  }
  updateUpgradeShop(id) {
    let ws = this.sockets[id];
    ws.send(JSON.stringify({
      type: CommEnum.TRANSFER_UPGRADE_SHOP,
      shop: this.getActive().getProp(`meta_upgrade`).map((upgrade) => {
        return upgrade.getData({
          owner: this.players[id],
          opps: [],
          deck: this.deck
        });
      })
    }));
  }
  disconnect(id, msg = "") {
    for (let card of this.players[id].cih()) {
      this.deck.discardPile.push(card);
    }
    if (id === this.activeTurn) {
      this.incrementTurn();
    }
    this.log(`Player ${id} disconnected (${this.players[id].getLogText()}) - ${msg}`);
    this.gameLog(`${this.players[id]} disconnected.`);
    if (this.sockets[id]) {
      this.sockets[id].send(JSON.stringify({
        type: CommEnum.SERVER_MSG,
        message: msg
      }));
      this.sockets[id].send(JSON.stringify({
        type: CommEnum.DISCONNECTED
      }));
    }
    delete this.players[id];
    delete this.sockets[id];
    if (this.serverConfig.fairness) {
      Object.values(this.players).forEach((player) => player.addTurns(-1));
    }
    if (Object.keys(this.players).length > 0) {
      let newHost = Object.keys(this.players).find((key) => !this.players[key].isBot());
      if (newHost) {
        this.players[newHost].setHost();
        this.gameLog(`${this.players[newHost]} is now the host.`);
      } else {
        this.log("No non-bots left, server entering reset mode");
        this.reset();
      }
    }
    if (Object.keys(this.players).length === 0) {
      this.activeTurn = "";
      this.log("No non-bots left, server entering reset mode");
      this.reset();
    }
    this.updateAllStates();
  }
  getActive() {
    if (this.activeTurn === "")
      throw new Error("No active turn");
    return this.players[this.activeTurn];
  }
  sendState(id) {
    let opps = Object.keys(this.players).filter((key) => key !== id).map((key) => this.players[key]);
    let index = Object.keys(this.players).indexOf(this.activeTurn);
    let your_index = Object.keys(this.players).indexOf(id);
    if (this.players[id].isBot()) {
      return;
    }
    this.sockets[id].send(JSON.stringify({
      type: CommEnum.UPDATE_PLAYER_STATE,
      state: {
        game: {
          players: Object.values(this.players).map((p, i) => p.getPrivate(i === your_index)),
          turnPhase: this.turnPhase,
          uis: this.players[id].getUIs(),
          activeTurn: index,
          deck: this.deck.length,
          config: this.serverConfig,
          logs: this.sendableLogs.map((x) => x.toString()),
          discard: this.deck.discardPile.map((x) => ({
            name: x.getName(),
            text: x.getFormulatedText({
              owner: this.players[id],
              opps,
              deck: this.deck,
              card: x
            }),
            rarity: x.getRarity(),
            props: x.getProps()
          }))
        },
        personal: this.players[id].getCards(opps, this.deck)
      }
    }));
  }
  updateAllStates() {
    Object.keys(this.players).forEach((key) => this.sendState(key));
  }
  adjustAIHeuristics(num_sims = 250) {
    console.log(`Adjusting AI heuristics...`);
    let mods = adjustAIWeights(num_sims, false);
    for (let botName of Object.keys(BehaviorProfile_default)) {
      console.log(`\n=== ${botName} ===`);
      for (let mod of Object.keys(mods)) {
        if (BehaviorProfile_default[botName][mod]) {
          let newMod = Math.round(BehaviorProfile_default[botName][mod] * mods[mod] * 100) / 100;
          console.log(`${mod}: ${BehaviorProfile_default[botName][mod]} -> ${newMod}`);
          BehaviorProfile_default[botName][mod] = newMod;
        }
      }
    }
  }
  init(port = 15912) {
    let server = this;
    server.log(`Server initialized on port ${port}`);
    this.serverPort = port;
    if (!this.booted) {
      this.adjustAIHeuristics();
    }
    this.booted = true;
    this.serverObj = new WebSocketServer({
      port
    });
    this.serverObj.on("connection", function connection(ws) {
      ws.on("message", function input(message) {
        let result = JSON.parse(message);
        let id2 = result.id;
        let opps = Object.keys(server.players).filter((key) => key !== id2).map((key) => server.players[key]);
        switch (result.type) {
          case CommEnum.SET_NAME:
            if (result.name.length < 1) {
              result.name = GameServer.createName();
            }
            server.players[id2].setName(result.name);
            server.gameLog(`${server.players[id2].getLogText()} joined the game`);
            server.updateAllStates();
            break;
          case CommEnum.DRAW_CARD:
            if (server.activeTurn == id2 && server.turnPhase == 0) {
              server.players[id2].draw(server.deck, 1);
              server.gameLog(`${server.players[id2].getLogText()} drew a card.`);
              server.incrementPhase();
            } else if (server.activeTurn !== id2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played - not your turn."
              }));
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played - not the draw phase."
              }));
            }
            server.updateAllStates();
            break;
          case CommEnum.GIVE_CARD:
            let giveId = result.idInHand;
            let targetOpp = Object.keys(server.players)[result.target];
            if (server.activeTurn == id2 && server.turnPhase == 1 && targetOpp !== id2 && server.players[id2].cih().length >= 2 && server.players[id2].cih()[giveId].canBeGiven(server.players[targetOpp], {
              card: server.players[id2].cih()[giveId],
              owner: server.players[id2],
              opps,
              deck: server.deck
            })) {
              server.gameLog(`${server.players[id2].getLogText()} gives ${server.players[id2].cih()[giveId].getLogText()} to ${server.players[targetOpp].getLogText()}.`);
              server.players[id2].give(server.players[id2].cih()[giveId], server.players[targetOpp]);
              server.incrementPhase();
            } else if (server.activeTurn === id2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be gifted - not your turn."
              }));
            } else if (server.turnPhase !== 1) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be gifted - not the give phase."
              }));
            } else if (server.players[id2].cih().length < 2) {
              server.gameLog(`${server.players[id2].getLogText()} doesn't have enough cards to be generous.`);
              server.incrementPhase();
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be gifted - not giveable to this player."
              }));
            }
            break;
          case CommEnum.GET_CHOICES:
            let choiceToGet = result.idInHand;
            let choiceCard = server.players[id2].cih()[choiceToGet];
            if (choiceCard.canBePlayed({
              owner: server.players[id2],
              opps,
              deck: server.deck,
              card: choiceCard
            }) && server.activeTurn === id2 && server.turnPhase == 2) {
              let result2 = JSON.stringify({
                type: CommEnum.CHOICE_LIST,
                card: choiceToGet,
                splits: choiceCard.getAbilities().map((ability) => ability.getChoices().length),
                choices: choiceCard.getChoices({
                  owner: server.players[id2],
                  opps,
                  deck: server.deck,
                  card: choiceCard
                })
              });
              ws.send(result2);
            } else if (server.activeTurn === id2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't have choices selected - not your turn."
              }));
            } else if (server.turnPhase !== 2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played - not the play phase."
              }));
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played"
              }));
            }
            break;
          case CommEnum.PLAY_CARD:
            let idInHand = result.idInHand;
            let card = server.players[id2].cih()[idInHand];
            let choices = result.choices;
            let choiceObjs = choices.map((selections, abilityId) => {
              let ability = card.orderAbilities()[abilityId];
              return selections.map((selection, choiceId) => {
                let type = ability.informChoices({
                  owner: server.players[id2],
                  opps,
                  deck: server.deck,
                  card
                })[choiceId];
                switch (type.choice) {
                  case Choices.OPPONENT:
                  case Choices.PLAYER:
                    return server.players[Object.keys(server.players)[selection]];
                  case Choices.CARD_IN_HAND:
                    return server.players[id2].cih()[selection];
                  case Choices.CARD_IN_DISCARD:
                    return server.deck.discardPile[selection];
                }
              });
            });
            if (server.activeTurn === id2 && server.turnPhase == 2 && card.canBePlayed({
              owner: server.players[id2],
              opps,
              deck: server.deck,
              card
            })) {
              let cardArgs = {
                owner: server.players[id2],
                opps,
                deck: server.deck,
                card
              };
              if (card.getChoices(cardArgs).length > 0) {
                server.gameLog(`${server.players[id2].getLogText()} plays ${card.getLogText()} with the following choices:\n${choices.map((choice, index) => `${card.orderAbilities()[index].getFormulatedText(cardArgs)}: ${choiceObjs[index].map((x) => x.getLogText()).join(", ")}`).join("\n")}`);
              } else {
                server.gameLog(`${server.players[id2].getLogText()} plays ${card.getLogText()}.`);
              }
              server.players[id2].play(card, opps, server.deck, choiceObjs);
              server.incrementPhase();
            } else if (server.activeTurn === id2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played - not your turn."
              }));
            } else if (server.turnPhase !== 2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played - not the play phase."
              }));
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be played - not playable."
              }));
            }
            break;
          case CommEnum.DISCARD_TO_HAND:
            let toDiscard = result.idInHand;
            if (server.activeTurn !== id2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be discarded - not your turn."
              }));
            } else if (server.turnPhase !== 3) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be discarded - not the discard phase."
              }));
            } else if (server.players[id2].cih().length <= server.players[id2].getHandsize()) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "This card can't be discarded - you don't have enough cards in hand."
              }));
              server.updateAllStates();
              server.incrementTurn();
            } else {
              for (let card2 of toDiscard) {
                if (server.players[id2].cih().length >= card2 + 1) {
                  let toDiscardCards = [server.players[id2].cih()[card2]];
                  server.players[id2].setCiH(server.players[id2].cih().filter((x) => !toDiscardCards.includes(x)));
                  for (let card3 of toDiscardCards) {
                    server.deck.discardPile.push(card3);
                  }
                  server.updateAllStates();
                  if (server.players[id2].cih().length <= server.players[id2].getHandsize()) {
                    break;
                    server.incrementTurn();
                  }
                }
              }
            }
            break;
          case CommEnum.ADD_BOT:
            if (server.players[id2].isHost()) {
              server.addBot();
              server.updateAllStates();
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You can't add a bot - you aren't the host."
              }));
            }
            break;
          case CommEnum.KICK_PLAYER:
            if (server.players[id2].isHost()) {
              let targetToKick = result.target;
              let stringId = Object.keys(server.players)[targetToKick];
              if (stringId === id2) {
                ws.send(JSON.stringify({
                  type: CommEnum.ERROR,
                  message: "You can't kick yourself."
                }));
              } else {
                server.gameLog(`${server.players[id2]} kicked ${server.players[stringId]}.`);
                server.disconnect(stringId, result.message ?? "The host hated your guts.");
              }
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You can't kick a player - you aren't the host."
              }));
            }
            break;
          case CommEnum.TRANSFER_UPGRADE_SHOP:
            if (server.getActive().getUIs().upgrade) {
              server.updateUpgradeShop(id2);
            } else {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You haven't unlocked the upgrade shop."
              }));
            }
            break;
          case CommEnum.BUY_UPGRADE:
            let upgradeIndex = result.upgrade;
            let shop = server.getActive().getProp(`meta_upgrade`);
            if (server.activeTurn !== id2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You can't buy an upgrade - not your turn."
              }));
            } else if (!server.getActive().getUIs().upgrade) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You can't buy an upgrade - you haven't unlocked the upgrade shop."
              }));
            } else if (server.turnPhase !== 2) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You can't buy an upgrade - not the play phase."
              }));
            } else if (shop.length <= upgradeIndex || upgradeIndex < 0 || shop[upgradeIndex].locked() || !shop[upgradeIndex].canPayCost({
              owner: server.getActive(),
              opps,
              deck: server.deck
            })) {
              ws.send(JSON.stringify({
                type: CommEnum.ERROR,
                message: "You can't buy an upgrade - invalid upgrade."
              }));
            } else {
              shop[upgradeIndex].unlock({
                owner: server.getActive(),
                opps,
                deck: server.deck
              });
              server.gameLog(`${server.getActive().getLogText()} bought ${shop[upgradeIndex].getData({
                owner: server.getActive(),
                opps,
                deck: server.deck
              }).name}.`);
              server.incrementPhase();
              server.updateAllStates();
              server.updateUpgradeShop(id2);
            }
            break;
        }
      });
      ws.on("close", function close(code, message) {
        let id2 = Object.keys(server.sockets).find((key) => server.sockets[key] === ws);
        server.disconnect(id2);
      });
      let id = server.addPlayer();
      server.sockets[id.id] = ws;
      ws.send(JSON.stringify({
        type: CommEnum.CONNECTED,
        connected: id.id,
        host: Object.keys(server.players)[0] == id.id,
        turn: id.index
      }));
    });
  }
}

// runtime/dummies/init_server.ts
var server = new GameServer;
server.init(15912);
