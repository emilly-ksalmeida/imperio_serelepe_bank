import {prisma} from "./db.js";

export async function getAllProducts(){
    return await prisma.products.findMany();
}

export async function newProduct(productData){
    const { sellerId, name, description, unitPrice, stockQuantity } = productData;
    const parsedUnitPrice = parseFloat(unitPrice);
    const parsedStockQuantity = parseInt(stockQuantity, 10);
    return await prisma.products.create({
        data: {
            sellerId,
            name,
            description,
            unitPrice: parsedUnitPrice,
            stockQuantity: parsedStockQuantity
        }
    });
}