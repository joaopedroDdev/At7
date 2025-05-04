const Database = require('../db/database');

const conexao = new Database();
class ProdutoModel {

    #produtoId;
    #produtoCodigo;
    #produtoNome;
    #produtoQuantidade;
    #produtoValor;
    #produtoImagem;
    #produtoImgExtensao;
    #categoriaId;
    #categoriaNome;
    #marcaId;
    #marcaNome;

    get produtoId() { return this.#produtoId; } set produtoId(produtoId) {this.#produtoId = produtoId;}
    get produtoCodigo() { return this.#produtoCodigo; } set produtoCodigo(produtoCodigo) {this.#produtoCodigo = produtoCodigo;}
    get produtoNome() { return this.#produtoNome; } set produtoNome(produtoNome) {this.#produtoNome = produtoNome;}
    get produtoQuantidade() { return this.#produtoQuantidade; } set produtoQuantidade(produtoQuantidade) {this.#produtoQuantidade = produtoQuantidade;}
    get produtoValor() { return this.#produtoValor; } set produtoValor(produtoValor) {this.#produtoValor = produtoValor;}
    get produtoImagem() { return this.#produtoImagem; } set produtoImagem(produtoImagem) {this.#produtoImagem = produtoImagem;}
    get produtoImgExtensao() { return this.#produtoImgExtensao; } set produtoImgExtensao(produtoImgExtensao) {this.#produtoImgExtensao = produtoImgExtensao;}
    get categoriaId() { return this.#categoriaId; } set categoriaId(categoriaId) {this.#categoriaId = categoriaId;}
    get categoriaNome() { return this.#categoriaNome; } set categoriaNome(categoriaNome) {this.#categoriaNome = categoriaNome;}
    get marcaId() { return this.#marcaId; } set marcaId(marcaId) {this.#marcaId = marcaId;}
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) {this.#marcaNome = marcaNome;}

    constructor(produtoId, produtoCodigo, produtoNome, produtoQuantidade, produtoValor, produtoImagem, produtoImgExtensao, categoriaId, marcaId, categoriaNome, marcaNome) {
        this.#produtoId = produtoId;
        this.#produtoCodigo = produtoCodigo;
        this.#produtoNome = produtoNome;
        this.#produtoQuantidade = produtoQuantidade;
        this.#produtoValor = produtoValor;
        this.#produtoImagem = produtoImagem;
        this.#produtoImgExtensao = produtoImgExtensao;
        this.#categoriaId = categoriaId;
        this.#categoriaNome = categoriaNome;
        this.#marcaId = marcaId;
        this.#marcaNome = marcaNome;
    }

    async excluir(codigo){
        let sql = "delete from tb_produto where prd_id = ?"
        let valores = [codigo];

        var result = await conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async gravar() {
        if(this.#produtoId == 0){
            let sql = "insert into tb_produto (prd_cod, prd_nome, prd_quantidade, cat_id, mar_id, prd_valor, prd_imagem, prd_imgextensao) values (?, ?, ?, ?, ?, ?, ?, ?)";

            let valores = [this.#produtoCodigo, this.#produtoNome, this.#produtoQuantidade, this.#categoriaId, this.#marcaId, this.#produtoValor, this.#produtoImagem, this.#produtoImgExtensao];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
        else{
            //alterar
            let sql = "update tb_produto set prd_cod = ?, prd_nome =?, prd_quantidade= ?, cat_id = ?, mar_id = ?, prd_imagem = ?, prd_imgextensao = ?, prd_valor = ? where prd_id = ?";

            let valores = [this.#produtoCodigo, this.#produtoNome, 
                this.#produtoQuantidade, 
                this.#categoriaId, 
                this.#marcaId, this.#produtoImagem, this.#produtoImgExtensao, this.#produtoValor, this.#produtoId];

            return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
        }
    }

    async buscarProduto(id){
        let sql = 'select * from tb_produto where prd_id = ? order by prd_id';
        let valores = [id];
        var rows = await conexao.ExecutaComando(sql, valores);

        let produto = null;

        if(rows.length > 0){
            var row = rows[0];

            let imagem = "";
            
            produto = new ProdutoModel(row['prd_id'], 
            row['prd_cod'], row['prd_nome'], row['prd_quantidade'], row["prd_valor"],
            row["prd_imagem"], row["prd_imgextensao"], 
            row['cat_id'], row['mar_id'], "", "");

            if(row["prd_imagem"] != null) {
                produto.produtoImagem = global.CAMINHO_IMG_BROWSER + row["prd_imagem"];
            }
            else {
                produto.produtoImagem = global.CAMINHO_IMG_BROWSER + "produto-sem-imagem.webp";
            }

        }

        return produto;
    }

    async listarProdutos() {

        let sql = 'select * from tb_produto p inner join tb_categoria c on p.cat_id = c.cat_id inner join tb_marca m on p.mar_id = m.mar_id order by prd_id';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){

                var row = rows[i];

                let img = global.CAMINHO_IMG_BROWSER + "produto-sem-imagem.webp";

                //para exibição de blob no html usando base64
                // if(row["prd_imagem"] != null)
                //     img = `data:image/${row["prd_imgextensao"]};base64,${row["prd_imagem"].toString("base64")}`;

                //para exibição no html com armazenamento local
                if(row["prd_imagem"] != null)
                    img = "img/produtos/" + row["prd_imagem"]

                listaRetorno.push(new ProdutoModel(row['prd_id'], 
                row['prd_cod'], row['prd_nome'], row['prd_quantidade'], row["prd_valor"], img, row["prd_imgextensao"], 
                row['cat_id'], row['mar_id'], row['cat_nome'], row['mar_nome']));
            }
        }

        return listaRetorno;
    }

}

module.exports = ProdutoModel;