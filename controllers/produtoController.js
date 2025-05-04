const CategoriaModel = require("../models/categoriaModel");
const MarcaModel = require("../models/marcaModel");
const ProdutoModel = require("../models/produtoModel");
const fs = require("fs");

class ProdutoController {

    async listarView(req, res) {
        let prod = new ProdutoModel();
        let lista = await prod.listarProdutos();
        res.render('produto/listar', {lista: lista});
    }

    async excluirProduto(req, res){
        var ok = true;
        if(req.body.codigo != "") {
            let produto = new ProdutoModel();
            ok = await produto.excluir(req.body.codigo);
        }
        else{
            ok = false;
        }

        res.send({ok: ok});
    }
    async cadastrarProduto(req, res){
        var ok = true;
        console.log(req.body);
        if(req.body.codigo != "" && req.body.nome != "" && 
        req.body.quantidade != "" && req.body.quantidade  != '0' && 
        req.body.marca != '0' && req.body.categoria  != '0'
        && req.body.valor != '0' && req.file != null) {
            let produto = new ProdutoModel(0, req.body.codigo, 
                req.body.nome, req.body.quantidade, req.body.valor, req.file.filename,
                req.file.mimetype.split("/").pop(),
                req.body.categoria, req.body.marca, "", "");

            ok = await produto.gravar();
        }
        else{
            ok = false;
        }

        res.send({ ok: ok })
    }

    async alterarView(req, res){
        let produto = new ProdutoModel();
        let marca = new MarcaModel();
        
        let categoria = new CategoriaModel();
        if(req.params.id != undefined && req.params.id != ""){
            produto = await produto.buscarProduto(req.params.id);
        }

        let listaMarca = await marca.listarMarcas();
        let listaCategoria = await categoria.listarCategorias();
        res.render("produto/alterar", {produtoAlter: produto, listaMarcas: listaMarca, listaCategorias: listaCategoria});
    }

    async alterarProduto(req, res) {
        var ok = true;
        if(req.body.codigo != "" && req.body.nome != "" && req.body.quantidade != "" && req.body.valor != "" && req.body.quantidade  != '0' && req.body.marca != '0' && req.body.categoria  != '0') {

            let produto = new ProdutoModel(req.body.id, req.body.codigo, req.body.nome, req.body.quantidade, req.body.valor, null, null, req.body.categoria, req.body.marca, "", "");

            //verificar se o arquivo veio;
            let produtoOld = await produto.buscarProduto(req.body.id);
            if(req.file != null) {
                produto.produtoImagem = req.file.filename;
                produto.produtoImgExtensao = req.file.mimetype.split("/").pop();
                //apagar a imagem antiga;
                let imagemAntiga = produtoOld.produtoImagem.split("/").pop();
                if(fs.existsSync(global.CAMINHO_DIRETORIO + imagemAntiga)) {
                    fs.unlinkSync(global.CAMINHO_DIRETORIO + imagemAntiga);
                }
            }
            else{
                produto.produtoImagem = produtoOld.produtoImagem.split("/").pop();
                produto.produtoImgExtensao = produtoOld.produtoImgExtensao;
            }

            ok = await produto.gravar();
        }
        else{
            ok = false;
        }

        res.send({ ok: ok })
    }

    async cadastroView(req, res) {

        let listaMarcas = [];
        let listaCategorias = [];

        let marca = new MarcaModel();
        listaMarcas = await marca.listarMarcas();

        let categoria = new CategoriaModel();
        listaCategorias = await categoria.listarCategorias();

        res.render('produto/cadastro', { listaMarcas: listaMarcas, listaCategorias: listaCategorias });
    }
}

module.exports = ProdutoController;