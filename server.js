const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true}))
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://rhuangalvao:engcomp123@representacao.fl10y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var ObjectId = require('mongodb').ObjectID;

const gdrive = require("./gdrive");
const fs = require('fs');
const xl = require('excel4node');

MongoClient.connect(uri, (err, client) => {
  if(err) return console.log(err)
  db = client.db('representacao')
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  })
})
app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
  res.render('index.ejs')
})
app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

//Rotas do CRUD PORTA ----------------------------------------------------------
//CREATE
app.get('/portas/create', (req, res) => {
    res.render('portas/create.ejs')
})
//SHOW
app.get('/portas/show', (req, res) => {
    db.collection('portas').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('portas/show.ejs', { data: results })
    })
})
app.post('/portas/show', (req, res) => {
    db.collection('portas').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/portas/show')
    })
})
//EDIT
app.route('/portas/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('portas').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('portas/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('portas').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/portas/show')
    console.log("Atualizado no banco de dados");
  })
})
//DELETE
app.route('/portas/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('portas').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/portas/show')
  })
})

//Rotas do CRUD ARGAMASSAS ARGACEL ----------------------------------------------------------
//CREATE
app.get('/argacel/create', (req, res) => {
    res.render('argacel/create.ejs')
})
//SHOW
app.get('/argacel/show', (req, res) => {
    db.collection('argacel').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('argacel/show.ejs', { data: results })
    })
})
app.post('/argacel/show', (req, res) => {
    db.collection('argacel').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/argacel/show')
    })
})
//EDIT
app.route('/argacel/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('argacel').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('argacel/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  if (nome.includes('REJUNTE')) {
    db.collection('argacel').find().toArray((err, results) => {
      if (err) return res.send(err)
      results.forEach(function(details) {
        if (details.nome.includes('REJUNTE')) {
          db.collection('argacel').updateOne({_id: ObjectId(details._id)}, {
            $set: {
              valor: valor
            }
          },(err, result)=>{
            if(err) return res.send(err)
            console.log("Atualizado no banco de dados");
          })
        }
      })
      res.redirect('/argacel/show')
    })
  }else {
    db.collection('argacel').updateOne({_id: ObjectId(id)}, {
      $set: {
        codigo: codigo,
        nome: nome,
        valor: valor
      }
    },(err, result)=>{
      if(err) return res.send(err)
      res.redirect('/argacel/show')
      console.log("Atualizado no banco de dados");
    })
  }
})
//DELETE
app.route('/argacel/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('argacel').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/argacel/show')
  })
})

//Rotas do CRUD VALOR PORTA ----------------------------------------------------------
//CREATE
app.get('/portas/valor/create', (req, res) => {
    res.render('portas/valor/create.ejs')
})
app.get('/portas/valor/atualizarChaveEstrangeiraTabelaPortas', (req, res) => {
    db.collection('portasValor').find().toArray((err, results1) => {
        if (err) return console.log(err)
        db.collection('portas').find().toArray((err, results2) => {
          results1.forEach(function(portaValor) {
            results2.forEach(function(porta) {
              if (portaValor.valor == porta.valor) {
                db.collection('portas').updateOne({_id: ObjectId(porta._id)}, {
                  $set: {
                    foreignValor: portaValor.descricao
                  }
                },(err, result)=>{
                  if(err) return res.send(err)
                  console.log("Atualizado foreignValor porta:" + porta.codigo);
                })
              }
            })
          })
          res.redirect('/portas/valor/show')
        })
    })
})
app.get('/portas/valor/atualizarValorTabelaPortas', (req, res) => {
    db.collection('portasValor').find().toArray((err, results1) => {
        if (err) return console.log(err)
        db.collection('portas').find().toArray((err, results2) => {
          results1.forEach(function(portaValor) {
            results2.forEach(function(porta) {
              if (portaValor.descricao == porta.foreignValor) {
                db.collection('portas').updateOne({_id: ObjectId(porta._id)}, {
                  $set: {
                    valor: portaValor.valor
                  }
                },(err, result)=>{
                  if(err) return res.send(err)
                  console.log("Atualizado valor porta:" + porta.codigo);
                })
              }
            })
          })
          res.redirect('/portas/valor/show')
        })
    })
})
//SHOW
app.get('/portas/valor/show', (req, res) => {
    db.collection('portasValor').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('portas/valor/show.ejs', { data: results })
    })
})
app.post('/portas/valor/show', (req, res) => {
    db.collection('portasValor').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/portas/valor/show')
    })
})
//EDIT
app.route('/portas/valor/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('portasValor').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('portas/valor/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var descricao = req.body.descricao
  var valor = req.body.valor

  db.collection('portasValor').updateOne({_id: ObjectId(id)}, {
    $set: {
      descricao: descricao,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/portas/valor/show')
    console.log("Atualizado no banco de dados");
  })
})
//DELETE
app.route('/portas/valor/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('portasValor').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/portas/valor/show')
  })
})

//Rotas do CRUD EMPRESA --------------------------------------------------------
//CREATE
app.get('/empresa/create', (req, res) => {
    res.render('empresa/create.ejs')
})
//SHOW
app.get('/empresa/show', (req, res) => {
    db.collection('empresa').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('empresa/show.ejs', { data: results })
    })
})
app.post('/empresa/show', (req, res) => {
    db.collection('empresa').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/empresa/show')
    })
})
//EDIT
app.route('/empresa/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('empresa').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('empresa/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var razaosocial = req.body.razaosocial
  var nomefantasia = req.body.nomefantasia
  var endereco = req.body.endereco
  var cidade = req.body.cidade
  var cep = req.body.cep
  var cnpj = req.body.cnpj
  var ie = req.body.ie
  var email = req.body.email
  var telefone = req.body.telefone
  var comprador = req.body.comprador

  db.collection('empresa').updateOne({_id: ObjectId(id)}, {
    $set: {
      razaosocial: razaosocial,
      nomefantasia: nomefantasia,
      endereco: endereco,
      cidade: cidade,
      cep: cep,
      cnpj: cnpj,
      ie: ie,
      email: email,
      telefone: telefone,
      comprador: comprador
    }
  },(err, result)=>{
    if(err) return res.send(err)
    db.collection('pedido').updateMany({razaosocial_id: id}, {
      $set: {
        empresa_nome: razaosocial,
        empresa_nome_fantasia: nomefantasia
      }
    },(err, result)=>{
      if(err) return res.send(err)
    })
    res.redirect('/empresa/show')
    console.log("Atualizado no banco de dados");
  })
})
//DELETE
app.route('/empresa/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('empresa').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/empresa/show')
  })
})


//Rotas do CRUD PEDIDO --------------------------------------------------------
//SHOW
app.get('/pedido/listarPedidos', (req, res) => {
    db.collection('pedido').find().toArray((err, results) => {
        if (err) return console.log(err)
        db.collection('empresa').find().toArray((err, result1) => {
            if (err) return console.log(err)
            res.render('pedido/listarPedidos.ejs', { pedidos: results, empresas: result1 })
        })
    })
})
//CREATE
app.get('/pedido/create', (req, res) => {
    db.collection('empresa').find().toArray((err, results) => {
        if (err) return console.log(err)
        db.collection('representada').find().toArray((err, results1) => {
            if (err) return console.log(err)
            res.render('pedido/create.ejs', { empresa: results, representada: results1 })
        })
    })
})

app.post('/pedido/salvarempresa', (req, res) => {
  db.collection('pedido').save(req.body, (err, result) => {
    if (err) return console.log(err)
  })
  db.collection('empresa').find({_id: ObjectId(req.body.razaosocial_id)}).toArray((err, result1) => {
    if (err) return console.log(err)
    db.collection('pedido').updateOne({_id: ObjectId(req.body._id)}, {
      $set: {
        empresa_nome: result1[0].razaosocial,
        empresa_nome_fantasia: result1[0].nomefantasia
      }
    },(err, result)=>{
      if(err) return res.send(err)
    })
  })
  var pedido = String(req.body._id)
  if (req.body.representada == "Portas Salete") {
    res.redirect('/pedido/create/adicionarProdutoSalete/'+pedido)
  }else if (req.body.representada == "Argamassas Argacel") {
    res.redirect('/pedido/create/adicionarProdutoArgacel/'+pedido)
  }
});

app.get('/pedido/create/adicionarProdutoSalete/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('portas').find().toArray((err, results1) => {
      if (err) return console.log(err)
      db.collection('tamanho').find().toArray((err, results2) => {
          if (err) return console.log(err)
          res.render('pedido/addProdutoSalete.ejs', { data1: results1, data2: results2, pedido_id: pedido_id })
      })
  })
})
app.get('/pedido/create/adicionarProdutoArgacel/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('argacel').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProdutoArgacel.ejs', { data1: results1, pedido_id: pedido_id })
  })
})

app.post('/pedido/salvarproduto', (req, res) => {
  db.collection('produto').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('Salvo novo produto')
    var pedido = req.body.pedido_id
      db.collection('pedido').find(ObjectId(pedido)).toArray((err, result1) => {
      if (result1[0].representada == "Portas Salete") {
        res.redirect('/pedido/create/adicionarProdutoSalete/'+pedido)
      }else if(result1[0].representada == "Argamassas Argacel"){
        res.redirect('/pedido/create/adicionarProdutoArgacel/'+pedido)
      }
    })
  })
})

app.get('/pedido/mostrarLista/:id', (req, res) => {
  var id = req.params.id
  db.collection('pedido').find(ObjectId(id)).toArray((err, result1) => {
    if (err) return res.send(err)
    var razaosocial_id = result1[0].razaosocial_id
    db.collection('produto').find({pedido_id: id}).toArray((err, result2) => {
      if (err) return res.send(err)
      db.collection('empresa').find({_id: ObjectId(razaosocial_id)}).toArray((err, result3) => {
        if (err) return res.send(err)
        pedido_valor_total = 0
        //SE FOR SALETE
        if (result1[0].representada == "Portas Salete") {
          db.collection('portas').find().toArray((err, portas) => {
            if (err) return res.send(err)
            result2.forEach(function(produto){
              portas.forEach(function(porta){
                if(produto.codigo == porta.codigo){
                  db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                    $set: {
                      nome: porta.nome
                    }
                  },(err, result)=>{
                    if(err) return res.send(err)
                    console.log("Atualizado no banco de dados");
                  })
                  if(produto.tamanho == "60" || produto.tamanho == "70" || produto.tamanho == "80"){
                    produto.valor = (produto.quantidade * porta.valor * 1).toFixed(2)
                  }else if (produto.tamanho == "90") {
                    produto.valor = (produto.quantidade * porta.valor * 1.1).toFixed(2)
                  }else if (produto.tamanho == "100") {
                    produto.valor = (produto.quantidade * porta.valor * 1.6).toFixed(2)
                  }else if (produto.tamanho == "110") {
                    produto.valor = (produto.quantidade * porta.valor * 1.7).toFixed(2)
                  }else {
                    console.log("Não deu valor");
                  }
                }
              })
            })
            result2.forEach(function(produto){
              pedido_valor_total = pedido_valor_total + parseFloat(produto.valor)
            })
            result1.valor_total = pedido_valor_total.toFixed(2)
            var numero =  parseInt(result1.valor_total);
            var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            var total = dinheiro.slice(3, dinheiro.lenght);
            db.collection('pedido').updateOne({_id: ObjectId(id)}, {
              $set: {
                valor_total: total
              }
            },(err, result)=>{
              if(err) return res.send(err)
            })
            db.collection('prazo').find().toArray((err, prazo) => {
              res.render('pedido/show.ejs', { pedido: result1, produto: result2, empresa: result3, prazo: prazo})
            })
          })

          //SE FOR ARGACEL
        }else if (result1[0].representada == "Argamassas Argacel") {
          db.collection('argacel').find().toArray((err, argamassas) => {
            if (err) return res.send(err)
            result2.forEach(function(produto){
              argamassas.forEach(function(argamassa){
                if(produto.codigo == argamassa.codigo){
                  db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                    $set: {
                      nome: argamassa.nome
                    }
                  },(err, result)=>{
                    if(err) return res.send(err)
                    console.log("Atualizado no banco de dados");
                  })
                  produto.valor = (produto.quantidade * parseFloat(argamassa.valor.replace(",", "."))).toFixed(2)
                }
              })
            })
            result2.forEach(function(produto){
              pedido_valor_total = pedido_valor_total + parseFloat(produto.valor)
            })
            result1.valor_total = pedido_valor_total.toFixed(2)
            var numero =  parseInt(result1.valor_total);
            var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            var total = dinheiro.slice(3, dinheiro.lenght);
            db.collection('pedido').updateOne({_id: ObjectId(id)}, {
              $set: {
                valor_total: total
              }
            },(err, result)=>{
              if(err) return res.send(err)
            })
            db.collection('prazo').find().toArray((err, prazo) => {
              res.render('pedido/show.ejs', { pedido: result1, produto: result2, empresa: result3, prazo: prazo})
            })
          })
        }
        //SE FOR ....

      })
    })
  })
});

app.post('/pedido/gerarPlanilhaSalete', (req, res) => {
  var id = req.body.pedido_id
  db.collection('pedido').find(ObjectId(id)).toArray((err, result1) => {
    if (err) return res.send(err)
    var razaosocial_id = result1[0].razaosocial_id
    db.collection('produto').find({pedido_id: id}).toArray((err, result2) => {
      if (err) return res.send(err)
      db.collection('empresa').find({_id: ObjectId(razaosocial_id)}).toArray((err, result3) => {
        if (err) return res.send(err)
        db.collection('portas').find().toArray((err, portas) => {
          if (err) return res.send(err)
          result2.forEach(function(produto){
            portas.forEach(function(porta){
              if(produto.codigo == porta.codigo){
                produto.nome = porta.nome;
                if(produto.tamanho == "60" || produto.tamanho == "70" || produto.tamanho == "80"){
                  produto.valor = (produto.quantidade * porta.valor * 1).toFixed(2)
                }else if (produto.tamanho == "90") {
                  produto.valor = (produto.quantidade * porta.valor * 1.1).toFixed(2)
                }else if (produto.tamanho == "100") {
                  produto.valor = (produto.quantidade * porta.valor * 1.6).toFixed(2)
                }else if (produto.tamanho == "110") {
                  produto.valor = (produto.quantidade * porta.valor * 1.7).toFixed(2)
                }else {
                  console.log("Não deu valor");
                }
              }
            })
          })
          pedido_valor_total = 0
          result2.forEach(function(produto){
            pedido_valor_total = pedido_valor_total + parseFloat(produto.valor)
          })
          result1.valor_total = pedido_valor_total.toFixed(2)

          // CRIAR A PLANILHA
          const wb = new xl.Workbook();

          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO PORTAS SALETE&24',
              firstHeader: '&24PEDIDO PORTAS SALETE&24',
              oddHeader: '&24PEDIDO PORTAS SALETE&24',
            },
          };
          const ws = wb.addWorksheet('Worksheet Name', options);

          var colunaData = wb.createStyle({
            alignment: {
              horizontal: 'right',
            },
          });
          var centralizado = wb.createStyle({
            alignment: {
              horizontal: 'center',
            },
          });
          var valor = wb.createStyle({
            numberFormat: '#,##0.00; (#,##.00); -',
            font: {
              bold: true,
            },
          });
          var negrito = wb.createStyle({
            font: {
              bold: true,
            },
          });
          const borda = wb.createStyle({
          	border: {
          		left: {
          			style: 'thin',
          			color: 'black',
          		},
          		right: {
          			style: 'thin',
          			color: 'black',
          		},
          		top: {
          			style: 'thin',
          			color: 'black',
          		},
          		bottom: {
          			style: 'thin',
          			color: 'black',
          		},
          		outline: false,
          	},
          });

          ws.column(2).setWidth(15);
          ws.column(2).setWidth(45);
          ws.column(3).setWidth(12);
          ws.column(4).setWidth(12);

          ws.cell(1, 1).string(result3[0].razaosocial);
          ws.cell(2, 1).string(result3[0].endereco + " - "+result3[0].cidade);
          ws.cell(3, 1).string(result3[0].cnpj + " " + result3[0].ie);
          ws.cell(4, 1).string("EMAIL");
          ws.cell(4, 2).string(result3[0].email);
          ws.cell(1, 4).date(result1[0].data).style({numberFormat: 'dd/mm/yyyy'}).style(colunaData);
          ws.cell(2, 4).string(result3[0].cep).style(colunaData);
          ws.cell(3, 4).string(result3[0].telefone).style(colunaData);
          ws.cell(4, 4).string(result3[0].comprador).style(colunaData);
          ws.cell(5, 2).string(req.body.prazo + "  " + req.body.formadepagamento);
          ws.cell(6, 1).string("Quantidade");
          ws.cell(6, 2).string("Descrição").style(centralizado);
          ws.cell(6, 3).string("Unitário").style(centralizado);;
          ws.cell(6, 4).string("Total").style(centralizado);;

          let linhaIndex = 7;
          result2.forEach(function(produto){
            ws.cell(linhaIndex, 1).number(parseFloat(produto.quantidade)).style(centralizado);
            if(produto.codigo.includes("M") || produto.codigo.includes("V")){
              ws.cell(linhaIndex, 2).string(produto.nome);
            }else {
              ws.cell(linhaIndex, 2).string("PORTA " + produto.codigo + " " + produto.tamanho + " CM " + produto.nome );
            }
            ws.cell(linhaIndex, 3).number(produto.valor/parseFloat(produto.quantidade)).style(valor);
            ws.cell(linhaIndex, 4).formula('A'+linhaIndex + ' * C'+linhaIndex).style(valor);
            linhaIndex++;
          })
          ws.cell(linhaIndex, 4).formula('SUM(D7:D'+ --linhaIndex + ')').style(valor);

          linhaIndex = linhaIndex +3;

          ws.cell(linhaIndex++, 2).string("MANDAR :").style(negrito);
          ws.cell(linhaIndex++, 2).string("COM MARCA E REFERÊNCIA NA PORTA.").style(negrito);
          ws.cell(linhaIndex++, 2).string("CAPRICHAR NA QUALIDADE.").style(negrito);
          ws.cell(linhaIndex++, 2).string("MANDAR A NF CONFORME ESCRITO NO PEDIDO.").style(negrito);
          ws.cell(linhaIndex++, 2).string("MANDAR BOLETO JUNTO COM A NF.").style(negrito);
          ws.cell(linhaIndex++, 2).string("TODAS FURADAS.").style(negrito);
          linhaIndex++;

          ws.cell(linhaIndex++, 2).string("GALVÃO").style(negrito);
          ws.cell(linhaIndex++, 2).string("42-99827-8677").style(negrito);
          ws.cell(linhaIndex++, 2).string("galvaoluiz3@gmail.com");

          ws.cell(1, 1, linhaIndex, 4).style(borda);

          // const destino = 'G:/.shortcut-targets-by-id/id/Galvão Repr/Salete Portas externas/A Pedidos/'
          // const destino = 'C:/Users/huanl/Documents/Projetos/'
          var numero =  parseInt(result1.valor_total);
          var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
          var total = dinheiro.slice(3, dinheiro.lenght);
          const nomeDoPedido = "Pedido " + result3[0].nomefantasia + " " + reformatDate(result1[0].data) + " " + total + ".xlsx";
          wb.write(nomeDoPedido);
          console.log('Arquivo local criado!');
          myTimeout = setTimeout(uploadFileSalete, 3000, nomeDoPedido);

          db.collection('prazo').find().toArray((err, prazo) => {
            res.redirect('/pedido/mostrarLista/'+id)
          })
        })
      })
    })
  })
});

function uploadFileSalete (nomeDoPedido){
  const GOOGLE_API_FOLDER_ID = '1-bD4Zi3QrT7WQWuksphPCCvGPKh2HGv6'   //PEDIDOS SALETE
  gdrive.imageUpload(
    nomeDoPedido,
    "./" + nomeDoPedido,
    GOOGLE_API_FOLDER_ID, (id) => {
      console.log(id);
      // open('https://drive.google.com/uc?export=view&id=' + id);
  });
  //https://drive.google.com/uc?export=view&id=
  setTimeout(deleteLocalFile, 3000, nomeDoPedido);
}

//EDIT
app.route('/produto/editProdutoSalete/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    pedido_id_edit = result[0].pedido_id
    db.collection('portas').find().toArray((err, results1) => {
        if (err) return console.log(err)
        db.collection('tamanho').find().toArray((err, results2) => {
            if (err) return console.log(err)
            res.render('pedido/editProdutoSalete.ejs', {data: result ,data1: results1, data2: results2 })
        })
    })
  })
})
.post((req, res) =>{
  var id = req.params.id
  var quantidade = req.body.quantidade
  var codigo = req.body.codigo
  var tamanho = req.body.tamanho

  db.collection('produto').updateOne({_id: ObjectId(id)}, {
    $set: {
      quantidade: quantidade,
      codigo: codigo,
      tamanho: tamanho
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/pedido/mostrarLista/'+pedido_id_edit)
    })
    console.log("Atualizado no banco de dados");
  })

function deleteLocalFile (nomeDoPedido){
  fs.unlink(nomeDoPedido, function (err){
    if (err) throw err;
    console.log('Arquivo local deletado!');
  })
}

app.post('/pedido/gerarPlanilhaArgacel', (req, res) => {
  var id = req.body.pedido_id
  db.collection('pedido').find(ObjectId(id)).toArray((err, result1) => {
    if (err) return res.send(err)
    var razaosocial_id = result1[0].razaosocial_id
    db.collection('produto').find({pedido_id: id}).toArray((err, result2) => {
      if (err) return res.send(err)
      db.collection('empresa').find({_id: ObjectId(razaosocial_id)}).toArray((err, result3) => {
        if (err) return res.send(err)
        db.collection('argacel').find().toArray((err, argamassas) => {
          if (err) return res.send(err)
          result2.forEach(function(produto){
            argamassas.forEach(function(argamassa){
              if(produto.codigo == argamassa.codigo){
                produto.nome = argamassa.nome
                produto.valor = (produto.quantidade * parseFloat(argamassa.valor.replace(",", "."))).toFixed(2)
              }
            })
          })
          pedido_valor_total = 0
          result2.forEach(function(produto){
            pedido_valor_total = pedido_valor_total + parseFloat(produto.valor)
          })
          result1.valor_total = pedido_valor_total.toFixed(2)

          // CRIAR A PLANILHA
          const wb = new xl.Workbook();

          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO ARGAMASSAS ARGACEL&24',
              firstHeader: '&24PEDIDO ARGAMASSAS ARGACEL&24',
              oddHeader: '&24PEDIDO ARGAMASSAS ARGACEL&24',
            },
          };
          const ws = wb.addWorksheet('Worksheet Name', options);

          var colunaData = wb.createStyle({
            alignment: {
              horizontal: 'right',
            },
          });
          var centralizado = wb.createStyle({
            alignment: {
              horizontal: 'center',
            },
          });
          var valor = wb.createStyle({
            numberFormat: '#,##0.00; (#,##.00); -',
            font: {
              bold: true,
            },
          });
          var negrito = wb.createStyle({
            font: {
              bold: true,
            },
          });
          const borda = wb.createStyle({
          	border: {
          		left: {
          			style: 'thin',
          			color: 'black',
          		},
          		right: {
          			style: 'thin',
          			color: 'black',
          		},
          		top: {
          			style: 'thin',
          			color: 'black',
          		},
          		bottom: {
          			style: 'thin',
          			color: 'black',
          		},
          		outline: false,
          	},
          });

          ws.column(2).setWidth(15);
          ws.column(2).setWidth(45);
          ws.column(3).setWidth(12);
          ws.column(4).setWidth(12);

          ws.cell(1, 1).string(result3[0].razaosocial);
          ws.cell(2, 1).string(result3[0].endereco + " - "+result3[0].cidade);
          ws.cell(3, 1).string(result3[0].cnpj + " " + result3[0].ie);
          ws.cell(4, 1).string("EMAIL");
          ws.cell(4, 2).string(result3[0].email);
          ws.cell(1, 4).date(result1[0].data).style({numberFormat: 'dd/mm/yyyy'}).style(colunaData);
          ws.cell(2, 4).string(result3[0].cep).style(colunaData);
          ws.cell(3, 4).string(result3[0].telefone).style(colunaData);
          ws.cell(4, 4).string(result3[0].comprador).style(colunaData);
          ws.cell(5, 2).string(req.body.prazo + "  " + req.body.formadepagamento);
          ws.cell(6, 1).string("Quantidade");
          ws.cell(6, 2).string("Descrição").style(centralizado);
          ws.cell(6, 3).string("Unitário").style(centralizado);;
          ws.cell(6, 4).string("Total").style(centralizado);;

          let linhaIndex = 7;
          result2.forEach(function(produto){
            ws.cell(linhaIndex, 1).number(parseFloat(produto.quantidade)).style(centralizado);
            ws.cell(linhaIndex, 2).string(produto.nome);
            ws.cell(linhaIndex, 3).number(produto.valor/parseFloat(produto.quantidade)).style(valor);
            ws.cell(linhaIndex, 4).formula('A'+linhaIndex + ' * C'+linhaIndex).style(valor);
            linhaIndex++;
          })
          ws.cell(linhaIndex, 4).formula('SUM(D7:D'+ --linhaIndex + ')').style(valor);

          linhaIndex = linhaIndex +3;

          ws.cell(linhaIndex++, 2).string("GALVÃO").style(negrito);
          ws.cell(linhaIndex++, 2).string("42-99827-8677").style(negrito);
          ws.cell(linhaIndex++, 2).string("galvaoluiz3@gmail.com");

          ws.cell(1, 1, linhaIndex, 4).style(borda);

          var numero =  parseInt(result1.valor_total);
          var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
          var total = dinheiro.slice(3, dinheiro.lenght);
          const nomeDoPedido = "Pedido " + result3[0].nomefantasia + " " + reformatDate(result1[0].data) + " " + total + ".xlsx";
          wb.write(nomeDoPedido);
          console.log('Arquivo local criado!');
          myTimeout = setTimeout(uploadFileArgacel, 3000, nomeDoPedido);

          db.collection('prazo').find().toArray((err, prazo) => {
            res.redirect('/pedido/mostrarLista/'+id)
          })
        })
      })
    })
  })
});

function uploadFileArgacel (nomeDoPedido){
  const GOOGLE_API_FOLDER_ID = '1EViEqk_UvALkAu4d2o6MNbdlN0p8fi47'   //PEDIDOS SALETE
  gdrive.imageUpload(
    nomeDoPedido,
    "./" + nomeDoPedido,
    GOOGLE_API_FOLDER_ID, (id) => {
      console.log(id);
      // open('https://drive.google.com/uc?export=view&id=' + id);
  });
  //https://drive.google.com/uc?export=view&id=
  setTimeout(deleteLocalFile, 3000, nomeDoPedido);
}

function reformatDate(dateStr)
{
  dArr = dateStr.split("-");  // ex input "2010-01-18"
  return dArr[2]+ " " +dArr[1]+ " " +dArr[0]; //ex out: "18/01/10"
}

var pedido_id_edit = ""
//EDIT
app.route('/produto/editProdutoArgacel/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    pedido_id_edit = result[0].pedido_id
    db.collection('argacel').find().toArray((err, results1) => {
        if (err) return console.log(err)
        res.render('pedido/editProdutoArgacel.ejs', {data: result ,data1: results1 })
    })
  })
})
.post((req, res) =>{
  var id = req.params.id
  var quantidade = req.body.quantidade
  var codigo = req.body.codigo

  db.collection('produto').updateOne({_id: ObjectId(id)}, {
    $set: {
      quantidade: quantidade,
      codigo: codigo,
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/pedido/mostrarLista/'+pedido_id_edit)
    })
    console.log("Atualizado no banco de dados");
  })

//DELETE PRODUTO
app.route('/produto/delete/:id')
.get((req, res) =>{
  var id = req.params.id
    db.collection('produto').find(ObjectId(id)).toArray((err, resproduto) => {
      pedido_id_edit = resproduto[0].pedido_id
      db.collection('produto').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletado do Banco de dados');
        res.redirect('/pedido/mostrarLista/'+pedido_id_edit)
      })
    })
})

//DELETE PEDIDO
app.route('/pedido/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('pedido').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    db.collection('produto').deleteMany({pedido_id: id}, (err, result) => {
      if(err) return res.send(500, err)
      console.log('Deletado produto do pedido');
    })
    res.redirect('/pedido/listarPedidos')
  })

})
