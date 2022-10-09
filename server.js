const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP
const { buildSchema } = require('graphql');

const schema = buildSchema(`
 type Query {
  pokemon(id: Int!): Pokemon
  advantageousPokemons(id: Int!): [Pokemon]
  pokemons: [Pokemon]
 },
 type Pokemon {
  id: Int
  name: String
  types: [String]
  weight: Weight
  height: Height
 },
 type Weight {
   minimum: String
   maximum: String
 },
 type Height {
   minimum: String
   maximum: String
 }
`);
const pokemons = require("./pokemons.json");

const getPokemon = function({id}) { 
  return pokemons.filter(pokemon => {
    return pokemon.id == id;
  })[0];
}

const getAdvantageousPokemons = function({id}) { 
  const type2index = {
    "Normal": 0,
    "Fire": 1,
    "Water": 2,
    "Electric": 3,
    "Grass": 4,
    "Ice": 5,
    "Fighting": 6,
    "Poison": 7,
    "Ground": 8,
    "Flying": 9,
    "Psychic": 10,
    "Bug": 11,
    "Rock": 12,
    "Ghost": 13,
    "Dragon": 14,
    "Dark": 15,
    "Steel": 16,
    "Fairy": 17,
  }

  const typeTable = [
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1, -2,  0,  0, -1,  0],
    [0, -1, -1,  0,  1,  1,  0,  0,  0,  0,  0,  1, -1,  0, -1,  0,  1,  0],
    [0,  1, -1,  0, -1,  0,  0,  0,  1,  0,  0,  0,  1,  0, -1,  0,  0,  0],
    [0,  0,  1, -1, -1,  0,  0,  0, -2,  1,  0,  0,  0,  0, -1,  0,  0,  0],
    [0, -1,  1,  0, -1,  0,  0, -1,  1, -1,  0, -1,  1,  0, -1,  0, -1,  0],
    [0, -1, -1,  0,  1, -1,  0,  0,  1,  1,  0,  0,  0,  0,  1,  0, -1,  0],
    [1,  0,  0,  0,  0,  1,  0, -1,  0, -1, -1, -1,  1, -2,  0,  1,  1, -1],
    [0,  0,  0,  0,  1,  0,  0, -1, -1,  0,  0,  0, -1, -1,  0,  0, -2,  1],
    [0,  1,  0,  1, -1,  0,  0,  1,  0, -2,  0, -1,  1,  0,  0,  0,  1,  0],
    [0,  0,  0, -1,  1,  0,  1,  0,  0,  0,  0,  1, -1,  0,  0,  0, -1,  0],
    [0,  0,  0,  0,  0,  0,  1,  1,  0,  0, -1,  0,  0,  0,  0, -2, -1,  0],
    [0, -1,  0,  0,  1,  0, -1, -1,  0, -1,  1,  0,  0, -1,  0,  1, -1, -1],
    [0,  1,  0,  0,  0,  1, -1,  0, -1,  1,  0,  1,  0,  0,  0,  0, -1,  1],
    [-2, 0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  0,  0,  1,  0, -1,  0,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  0, -1, -2],
    [0,  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  1,  0, -1,  0, -1],
    [0, -1, -1, -1,  0,  1,  0,  0,  0,  0,  0,  0,  1,  0,  0,  0, -1,  1],
    [0, -1,  0,  0,  0,  0,  1, -1,  0,  0,  0,  0,  0,  0,  1,  1, -1,  0],
  ]

  const attacker =  pokemons.filter(pokemon => {
    return pokemon.id == id;
  })[0];

  const advantageousPokemons = []

  for(const defender of pokemons){
    let point = 0;
    for(const attackerType of attacker.types){
      for(const defenderType of defender.types){
        point += typeTable[type2index[attackerType]][type2index[defenderType]];
      }
      if (point >= 1) {
        advantageousPokemons.push(defender)
        break
      }
    }
  }

  return advantageousPokemons
}

const root = {
  pokemon: getPokemon,
  advantageousPokemons: getAdvantageousPokemons,
};

const app = express();
app.use('/graphql', graphqlHTTP({
 schema: schema,
 rootValue: root,
 graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));