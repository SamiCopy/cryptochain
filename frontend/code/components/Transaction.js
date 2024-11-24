import React from 'react';

// Added null checks for transaction and outputMap to avoid errors
const Transaction = ({ transaction }) => {

    // If transaction is undefined or null, we return a fallback message
    if (!transaction) {
        return <div>No transaction data available</div>;
    }

    // Destructure input and outputMap from transaction, with an empty object fallback to avoid undefined errors
    const { input, outputMap } = transaction || {};

    // Added a null check for outputMap to avoid trying to get keys from undefined
    const recipients = outputMap ? Object.keys(outputMap) : [];

    return (
        <div className='Transaction'>
            {/* Check if input exists so not to check undefined for anyreason*/}
            <div> From: {input ? ` ${input.address.substring(0, 20)}...` : 'Unknown'} | Balance: {input ? input.amount : 0} </div>

            {/* Loop recipients only if outputMap exists */}
            {
                recipients.map(recipient => (
                    <div key={recipient}>
                        To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
                    </div>
                ))
            }
        </div>
    );
}

export default Transaction;
