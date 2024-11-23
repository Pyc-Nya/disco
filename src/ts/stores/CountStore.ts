import { makeAutoObservable } from "mobx";

export class CountStoreClass {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setCount = (count: number) => {
    this.count = count;
  }

  increment = () => {
    this.count++;
  }

  decrement = () => {
    if (this.count <= 0) return;
    this.count--;
  }
}

const CountStore = new CountStoreClass();

export default CountStore;
