export interface CreateProductDTO {
    name: string
    category?: string
    price: number
    quantity: number
}

export interface UpdateProductDTO {
    name?: string
    category?: string
    price?: number
    quantity?: number
}
