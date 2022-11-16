import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert, PreviewCard, BootstrapPreviewCard, Button } from './widgets';
import { Recipe } from './service-files/recipe-service';
import { RecipeList, RecipeDetails, RecipeEdit } from './component-files/recipe-components';
import {NewUser, UserLogin} from './component-files/user-components';
import { CartContent } from './component-files/cart-components';

class Menu extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Food Junkies">
          <NavBar.Link left={false} to="/recipes">Recipes</NavBar.Link>
          <NavBar.Link left={false} to="/user/login">My Profile</NavBar.Link>
          <NavBar.Link left={true} to="/cart"><Button.Light left={true} small={true} onClick={() => {}}>Jeg vil være et icon</Button.Light></NavBar.Link>
        </NavBar>
      </div>
      
    );
  }
}

class Home extends Component {

  suggestedRecipies: Recipe[] = []

  render() {
    return (
      <div style={{backgroundColor: "#f9f5f1"}}>
        <Card title="Welcome">

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent laoreet risus et nunc ultricies, a varius velit ultrices. Etiam in efficitur sem. Nulla facilisi. Curabitur nunc sem, sollicitudin ut tortor auctor, gravida dapibus dui. In auctor justo diam, ut dapibus justo ultricies a. Sed sollicitudin ipsum in velit rutrum rhoncus. Integer porttitor odio nisi, vitae rhoncus velit egestas sed. Ut lobortis lectus ut fringilla auctor. Donec rutrum eros nec nibh molestie, a molestie nibh semper. Suspendisse velit tellus, luctus sit amet lectus consectetur, tincidunt blandit metus. Curabitur vehicula fringilla erat, vel egestas urna mollis in. Nam cursus accumsan mauris eget molestie. Suspendisse suscipit porta purus, id interdum sem tempus sed. Curabitur mattis aliquam dolor. Etiam et velit eget arcu semper dapibus.
          Nulla sit amet auctor mi, vitae laoreet lorem. In et euismod erat, vitae eleifend tellus. Proin consectetur sit amet nunc vitae egestas. Ut ultrices, lacus a sagittis pretium, nunc dui condimentum erat, ac auctor dui ante id mi. Aliquam volutpat laoreet placerat. Ut dignissim eu enim at vulputate. Sed neque justo, mollis sit amet ligula vitae, tincidunt auctor lorem. Curabitur at augue sit amet odio cursus tristique. Nam cursus eros et neque condimentum convallis. Sed efficitur dolor ligula, sit amet faucibus odio posuere quis. Suspendisse lobortis rutrum tortor et finibus. Nam ac tincidunt felis. 
        </Card>
        <Card title="suggested recipes">
            {this.suggestedRecipies.map((recipe) => (
            <PreviewCard link1={recipe.recipe_id.toString()} title1={recipe.name} image1={recipe.picture_url}></PreviewCard>
            ))}

        </Card>
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
      <Route exact path='/user/login' component={UserLogin}/>
      <Route exact path='/user/create' component={NewUser}/>
      <Route exact path='/cart' component={CartContent}/>
    </div>
  </HashRouter>,
  document.getElementById('root')
);
