// Frontend/code/components/DeployContract.js

import React, { useState } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const DeployContract = () => {
    const [code, setCode] = useState('');
    const [transaction, setTransaction] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);

    const updateCode = event => {
        setCode(event.target.value);
    };

    const deployContract = () => {
        fetch(`${document.location.origin}/api/deploy-contract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        })
            .then(response => response.json())
            .then(json => {
                if (json.type === 'success') {
                    setTransaction(json.transaction);
                    setContractAddress(json.transaction.contractAddress);
                } else {
                    alert(json.message || 'Contract deployment failed.');
                }
            });
    };

    const copyContractAddress = () => {
        if (contractAddress) {
            navigator.clipboard.writeText(contractAddress).then(() => {
                alert('Contract address copied to clipboard!');
            }, () => {
                alert('Failed to copy the contract address.');
            });
        }
    };

    return (
        <div className="DeployContract">
            <Link to="/">Home</Link>
            <h3>Deploy Smart Contract</h3>
            <FormGroup>
                <FormControl
                    as="textarea"
                    rows="10"
                    placeholder="Enter your smart contract code here..."
                    value={code}
                    onChange={updateCode}
                />
            </FormGroup>
            <Button
                variant="danger"
                size="sm"
                onClick={deployContract}
            >
                Deploy
            </Button>
            <br /><br />
            {transaction && (
                <div className="DeploymentResult">
                    <h4>Contract Deployed Successfully!</h4>
                    <p><strong>Contract Address:</strong> {contractAddress}</p>
                    <p><strong>Transaction ID:</strong> {transaction.id}</p>
                    <Button
                        variant="info"
                        size="sm"
                        onClick={copyContractAddress}
                    >
                        Copy Contract Address
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DeployContract;
