import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const orderItems = sqliteTable("order_items", {
	id: text().primaryKey().notNull(),
	orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" } ),
	productId: text("product_id").notNull(),
	productName: text("product_name").notNull(),
	quantity: integer().default(1),
	pricePaise: integer("price_paise").notNull(),
});

export const orders = sqliteTable("orders", {
	id: text().primaryKey().notNull(),
	customerName: text("customer_name").notNull(),
	customerEmail: text("customer_email").notNull(),
	customerPhone: text("customer_phone"),
	address: text().notNull(),
	razorpayOrderId: text("razorpay_order_id"),
	razorpayPaymentId: text("razorpay_payment_id"),
	amountPaise: integer("amount_paise").notNull(),
	status: text().default("pending"),
	createdAt: text("created_at").default("datetime('now')"),
},
(table) => [
	uniqueIndex("orders_razorpay_order_id_unique").on(table.razorpayOrderId),
]);

export const productImages = sqliteTable("product_images", {
	id: text().primaryKey().notNull(),
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" } ),
	url: text().notNull(),
	alt: text(),
	sortOrder: integer("sort_order").default(0),
});

export const productVideos = sqliteTable("product_videos", {
	id: text().primaryKey().notNull(),
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" } ),
	youtubeId: text("youtube_id").notNull(),
	title: text(),
	sortOrder: integer("sort_order").default(0),
});

export const products = sqliteTable("products", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	pricePaise: integer("price_paise").notNull(),
	originalPricePaise: integer("original_price_paise"),
	category: text(),
	condition: text(),
	stock: integer().default(1),
	featured: integer().default(false),
	published: integer().default(false),
	createdAt: text("created_at").default("datetime('now')"),
	updatedAt: text("updated_at").default("datetime('now')"),
},
(table) => [
	uniqueIndex("products_slug_unique").on(table.slug),
]);

