# Graph Report - .  (2026-07-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 207 nodes · 253 edges · 25 communities (21 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a16b0aa7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- db/schema.ts
- dependencies
- devDependencies
- compilerOptions
- products.ts
- AdminProductForm.tsx
- relations.ts
- scripts
- include
- (dashboard)/layout.tsx
- app/layout.tsx
- verify/route.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Db` - 12 edges
3. `products` - 8 edges
4. `scripts` - 7 edges
5. `include` - 7 edges
6. `orders` - 6 edges
7. `sendOrderConfirmation()` - 4 edges
8. `getProductBySlug()` - 4 edges
9. `lib` - 4 edges
10. `ImageUploader()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ImageUploader()` --indirect_call--> `publicUrl()`  [INFERRED]
  src/components/ImageUploader.tsx → src/lib/r2.ts
- `POST()` --calls--> `getUploadUrl()`  [EXTRACTED]
  src/app/api/admin/upload/route.ts → src/lib/r2.ts
- `POST()` --calls--> `getRazorpay()`  [EXTRACTED]
  src/app/api/checkout/create-order/route.ts → src/lib/razorpay.ts
- `POST()` --calls--> `sendOrderConfirmation()`  [EXTRACTED]
  src/app/api/checkout/verify/route.ts → src/lib/email.ts
- `HomePage()` --calls--> `getFeaturedProducts()`  [EXTRACTED]
  src/app/page.tsx → src/lib/products.ts

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "db/schema.ts"
Cohesion: 0.10
Nodes (15): POST(), client, Db, orderItems, orderItemsRelations, orders, ordersRelations, productImages (+7 more)

### Community 1 - "dependencies"
Cohesion: 0.08
Nodes (25): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, drizzle-orm, @libsql/client, lucide-react, nanoid, next, next-auth (+17 more)

### Community 2 - "devDependencies"
Cohesion: 0.11
Nodes (19): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+11 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "products.ts"
Cohesion: 0.18
Nodes (12): HomePage(), metadata, ProductsPage(), generateMetadata(), ProductPage(), Product, ProductCard(), Props (+4 more)

### Community 5 - "AdminProductForm.tsx"
Cohesion: 0.19
Nodes (6): POST(), ImageUploader(), Props, getUploadUrl(), publicUrl(), s3

### Community 6 - "relations.ts"
Cohesion: 0.24
Nodes (10): orderItemsRelations, ordersRelations, productImagesRelations, productsRelations, productVideosRelations, orderItems, orders, productImages (+2 more)

### Community 7 - "scripts"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, db:push, dev, lint, seed (+2 more)

### Community 8 - "include"
Cohesion: 0.18
Nodes (10): drizzle, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+2 more)

### Community 10 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): geistSans, metadata, Navbar()

### Community 11 - "verify/route.ts"
Cohesion: 0.70
Nodes (3): POST(), getResend(), sendOrderConfirmation()

## Knowledge Gaps
- **78 isolated node(s):** `orderItemsRelations`, `ordersRelations`, `productImagesRelations`, `productsRelations`, `productVideosRelations` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `include`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `orderItemsRelations`, `ordersRelations`, `productImagesRelations` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10241820768136557 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._