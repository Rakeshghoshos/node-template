module.exports = (sequelize, DataTypes) => {
  const VenueProfile = sequelize.define(
    "VenueProfileMaster",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dlLTESpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      ulLTESpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dlNRSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      upNRSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dlFR2NRSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dlActivityFactor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      ulActivityFactor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dlIncrease: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      ulIncrease: {
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
      tableName: "venue_profiles",
      timestamps: true,
    }
  );

  return VenueProfile;
};
