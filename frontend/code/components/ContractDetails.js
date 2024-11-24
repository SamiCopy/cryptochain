// Frontend/code/components/ContractDetails.js

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const ContractDetails = () => {
  const { address } = useParams();
  const [contract, setContract] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchContract(address);
    fetchContractTransactions(address);
  }, [address]);

  const fetchContract = (address) => {
    fetch(`${document.location.origin}/api/contract/${address}`)
      .then(response => response.json())
      .then(json => {
        if (json.type !== 'error') {
          setContract(json);
        } else {
          alert(json.message);
        }
        setLoading(false); // Set loading to false
      })
      .catch(() => setLoading(false));
  };

  const fetchContractTransactions = (address) => {
    fetch(`${document.location.origin}/api/contract-transactions/${address}`)
      .then(response => response.json())
      .then(json => {
        if (json.type !== 'error') {
          setTransactions(json.transactions);
        } else {
          alert(json.message);
        }
      });
  };

  if (loading) {
    return (
      <div className="ContractDetails">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading contract details...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="ContractDetails">
      <Link to="/">Home</Link>
      <h3>Contract Details</h3>
      {contract ? (
        <div>
          <p><strong>Contract Address:</strong> {address}</p>
          <p><strong>Contract Code:</strong></p>
          <pre>{contract.code}</pre>
          <p><strong>Contract State:</strong></p>
          <pre>{JSON.stringify(contract.state, null, 2)}</pre>
          <h4>Deployment Details:</h4>
          <p><strong>Deployer Address:</strong> {contract.deployer}</p>
          <p><strong>Deployment Time:</strong> {new Date(contract.deploymentTime).toLocaleString()}</p>
          <h4>Interactions:</h4>
          {transactions && transactions.length > 0 ? (
            <ul>
              {transactions.map((tx, index) => (
                tx && tx.params && (
                  <li key={index}>
                    <p><strong>Transaction ID:</strong> {tx.id}</p>
                    <p><strong>Action:</strong> {tx.params.action || 'N/A'}</p>
                    <p><strong>Sender:</strong> {tx.input?.address || 'N/A'}</p>
                    <p><strong>Time:</strong> {tx.input?.timestamp ? new Date(tx.input.timestamp).toLocaleString() : 'N/A'}</p>
                    <hr />
                  </li>
                )
              ))}
            </ul>
          ) : (
            <p>No interactions yet.</p>
          )}
        </div>
      ) : (
        <p>Loading contract details...</p>
      )}
    </div>
  );
};

export default ContractDetails;
