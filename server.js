const express = require('express')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

const MongoClient = require('mongodb').MongoClient 

MongoClient.connect('mongodb+srv://kim8850917:xlrkfprtm0917@cluster0.coqpn.mongodb.net/bobby?retryWrites=true&w=majority', (error, client) => {
    if (error) return console.log(error)
    db = client.db('bobby')

    app.listen(8888, () => {
        console.log('listening on 8888')
    })
})

app.get('/', (req, res) => {
    db.collection('bobby').find().toArray((error, result) => {
        if (error) return console.log(error)
        console.log(result)

        let bobCount = 0
        let today = new Date()

        let year = today.getFullYear()
        let month = today.getMonth() + 1
        let date = today.getDate()
        
        for (let i = 0; i < result.length; i++) {
            if (parseInt(result[i].년) === year && parseInt(result[i].월) === month && parseInt(result[i].일) === date) {
                bobCount++
            }
        }
        console.log(bobCount)
        res.render('index.ejs', { count : bobCount })
    })
}) 

app.get('/list', (req, res) => {
    db.collection('bobby').find().toArray((error, result) => {
        if (error) return console.log(error)
        console.log(result)
        res.render('list.ejs', { posts : result })
    })
})

app.post('/add', (req, res) => {
    console.log(req.body)
    db.collection('counter').findOne({ name: '게시물 개수' }, (error, result) => {
        console.log(result.totalPost)
        var totalPost = result.totalPost
        db.collection('bobby').insertOne({ _id: totalPost + 1, 년: req.body.year, 월: req.body.month, 일: req.body.date, 시: req.body.hour, 분: req.body.minute }, (error, result) => {
            console.log('저장 완료')
            db.collection('counter').updateOne({ name: '게시물 개수' }, { $inc: { totalPost: 1 } }, (error, result) => {
                if (error) return console.log(error)
                db.collection('bobby').find().toArray((error, result) => {
                    if (error) return console.log(error)
                    console.log(result)
                    res.render('list.ejs', { posts: result })
                })
            })
        })
    })
})

app.delete('/delete', (req, res) => {
    console.log(req.body)
    req.body._id = parseInt(req.body._id)
    db.collection('bobby').deleteOne(req.body, (error, result) => {
        console.log('삭제 완료')
        res.status(200).send({ messgae: '성공했습니다' })
    })
})