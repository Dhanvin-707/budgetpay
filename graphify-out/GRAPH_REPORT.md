# Graph Report - .  (2026-07-30)

## Corpus Check
- Corpus is ~13,521 words - fits in a single context window. You may not need a graph.

## Summary
- 273 nodes · 387 edges · 28 communities (23 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin Dashboard
- External Dependencies
- App Shell
- Dev Dependencies
- TS Config
- Admin Products CRUD
- Cart System
- Product Detail
- Drizzle Relations
- Package Metadata
- TS References
- Upload / R2
- App Layout
- Checkout / Email
- Location Picker
- Auth Types
- Drizzle Config
- ESLint Config
- Next Config
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Db` - 15 edges
3. `FadeIn()` - 11 edges
4. `products` - 8 edges
5. `orders` - 8 edges
6. `scripts` - 7 edges
7. `getCart()` - 7 edges
8. `include` - 7 edges
9. `users` - 5 edges
10. `saveCart()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ImageUploader()` --indirect_call--> `publicUrl()`  [INFERRED]
  src/components/ImageUploader.tsx → src/lib/r2.ts
- `POST()` --calls--> `extractYoutubeId()`  [EXTRACTED]
  src/app/api/admin/products/route.ts → src/lib/youtube.ts
- `POST()` --calls--> `uploadToR2()`  [EXTRACTED]
  src/app/api/admin/upload/route.ts → src/lib/r2.ts
- `POST()` --calls--> `getRazorpay()`  [EXTRACTED]
  src/app/api/checkout/create-order/route.ts → src/lib/razorpay.ts
- `POST()` --calls--> `sendOrderConfirmation()`  [EXTRACTED]
  src/app/api/checkout/verify/route.ts → src/lib/email.ts

## Import Cycles
- None detected.

## Communities (28 total, 5 thin omitted)

### Community 0 - "Admin Dashboard"
Cohesion: 0.08
Nodes (22): handler, POST(), setPasswordAction(), OrderStatusSelect(), Props, SetPasswordForm(), client, Db (+14 more)

### Community 1 - "External Dependencies"
Cohesion: 0.07
Nodes (27): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, drizzle-orm, leaflet, @libsql/client, lucide-react, nanoid, next (+19 more)

### Community 2 - "App Shell"
Cohesion: 0.16
Nodes (11): HomePage(), metadata, ProductsPage(), FadeIn(), Props, Product, ProductCard(), ProductsGrid() (+3 more)

### Community 3 - "Dev Dependencies"
Cohesion: 0.10
Nodes (21): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+13 more)

### Community 4 - "TS Config"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 5 - "Admin Products CRUD"
Cohesion: 0.15
Nodes (8): POST(), ClientImageInput(), ImageUploader(), Props, productImages, productVideos, publicUrl(), extractYoutubeId()

### Community 6 - "Cart System"
Cohesion: 0.23
Nodes (11): AddToCartButton(), Props, CartView(), LocationPicker, addToCart(), CartItem, clearCart(), getCart() (+3 more)

### Community 7 - "Product Detail"
Cohesion: 0.18
Nodes (10): generateMetadata(), ProductPage(), ImageType, MediaItem, Props, VideoType, LocationPicker, Props (+2 more)

### Community 8 - "Drizzle Relations"
Cohesion: 0.24
Nodes (10): orderItemsRelations, ordersRelations, productImagesRelations, productsRelations, productVideosRelations, orderItems, orders, productImages (+2 more)

### Community 9 - "Package Metadata"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, db:push, dev, lint, seed (+2 more)

### Community 10 - "TS References"
Cohesion: 0.18
Nodes (10): drizzle, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+2 more)

### Community 11 - "Upload / R2"
Cohesion: 0.47
Nodes (3): POST(), s3, uploadToR2()

### Community 12 - "App Layout"
Cohesion: 0.40
Nodes (3): geistSans, metadata, AuthProvider()

### Community 13 - "Checkout / Email"
Cohesion: 0.70
Nodes (3): POST(), getResend(), sendOrderConfirmation()

### Community 15 - "Auth Types"
Cohesion: 0.50
Nodes (3): next-auth, Session, User

## Knowledge Gaps
- **96 isolated node(s):** `isTurso`, `orderItemsRelations`, `ordersRelations`, `productImagesRelations`, `productsRelations` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FadeIn()` connect `App Shell` to `Admin Dashboard`, `Cart System`, `Product Detail`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Db` connect `Admin Dashboard` to `Checkout / Email`, `App Shell`, `Admin Products CRUD`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `isTurso`, `orderItemsRelations`, `ordersRelations` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.07918367346938776 - nodes in this community are weakly interconnected._
- **Should `External Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `TS Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._