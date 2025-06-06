module.exports = (sequelize, DataTypes) => {
  const MarketShare = sequelize.define(
    "MarketShareMaster",
    {
      marketId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      TMOOnly: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      SPROnly: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      NTM: {
        type: DataTypes.FLOAT,
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
      tableName: "market_shares",
      timestamps: true,
    }
  );

  return MarketShare;
};
