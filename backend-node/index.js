import express from 'express'
import { Sequelize, DataTypes } from 'sequelize'

const app = express()

app.use(express.json())//precisa colocar senão dá erro no postman

const sequelize = new Sequelize('senai', 'root', '', { host: 'localhost', dialect: 'mysql' })//conecta a aplicação com o BD, que é o senai

const Produto = sequelize.define('Produto', {//esse é o model
    nome: DataTypes.STRING,
    preco: DataTypes.DECIMAL(10, 2),
    quantidade: DataTypes.INTEGER
}, { tableName: 'produtos' })


app.post('/produtos', async (req, res) => { //essa rota /produtos, cadastra e precisa usar o body vc deve colocar o nome e trará está resposta
    const produto = {
        nome: req.body.nome,
        preco: req.body.preco,
        quantidade: req.body.quantidade
    }

    if (!produto.nome.trim()) {   //se no body tiver algo vazio cai nessa validação do if, o código será interrompido, pois tem um erro
        return res.status(400).json(
            {
                "mensagem": "Nome é obrigatório"
            }
        )
    }

    try {//o try significa que vai tentaar cadastrar , se não conseguir aparecer essa msgem docatch
        const produtoCadastrado = await Produto.create(produto)
        res.status(201).json(produtoCadastrado)
    } catch (erro) {
        res.status(500).send("Erro ao cadastrar produto")
    }
})

app.get('/produtos', async (req, res) => { //vai listar os produtos 
    try {
        const produtos = await Produto.findAll()
        res.status(200).json(produtos)
    } catch (erro) {
        res.status(500).send("Erro ao listar produtos")
    }
})

app.get('/produtos/:id', async (req, res) => { //vai buscar pelo id os produtos 
    try {
        const produto = await Produto.findByPk(req.params.id)

        if (!produto) {
            return res.status(400).json({ 'mensagem': 'Produto não encontrado' })
        }

        res.status(200).json(produto)
    } catch (erro) {
        res.status(500).send("Erro ao listar produtos")
    }
})
app.put('/produtos/:id', async (req, res) => { //vai atualizar pelo id os produtos 

    const dadosAtualizados = {
         nome: req.body.nome,
         preco: req.body.preco,
         quantidade: req.body.quantidade,
    }

    if (!dadosAtualizados.nome){
        return res.status(400).json({ 'mensagem': 'Nome é não obrigatório' })
    }
    try {
        const produto = await Produto.findByPk(req.params.id)

        if (!produto) { //produto minúsculo é que ele encontrou pelo id, o  objeto
            return res.status(404).json({ 'mensagem': 'Produto não encontrado' })
        }

        await produto.update(dadosAtualizados)
        res.status(200).json(produto)

    } catch (erro) {
        res.status(500).send("Erro ao atualizar produtos")
    }
})



app.delete('/produtos/:id', async (req, res) => { //vai deletar pelo id os produtos 
    console.log('qlquer ')

    try {
        const produto = await Produto.findByPk(req.params.id) // Produto maiúsculo é o do model

        if (!produto) { //produto minúsculo é que ele encontrou pelo id, o  objeto
            return res.status(400).json({ 'mensagem': 'Produto não encontrado' })
        }

        await produto.destroy()
        res.status(204).send()

    } catch (erro) {
        res.status(500).send("Erro ao excluir produtos")
    }
})

async function iniciar() { //função p chamar o BD
    try {
        await sequelize.sync()
        app.listen(3000, () => {
            console.log("Servidor rodando em http://localhost:3000")
        })
    } catch (erro) {
        console.error(erro.message)
    }

}

iniciar() //to chamando a função de cima


