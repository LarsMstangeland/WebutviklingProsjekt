import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button, PreviewCard } from '../widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe, Ingredient, IngredientName } from '../service-files/recipe-service';
import userService, { LikedRecipe } from '../service-files/user-service';
import utilityService, {Region, Unit, Type} from '../service-files/utility-service';
import cartService, {CartItem} from 'src/service-files/cart-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
//@ts-ignore
const userData = JSON.parse(sessionStorage.getItem('user'));

/**
 * Renders recipe list.
 */
export class RecipeList extends Component {
  //Array to store all recipes
  recipes: Recipe[] = [];
  recipesToShow: Recipe[] = [];
  regions: Region[] = [];
  types: Type[] = [];
  searchBar: string = '';
  regionFilter: string = 'Region';
  recipeTypeFilter: string = 'Type';
  userId: number | undefined = 0;
  recipe: Recipe = {
    recipe_id: 0,
    name: '',
    description: '',
    region: '',
    picture_url: '',
    type: ''
  };

  filter(){
    for(let i = 0; i < this.recipes.length; i++){
      const recipe = this.recipes[i];
      const name = recipe.name.toUpperCase();
      if(name.indexOf(this.searchBar.toUpperCase()) > -1){
        if(this.regionFilter == 'Region' && this.recipeTypeFilter == 'Type' || recipe.region == this.regionFilter && recipe.type == this.recipeTypeFilter){
          this.recipesToShow.push(recipe);
        }else if(this.regionFilter == 'Region' && recipe.type == this.recipeTypeFilter || recipe.region == this.regionFilter && this.recipeTypeFilter == 'Type'){
          this.recipesToShow.push(recipe)
        }
      }
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            margin: '1rem',
          }}
        >
          <h1>Recipes</h1>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ margin: '0 0.5rem' }}>
              <Form.Input style={{width : '12vw', height : '5.5vh', border : '2px solid black'}}
                onChange={(event) => {
                  this.searchBar = event.currentTarget.value;
                  this.recipesToShow = [];
                this.filter()
                }}
                value={this.searchBar}
                type="search"
                placeholder="Search for recipes"
              ></Form.Input>
            </div>
            <div style={{ margin: '0 0.5rem'}}>
              <Form.Select style={{width : '12vw', height : '5.5vh', border : '2px solid black'}}
                value={this.regionFilter}
                onChange={(event) => {
                  this.regionFilter = event.currentTarget.value;
                  this.recipesToShow = [];
                  this.filter()
                }}>
                <option>Region</option>
                {this.regions.map((region) => (
                  <option key={region.id} value={region.name}>{region.name}</option>
                ))}
              </Form.Select>
            </div>
            <div style={{ margin: '0 0.5rem', width : '2vw' }}>
              <Form.Select
              style={{width : '12vw', height : '5.5vh', border : '2px solid black'}}
                value={this.recipeTypeFilter}
                onChange={(event) => {
                  this.recipeTypeFilter = event.currentTarget.value;
                  this.recipesToShow = [];
                this.filter()
                }}>
                <option>Type</option>
                {this.types.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </Form.Select>
            </div>
            <div style={{ margin: '0 0.5rem' }}>
              {userData && userData.admin ? (
                <Button.Success
                  onClick={() => {
                    recipeService
                      .addRecipe(
                        this.recipe.name,
                        this.recipe.description,
                        this.recipe.picture_url,
                        this.recipe.region,
                        this.recipe.type
                      )
                      .then((response) => (this.recipe.recipe_id = response))
                      .then(() => history.push('/recipes/' + this.recipe.recipe_id + '/edit'));
                  }}
                >
                  Add Recipe
                </Button.Success>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {this.recipesToShow.length > 0 ? (
              this.recipesToShow.map((recipe) => (
                //Maps all the different recipes and renders them as links to their respective recipe details

              <PreviewCard small id={recipe.recipe_id} name={recipe.name} url={recipe.picture_url}></PreviewCard>
              ))) : (<h3>No results</h3>)}
          </div>
        </div>
      </div>
    );
  }

  async mounted() {
    //Gets all recipes and pass them to recipe array
    try {
      let recipes = await recipeService.getAll();
      this.recipes = recipes;
      this.recipesToShow = recipes;
      let regions = await utilityService.getAllRegions();
      this.regions = regions;
      let types = await utilityService.getAllTypes();
      this.types = types;
    } catch (error: any){
      Alert.danger('Error getting recipes: ' + error.message)
    }
  }
}

/**
 * Renders a specific recipe.
 */
export class RecipeDetails extends Component<{ match: { params: { id: number } } }> {
  //Objects to store recipe and recipe ingredient details
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture_url: '', type: '' };
  likedRecipes : LikedRecipe[] = [];
  ingredients: Ingredient[] = [];
  portions: number = 4;
  emailSubject: string = '';
  emailBody: string = '';
   
  RecipeDetail({name, value}: any) {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
        <p style={{marginRight: "0.5rem"}}>{name}:</p>
        <p>{value}</p>
      </div>
    )
  }

  render() {
    return (
    <>
      <div style={{padding: "1rem"}}>
        <Row>
          <Row style={{display: "flex", flexDirection: "row", padding: "1rem"}}>
            <Row style={{width: "50%"}}>
              <img src={this.recipe.picture_url} alt={this.recipe.name} style={{maxWidth: "100", height: "auto", borderRadius: "2rem"}}/>
            </Row>
            <div style={{width: "50%"}}>
              <h2 style={{marginBottom: "1rem"}}>{this.recipe.name}</h2>
              <this.RecipeDetail name="Region" value={this.recipe.region}/>
              <this.RecipeDetail name="Type" value={this.recipe.type}/>
              <this.RecipeDetail name="Description" value={this.recipe.description}/>
            </div>
          </Row>
          <div style={{marginBottom: "0.5rem"}}>
            <Column>
                  {
                  userData ?
                  (this.likedRecipes.some((r) => (this.recipe.recipe_id == r.recipe_id)) ?
                  <Button.Danger onClick={async ()=>{
                    await userService.removeLikedRecipe(userData.user_id, this.recipe.recipe_id)
                    location.reload();
                    }}>Unlike</Button.Danger>  
                    :
                   <Button.Success onClick={async ()=> {
                    await userService.likeRecipe(userData.user_id, this.props.match.params.id);
                    location.reload();
                    }}>Like recipe
                  </Button.Success>)
                   : 
                   (<Button.Success onClick={async ()=> {
                    Alert.info('Log in to like a recipe')
                    }}>Like recipe
                  </Button.Success>)
                  }
            </Column>
          </div>
            <Column>
              <Button.Success onClick={() => {
              userData ? 
                (recipeService.addRecipeIngredientsToCart(this.ingredients, this.recipe.recipe_id, userData.user_id),
                Alert.info('Ingredients added to cart!')
               ) : (Alert.info('Log in to add ingredients to cart'))
            }}>Add ingredients to cart</Button.Success></Column> 
            <Column><Button.Light onClick={() => {window.open(`mailto:example@mail.com?subject=${this.emailSubject}&body=${this.emailBody}`)}}>Share</Button.Light></Column>
          </Row>
        </div>
          <Card title='Ingredients'>
            <Row>
              <Column>Portions:</Column>
              <Column>
                <Form.Input
                  type="number"
                  max="50"
                  min="1"
                  value={this.portions}
                  onChange={(event) =>
                    Number(event.currentTarget.value) <= 50
                      ? (this.portions = Number(event.currentTarget.value))
                      : ''
                  }
                ></Form.Input>
              </Column>
            </Row>
            <Row>
              <Column>Ingredients name:</Column>
              <Column>Amount:</Column>
              <Column>Unit:</Column>
            </Row>
            {this.ingredients.map((ingredient) => (
              //Maps the different ingredients of a recipe and renders their respective values
              <Row key={ingredient.ingredients_id}>
                <Column>{ingredient.name}</Column>
                <Column>{(ingredient.amount * this.portions) / 4}</Column>
                <Column>{ingredient.unit}</Column>
              </Row>
              ))}
              
          </Card>
          {
          userData ? 
          (userData.admin ? (<Row>
              <Column><Button.Danger onClick={() => {
                //Deletes the recipe and pushes the path back to all recipes
                  recipeService.delete(this.recipe.recipe_id).then(() => {
                    history.push('/recipes');
              })
              }}>Delete</Button.Danger></Column>
              <Column><Button.Success onClick={() => {
                //Pushes the path to edit page of recipe
                history.push('/recipes/' + this.props.match.params.id + '/edit')
              }}>Edit</Button.Success></Column>
            </Row>) : ( <> </>
            )): <> </>}
        </>
      )
    
  }

  async mounted() {
    //Gets spesific recipe and it´s ingredients, and pass them to
    try {
      let recipe = await recipeService.get(this.props.match.params.id);
      this.recipe = recipe;
      let ingredients = await recipeService.getRecipeIngredients(this.props.match.params.id);
      this.ingredients = ingredients;
      this.emailSubject = 'Recipe for ' + this.recipe.name;
      this.emailBody = 'Description: %0D%0A' + this.recipe.description + '%0D%0A %0D%0A Ingredients:  %0D%0A' + this.ingredients.map(ing => `${ing.name + ' - ' + ing.amount + ' ' + ing.unit} %0D%0A`)

      if(userData) {
        let likedRecipes = await userService.getLikedRecipes(userData.user_id)
        this.likedRecipes = likedRecipes
      }

    } catch (error: any) {
      Alert.danger('Error getting recipe or ingredients: ' + error.message)
    }
  }
}

/**
 * Renders a page to edit a recipe
 */
export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture_url: '', type: '' };
  recipeIngredients: Ingredient[] = [];
  ingredientsToDelete: Ingredient[] = [];
  regions: Region[] = [];
  units: Unit[] = [];
  types: Type[] = [];
  newIngredient: Ingredient = { ingredients_id: 0, name: '', amount: 0, unit: '' };
  newIngredients: Ingredient[] = [];
  newIngredientsToDelete: Ingredient[] = [];
  ingredients: IngredientName[] = [];
  searchBar: string = '';
  ingredientsToShow: IngredientName[] = [];

  render() {
    return (
      <>
        <Card title="Edit recipe">
          <Row style={{marginBottom: "0.5rem"}}>
            <Column width={2}>
              <Form.Label>Name:</Form.Label>
            </Column>
            <Column>
              <Form.Input
                type="text"
                value={this.recipe.name}
                onChange={(event) => (this.recipe.name = event.currentTarget.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Region:</Form.Label>
            </Column>
            <Column>
              <Form.Select
                value={this.recipe.region}
                onChange={(event) => (this.recipe.region = event.currentTarget.value)}
              >
                <option value={'Regions'}>Regions</option>
                {this.regions.map((region) => (
                  <option key={region.id} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </Form.Select>
            </Column>
          </Row>
          <Row>
            <Column width={2}>
              <Form.Label>Type:</Form.Label>
            </Column>
            <Column>
              <Form.Select
                value={this.recipe.type}
                onChange={(event) => (this.recipe.type = event.currentTarget.value)}>

                <option value={'Types'}>Types</option>
                {this.types.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Column>
          </Row>
          <Row style={{marginBottom: "0.5rem"}}>
            <Column width={2}>
              <Form.Label>Description:</Form.Label>
            </Column>
            <Column>
              <Form.Textarea
                value={this.recipe.description}
                onChange={(event) => {
                  this.recipe.description = event.currentTarget.value;
                }}
                rows={10}
              />
            </Column>
          </Row>
          <Row>
            <Column width={2}>Image URL:</Column>
            <Column>
              <Form.Input
                type="text"
                value={this.recipe.picture_url}
                onChange={(event) => (this.recipe.picture_url = event.currentTarget.value)}
              ></Form.Input>
            </Column>
          </Row>
          <Row>
            <Column>Ingredients name:</Column>
            <Column>Amount:</Column>
            <Column>Unit:</Column>
            <Column></Column>
          </Row>
          {this.recipeIngredients.map((ingredient) => (
            <Row key={ingredient.ingredients_id}>
              <Column>{ingredient.name}</Column>
              <Column>
                <Form.Input
                  type="number"
                  max="1000"
                  min="0"
                  value={ingredient.amount}
                  onChange={(event) => (ingredient.amount = Number(event.currentTarget.value))}
                />
              </Column>
              <Column>
                <Form.Select
                  value={ingredient.unit}
                  onChange={(event) => (ingredient.unit = event.currentTarget.value)} >
                  {this.units.map((unit) => (
                    <option key={unit.id} value={unit.unit}>
                      {unit.unit}
                    </option>
                  ))}
                </Form.Select>
              </Column>
              <Column>
                {this.ingredientsToDelete.findIndex(
                  (ing) => ing.ingredients_id == ingredient.ingredients_id
                ) == -1 ? (
                  <Button.Danger
                    small
                    onClick={() => {
                      if (
                        this.newIngredients.findIndex(
                          (ing) => ing.ingredients_id == ingredient.ingredients_id
                        ) == -1
                      ) {
                        this.ingredientsToDelete.push(ingredient);
                      } else {
                        this.newIngredients.splice(this.newIngredients.indexOf(ingredient), 1);
                        this.recipeIngredients.splice(
                          this.recipeIngredients.indexOf(ingredient),
                          1
                        );
                      }
                    }}
                  >
                    X
                  </Button.Danger>
                ) : (
                  <Button.Success
                    small
                    onClick={() => {
                      const index = this.ingredientsToDelete.indexOf(ingredient);
                      if (index > -1) {
                        // only splice array when item is found
                        this.ingredientsToDelete.splice(index, 1); // 2nd parameter means remove one item only
                      }
                    }}
                  >
                    Add
                  </Button.Success>
                )}
              </Column>
            </Row>
          ))}
          <h4>Add ingredient</h4>
          <Row>
            <Column>
              <Form.Input
                type="search"
                value={this.searchBar}
                placeholder="Search for ingredient"
                list={'searchList'}
                onChange={(event) => {
                  this.searchBar = event.currentTarget.value;

                  if(this.searchBar.length > 1){
                    this.ingredientsToShow = [];
                    for (let i = 0; i < this.ingredients.length; i++) {
                      const name = this.ingredients[i].name.toUpperCase();
                      if (name.indexOf(this.searchBar.toUpperCase()) > -1) {
                        this.ingredientsToShow.push(this.ingredients[i]);
                      }
                    }
                  }
                }
              }></Form.Input>
              <datalist id='searchList'>
                {this.ingredientsToShow.map((ingredient) => (
                  <option key={ingredient.ingredients_id} value={ingredient.name}>{ingredient.name}</option>
                ))}
              </datalist>
            </Column>
            <Column>
              <Form.Input
                type="number"
                max="1000"
                value={this.newIngredient.amount}
                onChange={(event) => (this.newIngredient.amount = Number(event.currentTarget.value))}
              /></Column>
            <Column>
              <Form.Select
                value={this.newIngredient.unit}
                  onChange={(event) => (this.newIngredient.unit = event.currentTarget.value)} >
                <option>Select Unit</option>
                {this.units.map((unit) => (
                  <option key={unit.id} value={unit.unit}>
                    {unit.unit}
                  </option>
                ))}
              </Form.Select>
            </Column>
            <Column>
              <Button.Light
                small
                onClick={() => {
                  let nameCheck = this.ingredients.find(ing => ing.name == this.searchBar)
                  let duplicat = this.recipeIngredients.find(
                    (ingredient) => ingredient.name == this.newIngredient.name
                  );
                  if (
                    this.newIngredient.unit == 'Select Unit' ||
                    this.newIngredient.unit == '' ||
                    this.newIngredient.amount > 1000 ||
                    this.newIngredient.amount < 0
                  ) {
                    return Alert.danger('Unvalid value in new ingredient');
                  } else if (duplicat) {
                    return Alert.danger('This ingredient is already in use');
                  } else if(nameCheck){
                    let id = Number(
                      nameCheck.ingredients_id
                    );
                    this.newIngredient.ingredients_id = id;
                    this.newIngredient.name = this.searchBar;
                    this.recipeIngredients.push(this.newIngredient);
                    this.newIngredients.push(this.newIngredient);
                    this.newIngredient = { ingredients_id: 0, name: '', amount: 0, unit: '' };
                  }
                }}
              >
                Add
              </Button.Light>
            </Column>
          </Row>

        </Card>
        <Row>
          <Column>
            <Button.Success
              onClick={() => 
                {if(this.recipe.name != '' && this.recipe.description != '' && this.recipe.picture_url != ''
                && this.recipeIngredients.length > 0 && this.recipe.region != 'Regions' && this.recipe.type != 'Types'){



                {if(this.ingredientsToDelete.length > 0){
                  this.recipeIngredients = this.recipeIngredients.filter((ingredient) => !this.ingredientsToDelete.includes(ingredient))
                  recipeService.deleteRecipeIngredients(this.ingredientsToDelete, this.recipe.recipe_id)
                    }
                if(this.newIngredients.length > 0){
                  recipeService.addRecipeIngredient(this.newIngredients, this.recipe.recipe_id)
                    }
                    recipeService.updateRecipeIngredients(
                      this.recipeIngredients,
                      this.recipe.recipe_id
                    );
                    recipeService.update(this.recipe).then(() => {
                      history.push('/recipes/' + this.recipe.recipe_id);
                })}
              } else{
                Alert.danger('Unvalid values for recipe')
                  }
                }
              }
            >
              Save
            </Button.Success>
          </Column>
        </Row>
      </>
    );
  }

  async mounted() {
    try {
      let recipe = await recipeService.get(this.props.match.params.id);
      this.recipe = recipe;
      if(this.recipe.region == null || this.recipe.type == null){
        this.recipe.region = 'Regions';
        this.recipe.type = 'Types';
      }
      let recipeIngredients = await recipeService.getRecipeIngredients(this.props.match.params.id);
      this.recipeIngredients = recipeIngredients;
      let regions = await utilityService.getAllRegions()
      this.regions = regions;
      let units = await utilityService.getAllUnits()
      this.units = units;
      let types = await utilityService.getAllTypes()
      this.types = types;
      let ingredients = await recipeService.getAllIngredients(this.props.match.params.id)
      //@ts-ignore
      this.ingredients = ingredients;
    } catch (error: any) {
      Alert.danger('Error getting recipe or ingredients: ' + error.message);
    }
  }
}