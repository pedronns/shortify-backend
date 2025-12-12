// test-create.js
require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');

// Configuração do Sequelize usando variáveis do .env
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

// Definição do model Link
class Link extends Model {}
Link.init(
  {
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    passwordHash: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    protected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    custom: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Link',
    tableName: 'Links', // opcional, se quiser nome explícito
  }
);

// Função de teste para criar um link
async function testCreate() {
  try {
    // Testa a conexão
    await sequelize.authenticate();
    console.log('Conexão com Neon OK!');

    await sequelize.sync({ force: false })

    // Cria o link
    const link = await Link.create({
      url: 'https://example.com',
      code: 'teste123',
      clicks: 0,
      protected: false,
      custom: false,
    });

    console.log('Criado:', link.toJSON());
  } catch (err) {
    console.error('Erro na criação:', err);
  } finally {
    await sequelize.close();
  }
}

testCreate();
