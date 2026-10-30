const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./model/User');
const Product = require('./model/Product');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin@shopnest.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.create({
        name: 'Admin User',
        email: 'admin@shopnest.com',
        password: hashedPassword,
        role: 'admin'
      });
    }

    const products = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Immersive sound experience with advanced active noise cancellation.',
        price: 12999,
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 24
      },
      {
        name: 'Minimalist Modern Chair',
        description: 'A stylish and comfortable addition to any contemporary living room.',
        price: 8499,
        category: 'Furniture',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 12
      },
      {
        name: 'Professional DSLR Camera',
        description: 'Capture stunning moments with high-resolution clarity and speed.',
        price: 64999,
        category: 'Electronics',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.9,
        numReviews: 50
      },
      {
        name: 'Classic White Sneakers',
        description: 'Versatile and comfortable, a staple for any casual outfit.',
        price: 4499,
        category: 'Clothing',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 89
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'A compact, water-resistant speaker with rich sound for home or travel.',
        price: 3499,
        category: 'Electronics',
        stock: 32,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 31
      },
      {
        name: 'Everyday Canvas Backpack',
        description: 'A durable, roomy backpack with a clean design for daily essentials.',
        price: 2799,
        category: 'Accessories',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 18
      },
      {
        name: 'Ceramic Table Lamp',
        description: 'A warm, softly diffused bedside lamp with a timeless ceramic base.',
        price: 4299,
        category: 'Home & Living',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 22
      },
      {
        name: 'Classic Analog Wristwatch',
        description: 'A versatile everyday watch with a minimalist dial and comfortable strap.',
        price: 6499,
        category: 'Accessories',
        stock: 19,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 27
      },
      {
        name: 'Soft Knit Throw Blanket',
        description: 'A cozy textured throw that adds an inviting layer to a sofa or bed.',
        price: 3299,
        category: 'Home & Living',
        stock: 28,
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 16
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'A reusable insulated bottle designed to keep drinks at the right temperature.',
        price: 1299,
        category: 'Accessories',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 14
      },
      {
        name: 'Modern Lounge Sofa',
        description: 'A comfortable, contemporary sofa with clean lines for relaxed living.',
        price: 74999,
        category: 'Furniture',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 11
      },
      {
        name: 'Lightweight Running Shoes',
        description: 'Breathable everyday trainers with cushioned support for your daily miles.',
        price: 5499,
        category: 'Clothing',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 20
      },
      {
        name: 'Compact Instant Camera',
        description: 'Capture everyday moments and print a keepsake on the spot.',
        price: 9999,
        category: 'Electronics',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 19
      },
      {
        name: 'Acacia Wood Serving Board',
        description: 'A durable wood serving board for snacks, cheese, and everyday hosting.',
        price: 1999,
        category: 'Home & Living',
        stock: 21,
        imageUrl: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 9
      },
      {
        name: 'Everyday Crossbody Bag',
        description: 'A compact crossbody bag with practical pockets for daily essentials.',
        price: 3499,
        category: 'Accessories',
        stock: 17,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 13
      },
      {
        name: 'Minimal Desk Organizer',
        description: 'Keep your workspace tidy with a simple organizer for everyday essentials.',
        price: 1499,
        category: 'Home & Living',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 8
      },
      {
        name: 'Polarized Everyday Sunglasses',
        description: 'Lightweight sunglasses with a timeless frame for sunny days out.',
        price: 2999,
        category: 'Accessories',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 17
      },
      {
        name: 'Pour-Over Coffee Set',
        description: 'A simple ceramic dripper and carafe set for a slower morning brew.',
        price: 3999,
        category: 'Home & Living',
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 21
      },
      {
        name: 'Indoor Ceramic Planter',
        description: 'A clean-lined planter that brings a little greenery to any room.',
        price: 1599,
        category: 'Home & Living',
        stock: 27,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 12
      },
      {
        name: 'Linen Button-Down Shirt',
        description: 'A breathable relaxed-fit shirt made for easy everyday layering.',
        price: 3299,
        category: 'Clothing',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 15
      },
      {
        name: 'Wireless Desk Charging Pad',
        description: 'A compact wireless charging pad that keeps your desk uncluttered.',
        price: 2499,
        category: 'Electronics',
        stock: 31,
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 10
      },
      {
        name: 'Oak Side Table',
        description: 'A versatile solid-look side table for a favorite book and a cup of tea.',
        price: 10999,
        category: 'Furniture',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 7
      },
      {
        name: 'Leather Card Holder',
        description: 'A slim card holder that keeps the essentials close without the bulk.',
        price: 1499,
        category: 'Accessories',
        stock: 38,
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.2,
        numReviews: 11
      },
      {
        name: 'Insulated Travel Mug',
        description: 'A reusable travel mug with a secure lid for coffee on the go.',
        price: 1299,
        category: 'Home & Living',
        stock: 33,
        imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 19
      },
      {
        name: 'Soft Cotton Hoodie',
        description: 'A comfortable cotton-blend hoodie for cool mornings and relaxed weekends.',
        price: 3999,
        category: 'Clothing',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 26
      },
      {
        name: 'Retro Wireless Keyboard',
        description: 'A compact wireless keyboard with a comfortable layout for home or office.',
        price: 6499,
        category: 'Electronics',
        stock: 13,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.4,
        numReviews: 14
      },
      {
        name: 'Woven Storage Basket',
        description: 'A handwoven-style basket for blankets, toys, or everyday household storage.',
        price: 2199,
        category: 'Home & Living',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1593085260707-5377ba37f868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 9
      },
      {
        name: 'Adjustable Laptop Stand',
        description: 'A sturdy adjustable stand that brings a more comfortable setup to any desk.',
        price: 2499,
        category: 'Electronics',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 17
      },
      {
        name: 'Everyday Yoga Mat',
        description: 'A cushioned, easy-to-carry mat for stretching, yoga, and home workouts.',
        price: 1999,
        category: 'Sports & Outdoors',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.7,
        numReviews: 21
      },
      {
        name: 'Cotton Cushion Cover Set',
        description: 'Two soft woven cushion covers in a versatile neutral shade.',
        price: 1499,
        category: 'Home & Living',
        stock: 31,
        imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 12
      },
      {
        name: 'Classic Cotton Baseball Cap',
        description: 'A breathable cotton cap with an adjustable strap for everyday wear.',
        price: 1299,
        category: 'Clothing',
        stock: 27,
        imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.5,
        numReviews: 16
      },
      {
        name: 'Leather Weekend Duffle',
        description: 'A roomy overnight bag with a clean silhouette and practical inner pockets.',
        price: 8499,
        category: 'Accessories',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 8
      },
      {
        name: 'Pour-Over Glass Coffee Maker',
        description: 'A simple glass brewer for making a fresh, balanced cup at home.',
        price: 3199,
        category: 'Home & Living',
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.8,
        numReviews: 25
      },
      {
        name: 'Compact Travel Umbrella',
        description: 'A lightweight folding umbrella that fits easily in a work or travel bag.',
        price: 999,
        category: 'Accessories',
        stock: 34,
        imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.3,
        numReviews: 11
      },
      {
        name: 'Linen Table Runner',
        description: 'A relaxed linen table runner that adds a soft natural layer to meals.',
        price: 1699,
        category: 'Home & Living',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        ratings: 4.6,
        numReviews: 10
      }
    ];

    const existingProducts = await Product.find(
      { name: { $in: products.map((product) => product.name) } },
      { name: 1, price: 1 }
    ).lean();
    const existingNames = new Set(existingProducts.map((product) => product.name));
    const existingByName = new Map(existingProducts.map((product) => [product.name, product]));
    const newProducts = products.filter((product) => !existingNames.has(product.name));
    const priceUpdates = products
      .filter((product) => existingByName.has(product.name) && existingByName.get(product.name).price !== product.price)
      .map((product) => ({
        updateOne: {
          filter: { name: product.name },
          update: { $set: { price: product.price } },
        },
      }));

    if (newProducts.length) {
      await Product.insertMany(newProducts);
    }
    if (priceUpdates.length) {
      await Product.bulkWrite(priceUpdates);
    }

    console.log(`Seed completed. Added ${newProducts.length} products and updated ${priceUpdates.length} prices.`);
  } catch (error) {
    console.error("Error importing seed data:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

importData();
