import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, InfoCard, Alert, PreviewCard, BootstrapPreviewCard, Button } from './widgets';
import { RecipeList, RecipeDetails, RecipeEdit } from './component-files/recipe-components';
import recipeService, { Recipe, Ingredient, IngredientName } from './service-files/recipe-service';
import {NewUser, UserLogin} from './component-files/user-components';
import { CartContent } from './component-files/cart-components';
import userService, { LikedRecipe } from './service-files/user-service';



class Menu extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Food Junkies">
          <NavBar.Link left={false} to="/recipes">Recipes</NavBar.Link>
          <NavBar.Link left={false} to="/user/login">My Profile</NavBar.Link>
          {/*<NavBar.Link left={true} to="/cart"><Button.Light left={true} small={true} onClick={() => {}}>Jeg vil være et icon</Button.Light></NavBar.Link>*/}
        </NavBar>
      </div>
      
    );
  }
}

class Home extends Component {
  recipes: Recipe[] = [];
  recipesToShow: Recipe[] = [];
  MostLikedRecipes: Recipe[] = []

  render() {
    return (
      <div style={{ backgroundColor: '#f9f5f1' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '1rem',
          }}
        >
          <div style={{ margin: '4rem' }}>
            <h1>Welcome to</h1>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Food Junkies</h1>
            <NavBar.Link left={false} to="/recipes">
              <button type="button" className="btn btn-primary" onClick={() => {}}>
                To recipes!
              </button>
            </NavBar.Link>
          </div>
        </div>
        <InfoCard>Test</InfoCard>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {this.MostLikedRecipes.map((recipe) => (

          <PreviewCard small={true}
              key={recipe.recipe_id}
              id={recipe.recipe_id}
              name={recipe.name}
              url={recipe.picture_url}
            />
          ))}
        </div>
      </div>
    )
  }

  async mounted() {
    //Gets all recipes and pass them to recipe array
    try {
      let recipes = await recipeService.getAll();
      this.recipes = recipes;
      this.MostLikedRecipes;
      let bestrecipes = await userService.getMostLikedRecipes()

      for(let i = 0; i <= 5; i++){
        let PopularRecipe = await recipeService.get(bestrecipes[i].recipe_id)
        this.MostLikedRecipes.push(PopularRecipe)
        }

      for(let i = 0; i < 2; i++){
        let index = Math.floor(this.recipes.length * Math.random())
        let recipe = this.recipes[index];
        if(!this.recipesToShow.find(rec => rec.recipe_id == recipe.recipe_id)){
          this.recipesToShow.push(recipe)
        } else if(recipe.recipe_id == 1){
          this.recipesToShow.push(this.recipes[2])
        } else{
          this.recipesToShow.push(this.recipes[index - 1])
        }
      }
    } catch (error: any){
      Alert.danger('Error getting recipes: ' + error.message)
    }
  }
}
ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Alert />
      <Route exact path="/" component={Home} />
      <Route exact path="/recipes" component={RecipeList} />
      <Route exact path="/recipes/:id(\d+)" component={RecipeDetails} /> {/* id must be number */}
      <Route exact path='/recipes/:id(\d+)/edit' component={RecipeEdit} />
      <Route exact path='/user/login' component={UserLogin}/>
      <Route exact path='/user/create' component={NewUser}/>
      {/*<Route exact path='/cart' component={CartContent}/>*/}

    </div>
  </HashRouter>,
  document.getElementById('root')
);
