import { Component, Event, EventEmitter, h, State } from '@stencil/core';

import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'jm-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: { symbol: string; name: string }[];
  @State() loading = false;

  @Event({ bubbles: true, composed: true }) jmSymbolSelected: EventEmitter<string>;

  onFindStocks = (event: Event) => {
    event.preventDefault();
    this.loading = true;
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        this.searchResults = parsedRes['bestMatches'].map(match => {
          return { name: match['2. name'], symbol: match['1. symbol'] };
        });
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
      });
  };

  onSelectSymbol(symbol: string) {
    this.jmSymbolSelected.emit(symbol);
  }

  render() {
    let content = (
      <ul>
        {this.searchResults &&
          this.searchResults.map(result => (
            <li onClick={() => this.onSelectSymbol(result.symbol)}>
              <strong>{result.symbol}</strong> - {result.name}
            </li>
          ))}
      </ul>
    );
    if (this.loading) {
      content = <jm-spinner />;
    }
    return [
      <form onSubmit={this.onFindStocks}>
        <input id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Find</button>
      </form>,
      content
    ];
  }
}
