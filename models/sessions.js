const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");
class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'session',
  tableName: 'sessions',
})

module.exports = Session