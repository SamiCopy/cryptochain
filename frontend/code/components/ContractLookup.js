// Frontend/code/components/ContractLookup.js

import React, { useState } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const ContractLookup = () => {
    const [contractAddress, setContractAddress] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setContractAddress(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (contractAddress) {
            navigate(`/contract/${contractAddress}`);
        } else {
            alert('Please enter a contract address.');
        }
    };

    return (
        <div className="ContractLookup">
            <Link to="/">Home</Link>
            <h3>Lookup Contract</h3>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <FormControl
                        type="text"
                        placeholder="Enter Contract Address"
                        value={contractAddress}
                        onChange={handleInputChange}
                    />
                </FormGroup>
                <Button variant="danger" size="sm" type="submit">
                    Go to Contract
                </Button>
            </form>
        </div>
    );
};

export default ContractLookup;
