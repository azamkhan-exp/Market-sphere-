import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MarketSphere database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.reviewImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.sellerVerification.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.user.deleteMany();

  const salt = bcrypt.genSaltSync(10);
  const adminPassword = bcrypt.hashSync("AdminPass123!", salt);
  const sellerPassword = bcrypt.hashSync("SellerPass123!", salt);
  const customerPassword = bcrypt.hashSync("CustomerPass123!", salt);

  // 1. Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@marketsphere.com",
      name: "Victoria Sterling (Admin)",
      passwordHash: adminPassword,
      role: "ADMIN",
      isEmailVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
  });

  const seller1User = await prisma.user.create({
    data: {
      email: "seller@apextech.com",
      name: "Marcus Vance",
      passwordHash: sellerPassword,
      role: "SELLER",
      isEmailVerified: true,
      phone: "+1 (555) 234-5678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
  });

  const seller2User = await prisma.user.create({
    data: {
      email: "seller@luminalifestyle.com",
      name: "Elena Rostova",
      passwordHash: sellerPassword,
      role: "SELLER",
      isEmailVerified: true,
      phone: "+1 (555) 345-6789",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
  });

  const seller3User = await prisma.user.create({
    data: {
      email: "seller@aerofit.com",
      name: "David Chen",
      passwordHash: sellerPassword,
      role: "SELLER",
      isEmailVerified: true,
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
  });

  const sellerPendingUser = await prisma.user.create({
    data: {
      email: "seller@ecosphere.com",
      name: "Amara Johnson",
      passwordHash: sellerPassword,
      role: "SELLER",
      isEmailVerified: true,
      phone: "+1 (555) 567-8901",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "alex.customer@example.com",
      name: "Alex Mercer",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      isEmailVerified: true,
      phone: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    },
  });

  const customer2User = await prisma.user.create({
    data: {
      email: "sarah.connor@example.com",
      name: "Sarah Connor",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      isEmailVerified: true,
      phone: "+1 (555) 876-5432",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    },
  });

  // Addresses
  await prisma.address.createMany({
    data: [
      {
        userId: customerUser.id,
        type: "SHIPPING",
        isDefault: true,
        fullName: "Alex Mercer",
        street: "742 Evergreen Terrace",
        apartment: "Suite 4B",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
        country: "United States",
        phone: "+1 (555) 987-6543",
      },
      {
        userId: customerUser.id,
        type: "BILLING",
        isDefault: true,
        fullName: "Alex Mercer",
        street: "742 Evergreen Terrace",
        apartment: "Suite 4B",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
        country: "United States",
        phone: "+1 (555) 987-6543",
      },
    ],
  });

  // 2. Sellers
  const sellerApex = await prisma.seller.create({
    data: {
      userId: seller1User.id,
      storeName: "ApexTech Official",
      slug: "apextech-official",
      logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80",
      banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      description: "Premier creator of high-performance computing, audio gears, and smart wearables.",
      phone: "+1 (555) 234-5678",
      address: "100 Silicon Way, San Jose, CA 95110",
      taxId: "US-94-3829104",
      bankAccount: "Chase ****4920",
      status: "APPROVED",
      commissionRate: 8.5,
      rating: 4.9,
      reviewCount: 412,
    },
  });

  const sellerLumina = await prisma.seller.create({
    data: {
      userId: seller2User.id,
      storeName: "Lumina Lifestyle",
      slug: "lumina-lifestyle",
      logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80",
      banner: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      description: "Modern minimalist home living, ergonomic furnishings, and culinary essentials.",
      phone: "+1 (555) 345-6789",
      address: "45 Broadway Ave, New York, NY 10006",
      taxId: "US-13-8920194",
      bankAccount: "Wells Fargo ****7712",
      status: "APPROVED",
      commissionRate: 9.0,
      rating: 4.8,
      reviewCount: 285,
    },
  });

  const sellerAeroFit = await prisma.seller.create({
    data: {
      userId: seller3User.id,
      storeName: "AeroFit Dynamics",
      slug: "aerofit-dynamics",
      logo: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80",
      banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      description: "Precision-engineered athletic apparel, recovery systems, and outdoor performance gear.",
      phone: "+1 (555) 456-7890",
      address: "782 Endurance Rd, Boulder, CO 80301",
      taxId: "US-84-7719203",
      bankAccount: "Citibank ****8839",
      status: "APPROVED",
      commissionRate: 10.0,
      rating: 4.9,
      reviewCount: 198,
    },
  });

  const sellerEcoSphere = await prisma.seller.create({
    data: {
      userId: sellerPendingUser.id,
      storeName: "EcoSphere Organics",
      slug: "ecosphere-organics",
      logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&q=80",
      banner: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
      description: "Pure botanicals, organic skincare formulations, and sustainable luxury self-care.",
      phone: "+1 (555) 567-8901",
      address: "12 Green Garden Way, Portland, OR 97201",
      taxId: "US-93-6628190",
      bankAccount: "Bank of America ****2109",
      status: "PENDING", // for testing admin approval
      commissionRate: 10.0,
      rating: 5.0,
      reviewCount: 0,
    },
  });

  // Seller verifications
  await prisma.sellerVerification.createMany({
    data: [
      {
        sellerId: sellerApex.id,
        documentType: "BUSINESS_LICENSE",
        documentUrl: "https://placehold.co/800x600/png?text=ApexTech+Business+License",
        status: "APPROVED",
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
      },
      {
        sellerId: sellerEcoSphere.id,
        documentType: "BUSINESS_LICENSE",
        documentUrl: "https://placehold.co/800x600/png?text=EcoSphere+State+Registration",
        status: "PENDING",
      },
    ],
  });

  // 3. Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Cutting-edge computers, smartphones, audio systems, and smart home tech.",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
      icon: "Cpu",
      isFeatured: true,
      seoTitle: "Electronics & Smart Tech | MarketSphere",
      seoDescription: "Shop flagship laptops, noise-cancelling headphones, and smart home essentials.",
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: "Fashion & Apparel",
      slug: "fashion",
      description: "Curated designer wear, minimalist staples, luxury timepieces, and footwear.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
      icon: "Shirt",
      isFeatured: true,
      seoTitle: "Fashion & Apparel | MarketSphere",
      seoDescription: "Explore luxury fashion, performance outerwear, and timeless accessories.",
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: "Home & Living",
      slug: "home-living",
      description: "Ergonomic furniture, artisanal kitchenware, and ambient interior decor.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      icon: "Home",
      isFeatured: true,
      seoTitle: "Home, Kitchen & Living | MarketSphere",
      seoDescription: "Elevate your sanctuary with designer furniture, culinary gear, and ambient decor.",
    },
  });

  const catSports = await prisma.category.create({
    data: {
      name: "Sports & Fitness",
      slug: "sports-fitness",
      description: "Athletic equipment, gym gear, smart fitness monitors, and outdoor expedition gear.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      icon: "Activity",
      isFeatured: true,
      seoTitle: "Sports & Outdoor Gear | MarketSphere",
      seoDescription: "Engineered athletic gear, recovery tech, and outdoor adventure equipment.",
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: "Beauty & Wellness",
      slug: "beauty-wellness",
      description: "Clean skincare, organic serums, luxury fragrances, and holistic wellness rituals.",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      icon: "Sparkles",
      isFeatured: true,
      seoTitle: "Beauty & Wellness Essentials | MarketSphere",
      seoDescription: "Discover botanical skincare, rejuvenating elixirs, and luxury wellness.",
    },
  });

  const catGaming = await prisma.category.create({
    data: {
      name: "Gaming & Entertainment",
      slug: "gaming",
      description: "Mechanical keyboards, OLED displays, VR systems, and competitive esports gear.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      icon: "Gamepad2",
      isFeatured: true,
      seoTitle: "Pro Gaming & Esports Gear | MarketSphere",
      seoDescription: "Next-gen gaming consoles, ultra-responsive peripherals, and VR systems.",
    },
  });

  const catBooks = await prisma.category.create({
    data: {
      name: "Books & Stationery",
      slug: "books-stationery",
      description: "Bestselling literature, engineering compendiums, notebooks, and precision writing pens.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      icon: "BookOpen",
      isFeatured: false,
      seoTitle: "Books & Fine Stationery | MarketSphere",
      seoDescription: "Curated collection of bestselling literature, architectural books, and fountain pens.",
    },
  });

  const catAutomotive = await prisma.category.create({
    data: {
      name: "Automotive & Tools",
      slug: "automotive",
      description: "EV charging gear, 4K dashcams, smart diagnostics, and precision workshop tools.",
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
      icon: "Wrench",
      isFeatured: false,
      seoTitle: "Automotive Tech & Tools | MarketSphere",
      seoDescription: "Smart automotive diagnostics, EV accessories, and garage tooling.",
    },
  });

  // 4. Brands
  const brandApex = await prisma.brand.create({
    data: { name: "Apex Labs", slug: "apex-labs", logo: "https://placehold.co/120x60/png?text=APEX", isFeatured: true },
  });
  const brandSony = await prisma.brand.create({
    data: { name: "AuraSonics", slug: "aurasonics", logo: "https://placehold.co/120x60/png?text=AURASONICS", isFeatured: true },
  });
  const brandLumina = await prisma.brand.create({
    data: { name: "Lumina Studio", slug: "lumina-studio", logo: "https://placehold.co/120x60/png?text=LUMINA", isFeatured: true },
  });
  const brandAero = await prisma.brand.create({
    data: { name: "AeroTech Athletics", slug: "aerotech-athletics", logo: "https://placehold.co/120x60/png?text=AEROTECH", isFeatured: true },
  });
  const brandVortex = await prisma.brand.create({
    data: { name: "Vortex Gear", slug: "vortex-gear", logo: "https://placehold.co/120x60/png?text=VORTEX", isFeatured: true },
  });
  const brandBotanica = await prisma.brand.create({
    data: { name: "Pure Botanica", slug: "pure-botanica", logo: "https://placehold.co/120x60/png?text=BOTANICA", isFeatured: true },
  });

  // 5. Products Seed Data (32 Products)
  const productsData = [
    // Electronics & Computing
    {
      title: "ApexBook Pro M3 Max 16-inch",
      slug: "apexbook-pro-m3-max-16-inch",
      sku: "APX-NB-001",
      headline: "The ultimate workstation for software engineers and creators.",
      description: "Engineered for intense workflows. Featuring a 16.2-inch Liquid Retina XDR display with 120Hz ProMotion, 36GB unified memory, and extraordinary 22-hour battery life.",
      specifications: JSON.stringify({
        Processor: "Apex Silicon 16-Core CPU",
        Memory: "36GB Unified RAM",
        Storage: "1TB PCIe Gen4 NVMe SSD",
        Display: "16.2-inch Mini-LED 3456x2234 120Hz",
        Ports: "3x Thunderbolt 4, HDMI 2.1, SDXC, MagSafe 3",
        Weight: "4.7 lbs (2.14 kg)",
      }),
      basePrice: 2499.0,
      salePrice: 2299.0,
      stockQuantity: 42,
      lowStockThreshold: 5,
      isFeatured: true,
      isFlashDeal: true,
      flashDealEnd: new Date(Date.now() + 86400000 * 3),
      tags: JSON.stringify(["laptop", "creator", "programming", "apple", "m3", "workstation"]),
      categoryId: catElectronics.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.9,
      reviewCount: 128,
      totalSales: 310,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { name: "Space Gray / 1TB SSD", sku: "APX-NB-001-SG-1TB", price: 2299.0, stockQuantity: 24 },
        { name: "Silver / 2TB SSD", sku: "APX-NB-001-SL-2TB", price: 2699.0, stockQuantity: 18 },
      ],
    },
    {
      title: "AuraSonics WH-1000XM6 Wireless ANC Headphones",
      slug: "aurasonics-wh-1000xm6-wireless-anc-headphones",
      sku: "AUR-HP-002",
      headline: "Industry-leading active noise cancellation with spatial hi-res audio.",
      description: "Dual processor active noise cancellation isolates you from airplane cabin or cafe rumble. Features custom 40mm carbon-fiber drivers, 40-hour battery life, and crystal-clear beamforming microphones.",
      specifications: JSON.stringify({
        Driver: "40mm Carbon Fiber Composite",
        BatteryLife: "40 Hours (ANC On)",
        Bluetooth: "Version 5.4 with LDAC & aptX Lossless",
        Weight: "248 grams",
        FastCharging: "10 min charge = 5 hours playback",
      }),
      basePrice: 399.0,
      salePrice: 329.0,
      stockQuantity: 85,
      lowStockThreshold: 10,
      isFeatured: true,
      isFlashDeal: true,
      flashDealEnd: new Date(Date.now() + 86400000 * 2),
      tags: JSON.stringify(["headphones", "audio", "anc", "wireless", "bluetooth", "commute"]),
      categoryId: catElectronics.id,
      brandId: brandSony.id,
      sellerId: sellerApex.id,
      avgRating: 4.8,
      reviewCount: 240,
      totalSales: 680,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      ],
      variants: [
        { name: "Midnight Black", sku: "AUR-HP-002-BLK", price: 329.0, stockQuantity: 50 },
        { name: "Platinum Silver", sku: "AUR-HP-002-SLV", price: 329.0, stockQuantity: 35 },
      ],
    },
    {
      title: "ApexPulse Ultra 2 GPS Smartwatch 49mm",
      slug: "apexpulse-ultra-2-gps-smartwatch-49mm",
      sku: "APX-WT-003",
      headline: "Rugged aerospace titanium casing with multi-day expedition battery.",
      description: "Built for endurance athletes, divers, and trail explorers. Features dual-frequency GPS, depth gauge to 40 meters, ECG sensor, and 3000-nit always-on sapphire crystal display.",
      specifications: JSON.stringify({
        Case: "49mm Grade 5 Aerospace Titanium",
        WaterResistance: "100m ISO 22810 standard",
        Battery: "72 Hours in normal use / 120 Hours Low Power",
        Sensors: "ECG, SpO2, Temperature, Altimeter, Compass",
      }),
      basePrice: 799.0,
      salePrice: 749.0,
      stockQuantity: 35,
      lowStockThreshold: 5,
      isFeatured: true,
      tags: JSON.stringify(["smartwatch", "fitness", "gps", "titanium", "outdoor"]),
      categoryId: catElectronics.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.9,
      reviewCount: 94,
      totalSales: 215,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "OmniView 34-inch Curved QD-OLED Gaming Monitor",
      slug: "omniview-34-inch-curved-qd-oled-gaming-monitor",
      sku: "APX-MN-004",
      headline: "Ultrawide 175Hz 0.03ms quantum dot OLED immersion.",
      description: "Deep infinite blacks and vibrant 99.3% DCI-P3 color gamut. Ultra-responsive 0.03ms gray-to-gray response time eliminates motion blur completely for competitive gaming and color grading.",
      specifications: JSON.stringify({
        Resolution: "3440 x 1440 UWQHD",
        RefreshRate: "175Hz",
        ResponseTime: "0.03ms GtG",
        Panel: "Samsung QD-OLED 1800R Curve",
        HDR: "DisplayHDR True Black 400",
      }),
      basePrice: 1199.0,
      salePrice: 999.0,
      stockQuantity: 18,
      lowStockThreshold: 4,
      isFeatured: true,
      tags: JSON.stringify(["monitor", "oled", "gaming", "ultrawide", "175hz"]),
      categoryId: catGaming.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.8,
      reviewCount: 62,
      totalSales: 140,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Vortex Pro Wireless Mechanical Keyboard (75% Layout)",
      slug: "vortex-pro-wireless-mechanical-keyboard",
      sku: "VTX-KB-005",
      headline: "Gasket-mounted acoustic perfection with hot-swappable switches.",
      description: "CNC machined aluminum case, south-facing RGB, per-key macro programmability via QMK/VIA, and tri-mode connectivity (2.4GHz wireless, Bluetooth 5.2, USB-C).",
      specifications: JSON.stringify({
        FormFactor: "75% Compact (82 Keys)",
        Switches: "Factory Lubed Gateron Oil King Linear",
        Battery: "4000mAh (Up to 200 hours RGB off)",
        Keycaps: "Double-shot PBT Cherry Profile",
      }),
      basePrice: 189.0,
      salePrice: 159.0,
      stockQuantity: 54,
      lowStockThreshold: 8,
      isFeatured: false,
      tags: JSON.stringify(["keyboard", "mechanical", "gaming", "custom-keyboard", "wireless"]),
      categoryId: catGaming.id,
      brandId: brandVortex.id,
      sellerId: sellerApex.id,
      avgRating: 4.7,
      reviewCount: 110,
      totalSales: 480,
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Vortex Aerox Ultralight Wireless Gaming Mouse (49g)",
      slug: "vortex-aerox-ultralight-wireless-gaming-mouse",
      sku: "VTX-MS-006",
      headline: "Magnesium alloy exoskeleton with true 8000Hz polling rate.",
      description: "Weighing only 49 grams, this wireless mouse gives you unmatched flick precision. Equipped with the PixArt 3395 26,000 DPI optical sensor and optical microswitches rated for 100M clicks.",
      specifications: JSON.stringify({
        Weight: "49 grams",
        Sensor: "PixArt PAW3395 (26K DPI, 650 IPS)",
        PollingRate: "Up to 8000Hz Wireless",
        Battery: "80 hours continuous gameplay",
      }),
      basePrice: 129.0,
      salePrice: 99.0,
      stockQuantity: 70,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["mouse", "gaming", "ultralight", "wireless", "esports"]),
      categoryId: catGaming.id,
      brandId: brandVortex.id,
      sellerId: sellerApex.id,
      avgRating: 4.9,
      reviewCount: 88,
      totalSales: 390,
      images: [
        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Home & Kitchen / Living
    {
      title: "Lumina Barista Touch Espresso Machine",
      slug: "lumina-barista-touch-espresso-machine",
      sku: "LUM-ESP-007",
      headline: "Café-quality microfoam and precision PID temperature control at home.",
      description: "Dual boiler system allows simultaneous brewing and steaming. Intuitive touchscreen displays pre-programmed café drinks or allows complete manual barista extraction control with 9-bar pressure.",
      specifications: JSON.stringify({
        Pump: "Italian 15-Bar Ulka Pump (Brewing at 9-Bar)",
        Boiler: "Dual ThermoJet with 3-second heat up",
        Portafilter: "58mm Commercial Stainless Steel",
        WaterTank: "2.5 Liters removable",
      }),
      basePrice: 899.0,
      salePrice: 799.0,
      stockQuantity: 28,
      lowStockThreshold: 4,
      isFeatured: true,
      isFlashDeal: true,
      flashDealEnd: new Date(Date.now() + 86400000 * 4),
      tags: JSON.stringify(["coffee", "espresso", "kitchen", "barista", "appliance"]),
      categoryId: catHome.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.9,
      reviewCount: 156,
      totalSales: 410,
      images: [
        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina Ergonomic Executive Task Chair",
      slug: "lumina-ergonomic-executive-task-chair",
      sku: "LUM-CHR-008",
      headline: "Dynamic spinal posture support with breathable elastomeric mesh.",
      description: "Designed in collaboration with orthopedic surgeons. 4D adjustable armrests, synchronized tilt mechanism, and self-adjusting lumbar support keep you energized through 12+ hour focus blocks.",
      specifications: JSON.stringify({
        Material: "AeroWeave Poly-mesh + Cast Aluminum Base",
        WeightCapacity: "350 lbs (158 kg)",
        Adjustability: "Seat depth, 4D armrests, tilt limiter, tension",
        Warranty: "12-Year full manufacturer warranty",
      }),
      basePrice: 599.0,
      salePrice: 499.0,
      stockQuantity: 22,
      lowStockThreshold: 5,
      isFeatured: true,
      tags: JSON.stringify(["chair", "ergonomic", "office", "desk", "furniture"]),
      categoryId: catHome.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.8,
      reviewCount: 92,
      totalSales: 280,
      images: [
        "https://images.unsplash.com/photo-1580481077197-2856272559e2?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina Cast Iron 5.5-Quart Dutch Oven",
      slug: "lumina-cast-iron-55-quart-dutch-oven",
      sku: "LUM-DO-009",
      headline: "Artisanal vitreous enamel finish for lifelong braising and baking.",
      description: "Superior heat retention and even distribution. Self-basting lid keeps poultry and sourdough intensely moist. Safe for all stovetops including induction and oven-safe up to 500°F.",
      specifications: JSON.stringify({
        Capacity: "5.5 Quarts (5.2 Liters)",
        Material: "Enameled Cast Iron",
        MaxTemp: "500°F (260°C)",
        Diameter: "10.25 inches",
      }),
      basePrice: 199.0,
      salePrice: 159.0,
      stockQuantity: 45,
      lowStockThreshold: 8,
      isFeatured: false,
      tags: JSON.stringify(["cookware", "dutch-oven", "kitchen", "baking", "cast-iron"]),
      categoryId: catHome.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.9,
      reviewCount: 84,
      totalSales: 310,
      images: [
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina PureAir HEPA Smart Air Purifier",
      slug: "lumina-pureair-hepa-smart-air-purifier",
      sku: "LUM-AIR-010",
      headline: "Captures 99.97% of airborne allergens, wildfire smoke, and VOCs.",
      description: "Quiet 22dB sleep mode, dual laser particulate sensors, and real-time PM2.5 air quality display. Automatically dials fan speed to purify a 1,200 sq ft room in 30 minutes.",
      specifications: JSON.stringify({
        Coverage: "Up to 1,200 sq ft (111 m²)",
        Filter: "3-Stage Medical Grade True HEPA H13 + Carbon",
        NoiseLevel: "22dB - 48dB",
        SmartControls: "Wi-Fi, Alexa, Google Home integration",
      }),
      basePrice: 249.0,
      salePrice: 199.0,
      stockQuantity: 60,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["air-purifier", "hepa", "smart-home", "clean-air", "home"]),
      categoryId: catHome.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.8,
      reviewCount: 77,
      totalSales: 290,
      images: [
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Fashion & Apparel
    {
      title: "AeroTech StormShield All-Weather Technical Parka",
      slug: "aerotech-stormshield-all-weather-technical-parka",
      sku: "AER-PK-011",
      headline: "Triple-layer waterproof GORE-style membrane with recycled thermal down.",
      description: "Designed to conquer freezing rain, blizzards, and urban commutes. Features taped YKK Aquaguard zippers, magnetic storm flap closures, and internal fleece-lined device pockets.",
      specifications: JSON.stringify({
        Waterproofing: "28,000mm hydrostatic head rating",
        Insulation: "750 Fill Power Responsible Down Standard (RDS)",
        Breathability: "20,000 g/m²/24h",
        Pockets: "8 ergonomic storage compartments",
      }),
      basePrice: 420.0,
      salePrice: 349.0,
      stockQuantity: 38,
      lowStockThreshold: 6,
      isFeatured: true,
      tags: JSON.stringify(["jacket", "parka", "waterproof", "winter", "outerwear", "fashion"]),
      categoryId: catFashion.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.9,
      reviewCount: 114,
      totalSales: 340,
      images: [
        "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "AeroTech Apex Carbon Road Running Shoes",
      slug: "aerotech-apex-carbon-road-running-shoes",
      sku: "AER-SH-012",
      headline: "Full-length curved carbon plate with PEBA supercritical rebound foam.",
      description: "Engineered for marathon PRs and tempo training. Delivers 88% energy return per stride, weighing under 7.2 oz with an ultra-breathable single-layer engineered monomesh upper.",
      specifications: JSON.stringify({
        Weight: "7.2 oz (204g) Men's size 9",
        StackHeight: "39mm heel / 31mm forefoot (8mm drop)",
        Plate: "3D Curved Carbon Fiber Spoon Plate",
        Outsole: "Continental rubber high-abrasion traction",
      }),
      basePrice: 260.0,
      salePrice: 220.0,
      stockQuantity: 48,
      lowStockThreshold: 8,
      isFeatured: true,
      tags: JSON.stringify(["running", "shoes", "carbon-plate", "marathon", "fitness", "sneakers"]),
      categoryId: catFashion.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.8,
      reviewCount: 142,
      totalSales: 510,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina Minimalist Automatic Chronograph Watch",
      slug: "lumina-minimalist-automatic-chronograph-watch",
      sku: "LUM-WT-013",
      headline: "Japanese automatic 24-jewel movement with anti-reflective sapphire crystal.",
      description: "Bauhaus-inspired clean dial, 316L surgical-grade stainless steel case, and quick-release Italian vegetable-tanned full grain leather strap. Exhibition caseback showcases the oscillating rotor.",
      specifications: JSON.stringify({
        Movement: "Seiko NH35A Automatic 21,600 bph",
        CaseDiameter: "40mm / 11mm thickness",
        Crystal: "Domed Scratch-Resistant Sapphire with AR coating",
        WaterResistance: "5 ATM (50 meters)",
      }),
      basePrice: 349.0,
      salePrice: 289.0,
      stockQuantity: 30,
      lowStockThreshold: 5,
      isFeatured: false,
      tags: JSON.stringify(["watch", "chronograph", "automatic", "luxury", "accessories"]),
      categoryId: catFashion.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.7,
      reviewCount: 58,
      totalSales: 160,
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "AeroTech Merino Wool Seamless Baselayer",
      slug: "aerotech-merino-wool-seamless-baselayer",
      sku: "AER-BL-014",
      headline: "100% 200gsm Australian ultra-fine merino wool for thermal regulation.",
      description: "Naturally odor-resistant, temperature-regulating, and moisture-wicking. Flatlock seams prevent chafing during alpine touring, winter running, or cool daily commutes.",
      specifications: JSON.stringify({
        Fabric: "100% 18.5 Micron Merino Wool (200gsm)",
        Fit: "Next-to-skin athletic contour",
        Care: "Machine washable cold, line dry",
      }),
      basePrice: 95.0,
      salePrice: 79.0,
      stockQuantity: 65,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["merino", "baselayer", "wool", "thermal", "outdoor"]),
      categoryId: catFashion.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.8,
      reviewCount: 68,
      totalSales: 280,
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Sports & Fitness
    {
      title: "AeroFit Pro Adjustable Dumbbell Set (5-52.5 lbs)",
      slug: "aerofit-pro-adjustable-dumbbell-set",
      sku: "AER-DB-015",
      headline: "Fast dial weight selection replaces 15 sets of traditional weights.",
      description: "Compact home gym solution. Smooth rotating dial lets you transition weights in seconds from 5 lbs up to 52.5 lbs per dumbbell. Durable molding provides smooth lift-off and quiet workouts.",
      specifications: JSON.stringify({
        WeightRange: "5 to 52.5 lbs per dumbbell (2.3 to 24 kg)",
        Increments: "2.5 lb increments for the first 25 lbs",
        Dimensions: "15.75 x 8 x 9 inches each",
        Trays: "Includes two heavy-duty storage base cradles",
      }),
      basePrice: 399.0,
      salePrice: 349.0,
      stockQuantity: 25,
      lowStockThreshold: 4,
      isFeatured: true,
      tags: JSON.stringify(["gym", "dumbbells", "fitness", "home-workout", "weights"]),
      categoryId: catSports.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.9,
      reviewCount: 180,
      totalSales: 450,
      images: [
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "AeroFit Dynamic Percussion Massage Gun",
      slug: "aerofit-dynamic-percussion-massage-gun",
      sku: "AER-MG-016",
      headline: "16mm deep tissue amplitude with brushless 60-lb stall force motor.",
      description: "Accelerate muscle recovery and melt myofascial tension. 5 calibrated speed settings, ultra-quiet QuietGlide technology (<40dB), and 6 hours of continuous runtime per charge.",
      specifications: JSON.stringify({
        Amplitude: "16mm deep tissue penetration",
        StallForce: "Up to 60 lbs",
        Battery: "2600mAh Li-ion (6 Hours runtime)",
        Attachments: "6 antimicrobial interchangeable heads",
      }),
      basePrice: 199.0,
      salePrice: 149.0,
      stockQuantity: 50,
      lowStockThreshold: 8,
      isFeatured: false,
      tags: JSON.stringify(["recovery", "massage", "fitness", "wellness", "percussion"]),
      categoryId: catSports.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.8,
      reviewCount: 124,
      totalSales: 380,
      images: [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "AeroFit Alignment Non-Slip Natural Rubber Yoga Mat (6mm)",
      slug: "aerofit-alignment-non-slip-natural-rubber-yoga-mat",
      sku: "AER-YM-017",
      headline: "Laser-etched posture alignment grid with sweat-wicking polyurethane top.",
      description: "Zero slipping even during heated vinyasa or power yoga. High-density natural tree rubber base cushions joints, hips, and knees. 100% biodegradable and non-toxic.",
      specifications: JSON.stringify({
        Dimensions: "72 x 26 inches (183 x 66 cm)",
        Thickness: "6mm extra dense cushioning",
        Weight: "5.5 lbs (2.5 kg)",
        EcoCredentials: "Sustainably harvested natural tree rubber",
      }),
      basePrice: 85.0,
      salePrice: 68.0,
      stockQuantity: 75,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["yoga", "mat", "fitness", "rubber", "pilates"]),
      categoryId: catSports.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.9,
      reviewCount: 96,
      totalSales: 410,
      images: [
        "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Beauty & Wellness
    {
      title: "Botanica Tri-Peptide & Hyaluronic Youth Elixir (50ml)",
      slug: "botanica-tri-peptide-hyaluronic-youth-elixir",
      sku: "BOT-SR-018",
      headline: "Multi-molecular weight hyaluronic acid with 5% copper peptide complex.",
      description: "Clinically proven to boost skin elasticity, restore the lipid moisture barrier, and visibly soften fine expression lines. 100% vegan, cruelty-free, and fragrance-free.",
      specifications: JSON.stringify({
        Volume: "1.7 fl oz / 50ml",
        KeyActives: "Copper Tripeptide-1, Multi-Depth HA, Niacinamide 4%",
        SkinType: "Suitable for all skin types, including sensitive",
      }),
      basePrice: 78.0,
      salePrice: 62.0,
      stockQuantity: 90,
      lowStockThreshold: 12,
      isFeatured: true,
      tags: JSON.stringify(["skincare", "serum", "anti-aging", "peptides", "beauty"]),
      categoryId: catBeauty.id,
      brandId: brandBotanica.id,
      sellerId: sellerLumina.id,
      avgRating: 4.9,
      reviewCount: 210,
      totalSales: 630,
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Botanica Restorative Bakuchiol Night Renewal Cream",
      slug: "botanica-restorative-bakuchiol-night-renewal-cream",
      sku: "BOT-CR-019",
      headline: "Plant-derived retinol alternative with ceramide complex and squalane.",
      description: "Get all the collagen-renewing benefits of retinol without irritation, redness, or photosensitivity. Deeply hydrates and calms overnight so you wake up to luminous skin.",
      specifications: JSON.stringify({
        Volume: "1.7 oz / 50g",
        KeyActives: "2% Natural Bakuchiol, Ceramides NP/AP/EOP, Squalane",
        Formulation: "Rich velvety whipped cream",
      }),
      basePrice: 65.0,
      salePrice: 52.0,
      stockQuantity: 60,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["skincare", "moisturizer", "night-cream", "bakuchiol", "vegan"]),
      categoryId: catBeauty.id,
      brandId: brandBotanica.id,
      sellerId: sellerLumina.id,
      avgRating: 4.8,
      reviewCount: 88,
      totalSales: 290,
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Botanica Santal & Amber Eau de Parfum (100ml)",
      slug: "botanica-santal-amber-eau-de-parfum",
      sku: "BOT-PF-020",
      headline: "Smoky Australian sandalwood, cardamom, violet leaf, and golden amber.",
      description: "An intoxicating genderless artisanal fragrance created in Grasse, France. Opens with fresh cracked cardamom and papyrus, deepening into warm creamy sandalwood and cedarwood.",
      specifications: JSON.stringify({
        Concentration: "Eau de Parfum (22% fragrance oil)",
        Volume: "3.4 fl oz / 100ml",
        TopNotes: "Cardamom, Violet Leaf, Italian Bergamot",
        HeartNotes: "Papyrus, Iris, Cedarwood",
        BaseNotes: "Australian Sandalwood, Warm Amber, Cashmere Musk",
      }),
      basePrice: 145.0,
      salePrice: 125.0,
      stockQuantity: 40,
      lowStockThreshold: 5,
      isFeatured: true,
      tags: JSON.stringify(["fragrance", "perfume", "sandalwood", "luxury", "amber"]),
      categoryId: catBeauty.id,
      brandId: brandBotanica.id,
      sellerId: sellerLumina.id,
      avgRating: 4.9,
      reviewCount: 95,
      totalSales: 260,
      images: [
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Books & Stationery
    {
      title: "Designing Data-Intensive Applications (Hardcover Edition)",
      slug: "designing-data-intensive-applications-hardcover",
      sku: "BOK-CS-021",
      headline: "The foundational guide to scalable distributed storage, batch, and streaming.",
      description: "Martin Kleppmann’s magnum opus on the architecture and trade-offs behind modern distributed data systems, consensus algorithms, replication, and data models.",
      specifications: JSON.stringify({
        Author: "Martin Kleppmann",
        Format: "Hardcover, 616 pages",
        Publisher: "O'Reilly Media",
        Language: "English",
        ISBN: "978-1449373320",
      }),
      basePrice: 59.99,
      salePrice: 47.99,
      stockQuantity: 110,
      lowStockThreshold: 15,
      isFeatured: true,
      tags: JSON.stringify(["book", "software-engineering", "distributed-systems", "database", "tech"]),
      categoryId: catBooks.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 5.0,
      reviewCount: 380,
      totalSales: 1200,
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina Brass & Matte Black Fountain Pen (Fine Nib)",
      slug: "lumina-brass-matte-black-fountain-pen",
      sku: "LUM-FP-022",
      headline: "Precision German iridium-tipped nib with weighted brass balance.",
      description: "Milled from solid brass with a resilient matte black PVD coating. Includes a luxury piston ink converter and 6 international black ink cartridges in a presentation gift box.",
      specifications: JSON.stringify({
        Nib: "German Jowo #6 Fine Stainless Steel Iridium",
        Weight: "42 grams (perfectly balanced)",
        Length: "138mm capped / 125mm uncapped",
        InkSystem: "Piston converter + standard international cartridges",
      }),
      basePrice: 75.0,
      salePrice: 59.0,
      stockQuantity: 80,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["pen", "fountain-pen", "stationery", "writing", "brass"]),
      categoryId: catBooks.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.8,
      reviewCount: 72,
      totalSales: 290,
      images: [
        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Automotive & Tools
    {
      title: "ApexDrive 4K Dual Dash Cam with GPS & Night Vision",
      slug: "apexdrive-4k-dual-dash-cam-gps-night-vision",
      sku: "APX-DC-023",
      headline: "Front 4K UHD + Rear 1080p with Sony STARVIS 2 image sensors.",
      description: "Records ultra-crisp license plates day or night with HDR. Features 5GHz Wi-Fi for instant smartphone clip downloads, built-in GPS route logging, and 24/7 parking surveillance mode.",
      specifications: JSON.stringify({
        Resolution: "Front 4K (3840x2160 @30fps) + Rear 1080p",
        Sensor: "Sony STARVIS 2 IMX678",
        ViewingAngle: "150° Front / 140° Rear wide-angle",
        Storage: "Includes 128GB High-Endurance MicroSD card",
      }),
      basePrice: 199.0,
      salePrice: 159.0,
      stockQuantity: 45,
      lowStockThreshold: 6,
      isFeatured: false,
      tags: JSON.stringify(["dashcam", "automotive", "car", "4k", "gps", "security"]),
      categoryId: catAutomotive.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.8,
      reviewCount: 110,
      totalSales: 350,
      images: [
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "ApexDrive Portable 2500A Car Jump Starter & Power Bank",
      slug: "apexdrive-portable-2500a-car-jump-starter",
      sku: "APX-JS-024",
      headline: "Starts dead 8.5L gas & 6.0L diesel engines up to 30 times on a single charge.",
      description: "Spark-proof smart jumper clamps with reverse polarity protection. Doubles as a 20,000mAh portable charger with 65W USB-C PD fast-charging for laptops and phones, plus a 400-lumen emergency flashlight.",
      specifications: JSON.stringify({
        PeakCurrent: "2500 Amps",
        BatteryCapacity: "20,000mAh (74Wh)",
        Outputs: "USB-C PD 65W, 2x USB-A QC 3.0, 12V DC Out",
        Safety: "10 built-in intelligent protections",
      }),
      basePrice: 139.0,
      salePrice: 109.0,
      stockQuantity: 55,
      lowStockThreshold: 8,
      isFeatured: false,
      tags: JSON.stringify(["jump-starter", "automotive", "emergency", "battery", "tools"]),
      categoryId: catAutomotive.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.9,
      reviewCount: 145,
      totalSales: 470,
      images: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      ],
    },

    // Additional popular catalog items across categories
    {
      title: "ApexTab Studio 13 OLED Drawing Tablet",
      slug: "apextab-studio-13-oled-drawing-tablet",
      sku: "APX-TB-025",
      headline: "2.8K 120Hz tandem OLED display with 8192 levels of pressure stylus.",
      description: "Engineered for digital illustrators and animators. Zero parallax laminated glass feels like genuine paper. Powered by 8-core silicon with full stylus tilt and palm rejection.",
      specifications: JSON.stringify({
        Display: "13.0-inch 2880x1800 120Hz OLED",
        Stylus: "Active EMR Stylus (Zero battery needed)",
        RAM: "16GB LPDDR5X",
        Storage: "512GB NVMe",
      }),
      basePrice: 899.0,
      salePrice: 799.0,
      stockQuantity: 30,
      lowStockThreshold: 5,
      isFeatured: false,
      tags: JSON.stringify(["tablet", "drawing", "oled", "stylus", "art", "electronics"]),
      categoryId: catElectronics.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.8,
      reviewCount: 52,
      totalSales: 160,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "AuraSonics Portable Waterproof Bluetooth Speaker (30W)",
      slug: "aurasonics-portable-waterproof-bluetooth-speaker",
      sku: "AUR-SP-026",
      headline: "360-degree room-filling acoustic bass with IP67 floating waterproof rating.",
      description: "Take the soundtrack anywhere. Dual passive radiators deliver deep bass punches. 24 hours of playback, party link to daisy chain up to 100 speakers, and USB-C powerbank out.",
      specifications: JSON.stringify({
        Power: "30W RMS (Dual woofers + dual tweeters)",
        Waterproof: "IP67 Submersible up to 1 meter for 30 min",
        Battery: "24 Hours playback",
        Dimensions: "7.8 x 3.1 x 3.1 inches",
      }),
      basePrice: 129.0,
      salePrice: 89.0,
      stockQuantity: 95,
      lowStockThreshold: 15,
      isFeatured: false,
      isFlashDeal: true,
      flashDealEnd: new Date(Date.now() + 86400000 * 2),
      tags: JSON.stringify(["speaker", "bluetooth", "audio", "waterproof", "portable"]),
      categoryId: catElectronics.id,
      brandId: brandSony.id,
      sellerId: sellerApex.id,
      avgRating: 4.7,
      reviewCount: 195,
      totalSales: 780,
      images: [
        "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina Nordic Ceramic Pour-Over Coffee Set",
      slug: "lumina-nordic-ceramic-pour-over-coffee-set",
      sku: "LUM-PO-027",
      headline: "Matte stoneware dripper with double-walled 600ml glass server.",
      description: "Designed for the ultimate manual pour-over experience. Internal spiral ribs optimize water flow and extraction timing. Crafted from durable heat-retaining ceramic with acacia wood lid.",
      specifications: JSON.stringify({
        Capacity: "600ml (2-4 Cups)",
        Material: "High-fired Stoneware + Borosilicate Glass",
        FilterCompatibility: "Standard cone #02 filters",
      }),
      basePrice: 55.0,
      salePrice: 44.0,
      stockQuantity: 65,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["coffee", "pour-over", "kitchen", "ceramic", "nordic"]),
      categoryId: catHome.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.9,
      reviewCount: 48,
      totalSales: 210,
      images: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Lumina Artisanal Scented Soy Candle (Cardamom & Fig)",
      slug: "lumina-artisanal-scented-soy-candle",
      sku: "LUM-CD-028",
      headline: "Hand-poured 100% natural soy wax with crackling organic wooden wick.",
      description: "Infuse your space with lush wild Mediterranean fig, spiced crushed cardamom, and sweet cedar bark. Clean burn with no parabens, phthalates, or synthetic petroleum additives.",
      specifications: JSON.stringify({
        Weight: "11 oz (312g)",
        BurnTime: "65-75 Hours",
        Wax: "100% USA Farmed Soy Wax",
        Vessel: "Reusable frosted amber glass jar",
      }),
      basePrice: 38.0,
      salePrice: 29.0,
      stockQuantity: 120,
      lowStockThreshold: 20,
      isFeatured: false,
      tags: JSON.stringify(["candle", "home-decor", "soy-wax", "aromatherapy", "gift"]),
      categoryId: catHome.id,
      brandId: brandLumina.id,
      sellerId: sellerLumina.id,
      avgRating: 4.8,
      reviewCount: 112,
      totalSales: 540,
      images: [
        "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "AeroTech Apex Hydro-Flask 32oz Insulated Bottle",
      slug: "aerotech-apex-hydro-flask-32oz",
      sku: "AER-WB-029",
      headline: "Vacuum insulated 18/8 pro-grade stainless steel keeps ice frozen 24h.",
      description: "Zero condensation sweat, leak-proof magnetic chug cap, and durable powder-coat finish that won't chip or scratch during rugged trail expeditions.",
      specifications: JSON.stringify({
        Volume: "32 fl oz (946ml)",
        Insulation: "Double-wall TempShield vacuum insulation",
        Material: "18/8 Food-grade stainless steel, BPA-free",
      }),
      basePrice: 42.0,
      salePrice: 34.0,
      stockQuantity: 150,
      lowStockThreshold: 25,
      isFeatured: false,
      tags: JSON.stringify(["water-bottle", "fitness", "outdoor", "hydration", "sports"]),
      categoryId: catSports.id,
      brandId: brandAero.id,
      sellerId: sellerAeroFit.id,
      avgRating: 4.9,
      reviewCount: 230,
      totalSales: 920,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "Vortex 4K Virtual Reality Headset (Wireless PCVR)",
      slug: "vortex-4k-virtual-reality-headset",
      sku: "VTX-VR-030",
      headline: "Pancake optics with 120° FOV, inside-out tracking, and Wi-Fi 6E streaming.",
      description: "Next generation standalone and PCVR immersion. Dual 4K QD-LCD panels deliver 2560x2560 per eye with zero screen-door effect. Balanced halo strap for featherlight all-day comfort.",
      specifications: JSON.stringify({
        Resolution: "2560 x 2560 per eye (5K Combined)",
        RefreshRate: "90Hz / 120Hz experimental",
        Optics: "Edge-to-edge clear Pancake Lenses",
        Weight: "460 grams balanced",
      }),
      basePrice: 699.0,
      salePrice: 599.0,
      stockQuantity: 20,
      lowStockThreshold: 4,
      isFeatured: true,
      tags: JSON.stringify(["vr", "virtual-reality", "gaming", "headset", "metaverse"]),
      categoryId: catGaming.id,
      brandId: brandVortex.id,
      sellerId: sellerApex.id,
      avgRating: 4.7,
      reviewCount: 44,
      totalSales: 110,
      images: [
        "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "The Pragmatic Programmer: 20th Anniversary Edition",
      slug: "the-pragmatic-programmer-20th-anniversary",
      sku: "BOK-CS-031",
      headline: "Your journey to mastery in software craftsmanship and systems design.",
      description: "David Thomas and Andrew Hunt examine core coding philosophy, architecture, refactoring, career growth, and how to stay ahead of changing paradigms.",
      specifications: JSON.stringify({
        Authors: "David Thomas, Andrew Hunt",
        Format: "Hardcover, 352 pages",
        Publisher: "Addison-Wesley Professional",
        Language: "English",
      }),
      basePrice: 49.99,
      salePrice: 39.99,
      stockQuantity: 85,
      lowStockThreshold: 10,
      isFeatured: false,
      tags: JSON.stringify(["book", "software-engineering", "programming", "coding", "craftsmanship"]),
      categoryId: catBooks.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 5.0,
      reviewCount: 310,
      totalSales: 950,
      images: [
        "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      title: "ApexCharge 100W GaN Fast Wall Charger (4-Port)",
      slug: "apexcharge-100w-gan-fast-wall-charger",
      sku: "APX-CH-032",
      headline: "Pocket-sized gallium nitride power for 2 laptops and 2 phones simultaneously.",
      description: "Advanced GaN III technology produces 50% less heat in an ultra-compact folding pin design. Intelligent dynamic power allocation routes maximum wattage where needed.",
      specifications: JSON.stringify({
        TotalOutput: "100W Max",
        Ports: "3x USB-C PD 3.0 + 1x USB-A QC 3.0",
        Safety: "ActiveShield 2.0 temperature monitoring",
        Dimensions: "2.6 x 2.6 x 1.2 inches (210g)",
      }),
      basePrice: 69.0,
      salePrice: 49.0,
      stockQuantity: 140,
      lowStockThreshold: 20,
      isFeatured: false,
      tags: JSON.stringify(["charger", "gan", "usb-c", "fast-charging", "electronics", "accessories"]),
      categoryId: catElectronics.id,
      brandId: brandApex.id,
      sellerId: sellerApex.id,
      avgRating: 4.8,
      reviewCount: 220,
      totalSales: 870,
      images: [
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  for (const item of productsData) {
    const { images, variants, ...prodFields } = item as any;
    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
      },
    });

    // Images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: createdProduct.id,
            url: images[i],
            isPrimary: i === 0,
            sortOrder: i,
          },
        });
      }
    }

    // Variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            stockQuantity: v.stockQuantity,
            attributesJson: JSON.stringify({ variant: v.name }),
            isDefault: v === variants[0],
          },
        });
      }
    }

    // Initial Inventory Record
    await prisma.inventory.create({
      data: {
        productId: createdProduct.id,
        quantityOnHand: createdProduct.stockQuantity,
        quantityReserved: 0,
        lowStockAlert: createdProduct.lowStockThreshold,
      },
    });
  }

  // 6. Promotions & Flash Deals
  await prisma.promotion.createMany({
    data: [
      {
        title: "Spring Tech & Creator Expo 2026",
        subtitle: "Up to 30% off high-performance workstations, ANC headphones & ultra-wide displays.",
        bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
        linkUrl: "/search?category=electronics",
        type: "HERO_BANNER",
        discountPercentage: 30,
        priority: 10,
      },
      {
        title: "Lumina Home & Culinary Refresh",
        subtitle: "Transform your daily routine with artisanal espresso systems and ergonomic living.",
        bannerImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
        linkUrl: "/search?category=home-living",
        type: "HERO_BANNER",
        discountPercentage: 20,
        priority: 9,
      },
      {
        title: "Flash Deals of the Day",
        subtitle: "Limited quantity deals expiring soon.",
        bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
        linkUrl: "/search?flashDeal=true",
        type: "FLASH_SALE",
        discountPercentage: 25,
        priority: 8,
      },
    ],
  });

  // 7. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off your first order on MarketSphere",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 50,
        maxDiscountAmount: 100,
        usageLimit: 5000,
        perUserLimit: 1,
        timesUsed: 42,
        isActive: true,
      },
      {
        code: "SUMMER50",
        description: "$50 off any purchase over $250",
        discountType: "FIXED",
        discountValue: 50,
        minOrderAmount: 250,
        usageLimit: 1000,
        perUserLimit: 1,
        timesUsed: 19,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free expedited shipping on orders over $75",
        discountType: "FIXED",
        discountValue: 15,
        minOrderAmount: 75,
        usageLimit: 10000,
        perUserLimit: 3,
        timesUsed: 88,
        isActive: true,
      },
    ],
  });

  // 8. Orders & Historical Data (for Analytics and Testing)
  const laptopProduct = await prisma.product.findUnique({ where: { slug: "apexbook-pro-m3-max-16-inch" } });
  const headphonesProduct = await prisma.product.findUnique({ where: { slug: "aurasonics-wh-1000xm6-wireless-anc-headphones" } });
  const espressoProduct = await prisma.product.findUnique({ where: { slug: "lumina-barista-touch-espresso-machine" } });
  const chairProduct = await prisma.product.findUnique({ where: { slug: "lumina-ergonomic-executive-task-chair" } });

  if (laptopProduct && headphonesProduct && espressoProduct && chairProduct) {
    // Order 1: Delivered Order
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "MS-2026-89410",
        customerId: customerUser.id,
        status: "DELIVERED",
        paymentStatus: "PAID",
        subtotal: 2628.0,
        discountAmount: 100.0,
        shippingFee: 0.0,
        taxAmount: 214.88,
        totalAmount: 2742.88,
        couponCode: "WELCOME10",
        shippingAddressJson: JSON.stringify({
          fullName: "Alex Mercer",
          street: "742 Evergreen Terrace, Suite 4B",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "United States",
        }),
        shippingMethod: "EXPRESS",
        trackingNumber: "MS-EXP-9821049",
        carrier: "MarketSphere Express",
        createdAt: new Date(Date.now() - 86400000 * 12),
        items: {
          create: [
            {
              sellerId: sellerApex.id,
              productId: laptopProduct.id,
              title: laptopProduct.title,
              sku: laptopProduct.sku,
              unitPrice: 2299.0,
              quantity: 1,
              subtotal: 2299.0,
              sellerStatus: "DELIVERED",
              trackingNumber: "MS-EXP-9821049",
            },
            {
              sellerId: sellerApex.id,
              productId: headphonesProduct.id,
              title: headphonesProduct.title,
              sku: headphonesProduct.sku,
              unitPrice: 329.0,
              quantity: 1,
              subtotal: 329.0,
              sellerStatus: "DELIVERED",
              trackingNumber: "MS-EXP-9821049",
            },
          ],
        },
        payments: {
          create: {
            paymentProvider: "STRIPE",
            providerPaymentId: "pi_test_3N8x7291aB0cDeF",
            amount: 2742.88,
            currency: "USD",
            status: "SUCCEEDED",
            paymentMethodType: "CARD",
          },
        },
        shipments: {
          create: {
            carrier: "MarketSphere Express",
            trackingNumber: "MS-EXP-9821049",
            status: "DELIVERED",
            shippedAt: new Date(Date.now() - 86400000 * 10),
            deliveredAt: new Date(Date.now() - 86400000 * 7),
          },
        },
      },
    });

    // Order 2: In-Transit / Shipped Order
    await prisma.order.create({
      data: {
        orderNumber: "MS-2026-91024",
        customerId: customer2User.id,
        status: "SHIPPED",
        paymentStatus: "PAID",
        subtotal: 799.0,
        discountAmount: 50.0,
        shippingFee: 0.0,
        taxAmount: 63.66,
        totalAmount: 812.66,
        couponCode: "SUMMER50",
        shippingAddressJson: JSON.stringify({
          fullName: "Sarah Connor",
          street: "100 Resistance Way",
          city: "Los Angeles",
          state: "CA",
          postalCode: "90001",
          country: "United States",
        }),
        shippingMethod: "STANDARD",
        trackingNumber: "UPS-1Z9999999999999999",
        carrier: "UPS",
        estimatedDelivery: new Date(Date.now() + 86400000 * 2),
        createdAt: new Date(Date.now() - 86400000 * 2),
        items: {
          create: [
            {
              sellerId: sellerLumina.id,
              productId: espressoProduct.id,
              title: espressoProduct.title,
              sku: espressoProduct.sku,
              unitPrice: 799.0,
              quantity: 1,
              subtotal: 799.0,
              sellerStatus: "SHIPPED",
              trackingNumber: "UPS-1Z9999999999999999",
            },
          ],
        },
        payments: {
          create: {
            paymentProvider: "STRIPE",
            providerPaymentId: "pi_test_4M9y8302bC1dEfG",
            amount: 812.66,
            currency: "USD",
            status: "SUCCEEDED",
          },
        },
        shipments: {
          create: {
            carrier: "UPS",
            trackingNumber: "UPS-1Z9999999999999999",
            status: "IN_TRANSIT",
            shippedAt: new Date(Date.now() - 86400000 * 1),
            estimatedDelivery: new Date(Date.now() + 86400000 * 2),
          },
        },
      },
    });

    // 9. Verified Customer Reviews
    await prisma.review.create({
      data: {
        productId: laptopProduct.id,
        userId: customerUser.id,
        orderId: order1.id,
        rating: 5,
        title: "Phenomenal powerhouse for development",
        comment: "Compilation times for massive Next.js & Rust projects are literally instantaneous. The Liquid Retina screen is breathtaking, and the battery genuinely lasts two entire working days without plugging in.",
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulVotes: 34,
      },
    });

    await prisma.review.create({
      data: {
        productId: headphonesProduct.id,
        userId: customerUser.id,
        orderId: order1.id,
        rating: 5,
        title: "Best ANC headphones I have ever owned",
        comment: "Transatlantic flights are silent now. The soundstage is rich and detailed with punchy, controlled bass. Multipoint Bluetooth switching between my laptop and phone works flawlessly.",
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulVotes: 19,
      },
    });

    await prisma.review.create({
      data: {
        productId: headphonesProduct.id,
        userId: customer2User.id,
        rating: 4,
        title: "Superb noise cancelling, earcups run slightly warm",
        comment: "The noise cancellation is unmatched. Just note that during long 5-hour gym sessions your ears can get slightly warm, but the sound quality and comfort for daily work are 10/10.",
        isVerifiedPurchase: true,
        isApproved: true,
        helpfulVotes: 8,
      },
    });
  }

  // 10. Sample In-App Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customerUser.id,
        role: "CUSTOMER",
        title: "Order Delivered!",
        message: "Your order MS-2026-89410 has been delivered to 742 Evergreen Terrace.",
        type: "ORDER",
        link: "/orders/MS-2026-89410/track",
      },
      {
        userId: seller1User.id,
        role: "SELLER",
        title: "New High-Value Order Received",
        message: "Order MS-2026-89410 for ApexBook Pro M3 Max has been paid and confirmed.",
        type: "ORDER",
        link: "/seller/orders",
      },
      {
        userId: adminUser.id,
        role: "ADMIN",
        title: "New Seller Application: EcoSphere Organics",
        message: "EcoSphere Organics submitted business documentation awaiting verification.",
        type: "SYSTEM",
        link: "/admin/sellers",
      },
    ],
  });

  // 11. Initial Platform Audit Log
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: adminUser.id,
        actorRole: "ADMIN",
        action: "SELLER_APPROVED",
        entityType: "SELLER",
        entityId: sellerApex.id,
        changesJson: JSON.stringify({ status: "APPROVED", commissionRate: 8.5 }),
      },
      {
        actorId: adminUser.id,
        actorRole: "ADMIN",
        action: "SELLER_APPROVED",
        entityType: "SELLER",
        entityId: sellerLumina.id,
        changesJson: JSON.stringify({ status: "APPROVED", commissionRate: 9.0 }),
      },
      {
        actorId: adminUser.id,
        actorRole: "ADMIN",
        action: "PLATFORM_INITIALIZATION",
        entityType: "SYSTEM",
        entityId: "SYSTEM_INIT",
        changesJson: JSON.stringify({ version: "1.0.0", environment: "development" }),
      },
    ],
  });

  console.log("✅ MarketSphere database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
