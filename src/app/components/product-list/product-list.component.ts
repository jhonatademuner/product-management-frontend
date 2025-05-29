import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ProductDetailsModalComponent } from '../product-details-modal/product-details-modal.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailsModalComponent, DeleteConfirmationModalComponent],
  providers: [ProductService],
  template: `
    <div
      *ngIf="showErrorPopup"
      class="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded shadow-lg flex items-center space-x-4 z-50"
      role="alert"
    >
      <span>{{ errorMessage }}</span>
      <button
        (click)="closeErrorPopup()"
        aria-label="Close error popup"
        class="text-white font-bold ml-4 hover:text-red-300"
      >
        &times;
      </button>
    </div>
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Products</h1>
        <button [routerLink]="['/products/new']" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Product
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-6 py-3 text-left">Name</th>
              <th class="px-6 py-3 text-left">Description</th>
              <th class="px-6 py-3 text-right">Price</th>
              <th class="px-6 py-3 text-right">Stock</th>
              <th class="px-6 py-3 text-center">Stock Status</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products" class="border-t border-gray-300">
              <td class="px-6 py-4">{{ product.name }}</td>
              <td class="px-6 py-4">{{ product.description }}</td>
              <td class="px-6 py-4 text-right">{{ product.price | currency }}</td>
              <td class="px-6 py-4 text-right">{{ product.quantityInStock }}</td>
              <td class="px-6 py-4 text-center">
                <span [class]="getStockStatusClass(product)">
                  {{ getStockStatusText(product) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex justify-center items-center space-x-2">
                  <!-- Edit button -->
                  <button 
                    (click)="editProduct(product.id)" 
                    class="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                    title="Edit Product"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>

                  <!-- Stock button -->
                  <button 
                    (click)="manageStock(product.id)" 
                    class="text-green-500 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                    title="Manage Stock"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </button>

                  <!-- Details button -->
                  <button 
                    (click)="viewDetails(product.id)" 
                    class="text-purple-500 hover:text-purple-700 p-1 hover:bg-purple-50 rounded"
                    title="View Details"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>

                  <!-- Delete button -->
                  <button 
                    (click)="deleteProduct(product.id)" 
                    class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                    title="Delete Product"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    @if (selectedProduct) {
      <app-product-details-modal
        [product]="selectedProduct"
        [onClose]="closeModal.bind(this)"
      />
    }

    @if (productToDelete) {
      <app-delete-confirmation-modal
        [product]="productToDelete"
        [onConfirm]="confirmDelete.bind(this)"
        [onCancel]="cancelDelete.bind(this)"
      />
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  productToDelete: Product | null = null;
  errorMessage: string | null = null;
  showErrorPopup = false;
  private errorTimeoutId?: any;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  editProduct(id: string | undefined): void {
    if (!id) return;
  
    this.productService.getFullProduct(id).subscribe({
      next: () => {
        this.router.navigate(['/products', id]);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
  
  manageStock(id: string | undefined): void {
    if (!id) return;
  
    this.productService.getFullProduct(id).subscribe({
      next: () => {
        this.router.navigate(['/products', id, 'stock']);
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }  

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;
    
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.productToDelete = product;
    }
  }

  confirmDelete(): void {
    if (!this.productToDelete?.id) return;

    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== this.productToDelete?.id);
        this.productToDelete = null;
      },
      error: (error) => {
        this.handleError(error);
        this.productToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.productToDelete = null;
  }

  viewDetails(id: string | undefined): void {
    if (!id) return;

    this.productService.getFullProduct(id).subscribe({
      next: (product) => {
        this.selectedProduct = product;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  handleError(error: any): void {
    let message = 'An unexpected error occurred.';
  
    if (error instanceof HttpErrorResponse) {
      if (error.error?.message) {
        message = error.error.message; // Custom message from backend
      } else if (error.status === 0) {
        message = 'Unable to connect to the server.';
      } else if (error.status === 400) {
        message = 'Invalid input. Please check your data.';
      } else if (error.status === 404) {
        message = 'Product not found.';
      } else if (error.status === 500) {
        message = 'Internal server error. Please try again later.';
      }
    }
  
    this.showError(message);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.showErrorPopup = true;

    if (this.errorTimeoutId) {
      clearTimeout(this.errorTimeoutId);
    }

    this.errorTimeoutId = setTimeout(() => {
      this.closeErrorPopup();
    }, 3000);
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
    this.errorMessage = null;

    if (this.errorTimeoutId) {
      clearTimeout(this.errorTimeoutId);
      this.errorTimeoutId = undefined;
    }
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  getStockStatusClass(product: Product): string {
    if (product.quantityInStock === 0) {
      return 'text-red-600 font-bold';
    }
    return product.isBelowMinimumStock ? 'text-red-500' : 'text-green-500';
  }

  getStockStatusText(product: Product): string {
    if (product.quantityInStock === 0) {
      return 'Out of Stock';
    }
    return product.isBelowMinimumStock ? 'Low Stock' : 'In Stock';
  }
} 