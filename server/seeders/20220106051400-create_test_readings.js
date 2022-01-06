'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let readings = []
    for (var i = 0; i < 10; i++){
      readings.push({
        temperature: 10 + (i/10),
        humidity: 40 + (i/10),
        light: 12 + (i/10),
        createdAt: new Date(),
        updatedAt: new Date()  
      })
    }
    await queryInterface.bulkInsert('readings', readings, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('readings', null, {});
  }
};
