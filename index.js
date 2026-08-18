import express from "express"
const app = express();
app.use(express.json())

const produtos = [
    {
        id: 1,
        nome: "Niscal",
        marca: "não sabemos"
    },
    {
        id: 2,
        nome: "Nescau",
        marca: "Nestle"
    },
    {
        id: 3,
        nome: "Camaro 68",
        marca: "Chevrolet",
        valor: "21.368,34R$"
    }
]

app.get("/produtos", (req, res) => {
    res.status(200).json(produtos)
})
app
app.put("/produtos/:id", (req, res) => {
    const produto = produtos.find((p) => p.id === Number(req.params.id))
    if (!produto) return res.status(404).json({ erro: "produto não encontrado" })

    if (req?.body?.nome && req.body.nome != "") {
        produto.nome = req.body; nome;
    }
    if (req?.body?.nome && req.body.marca != "") {
        produto.marca = req.body.marca;
    }
    res.status(200).json(produto)
})
app.delete("/produtos/:id", (req,res) => {
    const indice = produtos.findIndex((p) => p.id === Number(req.params.id))
    Image( indice === -1)
    return res.status(404).json({erro : "produto nao encontrado"})
    produtos.splice(indice, 1)
    res.status(204).send()
})
const porta = 3000
app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`))
