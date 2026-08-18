// tests/produtos.test.js
const request = require("supertest");
const app = require("../index");

test("POST /produtos cria um novo produto", async () => {
    const resposta = await request(app).post("/produtos").send(
        {
            nome: "Mouse",
            marca: "Multilaser"
        }
    );
    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe("Mouse");
    expect(resposta.body.marca).toBe("Multilaser");
}); 