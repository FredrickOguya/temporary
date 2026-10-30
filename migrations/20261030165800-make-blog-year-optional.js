module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('blogs', 'year', {
      type: require('sequelize').DataTypes.INTEGER,
      allowNull: true,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('blogs', 'year', {
      type: require('sequelize').DataTypes.INTEGER,
      allowNull: false,
    })
  },
}