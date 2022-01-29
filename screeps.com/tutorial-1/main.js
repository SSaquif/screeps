// module.exports.loop = function () {
//     var creep = Game.creeps['Harvester1'];
//     var sources = creep.room.find(FIND_SOURCES);
//     if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
//         creep.moveTo(sources[0]);
//     }
// }

// module.exports.loop = function () {
//     var creep = Game.creeps['Harvester1'];

//     if(creep.store.getFreeCapacity() > 0) {
//         var sources = creep.room.find(FIND_SOURCES);
//         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
//             creep.moveTo(sources[0]);
//         }
//     }
//     else {
//         if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
//             creep.moveTo(Game.spawns['Spawn1']);
//         }
//     }
// }

// module.exports.loop = function () {
//     for(var name in Game.creeps) {
//         var creep = Game.creeps[name];

//         if(creep.store.getFreeCapacity() > 0) {
//             var sources = creep.room.find(FIND_SOURCES);
//             if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(sources[0]);
//             }
//         }
//         else {
//             if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(Game.spawns['Spawn1']);
//             }
//         }
//     }
// }

// var roleHarvester = require('role.harvester');

// module.exports.loop = function () {

//     for(var name in Game.creeps) {
//         var creep = Game.creeps[name];
//         roleHarvester.run(creep);
//     }
// }

const RoleHarvester = require("./role.harvester");

const gameLoop = () => {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    RoleHarvester.run(creep);
  }
};

module.exports = gameLoop;
