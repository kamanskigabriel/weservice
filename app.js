import express from "express"

const app = express()
app.use(express.json())

// "Banco de dados" em memória -----------------------------------------
let livros = [
    {
        id: 1,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        disponivel: true
    },
    {
        id: 2,
        titulo: "O Cortiço",
        autor: "Aluísio Azevedo",
        disponivel: true
    },
    {
        id: 3,
        titulo: "1984",
        autor: "George Orwell",
        disponivel: false
    }
]

// Rota de apoio ---------------------------------------------------------
app.get("/status", (req, res) => {
    res.status(200).json({ status: "ok" })
})

// GET /livros -------------------------------------------------------------
// Lista todos os livros. Aceita filtro opcional por query string:
// /livros?autor=orwell     -> filtra por autor (parcial, sem case sensitive)
// /livros?titulo=dom       -> filtra por título (parcial, sem case sensitive)
// /livros?disponivel=true  -> filtra por disponibilidade
app.get("/livros", (req, res) => {
    const { autor, titulo, disponivel } = req.query

    let resultado = livros

    if (autor) {
        resultado = resultado.filter((l) =>
            l.autor.toLowerCase().includes(autor.toLowerCase())
        )
    }

    if (titulo) {
        resultado = resultado.filter((l) =>
            l.titulo.toLowerCase().includes(titulo.toLowerCase())
        )
    }

    if (disponivel !== undefined) {
        const filtroDisponivel = disponivel === "true"
        resultado = resultado.filter((l) => l.disponivel === filtroDisponivel)
    }

    res.status(200).json(resultado)
})

// GET /livros/:id -----------------------------------------------------------
app.get("/livros/:id", (req, res) => {
    const livro = livros.find((l) => l.id === Number(req.params.id))

    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" })
    }

    res.status(200).json(livro)
})

// POST /livros --------------------------------------------------------------
app.post("/livros", (req, res) => {
    const titulo = req?.body?.titulo || null
    const autor = req?.body?.autor || null
    const disponivel = req?.body?.disponivel

    if (!titulo) {
        return res.status(400).json({ erro: "Título é obrigatório" })
    }

    if (!autor) {
        return res.status(400).json({ erro: "Autor é obrigatório" })
    }

    const novoId = livros.length > 0
        ? Math.max(...livros.map((l) => l.id)) + 1
        : 1

    const novoLivro = {
        id: novoId,
        titulo,
        autor,
        disponivel: typeof disponivel === "boolean" ? disponivel : true
    }

    livros.push(novoLivro)

    res.status(201).json(novoLivro)
})

// PUT /livros/:id -------------------------------------------------------
app.put("/livros/:id", (req, res) => {
    const livro = livros.find((l) => l.id === Number(req.params.id))

    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" })
    }

    if (req?.body?.titulo && req.body.titulo !== "") {
        livro.titulo = req.body.titulo
    }

    if (req?.body?.autor && req.body.autor !== "") {
        livro.autor = req.body.autor
    }

    if (typeof req?.body?.disponivel === "boolean") {
        livro.disponivel = req.body.disponivel
    }

    res.status(200).json(livro)
})

// DELETE /livros/:id ----------------------------------------------------
app.delete("/livros/:id", (req, res) => {
    const indice = livros.findIndex((l) => l.id === Number(req.params.id))

    if (indice === -1) {
        return res.status(404).json({ erro: "Livro não encontrado" })
    }

    livros.splice(indice, 1)

    res.status(204).send()
})

// Função utilitária usada apenas pelos testes, para resetar o estado
// da lista em memória entre um teste e outro.
export function resetLivros() {
    livros = [
        { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", disponivel: true },
        { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", disponivel: true },
        { id: 3, titulo: "1984", autor: "George Orwell", disponivel: false }
    ]
}

export default app
