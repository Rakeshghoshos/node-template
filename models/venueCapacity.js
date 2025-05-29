module.exports = (sequelize, DataTypes) => {
  const VenueCapacity = sequelize.define(
    "VenueCapacity",
    {
      venueInformation: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      lteSpectrum: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      nrSpectrum: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      optional: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      results: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      user: {
        type: DataTypes.JSONB,
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
      tableName: "venue_capacities",
      timestamps: true,
    }
  );

  return VenueCapacity;
};
