var HarvesterCreep = require("./Creeps/HarvesterCreep");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");

module.exports.loop = function () {
  const tick = Game.time;
  console.log(`Game Tick ${tick}`);

  if (tick === 1) {
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "Harvy-1", {
      memory: { role: "harvester" },
    });
  }

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
      HarvesterCreep.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
  }
};
