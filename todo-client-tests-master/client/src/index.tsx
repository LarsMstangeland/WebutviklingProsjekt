import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, InfoCard, Alert, PreviewCard, SlideShowCard, BootstrapPreviewCard, Button, Card } from './widgets';
import { RecipeList, RecipeDetails, RecipeEdit } from './component-files/recipe-components';
import recipeService, { Recipe, Ingredient, IngredientName } from './service-files/recipe-service';
import {NewUser, UserLogin} from './component-files/user-components';
import { CartContent } from './component-files/cart-components';
import userService, { LikedRecipe } from './service-files/user-service';

//@ts-ignore
const userData = JSON.parse(sessionStorage.getItem('user')); 



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
  UsersLikedRecipes: LikedRecipe[] = []
  RecipesThatWasLikedByUser: Recipe[] = [{recipe_id: 0, name: "", description: "", picture_url: "", region: "", type:""}]
  slidenr: number = 0
  CurrentlyInSlide: Recipe = {recipe_id: 0, name: "", description: "", picture_url: "", region: "", type:""}

  /**@ts-ignore */
  timer: Timer = () => {}

  hermansMetodeStartTheTimeout(){
    this.timer = setInterval(() => {

      console.log(this.slidenr)
      this.slidenr == 4 ? this.slidenr = 0 : this.slidenr++;
      this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]

    },5000);
  }

  

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
            <h1>Welcome to <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>Food Junkies</span></h1>
        </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SlideShowCard recipe={this.CurrentlyInSlide}>
          <div style={{left: "80%", top: "80%"}}>
            <Button.Light onClick={() => {
              //onlick slide should increment and re-define the recipe to be shown
              this.slidenr == 0 ? this.slidenr = 4: this.slidenr--
              this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]
              clearInterval(this.timer)
              this.hermansMetodeStartTheTimeout();
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='bi bi-arrow-left' viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            </Button.Light>
            <Button.Light onClick={() => {
              //onlick slide should increment and re-define the recipe to be shown
              this.slidenr == 4 ? this.slidenr = 0: this.slidenr++
              this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]
              clearInterval(this.timer)
              this.hermansMetodeStartTheTimeout();

              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </Button.Light>
          </div>
          </SlideShowCard>
        </div>        
      </div>
    );
  }

  async mounted() {
    try {

      //Gets all recipes and pass them to recipe array
      let recipes = await recipeService.getAll();
      this.recipes = recipes;

      //get a filtered list of the liked recipes in the whole db
      //and define how big the slide show should be
      let bestrecipes = await userService.getMostLikedRecipes()
      let sizeOfSlide = 5

      //fill up the array with the specified top % of liked recipes
      for(let i = 0; i < sizeOfSlide; i++){
        let PopularRecipe = await recipeService.get(bestrecipes[i].recipe_id)
        this.MostLikedRecipes.push(PopularRecipe)
        }
        
      //initiialize the first slide and start timer
      this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]

      this.hermansMetodeStartTheTimeout();


      userData? (
        await userService.getLikedRecipesForUser(userData.user_id).then((recipes) => {
          recipes.map(async (recipe) => {
    
            let newrecipe = await recipeService.get(recipe.recipe_id)
            this.RecipesThatWasLikedByUser.push(newrecipe)
          })
        })
        ) : this.RecipesThatWasLikedByUser = [{recipe_id: 0, name: "", description: "", picture_url: "", region: "", type:""}];

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
