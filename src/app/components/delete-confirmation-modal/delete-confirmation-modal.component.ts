import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50" (click)="onCancel()">
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full m-4" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Delete Product</h2>
            <button 
              class="text-gray-500 hover:text-gray-700"
              (click)="onCancel()"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="mt-2">
            <p class="text-gray-600">
              Are you sure you want to delete <span class="font-semibold">{{ product.name }}</span>? This action cannot be undone.
            </p>
          </div>

          <div class="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-md hover:bg-gray-100"
              (click)="onCancel()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
              (click)="onConfirm()"
            >
              Delete
            </button>
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
export class DeleteConfirmationModalComponent {
  @Input() product!: Product;
  @Input() onConfirm!: () => void;
  @Input() onCancel!: () => void;
} 