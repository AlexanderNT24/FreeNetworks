//Llamamos a passport para una validacion local
const passport=require('passport');
//En passport las autenticaciones se denominan strategy
const localStrategy=require('passport-local').Strategy;
//Llamamos al modulo interno user
const User=require('../models/user');
//Para serializar
passport.serializeUser((user,done)=>{
    done(null,user.id);

});
//Para deserializar
passport.deserializeUser(async(id,done)=>{
   const user=await User.findById(id);
   done(null,user);

});

//Usamos una estrategia pasandole el tipo de datos
//Proceso de registro
passport.use('local-signup',new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},async (req,email,password,done)=>{

    const userBusqueda=await User.findOne({email:email});
    
    if(userBusqueda){
        return done(null,false,req.flash('signUpMessage','El email ya existe'));
    } else{
        const newUser=new User();
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        //Metodo asincrono
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-signin', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, async (req,email,password,done)=>{
    //Hago una consulta a la base de datos buscando al usuario
    const user=await User.findOne({email:email});
    //Valido si el usuario existe
    if(!user){
        return done(null,false,req.flash('signInMessage','Usuario No Existe'));
    }
    if(!user.comparePassword(password))
    {
        return done(null,false,req.flash('signInMessage','Contraseña Incorrecta'));
    }
    done(null,user);


}));