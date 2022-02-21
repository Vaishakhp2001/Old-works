
var db = require('../config/connection')
const bcrypt = require("bcrypt")
const { reject } = require('bcrypt/promises')
const async = require('hbs/lib/async')
const req = require('express/lib/request')
const { response } = require('express')
const ObjectID = require('mongodb').ObjectId
const res = require('express/lib/response')

module.exports = {
    addProduct: (product) => {
        return new Promise(async (resolve, reject) => {
            product.password = await bcrypt.hash(product.password, 10)


            db.get().collection('product').insertOne(product).then((data) => {

                resolve(data)


            })

        })

    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection('product').find().toArray()
            resolve(products)
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let result = {}
            let user = await db.get().collection("product").findOne({ name: userData.name })

            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login true")
                        result.user = user
                        result.status = true
                        resolve(result)
                    } else {
                        console.log("login false")
                        resolve({ status: false })
                    }

                })
            }
            else {
                console.log("no user")
                resolve({ status: false })
            }
        })
    },
    deleteUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection("product").deleteOne({ _id: userId }).then((response) => {
                resolve(response)
            })
        })
    },
    editUser: (userId) => {
        return new Promise((resolve, reject) => {
             db.get().collection('product').findOne({ _id:ObjectID(userId) }).then((response) => {
                 console.log('hi');
                 console.log("response :",response,":end");

                resolve(response)
            })
        })
    },
    updateUser: (Id, body) => {
        return new Promise((resolve, reject) => {
            console.log("id:",Id);
            db.get().collection('product').updateOne({_id:ObjectID(Id)},
                {
                    $set: {
                        name: body.name,
                        email: body.email,
                        number: body.number,
                        age: body.age
                    }
                }
                )

        .then((response) => {
            console.log("updated:",response)
            resolve(response)
        })
    })
    },
    addUser:(body)=>{
        return new Promise((resolve,reject)=>{
            console.log("body :",body)
            db.get().collection('product').insert({
                name:body.name,
                email:body.email,
                number:body.number,
                age:body.age,
                password:body.password
            }).then((response)=>{
                resolve(response)
            })
        })
    }
}