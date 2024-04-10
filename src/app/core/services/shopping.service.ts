import { DetailPurchase } from '@/api/interfaces/purchase.interface';
import { Injectable, computed, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShoppinService {
  #shoppingCart = signal<DetailPurchase[]>([]);

  shoppinCart = computed(() => this.#shoppingCart());

  constructor() {
    effect(() => {
      console.log('******* 👉 Shopping Cart  *********');
      console.log(this.#shoppingCart());
    });
  }

  total = computed(() => {
    return this.#shoppingCart().reduce(
      (acc, curr) =>
        acc + Math.round(curr.quantity * curr.purchasePrice * 10) / 10,
      0,
    );
  });

  addDetailPurchase(detailPurchase: DetailPurchase) {
    detailPurchase.subTotal =
      Math.round(detailPurchase.quantity * detailPurchase.purchasePrice * 10) /
      10;

    const itemDetailPurchase = this.#shoppingCart().some(
      (x) => x.product.id === detailPurchase.product.id,
    );

    if (itemDetailPurchase) {
      this.#shoppingCart.update((shoppinCart) =>
        shoppinCart.map((itemCart) => {
          if (itemCart.product.id === detailPurchase.product.id) {
            itemCart = detailPurchase;
          }
          return itemCart;
        }),
      );
    } else {
      this.#shoppingCart.update((shoppingCart) => [
        ...shoppingCart,
        detailPurchase,
      ]);
    }
  }

  deleteDetailPurchase(detailPurchase: DetailPurchase) {
    this.#shoppingCart.update((shoppingCart) =>
      shoppingCart.filter(
        (itemShopping) => itemShopping.product.id !== detailPurchase.product.id,
      ),
    );
  }

  clearShoppintCart() {
    this.#shoppingCart.set([]);
  }
}
