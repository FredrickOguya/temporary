module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn(
      'sessions',
      'updtated_at',
      'updated_at'
    )
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn(
      'sessions',
      'updated_at',
      'updtated_at'
    )
  },

}