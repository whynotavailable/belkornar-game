interface DataFile {
  areas: Area[];
  processes: Process[];
  items: Item[];
  people: Person[];
}

interface ScheduledTask {
  // the grouping for killing tasks of the same kind
  group: string;
  // actor is what is the thing performing the tasks (mostly the player and enemies)
  actor: string;
  // the id of the owner of the task (for display purposes)
  owner: string;
  // the type of action (to figure out what processes the finished task)
  taskType: string;
  startTime: number;
  endTime: number;
  // calculation (to just make it easier on the UI)
  percentTimeLeft: number;
  // this is for how often the task repeats after it's started.
  // When it gets added to the process queue the
  interval: number | null;
}

interface Area {
  id: string;
  name: string;
  people?: string[];
  activities?: string[];
}

interface Process {
  id: string;
  name: string;
  exp?: ExpDrop[];
  input?: Quantity[];
  output?: Quantity[];
  group?: string;
  groups?: string[];
  time?: number;
}

interface Item {
  // this is the item id
  id: string
  // this is the
  name: string;
  cost?: number;
  type?: 'consumable' | 'material' | 'equipment'
  slot?: string;
  kind?: string;
  stackable?: boolean;
  requirements?: Requirement[];
}

// an item in your inventory
interface InventoryItem extends Item {
  ordinal: number;
  // if the item is stackable it only counts as 1 for backpack slots
  count: number;
}

interface InventoryChange {
  id: string;
  name?: string;
  change: number;
}

interface ExpDrop {
  id: string;
  exp: number;
}

interface Quantity {
  id: string;
  amount?: number;
}

interface Requirement {
  id: string;
}

interface Person {
  id: string;
  name: string;
  sells?: PersonSell[];
  quote?: string;
  gold?: number;
}

// for embedding buttons into child components
interface CustomInventoryAction {
  name: string,
  action: (item: InventoryItem, count: number) => void;
}

interface PersonSell {
  id: string;
  count: number;
}

declare interface Array<T> {
  first(predicate: (value: T) => boolean): T;
  remove(predicate: (value: T) => boolean): Array<T>;
}

/*
id: hat_seller
name: hat seller
sells:
  - id: item__hat
    count: 5
 */
