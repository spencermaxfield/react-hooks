// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
    }

    static getDerivedStateFromError(error) {
        return {error};
    }


    render() {
        if (this.state.error) {
            return <div>{this.state.error.message}</div>;
        }

        return this.props.children;
    }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
      status: 'idle',
      pokemon: null,
      error: null,
  });


  React.useEffect(() => {
      if (!pokemonName) {
          return
      }

      setState({
         error: null,
         pokemon: null,
         status: 'pending',
      });

      fetchPokemon(pokemonName)
          .then(pokemonData => {
              setState({
                 error: null,
                 pokemon: pokemonData,
                 status: 'resolved',
              });
          })
          .catch(error => {
              setState({
                 error: error,
                 pokemon: null,
                 status: 'rejected',
              });
          });
  }, [pokemonName]);


  if (state.status === 'rejected') {
      setState({
          error: null,
          pokemon: null,
          status: 'idle',
      });
      throw state.error;
  }

  if (state.status === 'resolved') {
      return <PokemonDataView pokemon={state.pokemon}/>;
  } else if (state.status === 'pending') {
      return <PokemonInfoFallback name={pokemonName}/>;
  } else {
      return <div>Submit a Pokemon</div>;
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('');

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
      <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary key={pokemonName}>
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
      </div>
  )
}

export default App
