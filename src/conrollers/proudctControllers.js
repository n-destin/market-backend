import Product from "../models/product";
// import Product from "../models/product";
import User from "../models/user";
import { produce } from "immer";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export async function getProduct(id){
    const product =  await Product.findById(id);
    if(!product) throw new Error('there is no such product')
    return product;
}
// function to search for matching producst. can be used for the search functionality, and when one reaches on a news page
// adding to cart

export async function cartFunction(cartAction, userId, ProductId){
    try {
        const Person = await User.findById(userId);
        const productToAdd = await Product.findById(ProductId);
        if(cartAction == 'add'){
            Person.cartProducts.push(productToAdd.id);
        }else{
            for(let i = 0; i <Person.cartProducts.length ; i++){
                if(ProductId === Person.cartProducts[i].id){
                    delete Person.cartProducts[i]
                }
            }
        }

    } catch (error) {
        console.log(error.messafe);
    }
}

export async function getRelated(searchCategory){
    return await Product.find({productCategory : searchCategory})
}


export async function Search(searchTerm){
    Product.createIndexes({productDescription : "text", productName : "text"})
    const matchProducts = await Product.find({$text : {$search: searchTerm}}).toArray();
    return matchProducts
}
//removing from cart 
export async function createProductAndPrice(name, price, currency){
    try {
         stripe.products.create(name).then(response=>{
            if(response){
                stripe.prices.create({
                    product : response.data.id,
                    unit_amounts : price,
                    currency,
                }).then(response=>{
                    if(response) return {productId : response.data.product, priceId : response.data.id};
                })
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}