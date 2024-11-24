// Frontend/code/components/InteractContract.js

import React, { Component } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class InteractContract extends Component {
    state = { contractAddress: '', params: '', transaction: null, contractState: null }

    updateContractAddress = event => {
        this.setState({ contractAddress: event.target.value });
    }

    updateParams = event => {
        this.setState({ params: event.target.value });
    }

    interactContract = () => {
        const { contractAddress, params } = this.state;

        fetch(`${document.location.origin}/api/interact-contract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contractAddress, params: JSON.parse(params) })
        })
            .then(response => response.json())
            .then(json => {
                if (json.type === 'success') {
                    this.setState({ transaction: json.transaction });
                    // Fetch updated contract state
                    this.fetchContractState(contractAddress);
                } else {
                    alert(json.message || 'Contract interaction failed.');
                }
            });
    }

    fetchContractState = (address) => {
        fetch(`${document.location.origin}/api/contract/${address}`)
            .then(response => response.json())
            .then(json => {
                this.setState({ contractState: json.state });
            });
    }

    render() {
        const { transaction, contractState } = this.state;

        return (
            <div className="InteractContract">
                <Link to='/'>Home</Link>
                <h3>Interact with Smart Contract</h3>
                <FormGroup>
                    <FormControl
                        type="text"
                        placeholder="Contract Address"
                        value={this.state.contractAddress}
                        onChange={this.updateContractAddress}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                        as="textarea"
                        rows="5"
                        placeholder='Parameters (JSON format), e.g., {"action": "increment", "amount": 1}'
                        value={this.state.params}
                        onChange={this.updateParams}
                    />
                </FormGroup>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={this.interactContract}
                >
                    Submit
                </Button>

                {transaction && (
                    <div>
                        <h4>Interaction Submitted Successfully!</h4>
                        <p><strong>Transaction ID:</strong> {transaction.id}</p>
                        <p>The contract state has been updated.</p>
                    </div>
                )}

                {contractState && (
                    <div>
                        <h4>Contract State:</h4>
                        <pre>{JSON.stringify(contractState, null, 2)}</pre>
                    </div>
                )}
            </div>
        );
    }
}

export default InteractContract;
