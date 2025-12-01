import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Mock product data
const mockProducts = [
  {
    name: 'Gaming Laptop RTX 4070',
    price: 1299,
    originalPrice: 1499,
    emoji: '💻',
    category: 'laptops',
    brand: 'ASUS',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    specs: ['RTX 4070', '16GB RAM', '512GB SSD', '15.6" 144Hz']
  },
  {
    name: 'Mechanical Keyboard RGB',
    price: 149,
    originalPrice: 199,
    emoji: '⌨️',
    category: 'accessories',
    brand: 'Corsair',
    rating: 4.6,
    reviews: 89,
    inStock: true,
    specs: ['Cherry MX Switches', 'RGB Backlight', 'USB-C', 'Palm Rest']
  },
  {
    name: 'Gaming Monitor 144Hz',
    price: 349,
    originalPrice: 399,
    emoji: '🖥️',
    category: 'monitors',
    brand: 'LG',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    specs: ['27" IPS', '144Hz', '1ms Response', 'HDR10']
  },
  {
    name: 'Wireless Gaming Mouse',
    price: 79,
    originalPrice: 99,
    emoji: '🖱️',
    category: 'accessories',
    brand: 'Logitech',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    specs: ['Wireless', '16000 DPI', 'RGB', '70hr Battery']
  },
  {
    name: 'Gaming Desktop RTX 4080',
    price: 1899,
    originalPrice: 2199,
    emoji: '🖥️',
    category: 'desktops',
    brand: 'Custom Build',
    rating: 4.9,
    reviews: 67,
    inStock: false,
    specs: ['RTX 4080', '32GB RAM', '1TB SSD', 'Intel i9']
  },
  {
    name: 'Ultra-wide Monitor 34"',
    price: 599,
    originalPrice: 699,
    emoji: '📺',
    category: 'monitors',
    brand: 'Samsung',
    rating: 4.5,
    reviews: 92,
    inStock: true,
    specs: ['34" Ultra-wide', '144Hz', 'VA Panel', 'HDR1000']
  },
  {
    name: 'Business Laptop i7',
    price: 899,
    originalPrice: 999,
    emoji: '💼',
    category: 'laptops',
    brand: 'Dell',
    rating: 4.4,
    reviews: 178,
    inStock: true,
    specs: ['Intel i7', '16GB RAM', '512GB SSD', '14" FHD']
  },
  {
    name: 'Gaming Headset RGB',
    price: 129,
    originalPrice: 159,
    emoji: '🎧',
    category: 'accessories',
    brand: 'SteelSeries',
    rating: 4.6,
    reviews: 245,
    inStock: true,
    specs: ['7.1 Surround', 'RGB', 'Noise Cancelling', '50mm Drivers']
  }
];

export async function migrateProductsToFirebase() {
  try {
    console.log('Starting product migration...');

    for (const product of mockProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`Added product: ${product.name}`);
    }

    console.log('Product migration completed successfully!');
  } catch (error) {
    console.error('Error migrating products:', error);
    throw error;
  }
}

// For running the migration
if (typeof window === 'undefined') {
  // This will only run on server side
  migrateProductsToFirebase();
}