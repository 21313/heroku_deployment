var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

//set origin that can allow the client to hit the server
cors({credentials : true, origin : true});
app.use(cors());

//Setup express instant on app Variable
var app = express();

//Added Middleware for parsing
app.use(bodyParser.json(),function(err,req,res,next){
    if(err){
        return res.status(500).json({ error : err})
    }
    next();
});
app.use(bodyParser.urlencoded({extended:false}))


//---------Database Connection-----------//
mongoose.connect('mongodb://bilal:abc123@ds161493.mlab.com:61493/mongoapp');

//---------User Schema Start-----------//
var userSchema = mongoose.Schema({
    patientName : String,
    patientDisease : String,
    medicine : String,
    drName : String,
    date : String
});

//........................USer Models.....................//
var userModel = mongoose.model('User', userSchema);


//-------------User Schema End----------------//


//==========Create USer Signup API Start=====================//
app.use('Access-Control-Allow-Origin','*');
app.post('/CREATEUSER',function(req,res){
    console.log('api work')
    res.header('Access-Control-Allow-Origin',"*");
    //response.setHeader('Access-Control-Allow-Origin',"*")
    var userObj = {
        patientName : req.body.patientName,
        patientDisease : req.body.patientDisease,
        medicine : req.body.medicine,
        drName : req.body.drName,
        date : req.body.date
    }
    console.log('post api',userObj)
    var saveData = new userModel(userObj);
    saveData.save(function(err,data){
        if(!err){
            console.log('data',data);
            res.send(data);
        }
        else{
            console.log('Error',err);
            res.send(err);
        } 
    })
})


//----------------API For Getting Signup Data-------------------------//
app.get('/GETDATA',function(req,res){
    userModel.find(function(error,data){
        if(data){
            res.json(data);
            console.log('Patients data available ',data);
        }
        else{
            console.log('Error in getting patient data ',error);
        }
    })
})

//==========Create USer Signup API End=====================//



//==========API for deleting the Data=====================//
app.delete('/DELETE/:id',function(req,res){
    userModel.remove({
        _id : req.params.id
    },function(err,data){
        if(err){
            console.log('Error in deleting')
        }
        else{
            res.send(data)
        }
    }
)
});


//When successFully Connected
mongoose.connection.on('connected',function(connect){
    console.log('Mongoose default connection open to '+ connect);
});

//If the connection throw an error 
mongoose.connection.on('error',function(err){
    console.log('Mongoose default connection error '+ err);
});

//If the connection is disconnected
mongoose.connection.on('disconnected',function(disconnect){
    console.log('Mongoose default connection is disconnected '+ disconnect);
});

app.listen(process.env.PORT || 3000,function(){
    console.log('Server run on Port 3000')
})