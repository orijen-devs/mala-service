export type ItemType = {
    name: string,
    category: string,
    price: number,
    price_description: string
    description: string,
    quantity: number,
    imageUrl: string,
    uiid: string
}

export type PaymentData = {
    amount: number
    email?: string
    userId?: string
    externalId?: string
    redirectUrl?: string
    message?: string
}