import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import { RecipeList, RecipeDetails } from './recipe/recipe-components';

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Food Junkies">
        <NavBar.Link to="/recipes">Recipes</NavBar.Link>
        <NavBar.Link to="/my_profile">My Profile</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="Welcome">To Food Junkies</Card>;
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Alert />
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/recipes" component={RecipeList} />
      <Route exact path="/recipes/:id(\d+)" component={RecipeDetails} /> {/* id must be number */}
      <Route exact path='/my_profile' />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
