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

  app.listen(3000, function(){
    console.log("Server running na porta 3000")
  })
})

app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
  res.render('index.ejs')
})
app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
.get((req, res)=>{
  var id = req.params.id
  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', {data: result})
  })
})
.post((req, res) =>{
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname
    }
  },(err, result)=>{
    if(err) return res.send(err)
    res.redirect('/show')
    console.log("Atualizado no banco de dados");
  })
})

app.route('/delete/:id')
.get((req, res) =>{
  var id = req.params.id
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if(err) return res.send(500, err)
    console.log('Deletado do Banco de dados');
    res.redirect('/show')
  })

})
