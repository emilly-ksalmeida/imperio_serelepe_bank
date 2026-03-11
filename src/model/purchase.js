import {prisma} from "./db.js";

export default class PurchaseService {
    constructor(purchaseData){
        this.purchaseData = purchaseData;
        this.purchaseList = purchaseData.purchase;
        this.outOfStockItems = []
    }

  async validateItemsStock() {
    // verifica estoque
    for (let purchaseItem of this.purchaseList){
        for (let item of purchaseItem.items){
            const verifyItem = await prisma.products.findUnique({
            where: { id: item.idProduct },
            select: { stockQuantity: true }
        });
        if(item.quantity > verifyItem.stockQuantity){
            this.outOfStockItems.push({
                name: item.name,
                availableStock: verifyItem.stockQuantity
            });
        }
        }
    }
}
}

