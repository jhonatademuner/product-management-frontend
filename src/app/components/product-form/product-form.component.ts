import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
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
      <h1 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit' : 'Create' }} Product</h1>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="max-w-lg">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
          <div *ngIf="productForm.get('name')?.errors?.['required'] && productForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
            Name is required
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <textarea
            id="description"
            formControlName="description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          ></textarea>
          <div *ngIf="productForm.get('description')?.errors?.['required'] && productForm.get('description')?.touched" class="text-red-500 text-xs mt-1">
            Description is required
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
            Price
          </label>
          <input
            type="number"
            id="price"
            formControlName="price"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
          <div *ngIf="productForm.get('price')?.errors?.['required'] && productForm.get('price')?.touched" class="text-red-500 text-xs mt-1">
            Price is required
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="quantityInStock">
            {{ isEditMode ? 'Stock Quantity' : 'Initial Stock Quantity' }}
          </label>
          <input
            type="number"
            id="quantityInStock"
            formControlName="quantityInStock"
            [readonly]="isEditMode"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
          <div *ngIf="productForm.get('quantityInStock')?.errors?.['required'] && productForm.get('quantityInStock')?.touched" class="text-red-500 text-xs mt-1">
            {{ isEditMode ? 'Stock quantity' : 'Initial stock quantity' }} is required
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            [disabled]="!productForm.valid"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {{ isEditMode ? 'Update' : 'Create' }} Product
          </button>
          <button
            type="button"
            (click)="goBack()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: string;
  errorMessage: string | null = null;
  showErrorPopup = false;
  private errorTimeoutId?: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantityInStock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
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
    if (this.productForm.valid) {
      const product: Product = this.productForm.getRawValue();

      if (this.isEditMode && this.productId) {
        product.id = this.productId;
        this.productService.updateProduct(product).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => this.handleError(error)
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: () => this.router.navigate(['/products']),
          error: (error) => this.handleError(error)
        });
      }
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