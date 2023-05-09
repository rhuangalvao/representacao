const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true}))
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://rhuangalvao:engcomp123@representacao.fl10y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const { ObjectId } = require('mongodb');

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
  db.collection('visita').find().toArray((err, results) => {
      if (err) return console.log(err)
      res.render('index.ejs', { visita: results })
  })
  // res.render('index.ejs')
})
app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

//Rotas do CRUD mariana Madeiras ----------------------------------------------------------
//CREATE
app.get('/mariana/create', (req, res) => {
    res.render('mariana/create.ejs')
})
//SHOW
app.get('/mariana/show', (req, res) => {
    db.collection('mariana').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('mariana/show.ejs', { data: results })
    })
})
app.post('/mariana/show', (req, res) => {
    db.collection('mariana').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/mariana/show')
    })
})
//EDIT
app.route('/mariana/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('mariana').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('mariana/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('mariana').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/mariana/show')
    console.log("Atualizado no banco de dados");
  })
})
//DELETE
app.route('/mariana/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('mariana').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/mariana/show')
  })
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
    db.collection('portas').insertOne(req.body, (err, result) => {
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
    db.collection('argacel').insertOne(req.body, (err, result) => {
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

//Rotas do CRUD FIOCAB ----------------------------------------------------------
//CREATE
app.get('/fiocab/create', (req, res) => {
    res.render('fiocab/create.ejs')
})
//SHOW
app.get('/fiocab/show', (req, res) => {
    db.collection('fiocab').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('fiocab/show.ejs', { data: results })
    })
})
app.post('/fiocab/show', (req, res) => {
    db.collection('fiocab').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/fiocab/show')
    })
})
//EDIT
app.route('/fiocab/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('fiocab').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('fiocab/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('fiocab').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/fiocab/show')
    console.log("Atualizado no banco de dados");
  })

})
//DELETE
app.route('/fiocab/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('fiocab').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/fiocab/show')
  })
})

//Rotas do CRUD RESERVA FERRAMENTAS ----------------------------------------------------------
//CREATE
app.get('/reserva/create', (req, res) => {
    res.render('reserva/create.ejs')
})
//SHOW
app.get('/reserva/show', (req, res) => {
    db.collection('reserva').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('reserva/show.ejs', { data: results })
    })
})
app.post('/reserva/show', (req, res) => {
    db.collection('reserva').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/reserva/show')
    })
})
//EDIT
app.route('/reserva/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('reserva').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('reserva/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('reserva').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/reserva/show')
    console.log("Atualizado no banco de dados");
  })

})
//DELETE
app.route('/reserva/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('reserva').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/reserva/show')
  })
})

//Rotas do CRUD SULFLEX ----------------------------------------------------------
//CREATE
app.get('/sulflex/create', (req, res) => {
    res.render('sulflex/create.ejs')
})
//SHOW
app.get('/sulflex/show', (req, res) => {
    db.collection('sulflex').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('sulflex/show.ejs', { data: results })
    })
})
app.post('/sulflex/show', (req, res) => {
    db.collection('sulflex').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/sulflex/show')
    })
})
//EDIT
app.route('/sulflex/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('sulflex').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('sulflex/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('sulflex').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/sulflex/show')
    console.log("Atualizado no banco de dados");
  })

})
//DELETE
app.route('/sulflex/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('sulflex').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/sulflex/show')
  })
})

//Rotas do CRUD VASSOURAS ESPLANADA ----------------------------------------------------------
//CREATE
app.get('/esplanada/create', (req, res) => {
    res.render('esplanada/create.ejs')
})
//SHOW
app.get('/esplanada/show', (req, res) => {
    db.collection('esplanada').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('esplanada/show.ejs', { data: results })
    })
})
app.post('/esplanada/show', (req, res) => {
    db.collection('esplanada').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/esplanada/show')
    })
})
//EDIT
app.route('/esplanada/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('esplanada').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('esplanada/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('esplanada').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/esplanada/show')
    console.log("Atualizado no banco de dados");
  })

})
//DELETE
app.route('/esplanada/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('esplanada').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/esplanada/show')
  })
})

//Rotas do CRUD ARTLUSTRES ----------------------------------------------------------
//CREATE
app.get('/artlustres/create', (req, res) => {
    res.render('artlustres/create.ejs')
})
//SHOW
app.get('/artlustres/show', (req, res) => {
    db.collection('artlustres').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('artlustres/show.ejs', { data: results })
    })
})
app.post('/artlustres/show', (req, res) => {
    db.collection('artlustres').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/artlustres/show')
    })
})
//EDIT
app.route('/artlustres/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('artlustres').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('artlustres/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var estoque = req.body.estoque
  var valor = req.body.valor

  db.collection('artlustres').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      estoque: estoque,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/artlustres/show')
    console.log("Atualizado no banco de dados");
  })

})
//DELETE
app.route('/artlustres/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('artlustres').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/artlustres/show')
  })
})

//Rotas do CRUD SULFLEX ----------------------------------------------------------
//CREATE
app.get('/tucano/create', (req, res) => {
    res.render('tucano/create.ejs')
})
//SHOW
app.get('/tucano/show', (req, res) => {
    db.collection('tucano').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('tucano/show.ejs', { data: results })
    })
})
app.post('/tucano/show', (req, res) => {
    db.collection('tucano').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de Dados')
        res.redirect('/tucano/show')
    })
})
//EDIT
app.route('/tucano/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('tucano').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('tucano/edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var codigo = req.body.codigo
  var nome = req.body.nome
  var valor = req.body.valor

  db.collection('tucano').updateOne({_id: ObjectId(id)}, {
    $set: {
      codigo: codigo,
      nome: nome,
      valor: valor
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/tucano/show')
    console.log("Atualizado no banco de dados");
  })

})
//DELETE
app.route('/tucano/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('tucano').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/tucano/show')
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
    db.collection('portasValor').insertOne(req.body, (err, result) => {
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
    db.collection('empresa').insertOne(req.body, (err, result) => {
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
  var numero = req.body.numero
  var bairro = req.body.bairro
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
      numero: numero,
      bairro: bairro,
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


// SALVAR VISITAS DE CIDADE
//CREATE
app.get('/cidade/visita', (req, res) => {
    db.collection('cidade').find().toArray((err, results) => {
        if (err) return console.log(err)
          res.render('visita/create.ejs', { cidade: results })
    })
})

app.post('/cidade/salvarvisita', (req, res) => {
  db.collection('visita').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
    res.redirect('/cidade/visita')
  })
});

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
  db.collection('pedido').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
  })
  db.collection('empresa').find({_id: ObjectId(req.body.razaosocial_id)}).toArray((err, result1) => {
    if (err) return console.log(err)
    db.collection('pedido').updateOne({_id: ObjectId(req.body._id)}, {
      $set: {
        empresa_nome: result1[0].razaosocial,
        empresa_nome_fantasia: result1[0].nomefantasia,
        cidade: result1[0].cidade
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
  }else if (req.body.representada == "Mariana Madeiras") {
    res.redirect('/pedido/create/adicionarProdutoMariana/'+pedido)
  }else if (req.body.representada == "FIOCAB") {
    res.redirect('/pedido/create/adicionarProdutoFiocab/'+pedido)
  }else if (req.body.representada == "Reserva Ferramentas") {
    res.redirect('/pedido/create/adicionarProdutoReserva/'+pedido)
  }else if (req.body.representada == "Sulflex") {
    res.redirect('/pedido/create/adicionarProdutoSulflex/'+pedido)
  }else if (req.body.representada == "Vassouras Esplanada") {
    res.redirect('/pedido/create/adicionarProdutoEsplanada/'+pedido)
  }else if (req.body.representada == "ArtLustres") {
    res.redirect('/pedido/create/adicionarProdutoArtLustres/'+pedido)
  }else if (req.body.representada == "Tucano") {
    res.redirect('/pedido/create/adicionarProdutoTucano/'+pedido)
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
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoMariana/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('mariana').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoFiocab/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('fiocab').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoReserva/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('reserva').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoSulflex/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('sulflex').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoEsplanada/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('esplanada').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoArtLustres/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('artlustres').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})
app.get('/pedido/create/adicionarProdutoTucano/:id', (req, res) => {
  var pedido_id = req.params.id
  db.collection('tucano').find().toArray((err, results1) => {
      if (err) return console.log(err)
        res.render('pedido/addProduto.ejs', { data1: results1, pedido_id: pedido_id })
  })
})

app.post('/pedido/salvarproduto', (req, res) => {
  db.collection('produto').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('Salvo novo produto')
    var pedido = req.body.pedido_id
      db.collection('pedido').find(ObjectId(pedido)).toArray((err, result1) => {
      if (result1[0].representada == "Portas Salete") {
        res.redirect('/pedido/create/adicionarProdutoSalete/'+pedido)
      }else if(result1[0].representada == "Argamassas Argacel"){
        res.redirect('/pedido/create/adicionarProdutoArgacel/'+pedido)
      }else if(result1[0].representada == "Mariana Madeiras"){
        res.redirect('/pedido/create/adicionarProdutoMariana/'+pedido)
      }else if (result1[0].representada == "FIOCAB") {
        res.redirect('/pedido/create/adicionarProdutoFiocab/'+pedido)
      }else if (result1[0].representada == "Reserva Ferramentas") {
        if (req.body.codigo == "M_R_1,20" || req.body.codigo == "M_R_1,50" || req.body.codigo == "M_X_1,20" || req.body.codigo == "M_X_1,50") {
          db.collection('pedido').updateOne({_id: ObjectId(pedido)}, {
            $set: {
              tipo: "Mesa",
            }
          },(err, result)=>{
            if(err) return res.send(err)
          })
        }else {
          db.collection('pedido').updateOne({_id: ObjectId(pedido)}, {
            $set: {
              tipo: "Normal",
            }
          },(err, result)=>{
            if(err) return res.send(err)
          })
        }
        res.redirect('/pedido/create/adicionarProdutoReserva/'+pedido)
      }else if (result1[0].representada == "Sulflex") {
        res.redirect('/pedido/create/adicionarProdutoSulflex/'+pedido)
      }else if (result1[0].representada == "Vassouras Esplanada") {
        res.redirect('/pedido/create/adicionarProdutoEsplanada/'+pedido)
      }else if (result1[0].representada == "ArtLustres") {
        res.redirect('/pedido/create/adicionarProdutoArtLustres/'+pedido)
      }else if (result1[0].representada == "Tucano") {
        res.redirect('/pedido/create/adicionarProdutoTucano/'+pedido)
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

                  if(produto.tamanho == "60" || produto.tamanho == "70" || produto.tamanho == "80"){
                    db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                      $set: {
                        nome: porta.nome,
                        total: (produto.quantidade * porta.valor * 1).toFixed(2)
                      }
                    },(err, result)=>{
                      if(err) return res.send(err)
                    })
                    produto.valor = (produto.quantidade * porta.valor * 1).toFixed(2)
                  }else if (produto.tamanho == "90") {
                    if (porta.nome.includes("ANGELIM")) {
                      db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                        $set: {
                          nome: porta.nome,
                          total: (produto.quantidade * porta.valor * 1.2).toFixed(2)
                        }
                      },(err, result)=>{
                        if(err) return res.send(err)
                      })
                      produto.valor = (produto.quantidade * porta.valor * 1.2).toFixed(2)
                    }else {
                      db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                        $set: {
                          nome: porta.nome,
                          total: (produto.quantidade * porta.valor * 1.1).toFixed(2)
                        }
                      },(err, result)=>{
                        if(err) return res.send(err)
                      })
                      produto.valor = (produto.quantidade * porta.valor * 1.1).toFixed(2)
                    }
                  }else if (produto.tamanho == "100") {
                    db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                      $set: {
                        nome: porta.nome,
                        total: (produto.quantidade * porta.valor * 1.6).toFixed(2)
                      }
                    },(err, result)=>{
                      if(err) return res.send(err)
                    })
                    produto.valor = (produto.quantidade * porta.valor * 1.6).toFixed(2)
                  }else if (produto.tamanho == "110") {
                    db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                      $set: {
                        nome: porta.nome,
                        total: (produto.quantidade * porta.valor * 1.7).toFixed(2)
                      }
                    },(err, result)=>{
                      if(err) return res.send(err)
                    })
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
            var numero =  parseFloat(result1.valor_total);
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

          //SE FOR OUTRO
        }else{
          var representadaAuxiliar = ""
          if(result1[0].representada == "Argamassas Argacel"){
            representadaAuxiliar = "argacel"
          }else if (result1[0].representada == "Mariana Madeiras") {
            representadaAuxiliar = "mariana"
          }else if (result1[0].representada == "FIOCAB") {
            representadaAuxiliar = "fiocab"
          }else if (result1[0].representada == "Reserva Ferramentas") {
            representadaAuxiliar = "reserva"
          }else if (result1[0].representada == "Sulflex") {
            representadaAuxiliar = "sulflex"
          }else if (result1[0].representada == "Vassouras Esplanada") {
            representadaAuxiliar = "esplanada"
          }else if (result1[0].representada == "ArtLustres") {
            representadaAuxiliar = "artlustres"
          }else if (result1[0].representada == "Tucano") {
            representadaAuxiliar = "tucano"
          }
          db.collection(representadaAuxiliar).find().toArray((err, argamassas) => {
            if (err) return res.send(err)
            result2.forEach(function(produto){
              argamassas.forEach(function(argamassa){
                if(produto.codigo == argamassa.codigo){
                  db.collection('produto').updateOne({_id: ObjectId(produto._id)}, {
                    $set: {
                      nome: argamassa.nome,
                      total: (produto.quantidade * parseFloat(argamassa.valor.replace(",", "."))).toFixed(2)
                    }
                  },(err, result)=>{
                    if(err) return res.send(err)
                  })
                  produto.valor = (produto.quantidade * parseFloat(argamassa.valor.replace(",", "."))).toFixed(2)
                }
              })
            })
            result2.forEach(function(produto){
              pedido_valor_total = pedido_valor_total + parseFloat(produto.valor)
            })
            result1.valor_total = pedido_valor_total.toFixed(2)
            var numero =  parseFloat(result1.valor_total);
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
      })
    })
  })
});

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
        res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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
app.route('/produto/editProdutoMariana/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    pedido_id_edit = result[0].pedido_id
    db.collection('mariana').find().toArray((err, results1) => {
        if (err) return console.log(err)
        res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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

app.route('/produto/editProdutoFiocab/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    pedido_id_edit = result[0].pedido_id
    db.collection('fiocab').find().toArray((err, results1) => {
        if (err) return console.log(err)
        res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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

app.route('/produto/editProdutoReserva/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    pedido_id_edit = result[0].pedido_id
    db.collection('reserva').find().toArray((err, results1) => {
        if (err) return console.log(err)
        res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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

app.route('/produto/editProdutoSulflex/:id')
  .get((req, res)=>{
    var id = req.params.id
    db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
      if (err) return res.send(err)
      pedido_id_edit = result[0].pedido_id
      db.collection('sulflex').find().toArray((err, results1) => {
          if (err) return console.log(err)
          res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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

app.route('/produto/editProdutoEsplanada/:id')
  .get((req, res)=>{
    var id = req.params.id
    db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
      if (err) return res.send(err)
      pedido_id_edit = result[0].pedido_id
      db.collection('esplanada').find().toArray((err, results1) => {
          if (err) return console.log(err)
          res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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

app.route('/produto/editProdutoArtLustres/:id')
  .get((req, res)=>{
    var id = req.params.id
    db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
      if (err) return res.send(err)
      pedido_id_edit = result[0].pedido_id
      db.collection('artlustres').find().toArray((err, results1) => {
          if (err) return console.log(err)
          res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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
app.route('/produto/editProdutoTucano/:id')
  .get((req, res)=>{
    var id = req.params.id
    db.collection('produto').find(ObjectId(id)).toArray((err, result) => {
      if (err) return res.send(err)
      pedido_id_edit = result[0].pedido_id
      db.collection('tucano').find().toArray((err, results1) => {
          if (err) return console.log(err)
          res.render('pedido/editProduto.ejs', {data: result ,data1: results1 })
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

function deleteLocalFile (nomeDoPedido){
  fs.unlink(nomeDoPedido, function (err){
    if (err) throw err;
    console.log('Arquivo local deletado!');
  })
}

app.post('/pedido/gerarPlanilha', (req, res) => {
  var id = req.body.pedido_id
  db.collection('pedido').find(ObjectId(id)).toArray((err, result1) => {
    if (err) return res.send(err)
    var razaosocial_id = result1[0].razaosocial_id
    db.collection('produto').find({pedido_id: id}).toArray((err, result2) => {
      if (err) return res.send(err)
      db.collection('empresa').find({_id: ObjectId(razaosocial_id)}).toArray((err, result3) => {
        if (err) return res.send(err)
        // CRIAR A PLANILHA
        const wb = new xl.Workbook();

        pedido_valor_total = 0
        result2.forEach(function(produto){
          pedido_valor_total = pedido_valor_total + parseFloat(produto.total)
        })
        result1.valor_total = pedido_valor_total.toFixed(2)

        if (result1[0].representada == "Argamassas Argacel") {
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO ARGACEL&24',
              firstHeader: '&24PEDIDO ARGACEL&24',
              oddHeader: '&24PEDIDO ARGACEL&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "Mariana Madeiras"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO MARIANA MADEIRAS&24',
              firstHeader: '&24PEDIDO MARIANA MADEIRAS&24',
              oddHeader: '&24PEDIDO MARIANA MADEIRAS&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "Portas Salete"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO PORTAS SALETE&24',
              firstHeader: '&24PEDIDO PORTAS SALETE&24',
              oddHeader: '&24PEDIDO PORTAS SALETE&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "FIOCAB"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO FIOCAB&24',
              firstHeader: '&24PEDIDO FIOCAB&24',
              oddHeader: '&24PEDIDO FIOCAB&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "Reserva Ferramentas"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO RESERVA FERRAMENTAS&24',
              firstHeader: '&24PEDIDO RESERVA FERRAMENTAS&24',
              oddHeader: '&24PEDIDO RESERVA FERRAMENTAS&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "Sulflex"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO SULFLEX MANGUEIRAS&24',
              firstHeader: '&24PEDIDO SULFLEX MANGUEIRAS&24',
              oddHeader: '&24PEDIDO SULFLEX MANGUEIRAS&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "Vassouras Esplanada"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO VASSOURAS ESPLANADA&24',
              firstHeader: '&24PEDIDO VASSOURAS ESPLANADA&24',
              oddHeader: '&24PEDIDO VASSOURAS ESPLANADA&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }else if(result1[0].representada == "ArtLustres"){
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO ART LUSTRES&24',
              firstHeader: '&24PEDIDO ART LUSTRES&24',
              oddHeader: '&24PEDIDO ART LUSTRES&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }

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

        ws.column(1).setWidth(12);
        ws.column(2).setWidth(45);
        ws.column(3).setWidth(12);
        ws.column(4).setWidth(12);

        ws.cell(1, 1).string(result3[0].razaosocial);
        ws.cell(2, 1).string(result3[0].endereco + ", " + result3[0].numero + " - "+result3[0].bairro + " - "+result3[0].cidade + "- PR");
        ws.cell(3, 1).string(result3[0].cnpj + "      " + result3[0].ie);
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

        if (result1[0].representada == "Portas Salete") {
          result2.forEach(function(produto){
            ws.cell(linhaIndex, 1).number(parseFloat(produto.quantidade)).style(centralizado);
            if(produto.codigo.includes("M") || produto.codigo.includes("V")){
              ws.cell(linhaIndex, 2).string(produto.nome);
            }else if(produto.codigo.includes("01P")){
              ws.cell(linhaIndex, 2).string("PORTA 01 " + produto.tamanho + " CM " + produto.nome );
            }else {
              ws.cell(linhaIndex, 2).string("PORTA " + produto.codigo + " " + produto.tamanho + " CM " + produto.nome );
            }
            ws.cell(linhaIndex, 3).number(parseFloat(produto.total)/parseFloat(produto.quantidade)).style(valor);
            ws.cell(linhaIndex, 4).formula('A'+linhaIndex + ' * C'+linhaIndex).style(valor);
            linhaIndex++;
          })
          ws.cell(linhaIndex, 4).formula('SUM(D7:D'+ --linhaIndex + ')').style(valor);
        }else {
          result2.forEach(function(produto){
            ws.cell(linhaIndex, 1).number(parseFloat(produto.quantidade)).style(centralizado);
            ws.cell(linhaIndex, 2).string(produto.nome);
            ws.cell(linhaIndex, 3).number(parseFloat(produto.total)/parseFloat(produto.quantidade)).style(valor);
            ws.cell(linhaIndex, 4).formula('A'+linhaIndex + ' * C'+linhaIndex).style(valor);
            linhaIndex++;
          })
          ws.cell(linhaIndex, 4).formula('SUM(D7:D'+ --linhaIndex + ')').style(valor);
        }

        linhaIndex = linhaIndex +3;

        if (result1[0].representada == "Portas Salete") {
          ws.cell(linhaIndex++, 2).string("MANDAR :").style(negrito);
          ws.cell(linhaIndex++, 2).string("COM MARCA E REFERÊNCIA NA PORTA.").style(negrito);
          ws.cell(linhaIndex++, 2).string("CAPRICHAR NA QUALIDADE.").style(negrito);
          ws.cell(linhaIndex++, 2).string("MANDAR A NF CONFORME ESCRITO NO PEDIDO.").style(negrito);
          ws.cell(linhaIndex++, 2).string("MANDAR BOLETO JUNTO COM A NF.").style(negrito);
          ws.cell(linhaIndex++, 2).string("FURADAS, AS QUE NÃO TEM LADO").style(negrito);
        }

        linhaIndex++;

        if (result1[0].usuario == "GALVÃO") {
          ws.cell(linhaIndex++, 2).string("GALVÃO").style(negrito);
          ws.cell(linhaIndex++, 2).string("42-99827-8677").style(negrito);
          ws.cell(linhaIndex++, 2).string("galvaoluiz3@gmail.com");
        }else if(result1[0].usuario == "DEYSE"){
          ws.cell(linhaIndex++, 2).string("DEYSE").style(negrito);
          ws.cell(linhaIndex++, 2).string("42-99987-1298").style(negrito);
          ws.cell(linhaIndex++, 2).string("deysekarine@hotmail.com");
        }

        ws.cell(1, 1, linhaIndex, 4).style(borda);

        var numero =  parseFloat(result1.valor_total);
        var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        var total = dinheiro.slice(3, dinheiro.lenght);
        const nomeDoPedido = "Pedido " + result3[0].nomefantasia + " " + reformatDate(result1[0].data) + " " + total + ".xlsx";
        wb.write(nomeDoPedido);
        console.log('Arquivo local criado!');

        if (result1[0].representada == "Argamassas Argacel") {
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1EViEqk_UvALkAu4d2o6MNbdlN0p8fi47');
        }else if(result1[0].representada == "Mariana Madeiras"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1hAx4Yq92A4t_PVJKoocsfEdS-W8uMqKQ');
        }else if(result1[0].representada == "Portas Salete"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1-bD4Zi3QrT7WQWuksphPCCvGPKh2HGv6');
        }else if(result1[0].representada == "FIOCAB"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '19cJAyQT4WiRQT60XcRLHePMPLDQYzaUz');
        }else if(result1[0].representada == "Reserva Ferramentas"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '18-MJWo22dyKqvKMAuN8XgCEmvq_nQBc6');
        }else if(result1[0].representada == "Sulflex"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1EzAYx8PjyMBgzwrJhttDmwRCFQU8r92B');
        }else if(result1[0].representada == "Vassouras Esplanada"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1UYC7hGp1OXNAU7FQqDMCEhv7ThiXmfz3');
        }else if(result1[0].representada == "ArtLustres"){
          myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1QIdorOQlhNgD4X_s9c-aBNzk5YTFgxDD');
        }
        db.collection('prazo').find().toArray((err, prazo) => {
          res.redirect('/pedido/mostrarLista/'+id)
        })
      })
    })
  })
});

function uploadFile(nomeDoPedido, localDrive){
  gdrive.imageUpload(
    nomeDoPedido,
    "./" + nomeDoPedido,
    localDrive, (id) => {
      console.log(id);
  });
  setTimeout(deleteLocalFile, 3000, nomeDoPedido);
}

function reformatDate(dateStr)
{
  dArr = dateStr.split("-");  // ex input "2010-01-18"
  return dArr[2]+ " " +dArr[1]+ " " +dArr[0]; //ex out: "18/01/10"
}

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


app.get('/pedido/relatorio', (req, res) => {
  db.collection('representada').find().toArray((err, results1) => {
      if (err) return console.log(err)
      res.render('pedido/relatorio.ejs', {representada: results1 })
  })
})

app.post('/pedido/gerarRelatorio', (req, res) => {
  var representada = req.body.representada
  var mesAno = req.body.data
  db.collection('pedido').find({representada: representada}).toArray((err, result1) => {
    if (err) return res.send(err)
    // CRIAR A PLANILHA
    const wb = new xl.Workbook();

    var options = {
      margins: {
        left: 0.3,
        right: 0.3,
      },
      printOptions: {
        centerHorizontal: true,
      },
    };

    const ws = wb.addWorksheet('Worksheet Name', options);

    var colunaData = wb.createStyle({
      alignment: {
        horizontal: 'right',
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

    ws.column(1).setWidth(45);
    ws.column(2).setWidth(12);
    ws.column(3).setWidth(12);
    ws.column(4).setWidth(12);

    if (result1[0].representada == "Sulflex") {
      auxRep = "Sulflex";
      auxCom = 6;
    }else if (result1[0].representada == "Portas Salete") {
      auxRep = "Portas Salete";
      auxCom = 5;
    }else if (result1[0].representada == "Argamassas Argacel") {
      auxRep = "Argamassas Argacel";
      auxCom = 4;
    }else if (result1[0].representada == "Mariana Madeiras") {
      auxRep = "Mariana Madeiras";
      auxCom = 5;
    }else if (result1[0].representada == "FIOCAB") {
      auxRep = "FIOCAB";
      auxCom = 3;
    }else if (result1[0].representada == "Vassouras Esplanada") {
      auxRep = "Vassouras Esplanada";
      auxCom = 15;
    }else if (result1[0].representada == "Reserva Ferramentas") {
      auxRep = "Reserva Ferramentas";
      auxCom = 6;
    }else if (result1[0].representada == "ArtLustres") {
      auxRep = "ArtLustres";
      auxCom = 20;
    }else if (result1[0].representada == "Tucano") {
      auxRep = "Tucano";
      auxCom = 5;
    }

    ws.cell(1, 1).string(auxRep + " Comissão à receber mês " + reformatMesAno(mesAno));
    ws.cell(2, 1).string("PEDIDOS").style(negrito);
    ws.cell(2, 4).string("com. "+auxCom+"%");

    let linhaIndex = 3;
    var comissao_total = 0

    if (auxRep == "Sulflex" || auxRep == "Portas Salete" || auxRep == "Vassouras Esplanada" || auxRep == "ArtLustres" || auxRep == "Tucano") {
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno) && pedido.cidade != "Ponta Grossa") {
          ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
          ws.cell(linhaIndex, 3).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
          ws.cell(linhaIndex, 4).formula('=C'+linhaIndex+'*'+auxCom+"/100").style(valor);
          comissao_total = comissao_total + (parseFloat(pedido.valor_total.replace(".", "")) * auxCom/100)
          linhaIndex++;
        }
      })

      auxCom = auxCom/2;
      ws.cell(linhaIndex++, 4).string("com. "+auxCom+"%");
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno) && pedido.cidade == "Ponta Grossa") {
          ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
          ws.cell(linhaIndex, 3).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
          ws.cell(linhaIndex, 4).formula('=C'+linhaIndex+'*'+auxCom+"/100").style(valor);
          comissao_total = comissao_total + (parseFloat(pedido.valor_total.replace(".", "")) * auxCom/100)
          linhaIndex++;
        }
      })
    }else if (auxRep == "Argamassas Argacel" || auxRep == "FIOCAB" || auxRep == "Mariana Madeiras") {
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno)) {
          ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
          ws.cell(linhaIndex, 3).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
          ws.cell(linhaIndex, 4).formula('=C'+linhaIndex+'*'+auxCom+"/100").style(valor);
          comissao_total = comissao_total + (parseFloat(pedido.valor_total.replace(".", "")) * auxCom/100)
          linhaIndex++;
        }
      })
    }else if (auxRep == "Reserva Ferramentas") {
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno) && pedido.cidade != "Ponta Grossa" && pedido.tipo == "Normal") {
          ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
          ws.cell(linhaIndex, 3).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
          ws.cell(linhaIndex, 4).formula('=C'+linhaIndex+'*'+auxCom+"/100").style(valor);
          comissao_total = comissao_total + (parseFloat(pedido.valor_total.replace(".", "")) * auxCom/100)
          linhaIndex++;
        }
      })
      auxCom = 5;
      ws.cell(linhaIndex++, 4).string("com. "+auxCom+"%");
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno) && pedido.cidade == "Ponta Grossa" && pedido.tipo == "Normal") {
          ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
          ws.cell(linhaIndex, 3).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
          ws.cell(linhaIndex, 4).formula('=C'+linhaIndex+'*'+auxCom+"/100").style(valor);
          comissao_total = comissao_total + (parseFloat(pedido.valor_total.replace(".", "")) * auxCom/100)
          linhaIndex++;
        }
      })
      auxCom = 3;
      ws.cell(linhaIndex++, 4).string("com. "+auxCom+"%");
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno) && pedido.cidade == "Ponta Grossa" && pedido.tipo == "Mesa") {
          ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
          ws.cell(linhaIndex, 3).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
          ws.cell(linhaIndex, 4).formula('=C'+linhaIndex+'*'+auxCom+"/100").style(valor);
          comissao_total = comissao_total + (parseFloat(pedido.valor_total.replace(".", "")) * auxCom/100)
          linhaIndex++;
        }
      })
    }


    linhaIndex++
    var linhaTotal = linhaIndex - 2
    ws.cell(linhaIndex, 2).string("TOTAL").style(negrito);
    ws.cell(linhaIndex, 3).formula('SUM(C3:C'+ linhaTotal + ')').style(valor);
    ws.cell(linhaIndex, 4).formula('SUM(D3:D'+ linhaTotal + ')').style(valor);
    var bordaInferior = linhaIndex

    linhaIndex+=2;

    ws.cell(1, 1, bordaInferior, 4).style(borda);

    var numero =  parseFloat(comissao_total);
    var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    var total = dinheiro.slice(3, dinheiro.lenght);
    const nomeDoPedido = "Comissão " + result1[0].representada + " " + reformatMesAno(mesAno) + " " + total + ".xlsx";
    wb.write(nomeDoPedido);
    console.log('Arquivo local criado!');

    myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1_HLuAswtxTrLXpi6cRp1Hhfki6aoccBY');

    res.redirect('/pedido/listarPedidos')
  })
});

function reformatMesAno(dateStr)
{
  dArr = dateStr.split("-");  // ex input "2022-01-18"
  return dArr[1]+ " " +dArr[0]; //ex out: "01 2022"
}

app.get('/pedido/relatorioDeyse', (req, res) => {
  res.render('pedido/relatorioDeyse.ejs')
})

app.post('/pedido/gerarRelatorioDeyse', (req, res) => {
  var mesAno = req.body.data
  db.collection('pedido').find().toArray((err, result1) => {
    if (err) return res.send(err)
      // CRIAR A PLANILHA
      const wb = new xl.Workbook();

      var options = {
        margins: {
          left: 0.3,
          right: 0.3,
        },
        printOptions: {
          centerHorizontal: true,
        },
      };

      const ws = wb.addWorksheet('Worksheet Name', options);
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

      ws.column(1).setWidth(45);
      ws.column(2).setWidth(12);
      ws.column(3).setWidth(12);
      ws.column(4).setWidth(12);

      ws.cell(1, 1).string("Comissão referente a " + reformatMesAno(mesAno)).style(negrito);
      ws.cell(1, 3).string("DEYSE").style(negrito);
      ws.cell(2, 1).string("PEDIDOS").style(negrito);

      let linhaIndex = 3;
      var comissao_total = 0
      var auxRep = ""
      var auxCom = 0
      var linhaInicio = 3

      ws.cell(linhaIndex, 1).string("Sulflex").style(negrito);
      ws.cell(linhaIndex++, 3).string("com. 3%");
      auxCom = 3;
      ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
      linhaIndex++;

      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {
              if (pedido.representada == "Sulflex") {
                auxRep = "Sulflex";
                auxCom = 3;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_total+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })

      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex, 1).string("Vassouras Esplanada").style(negrito);
      ws.cell(linhaIndex++, 3).string("com. 7,5%");
      auxCom = 7.5;
      ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
      linhaIndex++;

      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {
              if (pedido.representada == "Vassouras Esplanada") {
                auxRep = "Vassouras Esplanada";
                auxCom = 7.5;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_total+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })

      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex, 1).string("Portas Salete").style(negrito);
      ws.cell(linhaIndex++, 3).string("com. 2,5%");
      auxCom = 2.5;
      ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
      linhaIndex++;

      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {
              if (pedido.representada == "Portas Salete") {
                auxRep = "Portas Salete";
                auxCom = 2.5;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_total+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })

      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex, 1).string("Tucano").style(negrito);
      ws.cell(linhaIndex++, 3).string("com. 2,5%");
      auxCom = 2.5;
      ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
      linhaIndex++;

      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {
              if (pedido.representada == "Tucano") {
                auxRep = "Tucano";
                auxCom = 2.5;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_total+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })

      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex, 1).string("ArtLustres").style(negrito);
      ws.cell(linhaIndex++, 3).string("com. 10%");
      auxCom = 10;
      ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
      linhaIndex++;

      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {
              if (pedido.representada == "ArtLustres") {
                auxRep = "ArtLustres";
                auxCom = 10;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_total+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })

      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaTotal = linhaIndex - 1
      var linhaSubSoma = linhaIndex

      ws.cell(linhaIndex, 1).string("SOMA").style(negrito);
      ws.cell(linhaIndex, 4).formula('SUM(D1:D'+ linhaTotal + ')').style(negrito).style(valor);
      // ws.cell(linhaIndex, 4).number(comissao_total).style(negrito).style(valor);;

      linhaIndex++;
      linhaIndex++;

      var comissao_reserva = 0
      ws.cell(linhaIndex, 1).string("Reserva Ferramentas").style(negrito);
      ws.cell(linhaIndex++, 3).string("com. 5%");
      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {
              if (pedido.representada == "Reserva Ferramentas" && pedido.tipo == "Normal") {
                auxRep = "Reserva Ferramentas";
                auxCom = 5;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_reserva+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })

      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex++, 3).string("com. 6%");
      result1.forEach(function(pedido){
          if (pedido.data.includes(mesAno)) {
            if (pedido.usuario == "DEYSE" || pedido.cidade === "Ponta Grossa") {

            }else{
              if (pedido.representada == "Reserva Ferramentas" && pedido.tipo == "Normal") {
                auxRep = "Reserva Ferramentas";
                auxCom = 6;
                ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
                ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
                ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
                comissao_reserva+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
                linhaIndex++;
              }
            }
          }
      })
      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex++, 3).string("com. 3%");
      result1.forEach(function(pedido){
        if (pedido.data.includes(mesAno)) {
          if (pedido.representada == "Reserva Ferramentas" && pedido.tipo == "Mesa") {
            auxRep = "Reserva Ferramentas";
            auxCom = 3;
            ws.cell(linhaIndex, 1).string(pedido.empresa_nome);
            ws.cell(linhaIndex, 2).number(parseFloat(pedido.valor_total.replace(".", ""))).style(valor);
            ws.cell(linhaIndex, 3).formula('=B'+linhaIndex+'*'+auxCom+"/100").style(valor);
            comissao_reserva+= (parseFloat(pedido.valor_total.replace(".", "")) * auxCom / 100)
            linhaIndex++;
          }
        }
      })
      var linhaTotal = linhaIndex - 1
      ws.cell(linhaIndex, 2).formula('SUM(B'+ linhaInicio +':B'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 3).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      ws.cell(linhaIndex, 4).formula('SUM(C'+ linhaInicio +':C'+ linhaTotal + ')').style(valor);
      linhaIndex++;
      linhaIndex++;
      linhaInicio = linhaIndex

      ws.cell(linhaIndex, 1).string("TOTAL").style(negrito);
      ws.cell(linhaIndex, 4).formula('=D'+linhaSubSoma+'-'+ comissao_reserva).style(valor);
      ws.cell(linhaIndex, 5).number(439.03).style(valor);
      ws.cell(linhaIndex, 6).formula("=D"+linhaIndex+"-E"+linhaIndex).style(negrito);

      ws.cell(1, 1, linhaIndex, 4).style(borda);

      var numero =  parseFloat(comissao_total);
      var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
      var total = dinheiro.slice(3, dinheiro.lenght);
      const nomeDoPedido = "Comissão Deyse mês de " + reformatMesAno(mesAno) + " " + total + ".xlsx";
      wb.write(nomeDoPedido);
      console.log('Arquivo local criado!');
      myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1C2HS3uYLkPfBJOlyUJmO64XRQ94carT5');

      res.redirect('/pedido/listarPedidos')
  })
});




app.post('/pedido/gerarPlanilhaComImposto', (req, res) => {
  var id = req.body.pedido_id
  db.collection('pedido').find(ObjectId(id)).toArray((err, result1) => {
    if (err) return res.send(err)
    var razaosocial_id = result1[0].razaosocial_id
    db.collection('produto').find({pedido_id: id}).toArray((err, result2) => {
      if (err) return res.send(err)
      db.collection('empresa').find({_id: ObjectId(razaosocial_id)}).toArray((err, result3) => {
        if (err) return res.send(err)
        // CRIAR A PLANILHA
        const wb = new xl.Workbook();

        pedido_valor_total = 0
        result2.forEach(function(produto){
          pedido_valor_total = pedido_valor_total + parseFloat(produto.total)
        })
        result1.valor_total = pedido_valor_total.toFixed(2)

        if (result1[0].representada == "Tucano") {
          var options = {
            headerFooter: {
              evenHeader: '&24&PEDIDO TUCANO&24',
              firstHeader: '&24PEDIDO TUCANO&24',
              oddHeader: '&24PEDIDO TUCANO&24',
            },
            margins: {
              left: 0.3,
              right: 0.3,
            },
            printOptions: {
              centerHorizontal: true,
            },
          };
        }

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

        ws.column(1).setWidth(8);
        ws.column(2).setWidth(8);
        ws.column(3).setWidth(36);
        ws.column(4).setWidth(8);
        ws.column(5).setWidth(8);
        ws.column(6).setWidth(12);

        ws.cell(1, 1).string(result3[0].razaosocial);
        ws.cell(2, 1).string(result3[0].endereco + ", " + result3[0].numero + " - "+result3[0].bairro + " - "+result3[0].cidade + "- PR");
        ws.cell(3, 1).string(result3[0].cnpj + "      " + result3[0].ie);
        ws.cell(4, 1).string("EMAIL");
        ws.cell(4, 3).string(result3[0].email);
        ws.cell(1, 6).date(result1[0].data).style({numberFormat: 'dd/mm/yyyy'}).style(colunaData);
        ws.cell(2, 6).string(result3[0].cep).style(colunaData);
        ws.cell(3, 6).string(result3[0].telefone).style(colunaData);
        ws.cell(4, 6).string(result3[0].comprador).style(colunaData);
        ws.cell(5, 3).string(req.body.prazo + "  " + req.body.formadepagamento);
        ws.cell(5, 5).string("c/frete").style(centralizado);
        ws.cell(5, 5).string("11,94%").style(centralizado);
        ws.cell(5, 6).string("Total").style(centralizado);
        ws.cell(6, 1).string("Código");
        ws.cell(5, 2).string("mts.");
        ws.cell(6, 2).string("embal");
        ws.cell(6, 3).string("Descrição").style(centralizado);
        ws.cell(6, 4).string("un. mt").style(centralizado);
        ws.cell(6, 5).string("C/ST").style(centralizado);
        ws.cell(6, 6).string("com ST final").style(centralizado);

        let linhaIndex = 7;

        result2.forEach(function(produto){
          ws.cell(linhaIndex, 1).string(produto.codigo).style(centralizado);
          ws.cell(linhaIndex, 2).number(parseFloat(produto.quantidade)).style(centralizado);
          ws.cell(linhaIndex, 3).string(produto.nome);
          ws.cell(linhaIndex, 4).number(parseFloat(produto.total)/parseFloat(produto.quantidade)).style(valor);
          if (produto.codigo == "219" || produto.codigo == "222" || produto.codigo == "224") {
            ws.cell(linhaIndex, 6).formula('D'+linhaIndex + ' * B'+linhaIndex).style(valor);
          }else {
            ws.cell(linhaIndex, 5).formula('D'+linhaIndex + ' * 1.1194').style(valor);
            ws.cell(linhaIndex, 6).formula('E'+linhaIndex + ' * B'+linhaIndex).style(valor);
          }
          linhaIndex++;
        })
        ws.cell(linhaIndex, 6).formula('SUM(F7:F'+ --linhaIndex + ')').style(valor);

        linhaIndex = linhaIndex +3;

        if (result1[0].usuario == "GALVÃO") {
          ws.cell(linhaIndex++, 3).string("GALVÃO").style(negrito);
          ws.cell(linhaIndex++, 3).string("42-99827-8677").style(negrito);
          ws.cell(linhaIndex++, 3).string("galvaoluiz3@gmail.com");
        }else if(result1[0].usuario == "DEYSE"){
          ws.cell(linhaIndex++, 3).string("DEYSE").style(negrito);
          ws.cell(linhaIndex++, 3).string("42-99987-1298").style(negrito);
          ws.cell(linhaIndex++, 3).string("deysekarine@hotmail.com");
        }

        ws.cell(1, 1, linhaIndex, 6).style(borda);

        var numero =  parseFloat(result1.valor_total);
        var dinheiro = numero.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        var total = dinheiro.slice(3, dinheiro.lenght);
        const nomeDoPedido = "Pedido " + result3[0].nomefantasia + " " + reformatDate(result1[0].data) + " " + total + ".xlsx";
        wb.write(nomeDoPedido);
        console.log('Arquivo local criado!');

        myTimeout = setTimeout(uploadFile, 3000, nomeDoPedido, '1ja984V25nMX0937K3PrBF2BfFAMyuKhJ');

        db.collection('prazo').find().toArray((err, prazo) => {
          res.redirect('/pedido/mostrarLista/'+id)
        })
      })
    })
  })
});
