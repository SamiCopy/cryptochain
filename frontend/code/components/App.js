// Frontend/code/components/App.js

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class App extends Component {
    state = { walletInfo: { address: '', balance: 0 } }

    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => {
                this.setState({ walletInfo: json });
            })
            .catch(error => console.error('Error fetching wallet info:', error));
    }

    render() {
        const { address, balance } = this.state.walletInfo;
        return (
            <div className='App'>
                <br />
                <div><Link to='./blocks'>Blocks</Link></div>
                <div><Link to='./conduct-transaction'>Conduct Transactions</Link></div>
                <div><Link to='./pool-of-transactions'>Pool of Transactions</Link></div>
                <div><Link to='./deploy-contract'>Deploy Contract</Link></div>
                <div><Link to='./interact-contract'>Interact with Contract</Link></div>
                <div><Link to='/contracts'>Contracts</Link></div> {/* New Link */}
                <br />
                <div className='walletInfo'>
                    <div>Address: {address}</div>
                    <div>Balance: {balance}</div>
                </div>
                <hr />
            </div>
        );
    }
}

export default App;
