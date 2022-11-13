import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert, PreviewCard } from './widgets';
import { RecipeList, RecipeDetails, RecipeEdit } from './component-files/recipe-components';

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
    return (
      <div>
        <Card title="Welcome">To Food Junkies</Card>

          <PreviewCard title1 ="dette er en tittel1" title2 = "dette er en tittel2" image1 = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&quality=85&auto=format&fit=max&s=a52bbe202f57ac0f5ff7f47166906403" image2 = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&quality=85&auto=format&fit=max&s=a52bbe202f57ac0f5ff7f47166906403">
          </PreviewCard>


      </div>

    )

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
      <Route exact path='/recipes/:id(\d+)/edit' component={RecipeEdit} />
      <Route exact path='/my_profile' />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
