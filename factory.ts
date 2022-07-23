// 2D vector
type Vec = {readonly x: number, readonly y: number}

// the "type" of an item carried on conveyor belts
enum ItemType {
  Void,
  Number,
  String,
  Product,
  Sum
}

// an item (piece of data) carried on conveyor belts
type Item
  = { readonly itemType: ItemType.Void }
  | { readonly itemType: ItemType.Number,  readonly val: number }
  | { readonly itemType: ItemType.String,  readonly val: string }
  | { readonly itemType: ItemType.Product, readonly fst: Item, readonly snd: Item }
  | { readonly itemType: ItemType.Sum,     readonly tag: boolean, readonly val: Item }

// a factory machine
// can be either a conveyor belt or a machine that actually does stuff (takes inputs and outputs)
type Machine
  = {
    readonly isConveyor: true; // we have a conveyor belt
    readonly pos: Vec; // position
    // size is assumed to be 1x1 square
    readonly inpPorts: Vec[]; // positions (relative to `pos`) of all the input ports
    readonly otpPorts: Vec[]; // positions (relative to `pos`) of all the output ports
  } | {
    readonly isConveyor: false; // we're dealing with a machine that does stuff (takes inputs and outputs), not a conveyor belt
    readonly pos: Vec; // position
    readonly size: Vec; // number of squares it takes up in each dimension
    readonly inpPorts: Vec[]; // positions (relative to `pos`) of all the input ports
    readonly otpPorts: Vec[]; // positions (relative to `pos`) of all the output ports
    // run the machine for one tick
    // takes the items at all the input ports (or undefined if there is no item at this port)
    // returns undefined if the machine doesn't do anything
    // if it returns (Item | undefined)[], this means that it consumed all the items at the input ports
    // and is outputting things to its output ports
    // the length of the (Item | undefined)[] array should be the same as the length of machine.otpPorts:
    // for each port we get what item we want to push to that port
    readonly run: (inputs: (Item | undefined)[]) => ((Item | undefined)[]) | undefined;
  }

// map from 2d location to item
type Map2D<t> = {[x: number]: {[y: number]: t}};

// state of the factory simulation
// a 2d map of all machines and items
type SimState = {
  machines: Map2D<Machine>;
  items: Map2D<Item>;
}

// add 2 vectors together, returning the new vector
function addVecs(a: Vec, b: Vec): Vec {
  return {x: a.x + b.x, y: a.y + b.y}
}

// lookup an item in a 2D map
function lookup<t>(i: Vec, m: Map2D<t>): t | undefined {
  return m[i.x][i.y];
}

// assign an item in a 2D map
function assign<t>(i: Vec, v: t | undefined, m: Map2D<t>) {
  m[i.x][i.y] = v;
}

// list all keys in a 2D map
function allKeys<t>(m: Map2D<t>): Vec[] {
  // TODO how?
  return [];
}

// iterate over a 2D map
function foreach2D<t>(m: Map2D<t>, f: (key: Vec, item: t) => void) {
  // TODO
}

// run the simulation for one frame
// writes over the old state with a new one
// machines won't be affected by this function (so far), only items
function tickSimState(state: SimState) {
  foreach2D(state.machines, (key: Vec, machine: Machine) => {
    if (machine.isConveyor === true) {
      // TODO
      // conveyor belts can hold stuff on them :)
    } else {
      let inputs = machine.inpPorts.map((portLoc: Vec) => {
        let offsetPort = addVecs(portLoc, machine.pos)
        return lookup(offsetPort, state.items)
      })
      let outputs = machine.run(inputs)
      if (outputs === undefined) return
      for (var i = 0; i < machine.otpPorts.length; i++) {
        let portPosition = addVecs(machine.otpPorts[i], machine.pos)
        assign(portPosition, outputs[i], state.items) // TODO this can overwrite an existing item
      }
    }
  })
}
