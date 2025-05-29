import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" (click)="onClose()">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-semibold mb-4">Product Details</h2>
            <button 
              class="text-gray-500 hover:text-gray-700"
              (click)="onClose()"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-bold mb-1">Name</label>
              <p class="text-gray-600">{{ product.name }}</p>
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-1">Description</label>
              <p class="text-gray-600">{{ product.description }}</p>
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-1">Price</label>
              <p class="text-gray-600">{{ product.price | currency }}</p>
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-1">Quantity in Stock</label>
              <p class="text-gray-600">{{ product.quantityInStock }}</p>
            </div>

            <div>
              <label class="block text-gray-700 font-bold mb-1">Stock Status</label>
              <p [class]="getStockStatusClass()">
                {{ getStockStatusText() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductDetailsModalComponent {
  @Input() product!: Product;
  @Input() onClose!: () => void;

  getStockStatusClass(): string {
    if (this.product.quantityInStock === 0) {
      return 'text-red-600 font-bold';
    }
    return this.product.isBelowMinimumStock ? 'text-red-500' : 'text-green-500';
  }

  getStockStatusText(): string {
    if (this.product.quantityInStock === 0) {
      return 'Out of Stock';
    }
    return this.product.isBelowMinimumStock ? 'Below Minimum Stock' : 'Stock Level OK';
  }
} 