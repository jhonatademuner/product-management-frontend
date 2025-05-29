import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8222/api';

  constructor(private http: HttpClient) { }

  // Product CRUD operations
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/v1/product`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/v1/product/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/v1/product`, product);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/v1/product`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/v1/product/${id}`);
  }

  updateProductStock(id: string, amount: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/v1/stock/${id}/amount/${amount}`, null);
  }

  getFullProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/v1/stock/${productId}`);
  }
} 