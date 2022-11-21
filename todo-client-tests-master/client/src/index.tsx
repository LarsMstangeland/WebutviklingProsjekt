import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import {
  NavBar,
  Alert,
  PreviewCard,
  SlideShowCard,
  BootstrapPreviewCard,
  Button,
  Card,
  Row,
} from './widgets';
import { RecipeList, RecipeDetails, RecipeEdit } from './component-files/recipe-components';
import recipeService, { Recipe, Ingredient, IngredientName } from './service-files/recipe-service';
import { NewUser, UserLogin } from './component-files/user-components';
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

  hermansMetodeStartTheTimeout() {
    this.timer = setInterval(() => {
      this.slidenr == 4 ? (this.slidenr = 0) : this.slidenr++;
      this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr];
    }, 5000);
  }

  filterOnRelated(ListToBeFilter: Recipe[], relation: string) {
    let RelatedToLiked: Recipe[] = [];

    ListToBeFilter.map((LikedRecipe) => {
      relation == 'region'
        ? (RelatedToLiked = this.recipes.filter((recipe) => recipe.region == LikedRecipe.region))
        : [];
      relation == 'type'
        ? (RelatedToLiked = this.recipes.filter((recipe) => recipe.type == LikedRecipe.type))
        : [];
    });
    return RelatedToLiked;
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
            <Button.Light
              onClick={() => {
                //onlick slide should increment and re-define the recipe to be shown
                this.slidenr == 0 ? (this.slidenr = 4) : this.slidenr--;
                this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr];
                clearInterval(this.timer);
                this.hermansMetodeStartTheTimeout();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </Button.Light>
            <Button.Light
              onClick={() => {
                //onlick slide should increment and re-define the recipe to be shown
                this.slidenr == 4 ? (this.slidenr = 0) : this.slidenr++;
                this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr];
                clearInterval(this.timer);
                this.hermansMetodeStartTheTimeout();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </Button.Light>
          </SlideShowCard>
        </div>

        {userData ? (
          <div>
            <h2 style={{ marginLeft: '15vw', marginTop: '5vw' }}>
              Based on your likes you should like recipes with these types:
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {this.TypeRecommendedOnLikes.length > 0 ? (
                this.TypeRecommendedOnLikes.map((recipe) => (
                  <PreviewCard
                    small
                    key={recipe.recipe_id}
                    name={recipe.type}
                    url={recipe.picture_url}
                    id={recipe.recipe_id}
                  ></PreviewCard>
                ))
              ) : (
                <b>
                  You should like som recipes to get custom recommendation based on the type of dish
                </b>
              )}
            </div>
            <h2 style={{ marginLeft: '15vw', marginTop: '5vw' }}>
              Based on your likes you should like recipes with these Regions:
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {this.RegionRecommendedOnLikes.length > 0 ? (
                this.RegionRecommendedOnLikes.map((recipe) => (
                  <PreviewCard
                    small
                    key={recipe.recipe_id}
                    name={recipe.region}
                    url={recipe.picture_url}
                    id={recipe.recipe_id}
                  ></PreviewCard>
                ))
              ) : (
                <b>
                  You should like som recipes to get custom recommendation based on the type of dish
                </b>
              )}
            </div>
          </div>
        ) : (
          <h2 style={{ marginLeft: '35vw', marginTop: '5vw' }}> Login to get view more</h2>
        )}
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
      this.CurrentlyInSlide = this.MostLikedRecipes[this.slidenr];

      this.hermansMetodeStartTheTimeout();

      userData
        ? await userService.getLikedRecipesForUser(userData.user_id).then((recipes) => {
            recipes.map(async (recipe) => {
              let newrecipe = await recipeService.get(recipe.recipe_id);
              this.RecipesThatWasLikedByUser.push(newrecipe);

              let recomendedType = this.recipes.filter(
                (recipe) => recipe.type == newrecipe.type && recipe.recipe_id != newrecipe.recipe_id
              );
              let recomendedRegion = this.recipes.filter(
                (recipe) =>
                  recipe.region == newrecipe.region && recipe.recipe_id != newrecipe.recipe_id
              );

              recomendedRegion.map((RecipeRegion) => {
                if (this.RegionRecommendedOnLikes.length < 3) {
                  this.RegionRecommendedOnLikes.push(RecipeRegion);
                }
              });
              recomendedType.map((RecipeType) => {
                if (this.TypeRecommendedOnLikes.length < 3) {
                  this.TypeRecommendedOnLikes.push(RecipeType);
                }
              });
            });
          })
        : (this.RecipesThatWasLikedByUser = []);
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
