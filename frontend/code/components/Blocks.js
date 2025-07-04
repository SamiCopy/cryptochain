import React, { Component } from 'react';
import Block from './Block';
import { Link } from 'react-router-dom';

class Blocks extends Component {

    state = { blocks: [] }

    componentDidMount() {
        
        fetch(`${document.location.origin}/api/blocks`)
            .then( response => response.json() )
            .then( json => {
                    this.setState({ blocks: json })
                           } 
                 )
            .catch( error => console.error('Error fetching Block details', error) );

    }

    render() {

        return (
            <div> 

                <div> <Link to = '/' > Home </Link> </div>

                <h1> Blocks </h1>

                { 
                    this.state.blocks.map( block => { 

                            return (


                                < Block key={ block.hash } block={ block } />     


                            )
                        }  
                    )

                }

            </div>
        );
    }
}

export default Blocks;
