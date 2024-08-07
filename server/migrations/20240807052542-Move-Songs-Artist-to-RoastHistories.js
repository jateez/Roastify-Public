'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.dropTable("Songs")
    await queryInterface.dropTable("Artists")
    await queryInterface.addColumn("RoastHistories", "tracks", {
      type: Sequelize.JSONB
    })
    await queryInterface.addColumn("RoastHistories", "artists", {
      type: Sequelize.JSONB
    })
    await queryInterface.addColumn("Users", "imageUrl", {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
