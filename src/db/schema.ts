import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  pricePaise: integer("price_paise").notNull(),
  originalPricePaise: integer("original_price_paise"),
  category: text("category"),
  condition: text("condition"), // excellent, good, fair
  stock: integer("stock").default(1),
  featured: integer("featured", { mode: "boolean" }).default(false),
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("datetime('now')"),
  updatedAt: text("updated_at").default("datetime('now')"),
})

export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  sortOrder: integer("sort_order").default(0),
})

export const productVideos = sqliteTable("product_videos", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  youtubeId: text("youtube_id").notNull(),
  title: text("title"),
  sortOrder: integer("sort_order").default(0),
})

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  address: text("address").notNull(),
  razorpayOrderId: text("razorpay_order_id").unique(),
  razorpayPaymentId: text("razorpay_payment_id"),
  amountPaise: integer("amount_paise").notNull(),
  status: text("status").default("pending"), // pending, paid, shipped, delivered, cancelled
  createdAt: text("created_at").default("datetime('now')"),
})

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").default(1),
  pricePaise: integer("price_paise").notNull(),
})

export const productRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  videos: many(productVideos),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}))

export const productVideosRelations = relations(productVideos, ({ one }) => ({
  product: one(products, { fields: [productVideos.productId], references: [products.id] }),
}))

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}))