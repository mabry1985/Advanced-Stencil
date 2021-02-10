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

  @Event({bubbles: true, composed: true}) jmSymbolSelected: EventEmitter<string>;

  onFindStocks = (event: Event) => {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        this.searchResults = parsedRes['bestMatches'].map(match => {
          return { name: match['2. name'], symbol: match['1. symbol'] };
        });
      })
      .catch(err => console.log(err));
  };

  onSelectSymbol(symbol: string) {
    this.jmSymbolSelected.emit(symbol);
  }

  render() {
    return [
      <form onSubmit={this.onFindStocks}>
        <input id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Find</button>
      </form>,
      <ul>
        {this.searchResults &&
          this.searchResults.map(result => (
            <li onClick={() => this.onSelectSymbol(result.symbol)}>
              <strong>{result.symbol}</strong> - {result.name}
            </li>
          ))}
      </ul>,
    ];
  }
}
