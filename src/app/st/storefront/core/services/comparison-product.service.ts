import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComparisonProductService {

  private entries$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private productComparisonListLimit: number = 5;

  constructor() { }

  getEntries(): BehaviorSubject<string[]> {
    return this.entries$;
  }

  loadEntries(entries: string[] = []): void {
    this.entries$.next(entries);
  }

  clearList(): void {
    this.entries$.next([]);
  }

  delete(code: string): void {
    const entries = this.entries$.getValue() || [];
    const clearedEntries = entries.filter(currentCode => currentCode !== code);
    this.entries$.next(clearedEntries);
  }

  canAdd(code?: string): boolean {
    if (code) {
      return !this.isProductOnTheList(code) && !this.isLimitExceeded();
    }
    return false;
  }

  add(code?: string): void {
    if (code) {
      const entries = this.entries$.getValue() || [];
      entries.push(code);
      this.entries$.next(entries);
    }
  }

  private isProductOnTheList(productCode: string): boolean {
    const entries = this.entries$.getValue() || [];
    return !!entries.find((code: string) => code === productCode);
  }

  private isLimitExceeded(): boolean {
    const entries = this.entries$.getValue() || [];
    return entries.length >= this.productComparisonListLimit;
  }
}
