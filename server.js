const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true}))
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://rhuangalvao:engcomp123@representacao.fl10y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var ObjectId = require('mongodb').ObjectID;

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
