module.exports = (sequelize, DataTypes) => {
  const SpectrumSpeed = sequelize.define(
    "SpectrumSpeed",
    {
      technology: {
        type: DataTypes.ENUM(
          "LTE T  TDD",
          "LTE TDD Scell",
          "NR TDD",
          "LTE F FDD",
          "LTE FDD Scell",
          "NR FDD",
          "LAA"
        ),
        allowNull: false,
      },
      band: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      systemType: {
        type: DataTypes.ENUM("SISO", "2x2 MIMO", "4x4 MIMO", "mmW"),
        allowNull: false,
      },
      bandwidth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dlSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      ulSpeed: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      carriersAvailable: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
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
      tableName: "spectrum_speeds",
      timestamps: true,
    }
  );

  return SpectrumSpeed;
};
