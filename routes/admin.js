const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var ObjectId = require('mongodb').ObjectId

/* GET users listing. */
const admin={name:'admin123',password:12345}


router.get('/',(req, res) =>{
  if(req.session.admin){
    productHelpers.getAllProducts().then((data) => {
      res.render('admin/view-products', {data,admin})
    })
  }
  else{
    res.redirect("/admin/login")
    
  }
});
router.post("/login",(req,res)=>{
  if(req.body.name==admin.name&& req.body.password==admin.password){
    req.session.admin=req.body.name
    req.session.adminLoggedIn=true
    
    if(req.session.admin){
       res.redirect('/admin')
    }else{
      req.session.adminLoginErr="Invalid Admin name or Password"
        res.render("/admin/login",{LoginErr:req.session.adminLoginErr})
    }
  }
  
  else{
    req.session.adminLoginErr="Invalid Admin name or Password"
      res.render("admin/login",{LoginErr:req.session.adminLoginErr})
  }
})
router.get('/login',(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin')
  }
  else{
    res.render('admin/login')
  }
  
})
router.get('/logout',(req,res)=>{
  req.session.admin=null
  res.redirect("/admin/login")
})
router.get('/delete-user/:id', (req, res) => {
  let userId = ObjectId(req.params.id)
  productHelpers.deleteUser(userId).then((response) => {
    console.log(response)
    res.redirect("/admin")
  })
})
router.get('/edit-user/:id', async (req, res) => {
  let userId = req.params.id
  users = await productHelpers.editUser(userId)
  res.render('admin/edit-user', { users,admin })
})


router.post('/edit-user/:id', (req, res) => {

  let userId = req.params.id
  console.log("id",userId);
  productHelpers.updateUser(userId, req.body).then((response) => {
    res.redirect("/admin")
  })
})
router.get('/add-user',(req,res)=>{
  res.render('admin/add-user',{admin})
})
router.post('/add-user',(req,res)=>{
  productHelpers.addUser(req.body).then((response)=>{
    res.redirect('/admin')
  })
})

module.exports = router;
