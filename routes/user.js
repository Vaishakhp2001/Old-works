const { response } = require('express');
var express = require('express');
const req = require('express/lib/request');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET home page. */


let products=[
  {
    name:"Falcon pw2",
    description:"Super cycle,best for ride",
    price:18000,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa8lJlX70LDOhyM-yfP8k_0a-vtaAGhqmMpw&usqp=CAU"
  },
  {
    name:"Hero BSA",
    description:"Mountain cycle,amazing",
    price:20000,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU6RBGUV5CQz1-isLOvOIm6wN-1EAqSRlqdQ&usqp=CAU"
  },
  {
    name:"Hercules 2.0",
    description:"Powerfull item",
    price:15000,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgUepqFWTeQrTKqcI5m05cRgFx0skvM4VQHQ&usqp=CAU"
  },
  {
    name:"Leader scout",
    description:"Better perfomence",
    price:18000,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKgxxq_jKHfDoqnpzND9FZzucpcRKtXIeEZg&usqp=CAU"
  },
  {
    name:"Montra 120",
    description:"Smooth handling",
    price:12000,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd1kJUj49MQhFzUVBtXqphr7r5_G0mrznr7Q&usqp=CAU"
  },
  {
    name:"Cosmic H-456",
    description:"Trending item",
    price:14000,
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT51pR1isQSVFur5MeSAl5erPOYN3bpcfajuA&usqp=CAU"
  }
  
]

router.get("/",(req,res,next)=>{
  if(req.session.user){
    res.render("index",{products,user})
  }
  else{
    next()
  }
},
(req,res)=>{
  res.redirect('/login')
})
router.post('/',(req,res)=>{
    productHelpers.doLogin(req.body).then((response)=>{

      if(response.status){
      
        req.session.user=response.user
        req.session.user.loggedIn=true
        user=req.session.user
        res.render("index",{products,user})
      }
      else{
        req.session.userLoginErr="Invalid Username or Password"
        res.redirect("/login")
      }
    })
})	

router.get("/login",(req,res)=>{

  if(req.session.user){
    
       res.redirect('/')
    
  }
  
    res.render("user/login",{LoginErr:req.session.userLoginErr})
    req.session.userLoginErr=false
  })

router.get("/signup",(req,res)=>{
    res.render('user/signup',{admin:false})
})
router.post("/signup",(req,res)=>{
  productHelpers.addProduct(req.body).then((response)=>{
    req.session.user=response
    req.session.user.loggedIn=true

    res.render("user/login")
  })
  
})
router.get('/logout',(req,res)=>{
  req.session.user=null
    res.redirect('/login')
  
})

  




module.exports = router;
