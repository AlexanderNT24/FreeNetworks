//Llamamos a express
const express = require('express');
const req = require('express/lib/request');
//Creamos un objeto con las rutas del servidor
const router=express.Router();
//Llamamos a passport
const passport=require('passport');
//Llamamos al modulo 
const Question=require('../models/question');


//Tomamos la rutas desde el / pues dominio/.. luego de eso lo vamos a procesar con un request un response y un next que es un manejador de peticiones
//Principal
router.get('/',async (req,res,next)=>{
    try {
        const arrayQuestions = await Question.find();
    
        console.log(arrayQuestions)
        //Ordenamos
        const orderArray=arrayQuestions.sort((a,b)=>{
            return new Date(b.date) - new Date(a.date);
        })


        res.render('index', {
            arrayQuestions: orderArray,
            userQuestion:false
        })
        
        
        
    } catch (error) {
        console.log(error)
    }
});


//Registro
//Enviamos a una ventana
router.get('/signup',(req,res,next)=>{
    res.render('signup');
});
//Tomamos la informacion 
router.post('/signup',passport.authenticate('local-signup',{
    successRedirect:'/profile',
    failureRedirect:'/signup',
    passReqToCallback:true
}));

//Enviamos a una ventana
router.get('/signin',(req,res,next)=>{
    res.render('signin');
});
//Tomamos la informacion 
router.post('/signin',passport.authenticate('local-signin',{
    successRedirect:'/profile',
    failureRedirect:'/signin',
    passReqToCallback:true
    
}));
router.get('/logout',(req,res,next)=>{
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
     
})
router.get('/searchId/:id', async(req, res) => {
    const id = req.params.id
    try {
        const question = await Question.findOne({ _id: id })
        console.log(question)
        res.render('searchId', {
            question: question
        })
    } catch (error) {
        console.log('error', error)
        
    }
})
router.post('/searchId/:id', async(req, res) => {
    try {
    const user = require('../index');
    const email=user.email;
    const id = req.params.id;
    const response = req.body.response;
    const arrayQuestions = await Question.findOne({ _id: id })
    console.log(arrayQuestions)
    const date = new Date();
    const newObjToInsert={
        email:email,
        response:response,
        date:date
    }
   
    arrayQuestions.responses.push(newObjToInsert)
    console.log(arrayQuestions.responses)

    await Question.findByIdAndUpdate(id, arrayQuestions, { useFindAndModify: false })
    res.render('profile');
    
    } catch (error) {
        console.log(error)
        
    }
    
    
});

router.get('/search/:title', async(req, res) => {
    const title = req.params.title
    console.log(title)
    try {
        const arrayQuestions = await Question.find({ title: title })
        console.log(arrayQuestions)
        console.log(arrayQuestions.length)
        res.render('index', {
            arrayQuestions: arrayQuestions,
            userQuestion:false
        }
        )
    } catch (error) {
        console.log('error', error)
        
    }
})

router.get('/questions',async(req,res,next)=>{
    try {
    const user = require('../index')
    const email=user.email
    console.log("email"+email)
        const arrayQuestions = await Question.find({ email: email })
        console.log(arrayQuestions)
        console.log(arrayQuestions.length)
        res.render('index', {
            arrayQuestions: arrayQuestions,
            userQuestion:true
        }
        )
    } catch (error) {
        console.log('error', error)
        res.render('signin')
    }
})

//Validamos que no se pueda acceder a las rutas protegidas
router.use((req,res,next)=>{
    isAuthenticated(req,res,next);
    next();
});


//Registrar preguntas
router.get('/profile',(req,res,next)=>{
    res.render('profile');
})
router.post('/profile', async (req, res) => {
    const body = req.body;
    const date = new Date();
    console.log(body);
    questionObj={
        email:body.email,
        title:body.title,
        question:body.question,
        date:date,
        responses:[]
        
    }
    console.log(questionObj);
    res.render('profile');
    try {
        const question = new Question(questionObj);
        await question.save();
        
    } catch (error) {
        console.log('error', error);
    
        
   
    }
    
    
});

//Funcion para validar si estas autenticado
function isAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};
//Para poder usarlo en otros archivos
module.exports=router;