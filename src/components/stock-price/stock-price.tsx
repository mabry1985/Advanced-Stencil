import { Component, Element, h, State } from '@stencil/core';

import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'jm-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  stockInput: HTMLInputElement;

  // @Element() el: HTMLElement;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  onFetchStockPrice = (event: Event) => {
    event.preventDefault();
    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    const stockSymbol = this.stockInput.value;
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        if(!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid Symbol');
        }
        this.error = null;
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      })
      .catch(err => {
        this.error = err.message;
        console.log(err);
      });
  };

  render() {
    let dataContent = <p>Search Stock Symbol</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>
    }
    if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol" ref={el => (this.stockInput = el)} value={this.stockUserInput} 
        onInput={this.onUserInput}/>
        <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
      </form>,
      <div>
        {dataContent}
      </div>,
    ];
  }
}
