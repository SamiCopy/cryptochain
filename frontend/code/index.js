import React from "react";
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Blocks from './components/Blocks';
import ConductTransaction from "./components/ConductTransaction";
import PoolofTransactions from "./components/Pool";
import DeployContract from "./components/DeployContract";
import InteractContract from "./components/InteractContract";
import ContractDetails from './components/ContractDetails';
import ContractLookup from './components/ContractLookup'; // Import the new component

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <Router>
        <Routes>
            <Route exact path="/" element={<App />} />
            <Route path="/blocks" element={<Blocks />} />
            <Route path="/conduct-transaction" element={<ConductTransaction />} />
            <Route path="/pool-of-transactions" element={<PoolofTransactions />} />
            <Route path="/deploy-contract" element={<DeployContract />} />
            <Route path="/interact-contract" element={<InteractContract />} />
            <Route path="/contract/:address" element={<ContractDetails />} />
            <Route path="/contracts" element={<ContractLookup />} /> {/* New Route */}
        </Routes>
    </Router>
);

console.log('Hello from JS');
