import { Component, h } from '@stencil/core';

@Component({
  tag: 'jm-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  onFetchStockPrice(event: Event) {
    event.preventDefault();
    console.log("Submitted");
  }

  render() {
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol" />
        <button type="submit">Fetch</button>
      </form>,
      <div>
        <p>Price: {0}</p>
      </div>,
    ];
  }
}
