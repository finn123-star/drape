export interface ProductMeta {
  title: string
  brand: string
  price: number
  currency: string
  imageUrl: string
  shop: string
}

export type ShopParser = (url: string) => Promise<ProductMeta>
