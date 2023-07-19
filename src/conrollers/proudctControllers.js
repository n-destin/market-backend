import Product from "../models/product";


export async function getProduct(id){
    const product =  await Product.findById(id);
    if(!product) throw new Error('there is no such product')
    return product;
}

export function Search(searchTerm){
    Product.createIndexes({productDescription : "text", productName : "text"})
    const matchProducts = await Product.find({$text : {$search: searchTerm}}).toArray();
    return matchProducts
}