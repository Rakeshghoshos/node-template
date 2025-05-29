module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "UserMaster",
    {
      name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      mobile: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "",
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
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
