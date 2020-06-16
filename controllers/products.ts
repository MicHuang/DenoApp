import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { v4 } from 'https://deno.land/x/uuid/mod.ts'
import { Product } from '../types.ts'

const client = new MongoClient();
client.connectWithUri(`mongodb+srv://${config().DB_USER}:${config().DB_PASSWORD}@clusterus-zplkn.mongodb.net/${config().DB_NAME}?retryWrites=true&w=majority`);

const db = client.database("denoApp");
const good = db.collection("products");

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = async({ response }: {response: any}) => {
    const all_products = await good.find({ name: { $ne: null } });
    response.body = {
        success: true,
        data: all_products
    }
}

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = async({ params, response }: {params: {id: string}, response: any}) => {
    const product: Product | undefined = await good.findOne(
        { _id: { "$oid": params.id } },
      );
    if (product) {
        response.status = 200
        response.body = {
            success: true,
            data: product
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: "product not found"
        }
    }
}

// @desc    add new product
// @route   POST /api/v1/products
const addProduct = async({ request, response }: {request: any, response: any}) => {
    const reqBody = await request.body()

    if (!request.hasBody) {
        response.status = 400
        response.body = {
            success: false,
            msg: "No data"
        }
    } else {
        const product: Product = await good.insertOne(reqBody.value);
        response.status = 201
        response.body = {
            success: true,
            data: product
        }
    }

}

// @desc    update single product
// @route   PUT /api/v1/products/:id
const updateProduct = async({ params, request, response }: {params: {id: string}, request: any, response: any}) => {
    
    try {
        await good.updateOne(
            { _id: { "$oid": params.id } },
            { $set: { price: 0 } },
          );
        response.status = 200
        response.body = {
            success: true,
            msg: "updated success"
        }
        
    } catch (error) {
        response.status = 404
        response.body = {
            success: false,
            msg: "product not found"
        } 
    }
}

// @desc    delete a single product
// @route   DELETE /api/v1/products/:id
const delProduct = async({ params, response }: {params: {id: string}, response: any}) => {

    try {
        await good.deleteOne({ _id: { "$oid": params.id } })
        response.status = 200
        response.body = {
            success: true,
            data: "Deleted."
        }
    } catch (error) {
        response.status = 404
        response.body = {
            success: true,
            msg: error  
        }     
    }
}


export { getProducts, getProduct, addProduct, updateProduct, delProduct };