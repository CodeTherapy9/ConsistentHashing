module.exports = (sequelize, Sequelize) => {
    const Server_Live = sequelize.define("server_live", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
      },
      server_port: {
        type: Sequelize.STRING,
        unique:true,
        allowNull:false

      },
      server_status: {
        type: Sequelize.TINYINT,
        allowNull:false
      }
    },{freezeTableName: true,createdAt:false,updatedAt:false});
  
    return Server_Live;
  };