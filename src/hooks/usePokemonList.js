import axios from "axios";
import { useEffect, useState } from "react";

function usePokemonList(type){
     // const [pokemonList,setPokemonList] = useState([]);
     // const [isLoading,SetIsLoading] = useState(true);
     // const [pokedexUrl,setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');
     // const [nextUrl,setNextUrl] = useState('');
     // const [prevUrl,setPrevUrl] = useState('');
     const [pokemonListState,setPokemonListState] = useState({
          pokemonList: [],
          isLoading: true,
          pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
          nextUrl: '',
          prevUrl: '',
          type:''
     });
     async function getPokemonList(){ 
          
          
          if(pokemonListState.type){
               const response = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonListState.type}`);
               setPokemonListState((state) =>({
                    ...state,
                    pokemonList: response.data.pokemon
               }));
          }
          else{
               //SetIsLoading(true);  
               setPokemonListState((state) =>({...pokemonListState,isLoading:true})); 
               const response = await axios.get(pokemonListState.pokedexUrl);
               const PokemonResults = response.data.results;
               console.log("response is",response.data.pokemon);
               console.log(pokemonListState);
               
               // setNextUrl(response.data.next);
               // setPrevUrl(response.data.previous);
               setPokemonListState((state) =>({
                    ...state,
                    nextUrl: response.data.next,
                    prevUrl: response.data.previous
               }));
               const pokemonResultPromise = PokemonResults.map((pokemon)=> axios.get(pokemon.url));
               const pokemonData = await Promise.all(pokemonResultPromise);
               console.log(pokemonData);
               const pokeListResult = pokemonData.map((pokeData)=>{
                    const pokemon = pokeData.data;
                    return {
                         id: pokemon.id,
                         name: pokemon.name,
                         image: (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
                         types: pokemon.types
                    }
               });
               console.log("a",pokeListResult);
               setPokemonListState((state) =>({
                    ...state,
                    pokemonList: pokeListResult,
                    isLoading: false
               }));     
          }
     }
     useEffect(()=>{
          getPokemonList();
     },[pokemonListState.pokedexUrl]);
     return [pokemonListState,setPokemonListState];
}
export default usePokemonList;