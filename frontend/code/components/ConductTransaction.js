import React, { Component } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";


class ConductTransaction extends Component{
    state = { recipient : '', amount : '' , redirect: false}

    // the event object input in the function is specifically used to handle onChange function

    updateRecipient = event => {

        this.setState ({ recipient: event.target.value })

    }

    // used number, as react handles event.target as string by default.

    updateAmount = event => {

        this.setState ( { amount: (event.target.value) } )

    }

    conductTransaction = () => {

        // destructure initial recipient and amount from this.state, then fetching
        // transact url, and posting the initials as a stringified object and alerting
        // if json.message is undefined otherwise returning json.type(success) on browser 

        const { recipient, amount }  = this.state;
        const amountNumber = Number(amount); // Convert to number here

        if (!recipient || isNaN(amountNumber) || amountNumber <= 0) {
            alert('Please enter a valid recipient and amount.');
            return;
        }


        fetch(`${document.location.origin}/api/transact`, {   
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify( { recipient, amount: amountNumber } )})
            .then( response => response.json() )
            .then( json => {
                alert( json.message || json.type );
                this.setState( { redirect: true } );
            } );
    }

    render() {

        if ( this.state.redirect ) {

            return (
                <Navigate to = '/pool-of-transactions' />
            )

        }

        return(

            

            <div className="ConductTransaction">

            <Link to ='/' > Home </Link>

            <h3> Conduct a Transaction! </h3>

            {/* Form group creates a section/partition within a form 
                however, the input is defined by the form control tag    */}

            <FormGroup> 
                <FormControl
                
                    type = "text"
                    placeholder = "Recipient"
                    value = {this.state.recipient}
                    onChange = {this.updateRecipient}
                
                />
                </FormGroup>         

            <FormGroup>
                <FormControl
                    
                    type = "number"
                    placeholder = "Amount"
                    value = {this.state.amount}
                    onChange = {this.updateAmount}
                
                />
                </FormGroup>

                <div>

                    <Button 

                        variant=    "danger"
                        size=       "sm"
                        onClick={this.conductTransaction}

                    >

                    Submit

                    </Button>

                </div>

            </div>

        )

    }

}

export default ConductTransaction;