type Product = {
    id: number,
    title: string
}

const products: Product[] = [{id: 1, title: 'product 1'}, {id: 2, title: 'product 2'}]

export const productRepository = {
    getProducts(): Product[] {
        return products;
    },
    createProduct(title: string) : Product | null {
        if (!title.trim()) {
            return null;
        }
        const newProduct: Product = {
            id: products.length + 1,
            title,
        }
        products.push(newProduct);
        return newProduct;
    },
    findProductByTitle(title: string): Product | null {
        return products.find(p => p.title === title) ?? null;
    },
    findProductById(id: number): Product | null {
        return products.find(p => p.id === id) ?? null;
    },
    deleteProductById(id: number): boolean {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}