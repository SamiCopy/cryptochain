import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // import may cause problem, gpt suggestion. becuase of style not being on the button.
import Transaction from './Transaction';


class Block extends Component {

    state = { displayTransaction : false };


    
    toggleTransaction = ( event ) => {

        event.preventDefault();
        this.setState ( { displayTransaction: !this.state.displayTransaction } );

        // if the user wants to switch between full view or default view that we've set to 20.

    }

    get displayTransaction() {

        const { data } = this.props.block;


        const stringifiedData = JSON.stringify(data);
        const dataDisplay = stringifiedData.length > 20 ?
                 `${ stringifiedData.substring( 0, 20 ) }...` : stringifiedData;

        
        if ( this.state.displayTransaction ) {

            return ( 
                <div> 
                    <div> {
                    
                        data.map( transaction => (

                            <div key={transaction.id}>
                                
                                <hr />

                                <Transaction transaction={transaction}></Transaction>

                            </div>

                        ) )
                    
                    }
                    </div>

                    <Button 
    
                    variant = 'danger'
                    size  = 'sm' 
                    onClick = { this.toggleTransaction } >
                    
                    Show less..  </Button>
                
                
                </div> 
                )
    

        }

        return ( 
            <div> 
                <div> Data:{ dataDisplay } </div>
                <Button 

                variant = 'danger'
                size  = 'sm' 
                onClick = { this.toggleTransaction } >
                
                Show more..  </Button>
            
            
            </div> )

        // const fillerString = 'Transaction x..'

        // return <div> Display Transaction: {fillerString} </div>

    }


    render() {


        const { timestamp, hash  } = this.props.block;

                //inherit the block properties managed by the parent Blocks class.

        const hashDisplay = `${ hash.substring( 0, 10 ) }...`;


        return (

            <div className='Block' >

            <div>

               <div> Timestamp: { new Date (timestamp).toLocaleString() }   </div>
               <div> Hash:      { hashDisplay }                             </div>
               {this.displayTransaction}

            </div>


            </div>


        )

    
    }





}

export default Block;