module.exports = (sequelize, Sequelize) => {
    const Analytics = sequelize.define("analytics", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
      },
      server: {
        type: Sequelize.STRING,
        allowNull:false

      },
      status: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      timestamp:{
        type:Sequelize.DATE,
        defaultValue: null
      },
      rid:{
        type:Sequelize.STRING(45),
        defaultValue:null
      }
    },{freezeTableName: true,createdAt:false,updatedAt:false});
  
    return Analytics;
  };