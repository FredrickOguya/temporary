const { down } = require('./20261029000000-create-initial-tables')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: require('sequelize').DataTypes.INTEGER,
      allowNull: true,
    })

    await queryInterface.sequelize.query(
      `UPDATE blogs SET year = ${new Date().getFullYear()} WHERE year IS NULL`
    )

    await queryInterface.changeColumn('blogs', 'year', {
      type: require('sequelize').DataTypes.INTEGER,
      allowNull: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}