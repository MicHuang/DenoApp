import { v4 } from 'https://deno.land/x/uuid/mod.ts'
import { Product } from '../types.ts'

let products: Product[] = [
    {
        id: "1",
        name: "product number one",
        info: "This is product one",
        price: 29.99,
    },
    {
        id: "2",
        name: "product number two",
        info: "This is product two",
        price: 39.99,
    },
    {
        id: "3",
        name: "product number three",
        info: "This is product three",
        price: 49.99,
    }
]

// @desc    Get all products
// @route   GET /api/v1/products
const getProducts = ({ response }: {response: any}) => {
    response.body = {
        success: true,
        data: products
    }
}

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProduct = ({ params, response }: {params: {id: string}, response: any}) => {
    const product: Product | undefined = products.find(p => p.id === params.id)
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
        const product: Product = reqBody.value
        product.id = v4.generate()
        products.push(product)
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
    
    const product: Product | undefined = products.find(p => p.id === params.id)

    if (product) {
        const reqBody = await request.body()

        const updateData: {name?: string, info?: string, price?: number} = reqBody.value

        products = products.map ( p => p.id === product.id ? {...p, ...updateData}: p)

        response.status = 200
        response.body = {
            success: true,
            data: products
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: "product not found"
        }
    }
}

// @desc    delete a single product
// @route   DELETE /api/v1/products/:id
const delProduct = ({ params, response }: {params: {id: string}, response: any}) => {
    const product: Product | undefined = products.find(p => p.id === params.id)
    if (product) {

        products = products.filter(p => p.id !== product.id)

        response.status = 200
        response.body = {
            success: true,
            data: products
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            msg: "product not found"
        }
    }
}


export { getProducts, getProduct, addProduct, updateProduct, delProduct };