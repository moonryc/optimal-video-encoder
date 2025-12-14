// eslint-disable-next-line
import { ConversionItem, ConversionStatus, ProductFilter } from '@org/models';

export class ProductsService {
  private products: ConversionItem[] = [
    {
      id: "conv_001",
      progress: 12,
      timeRemaining: 1840, // seconds
      path: "/media/queue/Movie.One.2023.1080p.mkv",
      duration: 7200,
      is4k: false,
      error: null,
      status: ConversionStatus.PROCESSING,
      startedAt: new Date("2025-03-10T14:32:00Z"),
      erroredAt: null,
      deletedAt: null,
      stallCounter: 0,
      createdAt: new Date("2025-03-10T14:30:00Z"),
      updatedAt: new Date("2025-03-10T14:45:00Z"),
    },
    {
      id: "conv_002",
      progress: 100,
      timeRemaining: 0,
      path: "/media/movies/Another.Movie.2022.4K.mkv",
      duration: 8100,
      is4k: true,
      error: null,
      status: ConversionStatus.COMPLETED,
      startedAt: new Date("2025-03-09T08:10:00Z"),
      erroredAt: null,
      deletedAt: null,
      stallCounter: 0,
      createdAt: new Date("2025-03-09T08:05:00Z"),
      updatedAt: new Date("2025-03-09T10:21:00Z"),
    },
    {
      id: "conv_003",
      progress: 67,
      timeRemaining: 920,
      path: "/media/queue/TV.Show.S02E05.1080p.mkv",
      duration: 2700,
      is4k: false,
      error: null,
      status: ConversionStatus.PROCESSING,
      startedAt: new Date("2025-03-10T15:01:00Z"),
      erroredAt: null,
      deletedAt: null,
      stallCounter: 1,
      createdAt: new Date("2025-03-10T14:59:00Z"),
      updatedAt: new Date("2025-03-10T15:20:00Z"),
    },
    {
      id: "conv_004",
      progress: 42,
      timeRemaining: 0,
      path: "/media/queue/Corrupted.File.2019.mkv",
      duration: 5400,
      is4k: false,
      error: "ffmpeg exited with code 1: Invalid data found when processing input",
      status: ConversionStatus.FAILED,
      startedAt: new Date("2025-03-08T22:14:00Z"),
      erroredAt: new Date("2025-03-08T22:25:30Z"),
      deletedAt: null,
      stallCounter: 3,
      createdAt: new Date("2025-03-08T22:10:00Z"),
      updatedAt: new Date("2025-03-08T22:25:30Z"),
    },
    {
      id: "conv_005",
      progress: 0,
      timeRemaining: 0,
      path: "/media/queue/Big.Documentary.4K.mkv",
      duration: 9600,
      is4k: true,
      error: null,
      status: ConversionStatus.FAILED,
      startedAt: new Date("2025-03-07T18:40:00Z"),
      erroredAt: null,
      deletedAt: null,
      stallCounter: 5,
      createdAt: new Date("2025-03-07T18:35:00Z"),
      updatedAt: new Date("2025-03-07T19:10:00Z"),
    },
  ];

  getProducts(filter?: ProductFilter, page = 1, pageSize = 10) {
    let filteredProducts = [...this.products];

    // Apply filters
    if (filter) {
      if (filter.category) {
        filteredProducts = filteredProducts.filter(
          p => p.category === filter.category
        );
      }
      if (filter.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          p => p.price >= filter.minPrice!
        );
      }
      if (filter.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          p => p.price <= filter.maxPrice!
        );
      }
      if (filter.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(
          p => p.inStock === filter.inStock
        );
      }
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );
      }
    }

    // Calculate pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredProducts.slice(startIndex, endIndex);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  getProductById(id: string): ConversionItem | undefined {
    return this.products.find(p => p.id === id);
  }

  getCategories(): string[] {
    const categories = new Set(this.products.map(p => p.category));
    return Array.from(categories).sort();
  }
}
