# Quick Scripts

<!-- toc -->

- [Intro:Buiding a Creep with Memory & Suicide](#introbuiding-a-creep-with-memory--suicide)
- [Upgrading Controller](#upgrading-controller)
- [Harvesting](#harvesting)
  - [Example `Tutorial 3`](#example-tutorial-3)
- [Auto-spawn Creeps](#auto-spawn-creeps)
  - [Freeing Memory](#freeing-memory)
  - [Example](#example)
  - [Code](#code)
- [Defending Your Room](#defending-your-room)
  - [Create Construction Site](#create-construction-site)

<!-- tocstop -->

## Intro:Buiding a Creep with Memory & Suicide

```js
Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "Builder1", {
  memory: { role: "builder" },
});
// kill creep using name
Game.creeps["Harvester1"].suicide();
```

## Upgrading Controller

> Tutorial 2

Controller is invincible

By upgrading your Controller, constructing new extensions and more powerful creeps, you considerably improve the effectiveness of your colony work. Also, by replacing a lot of small creeps with fewer large ones, you save CPU resources on controlling them which is an important prerequisite to play in the online mode.

In the next section, we’ll talk about how to set up the automatic manufacturing of new creeps.

## Harvesting

> Tutorial 1 and Tuorial 3

### Example `Tutorial 3`

In total, we have 550 energy units in our spawn and extensions. It is enough to build a creep with the body [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE]. This creep will work 4 times faster than a regular worker creep. Its body is heavier, so we’ll add another MOVE to it. However, two parts are still not enough to move it at the speed of a small fast creep which would require 4xMOVEs or building a road.

```js
//create harvester
Game.spawns["Spawn1"].spawnCreep(
  [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  "HarvesterBig",
  { memory: { role: "harvester" } }
);
```

## Auto-spawn Creeps

Until now, we have created new creeps directly in the console. It’s not a good idea to do it constantly since the very idea of Screeps is making your colony control itself. You will do well if you teach your spawn to produce creeps in the room on its own.

This is a rather complicated topic and many players spend months perfecting and refining their auto-spawning code. But let’s try at least something simple and master some basic principles to start with.

### Freeing Memory

An important point here is that the memory of dead creeps is not erased but kept for later reuse. If you create creeps with random names each time it may lead to memory overflow, so you should clear it in the beginning of each tick (prior to the creep creation code).

### Example

> tutorial 4

Let’s say we want to have at least two harvesters at any time. The easiest way to achieve this is to run StructureSpawn.spawnCreep each time we discover it’s less than this number. You may not define its name (it will be given automatically in this case), but don’t forget to define the needed role.

We may also add some new RoomVisual call in order to visualize what creep is being spawned.

Add the logic for `StructureSpawn.spawnCreep` in your main module.

Documentation:

- StructureSpawn.spawnCreep
- RoomVisual

### Code

```js
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");

module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  console.log("Harvesters: " + harvesters.length);

  if (harvesters.length < 2) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
  }
};
```

## Defending Your Room

Things to do

1. Enable `safe mode` for room, kinda like last resort
2. Create `Towers` on construction sites
3. `Towers` can `attack` and `heal`

```js
// room safe mode
Game.spawns["Spawn1"].room.controller.activateSafeMode();
```

### Create Construction Site

```js
Game.spawns["Spawn1"].room.createConstructionSite(23, 22, STRUCTURE_TOWER);
```

### Auto Repair

```js
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");

module.exports.loop = function () {
  var tower = Game.getObjectById("4144de38777c8b57f9547f83");
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
  }
};
```
