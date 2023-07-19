import Product from "../models/product";


export function Search(searchTerm){
    Product.createIndexes({productDescription : "text", productName : "text"})
    const matchProducts = await Product.find({$text : {$search: searchTerm}}).toArray();
    return matchProducts
}