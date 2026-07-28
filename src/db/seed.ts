import { db } from "./index"
import { products } from "./schema"
import { nanoid } from "nanoid"

const sampleProducts = [
  { name: "Vintage Oak Chair", slug: "vintage-oak-chair", category: "Chairs", condition: "excellent", pricePaise: 12000, originalPricePaise: 25000, description: "A beautifully restored vintage oak chair with elegant turned legs and a comfortable curved backrest. Stripped, sanded, and finished with natural oil.", featured: true, published: true },
  { name: "Walnut Coffee Table", slug: "walnut-coffee-table", category: "Tables", condition: "good", pricePaise: 18500, originalPricePaise: 40000, description: "Solid walnut coffee table with a rich warm grain. Minor surface marks add character. Perfect centrepiece for your living room.", featured: true, published: true },
  { name: "Mid-Century Bookshelf", slug: "mid-century-bookshelf", category: "Shelving", condition: "excellent", pricePaise: 22000, originalPricePaise: 45000, description: "Classic mid-century design with tapered legs and adjustable shelving. Restored and refinished in a warm teak tone.", featured: true, published: true },
  { name: "Restored Teak Desk", slug: "restored-desk", category: "Desks", condition: "excellent", pricePaise: 28000, originalPricePaise: 55000, description: "Spacious teak writing desk with three drawers. Perfect for a home office. Fully restored with new drawer runners and a hand-rubbed finish.", featured: true, published: true },
  { name: "Teak Dining Set (6-seater)", slug: "teak-dining-set", category: "Tables", condition: "good", pricePaise: 45000, originalPricePaise: 85000, description: "Solid teak dining table with six matching chairs. Some patina on the table top adds rustic charm. Sturdy and ready for daily use.", featured: true, published: true },
  { name: "Mango Wood Bedside Table", slug: "bedside-table", category: "Tables", condition: "fair", pricePaise: 8500, originalPricePaise: 18000, description: "Compact mango wood bedside table with a single drawer. Surface has some minor scuffs, sanded and oiled. Functional and charming.", featured: true, published: true },
  { name: "Restored Wooden Armchair", slug: "wooden-armchair", category: "Chairs", condition: "excellent", pricePaise: 15000, originalPricePaise: 30000, description: "Comfortable armchair with wooden frame and cushioned seat. Fresh upholstery in a neutral linen finish.", featured: false, published: true },
  { name: "Antique Drawer Cabinet", slug: "drawer-cabinet", category: "Cabinets", condition: "good", pricePaise: 32000, originalPricePaise: 60000, description: "Six-drawer cabinet in solid sheesham wood. Restored with new brass handles and a smooth matte finish.", featured: false, published: true },
]

async function seed() {
  console.log("Seeding products…")
  for (const p of sampleProducts) {
    await db.insert(products).values({ id: nanoid(), ...p }).onConflictDoNothing()
  }
  console.log(`Seeded ${sampleProducts.length} products`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})