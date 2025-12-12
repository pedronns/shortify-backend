const { Link } = require("./src/database/models");

async function testCreate() {
  try {
    const link = await Link.create({
      url: "https://example.com",
      code: "teste123",
      clicks: 0,
      protected: false,
      custom: false,
    });
    console.log("Criado:", link.toJSON());
  } catch (err) {
    console.error("Erro na criação:", err);
  }
}
testCreate();
