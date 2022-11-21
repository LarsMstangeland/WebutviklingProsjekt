import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Alert, PreviewCard, SlideShowCard, Button} from './widgets';
import { RecipeList, RecipeDetails, RecipeEdit } from './component-files/recipe-components';
import recipeService, { Recipe } from './service-files/recipe-service';
import {NewUser, UserLogin} from './component-files/user-components';
import userService, { LikedRecipe } from './service-files/user-service';

//@ts-ignore
const userData = JSON.parse(sessionStorage.getItem('user'));

class Menu extends Component {
  render() {
    return (
      <div>
        <NavBar brand="Food Junkies">
          <NavBar.Link left={false} to="/recipes">
            Recipes
          </NavBar.Link>
          <NavBar.Link left={false} to="/user/login">
            My Profile
          </NavBar.Link>
        </NavBar>
      </div>
    );
  }
}

class Home extends Component {

  //different variables that are used for storing 
  //our db-results

  recipes: Recipe[] = [];
  recipesToShow: Recipe[] = [];
  MostLikedRecipes: Recipe[] = [];
  UsersLikedRecipes: LikedRecipe[] = [];
  RecipesThatWasLikedByUser: Recipe[] = [];
  slidenr: number = 0;
  CurrentlyInSlide: Recipe = {
    recipe_id: 0,
    name: '',
    description: '',
    picture_url: '',
    region: '',
    type: '',
  };

  TypeRecommendedOnLikes: Recipe[] = [];
  RegionRecommendedOnLikes: Recipe[] = [];

  /**@ts-ignore */
  timer: Timer = () => {};


  //defined function for starting the 5s timer
  //automatically controlling slides
  hermansMetodeStartTheTimeout(){
    this.timer = setInterval(() => {

      //resets slide nr back down to 0 when it hits 4
      //range 0-4 gives 5 slides
      this.slidenr == 4 ? this.slidenr = 0 : this.slidenr++;
      this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]

    },5000);
  }
   render() {
    return (
      <div style={{ backgroundColor: '#f9f5f1' }}>
        <h1
          style={{
            marginLeft: '35vw',
            height: '20vh',
            width: '50vw',
            position: 'relative',
            top: '5vh',
          }}
        >
          Welcome to <br />
          <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>Food Junkies</span>
        </h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SlideShowCard recipe={this.CurrentlyInSlide}>
            <Button.Light onClick={() => {
              
              //onlick slide should increment and re-define the recipe to be shown
              this.slidenr == 0 ? this.slidenr = 4: this.slidenr--
              this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]
              
              //clear the interval so the slide does not
              //switch right after being updated with manual
              clearInterval(this.timer)
              this.hermansMetodeStartTheTimeout();
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className='bi bi-arrow-left' viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            </Button.Light>
            <Button.Light onClick={() => {

              //same function as above, just the other way 
              this.slidenr == 4 ? this.slidenr = 0: this.slidenr++
              this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]
              clearInterval(this.timer)
              this.hermansMetodeStartTheTimeout();

              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </Button.Light>
          </SlideShowCard>
        </div>

        {//checks if a user i logged in and generates the rest of
        //the site based on that, if not the user gets fitting response to log in
        userData?(

        <div>
        <h2 style={{marginLeft:"15vw", marginTop:"5vw"}}>Based on your likes you should like recipes with these types:</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.TypeRecommendedOnLikes.length > 0 ? this.TypeRecommendedOnLikes.map((recipe) => (

            //runs through a defined array to show what recipes a user could try out
            //this defined array is based on likes and utilizes the type of dish
            //Also checks to see if the array is empty
            //And gives a response based on that
            
            <PreviewCard small key={recipe.recipe_id} name={recipe.type} url={recipe.picture_url} id={recipe.recipe_id}></PreviewCard>
          )): <b>You should Like some recipes to get a custom recommendation based on the type of dish</b>}
            
          </div>
          <h2 style={{marginLeft:"15vw", marginTop:"5vw"}} >Based on your likes you should like recipes with these Regions:</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
              {this.RegionRecommendedOnLikes.length > 0 ? this.RegionRecommendedOnLikes.map((recipe) => (

                  
              //runs through a defined array to show what recipes a user could try out
              //this defined array is based on likes and utilizes the type of dish. Also checks to see if the array is empty
              //And gives a response based on that

                <PreviewCard small key={recipe.recipe_id} name={recipe.region} url={recipe.picture_url} id={recipe.recipe_id}></PreviewCard>
              )): <b>You should Like some recipes to get a custom recommendation based on the type of dish</b>}
            </div>
        </div>) : <h2 style={{marginLeft:"35vw", marginTop:"5vw"}}>Log in to view more!</h2>}
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
      let bestrecipes = await userService.getMostLikedRecipes();
      let sizeOfSlide = 5;

      //fill up the array with the specified top % of liked recipes
      for (let i = 0; i < sizeOfSlide; i++) {
        let PopularRecipe = await recipeService.get(bestrecipes[i].recipe_id);
        this.MostLikedRecipes.push(PopularRecipe);
      }

      //initiialize the first slide and start timer
      this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr]
      this.hermansMetodeStartTheTimeout();

      //checks if the user is logged in and then fetches the liked recipe id's from the user
      userData? (
        await userService.getLikedRecipesForUser(userData.user_id).then((recipes) => {
          //Uses these recipe id's to the get full recipe object
          //and then pushes it into a array
          recipes.map(async (recipe) => {
            let newrecipe = await recipeService.get(recipe.recipe_id)
            this.RecipesThatWasLikedByUser.push(newrecipe)
            

            //uses the new recipe objekt to filter on this.recipes which is all the recipes in the db
            //Filtering for both region and type to recommend for user
            let recomendedType = this.recipes.filter((recipe) => recipe.type == newrecipe.type && recipe.recipe_id != newrecipe.recipe_id)
            let recomendedRegion = this.recipes.filter((recipe) => recipe.region == newrecipe.region && recipe.recipe_id != newrecipe.recipe_id)


            //make it so no more than 3 recipes can be recommended
            recomendedRegion.map((RegionRecipe) => {
              if(this.RegionRecommendedOnLikes.length < 3){
                this.RegionRecommendedOnLikes.push(RegionRecipe)
              }
            })
            recomendedType.map((TypeRecipe) => {
              if(this.TypeRecommendedOnLikes.length < 3){
                this.TypeRecommendedOnLikes.push(TypeRecipe)
              }
            })
          })
        })) : (this.RecipesThatWasLikedByUser = []);
    } catch (error: any) {
      Alert.danger('Error getting recipes: ' + error.message);
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
      <Route exact path="/recipes/:id(\d+)/edit" component={RecipeEdit} />
      <Route exact path="/user/login" component={UserLogin} />
      <Route exact path="/user/create" component={NewUser} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
