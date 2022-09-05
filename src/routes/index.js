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
        res.render('index', {
            arrayQuestions: arrayQuestions
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

//Validamos que no se pueda acceder a las rutas protegidas
router.use((req,res,next)=>{
    isAuthenticated(req,res,next);
    next();
});


router.get('/questions',async (req,res,next)=>{
    try {
        const arrayQuestions = await Question.findOne({ email: 'alex@hotmail.com' });
        console.log(arrayQuestions)
        res.render('questions', {
            arrayQuestions: arrayQuestions,
            error: false
        })
    } catch (error) {
        console.log(error)
        res.render('questions', {
            error: true,
            mensaje: 'No se encuentra el documento...'
        })
    }
})

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
        date:date
    }
    console.log(questionObj);
    res.render('questions');
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