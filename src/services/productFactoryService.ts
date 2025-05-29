
import { CoffeeFactory, ProductDecorator, ConcreteComponent } from '@/lib/utils';

// Implementation of Factory Pattern
export class ProductFactoryService {
  private factory: CoffeeFactory;

  constructor() {
    this.factory = new CoffeeFactory();
  }

  createCoffeeProduct(data: { id: number; name: string; price: number }) {
    return this.factory.createProduct('coffee', data);
  }

  createTeaProduct(data: { id: number; name: string; price: number }) {
    return this.factory.createProduct('tea', data);
  }

  // Implementation of Decorator Pattern
  createProductWithExtras(product: any, extras: (() => string)[]) {
    let decoratedProduct = new ConcreteComponent();
    
    extras.forEach(extra => {
      decoratedProduct = new ProductDecorator(decoratedProduct, extra);
    });

    return {
      ...product,
      description: decoratedProduct.operation()
    };
  }
}

export const productFactoryService = new ProductFactoryService();
