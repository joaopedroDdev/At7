document.addEventListener("DOMContentLoaded", function(){

    var btnGravar = document.getElementById("btnGravar");
    var inputArquivo = document.getElementById("inputArquivo");
    btnGravar.addEventListener("click", gravarProduto);
    inputArquivo.addEventListener("change", previaImagem);
})

function previaImagem() {
    //validar a extensão do arquivo antes de exibir
    console.log(this.files);

    if(this.files.length > 0) {
        let file = this.files[0];

        let ext = file.type.split("/").pop();
        if(ext == "png" || ext == "jpg" || ext == "jpeg") {
            //monta a imagem para ser exibida no <img>
            let url = URL.createObjectURL(file);
            document.getElementById("previaImagem").src = url;
            document.getElementById("divPrevia").style.display = "block";
        }
        else {
            alert("Selecione uma imagem com o formato correto! (jpg/png/jpeg)");
        }
    }
    else {
        alert("Nenhum imagem foi selecionada!");
    }
}

function gravarProduto() {
    var inputCodigo = document.getElementById("inputCodigo");
    var inputNome = document.getElementById("inputNome");
    var inputQtde = document.getElementById("inputQtde");
    var selMarca = document.getElementById("selMarca");
    var selCategoria = document.getElementById("selCategoria");
    var inputValor = document.getElementById("inputValor");
    var inputArquivo = document.getElementById("inputArquivo");

    //if de validação básica
    if(inputCodigo.value != "" && inputNome.value != "" && inputQtde.value != "" && inputQtde.value != '0' && selMarca.value != '0' && selCategoria.value != '0' &&
        inputValor.value != "" && inputValor.value > 0 &&
        inputArquivo.files.length > 0
    ){

        var form = new FormData();
        form.set("codigo", inputCodigo.value);
        form.set("nome", inputNome.value);
        form.set("quantidade", inputQtde.value);
        form.set("marca", selMarca.value);
        form.set("categoria", selCategoria.value);
        form.set("valor", inputValor.value);
        form.set("imagem", inputArquivo.files[0]);
        form.set("ext", inputArquivo.files[0].type.split("/").pop());

        fetch('/produto/cadastro', {
            method: "POST",
            body: form
        })
        .then(r => {
            return r.json();
        })
        .then(r=> {
            if(r.ok) {
                alert("Produto cadastrado!");
            }
            else{
                alert("Erro ao cadastrar produto");
            }
        })
        .catch(e => {
            console.log(e);
        })

    }
    else{
        alert("Preencha todos os campos corretamente!");
        return;
    }
}