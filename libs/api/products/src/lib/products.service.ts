// eslint-disable-next-line
import { ConversionItem, ConversionStatus, ProductFilter } from '@org/models';

export class ProductsService {


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
