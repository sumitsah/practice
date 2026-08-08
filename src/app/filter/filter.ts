import { Component, computed, effect, signal } from '@angular/core';
import { products } from '../products.json'
import { FormsModule } from '@angular/forms';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})

// https://dummyjson.com/products
// https://dummyjson.com/products/search?q=phone
export class Filter {
  // products = signal(products);
  searchStr = signal('');

  users = httpResource<any[]>(() => `https://jsonplaceholder.typicode.com/users?name_like=^${this.searchStr()}`,
    {
      defaultValue: [],
      // parse: (rawData)
    })

  // results = computed(() => this.products().filter((item) => item.title.toLowerCase().includes(this.searchStr())))

  constructor() {
    // effect(() => {
    //   console.log(this.results())
    // })
  }

  ngOnInit() {

    // console.log(this.products())

  }
}
