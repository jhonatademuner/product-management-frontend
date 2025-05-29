import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-stock-operations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Stock Operations</h1>
        <p class="text-gray-600">Product: {{ product?.name }}</p>
        <p class="text-gray-600">Current Stock: {{ product?.quantityInStock }}</p>
        <p *ngIf="product?.isBelowMinimumStock" class="text-red-600">Warning: Stock is below minimum level!</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Update Stock</h2>
        <p class="text-gray-600 mb-4">
          Use positive numbers to increase stock or negative numbers to decrease stock.
        </p>
        <form [formGroup]="stockForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Amount (+ to increase, - to decrease)
            </label>
            <input
              type="number"
              formControlName="amount"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              [class.border-red-500]="stockForm.get('amount')?.invalid && stockForm.get('amount')?.touched"
            >
            <div *ngIf="stockForm.get('amount')?.errors?.['required'] && stockForm.get('amount')?.touched" class="text-red-500 text-xs mt-1">
              Amount is required
            </div>
            <div *ngIf="stockForm.get('amount')?.errors?.['insufficientStock']" class="text-red-500 text-xs mt-1">
              Cannot decrease stock below 0
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button
              type="submit"
              [disabled]="!stockForm.valid"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              Update Stock
            </button>
            <button
              type="button"
              (click)="goBack()"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Products
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class StockOperationsComponent implements OnInit {
  stockForm: FormGroup;
  product?: Product;
  errorMessage: string | null = null;
  showErrorPopup = false;
  private errorTimeoutId?: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stockForm = this.fb.group({
      amount: ['', [Validators.required]]
    });

    // Add validator to check if stock would go below 0
    this.stockForm.get('amount')?.valueChanges.subscribe(amount => {
      if (this.product && amount) {
        const newStock = this.product.quantityInStock + amount;
        if (newStock < 0) {
          this.stockForm.get('amount')?.setErrors({ insufficientStock: true });
        }
      }
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        // Revalidate amount after product is loaded
        const currentAmount = this.stockForm.get('amount')?.value;
        if (currentAmount) {
          const newStock = product.quantityInStock + currentAmount;
          if (newStock < 0) {
            this.stockForm.get('amount')?.setErrors({ insufficientStock: true });
          }
        }
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.router.navigate(['/products']);
        }
        this.handleError(error);
      }
    });
  }

  onSubmit(): void {
    if (this.stockForm.valid && this.product?.id) {
      const amount = this.stockForm.get('amount')?.value;
      
      this.productService.updateProductStock(this.product.id, amount).subscribe({
        next: () => {
          this.loadProduct(this.product!.id!);
          this.stockForm.reset();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
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

  goBack(): void {
    this.router.navigate(['/products']);
  }
} 