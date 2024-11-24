import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

const INTERVAL_PEER_SYNC = 10000; //will check for updated in pool additions by peers every 10 seconds

class PoolofTransactions extends Component {

    state = { transactionMap: { }, redirect: false }

    fetchtransactionMap = () => {

        fetch(`${document.location.origin}/api/mapoftransactionpool`)  // response of fetch is stored in json format in json var and then json's value is set by giving it as an input
            .then( response => response.json() )
                .then( json =>  this.setState( { transactionMap: json } ))

    }

    fetchMineBlock = () => {

        fetch(`${document.location.origin}/api/minetransactions`)

          .then(response => {

            if (response.status === 200) {

              alert('Success');

              this.setState({ redirect: true });

            } else {

              alert('Mining Failed');

            }
          })
          .catch(error => {

            console.error('Error mining block:', error);

            alert('An error occurred while mining the block.');

          });

      };      //not using response.json because the returning value isn't json, its a get request so a message form is being returned for redirection


    componentDidMount() {

        this.fetchtransactionMap();

        this.fetchPoolMapInterval = setInterval(

            () => this.fetchtransactionMap(), INTERVAL_PEER_SYNC // verify its working by page/inspect/networktab -- here calls will be made every specified amount of seconds

        );

    }

    componentWillUnmount() {

        clearInterval(
                this.fetchPoolMapInterval
        )

    }

    render() {

        if ( this.state.redirect ) {

                return(
                    <Navigate to = '/blocks' />
                )

        }

        return (

                <div className="PoolofTransactions"> 

                <div> <Link to='/'>  Home  </Link> </div>
                <h3> Pool of Transactions </h3>

                {
                    Object.values(this.state.transactionMap).map( transaction => {

                        return (

                            <div key = { transaction.id } > <hr />
                            
                                < Transaction transaction={transaction} />
                            
                             </div>
                            

                        )

                    } )
                }

                <br/>
                <hr/>

                <Button

                variant="danger"
                size="sm"
                onClick={this.fetchMineBlock}
                
                >
                        Mine Block!


                </Button>

                 </div>

        )

    }

}

export default PoolofTransactions;