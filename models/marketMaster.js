module.exports = (sequelize, DataTypes) => {
  const Market = sequelize.define(
    "MarketMaster",
    {
      marketId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      marketName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extraDetails: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "markets",
      timestamps: true,
    }
  );

  return Market;
};
