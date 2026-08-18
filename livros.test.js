import request from "supertest"
import app, { resetLivros } from "../app.js"

// Antes de cada teste, restaura a lista de livros ao estado inicial,
// para que os testes não dependam da ordem de execução.
beforeEach(() => {
    resetLivros()
})

describe("GET /livros", () => {
    test("deve retornar 200 e a lista completa de livros", async () => {
        const res = await request(app).get("/livros")

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBe(3)
    })

    test("deve retornar 200 e filtrar por autor", async () => {
        const res = await request(app).get("/livros?autor=orwell")

        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
        expect(res.body[0].titulo).toBe("1984")
    })

    test("deve retornar 200 e filtrar por disponibilidade", async () => {
        const res = await request(app).get("/livros?disponivel=false")

        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
        expect(res.body[0].disponivel).toBe(false)
    })
})

describe("GET /livros/:id", () => {
    test("deve retornar 200 e o livro quando o id existir", async () => {
        const res = await request(app).get("/livros/1")

        expect(res.status).toBe(200)
        expect(res.body.titulo).toBe("Dom Casmurro")
    })

    test("deve retornar 404 quando o id não existir", async () => {
        const res = await request(app).get("/livros/999")

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("erro")
    })
})

describe("POST /livros", () => {
    test("deve retornar 201 e criar um novo livro", async () => {
        const novoLivro = {
            titulo: "O Alquimista",
            autor: "Paulo Coelho",
            disponivel: true
        }

        const res = await request(app).post("/livros").send(novoLivro)

        expect(res.status).toBe(201)
        expect(res.body).toMatchObject(novoLivro)
        expect(res.body.id).toBe(4)
    })

    test("deve retornar 400 quando o título não for informado", async () => {
        const res = await request(app).post("/livros").send({ autor: "Autor sem título" })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("erro")
    })

    test("deve retornar 400 quando o autor não for informado", async () => {
        const res = await request(app).post("/livros").send({ titulo: "Livro sem autor" })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("erro")
    })
})

describe("PUT /livros/:id", () => {
    test("deve retornar 200 e atualizar o livro quando o id existir", async () => {
        const res = await request(app)
            .put("/livros/1")
            .send({ disponivel: false })

        expect(res.status).toBe(200)
        expect(res.body.disponivel).toBe(false)
        expect(res.body.titulo).toBe("Dom Casmurro") // campo não enviado permanece igual
    })

    test("deve retornar 404 quando o id não existir", async () => {
        const res = await request(app)
            .put("/livros/999")
            .send({ titulo: "Não existe" })

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("erro")
    })
})

describe("DELETE /livros/:id", () => {
    test("deve retornar 204 e remover o livro quando o id existir", async () => {
        const res = await request(app).delete("/livros/2")

        expect(res.status).toBe(204)

        const confirmacao = await request(app).get("/livros/2")
        expect(confirmacao.status).toBe(404)
    })

    test("deve retornar 404 quando o id não existir", async () => {
        const res = await request(app).delete("/livros/999")

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("erro")
    })
})
