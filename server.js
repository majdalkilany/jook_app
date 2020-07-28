require('dotenv').config();
const express = require('express')
const pg = require('pg')
const superagent = require('superagent')
const cors = require('cors')
const methodOverride = require('method-override');
const { listenerCount } = require('superagent');

const app = express()
const PORT = process.env.PORT || 3000
const client = new pg.Client(process.env.DATABASE_URL);


// ========================================================================uses
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// ========================================================================routs

app.get('/',homePageHandler)
app.get('/add',addHandler)
app.get('/favorite',favoriteHandler)
app.get('/details/:id',detailsHandler)
app.put('/update/:id',updateHandler)
app.put('/delete/:id',deleteHandler)
app.get('/randomJoke',randomJokeHandler)


// ========================================================================homePageHandler
function homePageHandler (req,res){
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`
    superagent.get(url).then(result=>{
        // console.log(result.body)
        data = result.body.map(val=>{
            return new Joke(val)
        })
        res.render('home_page',{data:data})
    })
}

// ========================================================================addHandler
 function addHandler (req,res){
    //  console.log(req.query)
    let {type , setup ,punchline }=req.query
let sql =`INSERT INTO joke (type , setup ,punchline)
VALUES ($1, $2, $3);
`
let safeVal= [type , setup ,punchline]
client.query(sql,safeVal).then(()=>{
    res.redirect('/favorite')
})

 }
// ========================================================================favoriteHandler
function favoriteHandler (req,res){

let sql = `SELECT * FROM joke;`
client.query(sql).then(result=>{
    res.render('favorite_page' ,{data : result.rows})
})
}
// ========================================================================detailsHandler
function detailsHandler (req,res){
    let param = req.params.id
    console.log(param)
    let sql = `SELECT * FROM joke WHERE id = $1;`
    let safeVal = [param]
client.query(sql,safeVal).then(result=>{
    res.render('details_page' ,{data : result.rows[0]})
})
}


// ========================================================================updateHandler
function updateHandler (req,res){
    let param = req.params.id
    let {type , setup ,punchline }=req.body

    // console.log(req.body)
    let sql = `UPDATE joke
    SET type = $1, setup = $2, punchline=$3
     WHERE id = $4;`
    let safeVal = [type , setup ,punchline,param]
client.query(sql,safeVal).then(result=>{
    res.redirect(`/details/${param}`)
})
}

// ========================================================================deleteHandler

function deleteHandler (req,res){
    let param = req.params.id
    
    let sql = `DELETE FROM joke WHERE id=$1;

    ;`
    let safeVal = [param]
client.query(sql,safeVal).then(result=>{
    res.redirect(`/favorite`)
})
}


// ========================================================================randomJoke
function randomJokeHandler (req,res){
    let url = `https://official-joke-api.appspot.com/jokes/programming/random`
    superagent.get(url).then(result=>{
        // console.log(result.body)
        data = result.body.map(val=>{
            return new Random(val)
        })
        res.render('random_page',{data:data})
    })

}

// ========================================================================constroctor


function Joke(val){
    this.type = val.type
    this.setup = val.setup
    this.punchline = val.punchline
}


function Random(val){
    this.type = val.type
    this.setup = val.setup
    this.punchline = val.punchline
}

// ========================================================================listen to port 
client.connect()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log(' I am runing')
    })
})