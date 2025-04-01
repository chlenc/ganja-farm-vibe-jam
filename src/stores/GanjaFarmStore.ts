////////////////////////////////////////
// 🍃 Ganja farm

import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

////////////////////////////////////////
export enum PlantType {
  OgCush = "OG_CUSH",
}

const NEW_PLAYER_COINS = 1;
const SEED_PRICE = 0.1;

const TIME_TO_HARVEST = 60;

const SELL_PRICE = {
  [PlantType.OgCush]: 0.5,
};

const MAX_FARMING_SKILL = 10;
const INITIAL_FARMING_SKILL = 1;
const INITIAL_VALUE_SOLD = 0;
const EXP_MULTIPLIER = 3_000_000;

export class Player {
  public userId: string;
  public farmingSkill: number;
  public totalValueSold: number;
  public timeToHarvest: number;

  constructor(
    userId: string,
    farmingSkill: number = 1,
    totalValueSold: number = 0,
    timeToHarvest: number = 24 * 60 * 60
  ) {
    this.userId = userId;
    this.farmingSkill = farmingSkill;
    this.totalValueSold = totalValueSold;
    this.timeToHarvest = timeToHarvest;
  }

  public levelUpSkill(): void {
    if (this.farmingSkill < 10) {
      this.farmingSkill += 1;
    }
  }

  public increaseTotalValueSold(amount: number): void {
    this.totalValueSold += amount;
  }
}

export class Plant {
  public name: PlantType;
  public timePlanted: number | null;

  constructor(name: PlantType, timePlanted: number | null = null) {
    this.name = name;
    this.timePlanted = timePlanted;
  }

  static new(name: PlantType, timePlanted: number | null = null): Plant {
    return new Plant(name, timePlanted);
  }
}

export class GardenVector {
  public userId: string;
  public inner: (Plant | null)[];

  constructor(userId: string) {
    this.userId = userId;
    this.inner = new Array(10).fill(null);
  }

  public harvestAtIndex(index: number): void {
    if (index < 0 || index >= 10) {
      throw new Error("Invalid index");
    }
    this.inner[index] = null;
  }

  public plantAtIndex(val: Plant, index: number): void {
    if (index < 0 || index >= 10) {
      throw new Error("Invalid index");
    }
    this.inner[index] = val;
  }
}

export interface PlayerSeeds {
  userId: string;
  seeds: Map<PlantType, number>;
}

export interface PlayerItems {
  userId: string;
  items: Map<PlantType, number>;
}

export interface ISerializedGanjaFarmStore {
  player: Player;
  garden: GardenVector;
  balance: number;
  seeds: number;
  items: number;
}

export interface ISerializedGanjaFarmStore {
  player: Player;
  garden: GardenVector;
  balance: number;
  seeds: number;
  items: number;
}

export class GanjaFarmStore {
  player: Player;
  garden: GardenVector;
  balance: number;
  seeds: number;
  items: number;
  private timeToHarvest: number;

  constructor(rootStore: RootStore, initState?: ISerializedGanjaFarmStore) {
    this.timeToHarvest = TIME_TO_HARVEST;
    this.player =
      initState?.player ??
      new Player(
        rootStore.userStore.wallet,
        INITIAL_FARMING_SKILL,
        INITIAL_VALUE_SOLD
      );

    this.garden =
      initState?.garden ?? new GardenVector(rootStore.userStore.wallet);

    this.balance = initState?.balance ?? NEW_PLAYER_COINS;
    this.seeds = initState?.seeds ?? 0;
    this.items = initState?.items ?? 0;

    makeAutoObservable(this);
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  setGarden(garden: (Plant | null)[]) {
    this.garden = new GardenVector(this.player.userId);
    this.garden.inner = garden;
  }

  setSeeds(seeds: number) {
    this.seeds = seeds;
  }

  setItems(items: number) {
    this.items = items;
  }

  public async levelUp(): Promise<void> {
    if (this.player.farmingSkill >= MAX_FARMING_SKILL) {
      throw new Error("skill already max");
    }

    const newLevel = this.player.farmingSkill + 1;
    const exp = newLevel * newLevel * EXP_MULTIPLIER;

    if (this.player.totalValueSold < exp) {
      throw new Error("not enough exp");
    }

    this.player.levelUpSkill();
    this.setPlayer(this.player);

    log({
      event: "LevelUp",
      userId: this.player.userId,
      playerInfo: this.player,
      balance: this.balance,
    } as LevelUpEvent);
  }

  public buySeeds(plantType: PlantType, amount: number): void {
    const cost = amount * SEED_PRICE;
    if (this.balance < cost) {
      throw new Error("Insufficient funds");
    }

    this.balance -= cost;

    const currentAmount = this.seeds;
    this.seeds += amount;

    log({
      event: "BuySeeds",
      userId: this.player.userId,
      plantType: plantType,
      amountBought: amount,
      cost,
      totalCurrentAmount: currentAmount + amount,
      balance: this.balance,
    } as BuySeedsEvent);
  }

  public async plantSeedAtIndex(
    plantType: PlantType,
    index: number
  ): Promise<void> {
    const currentAmount = this.seeds;
    // console.log({ plantType, userId, playerSeeds, currentAmount });

    if (currentAmount < 1) {
      throw new Error("Not enough seeds");
    }

    const gardenVector = this.garden;

    // Check if there's already a plant in this spot
    if (gardenVector.inner[index] !== null) {
      throw new Error("This spot is already occupied");
    }

    this.seeds -= 1;

    const plant = new Plant(plantType, Date.now());
    gardenVector.plantAtIndex(plant, index);

    this.setSeeds(this.seeds);
    this.setGarden(gardenVector.inner);

    log({
      event: "PlantSeed",
      userId: this.player.userId,
      plantType: plantType,
      index,
      timestamp: Date.now(),
      balance: this.balance,
    } as PlantSeedEvent);
  }

  public async harvest(indexes: number[]): Promise<void> {
    const time = this.timeToHarvest * 1000; // Convert seconds to milliseconds
    const plantedSeeds = this.garden;

    if (!plantedSeeds) {
      throw new Error("No planted seeds found");
    }

    const currentTime = Date.now();

    for (const index of indexes) {
      const plant = plantedSeeds.inner[index];
      if (!plant) {
        throw new Error("No plant at this index");
      }

      const plantedTime = plant.timePlanted;
      if (!plantedTime) {
        throw new Error("Planted time not set");
      }

      const finishTime = plantedTime + time;
      if (currentTime < finishTime) {
        throw new Error("Too early to harvest");
      }

      plantedSeeds.inner[index] = null;

      this.items += 1;
      this.setItems(this.items);

      log({
        event: "Harvest",
        userId: this.player.userId,
        plantType: plant.name,
        index,
        timestamp: currentTime,
        balance: this.balance,
      } as HarvestEvent);
    }

    this.setGarden(plantedSeeds.inner);
  }

  public async sellItem(plantType: PlantType, amount: number): Promise<void> {
    const currentAmount = this.items;

    if (currentAmount < amount) {
      throw new Error("Not enough items to sell");
    }

    this.items -= amount;
    this.setItems(this.items);

    const price = SELL_PRICE[plantType] ?? 0;
    const amountToMint = price * amount;

    this.player.totalValueSold += amountToMint;
    this.balance += amountToMint;
    this.setPlayer(this.player);

    log({
      event: "SellItem",
      userId: this.player.userId,
      plantType: plantType,
      amountSold: amount,
      valueSold: amountToMint,
      playerInfo: this.player,
      balance: this.balance,
    } as SellItemEvent);
  }

  public async getPlayer(): Promise<Player> {
    return this.player;
  }

  public async getSeedAmount(item: PlantType): Promise<number> {
    if (!Object.values(PlantType).includes(item)) {
      throw new Error(`Invalid plant type: ${item}`);
    }
    return this.seeds;
  }

  public async getGardenVec(): Promise<GardenVector> {
    return this.garden;
  }

  public async getItemAmount(item: PlantType): Promise<number> {
    return this.items;
  }

  public async canLevelUp(): Promise<boolean> {
    if (this.player.farmingSkill < MAX_FARMING_SKILL) {
      const newLevel = this.player.farmingSkill + 1;
      const exp = newLevel * newLevel * EXP_MULTIPLIER;
      return this.player.totalValueSold >= exp;
    }

    return false;
  }

  public async canHarvest(index: number): Promise<boolean> {
    const plantedSeeds = this.garden;
    if (!plantedSeeds) {
      return false;
    }

    const plant = plantedSeeds.inner[index];
    if (!plant) {
      return false;
    }

    const currentTime = Date.now();
    const plantedTime = plant.timePlanted;
    if (!plantedTime) {
      return false;
    }

    const time = this.timeToHarvest * 1000; // Convert seconds to milliseconds
    const finishTime = plantedTime + time;
    return currentTime >= finishTime;
  }

  public async getTimeToHarvest(): Promise<number> {
    return this.timeToHarvest;
  }

  static create = (
    rootStore: RootStore,
    initState?: ISerializedGanjaFarmStore
  ) => {
    return new GanjaFarmStore(rootStore, initState);
  };

  serialize = (): ISerializedGanjaFarmStore => {
    return {
      player: this.player,
      garden: this.garden,
      balance: this.balance,
      seeds: this.seeds,
      items: this.items,
    };
  };
}

////////////////////////////////////////
// EVENT LOG STRUCTS
////////////////////////////////////////
type NewPlayerEvent = {
  userId: string;
  balance: number;
};

type LevelUpEvent = {
  userId: string;
  playerInfo: Player;
  balance: number;
};

type BuySeedsEvent = {
  userId: string;
  plantType: PlantType;
  amountBought: number;
  cost: number;
  totalCurrentAmount: number;
  balance: number;
};

type PlantSeedEvent = {
  userId: string;
  plantType: PlantType;
  index: number;
  timestamp: number;
  balance: number;
};

type HarvestEvent = {
  userId: string;
  plantType: PlantType;
  index: number;
  timestamp: number;
  balance: number;
};

type SellItemEvent = {
  userId: string;
  plantType: PlantType;
  amountSold: number;
  valueSold: number;
  playerInfo: Player;
  balance: number;
};

function log(
  event:
    | NewPlayerEvent
    | LevelUpEvent
    | BuySeedsEvent
    | PlantSeedEvent
    | HarvestEvent
    | SellItemEvent
): void {
  const timestamp = new Date().toISOString();

  console.log("----------------------------------------");
  console.log(`Timestamp: ${timestamp}`);
  console.log("Event Details:");

  Object.entries(event).forEach(([key, value]) => {
    if (key !== "type") {
      if (typeof value === "object" && value !== null) {
        console.log(`  ${key}:`);
        Object.entries(value).forEach(([subKey, subValue]) => {
          console.log(`    ${subKey}: ${subValue}`);
        });
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
  });

  console.log("----------------------------------------");
}
