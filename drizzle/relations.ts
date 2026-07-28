import { relations } from "drizzle-orm/relations";
import { orders, orderItems, products, productImages, productVideos } from "./schema";

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
}));

export const ordersRelations = relations(orders, ({many}) => ({
	orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	productImages: many(productImages),
	productVideos: many(productVideos),
}));

export const productVideosRelations = relations(productVideos, ({one}) => ({
	product: one(products, {
		fields: [productVideos.productId],
		references: [products.id]
	}),
}));