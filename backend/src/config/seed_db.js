const { Category, Product, Coupon, User, Wallet, Cart, sequelize } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // WARNING: This drops all tables!
    console.log('Database synced (all tables dropped and recreated)');

    // Categories
    const categories = await Category.bulkCreate([
      { name: 'Fruits', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194766.png' },
      { name: 'Vegetables', image: 'https://cdn-icons-png.flaticon.com/512/2329/2329903.png' },
      { name: 'Electronics', image: 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png' },
      { name: 'Beauty', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050200.png' },
      { name: 'Grocery', image: 'https://cdn-icons-png.flaticon.com/512/3050/3050188.png' },
    ]);

    // Products
    await Product.bulkCreate([
      { categoryId: 1, name: 'Fresh Apple', weight: '1 kg', price: 180, oldPrice: 200, discount: 10, rating: 4.5, image: 'https://cdn-icons-png.flaticon.com/512/415/415733.png' },
      { categoryId: 1, name: 'Banana Robusta', weight: '1 kg', price: 60, oldPrice: 80, discount: 25, rating: 4.2, image: 'https://cdn-icons-png.flaticon.com/512/2909/2909761.png' },
      { categoryId: 2, name: 'Tomato Hybrid', weight: '500 g', price: 30, oldPrice: 40, discount: 25, rating: 4.0, image: 'https://cdn-icons-png.flaticon.com/512/1202/1202125.png' },
      { categoryId: 2, name: 'Potato', weight: '2 kg', price: 70, oldPrice: 90, discount: 22, rating: 4.8, image: 'https://cdn-icons-png.flaticon.com/512/1135/1135544.png' },
      { categoryId: 3, name: 'Wireless Earbuds', weight: '1 unit', price: 1499, oldPrice: 2999, discount: 50, rating: 4.3, image: 'https://cdn-icons-png.flaticon.com/512/2741/2741271.png' },
      { categoryId: 4, name: 'Face Wash', weight: '100 ml', price: 150, oldPrice: 200, discount: 25, rating: 4.6, image: 'https://cdn-icons-png.flaticon.com/512/3163/3163195.png' },
      { categoryId: 5, name: 'Basmati Rice', weight: '5 kg', price: 850, oldPrice: 1000, discount: 15, rating: 4.7, image: 'https://cdn-icons-png.flaticon.com/512/2713/2713915.png' },
      { categoryId: 1, name: 'Mango Alphonso', weight: '1 kg', price: 400, oldPrice: 500, discount: 20, rating: 4.9, image: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png' },
    ]);

    // Coupons
    await Coupon.bulkCreate([
      { code: 'FLASH50', discountType: 'percentage', discountValue: 10, minOrderAmount: 500 },
      { code: 'SAVER100', discountType: 'flat', discountValue: 100, minOrderAmount: 1000 },
    ]);

    // Admin User
    const admin = await User.create({
      phone: '9876543210',
      email: 'admin@flashbasket.com',
      password: 'admin', // Will be hashed by hook
      name: 'Admin User',
      role: 'admin',
    });
    await Wallet.create({ userId: admin.id, balance: 1000 });
    await Cart.create({ userId: admin.id });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
