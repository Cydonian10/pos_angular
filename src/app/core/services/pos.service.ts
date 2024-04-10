import { Injectable, computed, effect, signal } from '@angular/core';
import { PostItem } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PosService {
  #posItems = signal<PostItem[]>([]);

  posItems = computed(() => this.#posItems());

  totalPrice = computed(() => {
    return this.#posItems().reduce(
      (acc, curr) =>
        acc +
        Math.ceil(curr.quantity * curr.product.salePrice * 10) / 10 -
        curr.discount,
      0,
    );
  });

  totalDescuento = computed(() => {
    return this.#posItems().reduce(
      (acc, curr) => Math.ceil(((acc + curr.discount) * 10) / 10),
      0,
    );
  });

  subTotal = computed(() => {
    return this.#posItems()
      .reduce(
        (acc, curr) =>
          acc +
          (Math.ceil(curr.quantity * curr.product.salePrice * 10) / 10) * 0.82,
        0,
      )
      .toFixed(2);
  });

  igv = computed(() => {
    return this.#posItems()
      .reduce(
        (acc, curr) =>
          acc +
          (Math.ceil(curr.quantity * curr.product.salePrice * 10) / 10) * 0.18,
        0,
      )
      .toFixed(2);
  });

  constructor() {
    // effect(() => {
    //   console.log('******** POS ********');
    //   console.log(this.#posItems());
    //   console.log({ total: this.totalPrice() });
    //   console.log({ descuento: this.totalDescuento() });
    //   console.log({ subTotal: this.subTotal() });
    //   console.log({ igv: this.igv() });
    // });
  }

  addProduct(posItem: PostItem) {
    posItem.subTotal =
      Math.ceil(posItem.product.salePrice * posItem.quantity * 10) / 10;

    const item = this.#posItems().some(
      (x) => x.product.id === posItem.product.id,
    );
    if (item) {
      this.#posItems.update((statePos) =>
        statePos.map((i: PostItem) => {
          if (i.product.id === posItem.product.id) {
            i = posItem;
          }
          return i;
        }),
      );
    } else {
      this.#posItems.update((v: PostItem[]) => [posItem, ...v]);
    }
  }

  addOneProduct(posItem: PostItem) {
    const item = this.#posItems().some(
      (x) => x.product.id === posItem.product.id,
    );

    if (item) {
      this.#posItems.update((statePos) =>
        statePos.map((i: PostItem) => {
          i.quantity += posItem.quantity;
          i.subTotal = Math.round(i.product.salePrice * i.quantity);
          return i;
        }),
      );
    } else {
      this.#posItems.update((v: PostItem[]) => [posItem, ...v]);
    }
  }

  deleteProduct(postItem: PostItem) {
    this.#posItems.update((v: PostItem[]) =>
      v.filter((item: PostItem) => item.product.id !== postItem.product.id),
    );
  }

  limpiearPosItems() {
    this.#posItems.set([]);
  }
}
