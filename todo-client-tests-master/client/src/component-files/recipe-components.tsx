import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import recipeService, { Recipe, Ingredient, IngredientName } from '../service-files/recipe-service';
import regionAndUnitService, {Region, Unit} from '../service-files/regionAndUnit-service';
import { createHashHistory } from 'history';
import "./recipe-components.css"

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
  searchBar: string = '';
  userId: number | undefined = 0;

  render() {
    if(userData != null) {
      return (
        <>
          <Card title="Recipes">
            <Row>
              <Column><Form.Input 
              onChange={(event) => {
                this.searchBar = event.currentTarget.value;
                this.recipesToShow = [];
                for(let i = 0; i < this.recipes.length; i++){
                  const name = this.recipes[i].name.toUpperCase();
                  if(name.indexOf(this.searchBar.toUpperCase()) > -1){
                    this.recipesToShow.push(this.recipes[i]);
                  }
                }
              }} 
              value={this.searchBar}
              type='search'
              placeholder='Search for recipes'
              ></Form.Input></Column>
              <Column>{userData.admin ? <Button.Success onClick={() => {
                history.push('/recipes/' + this.userId + '/addRecipes')
              }
              }>Add Recipe</Button.Success> : <></>}</Column>
            </Row>
            {this.recipesToShow.map((recipe) => (
              //Maps all the different recipes and renders them as links to their respective recipe details
              <Row key={recipe.recipe_id}>
                <Column>
                  <NavLink to={'/recipes/' + recipe.recipe_id}>{recipe.name}</NavLink>
                </Column>
              </Row>))}
          </Card>
        </>
      );
    }
    else {
      return (
        <>
          <Card title="Recipes">
            <Row>
              <Column>
              <Form.Input 
              onChange={(event) => {
                this.searchBar = event.currentTarget.value;
                this.recipesToShow = [];
                for(let i = 0; i < this.recipes.length; i++){
                  const name = this.recipes[i].name.toUpperCase();
                  if(name.indexOf(this.searchBar.toUpperCase()) > -1){
                    this.recipesToShow.push(this.recipes[i]);
                  }
                }
              }} 
              value={this.searchBar}
              type='search'
              placeholder='Search for recipes'
              ></Form.Input></Column>
            </Row>
            {this.recipesToShow.map((recipe) => (
              //Maps all the different recipes and renders them as links to their respective recipe details
              <Row key={recipe.recipe_id}>
                <Column>
                  <NavLink to={'/recipes/' + recipe.recipe_id}>{recipe.name}</NavLink>
                </Column>
              </Row>))}
          </Card>
        </>
      );
    }
  }

  async mounted() {
    //Gets all recipes and pass them to recipe array
    try{
      let recipes = await recipeService.getAll();
      this.recipes = recipes;
      this.recipesToShow = recipes;
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
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture_url: '' };
  ingredients: Ingredient[] = [];
  portions: number = 4;
  emailSubject: string = '';
  emailBody: string = '';

  render() {
  if(userData != null){
      return (
        <>
          <Card title={this.recipe.name}>
            <Row>
              <picture>
                <img src={this.recipe.picture_url} alt={this.recipe.name} />
              </picture>
            </Row>
            <Row>
              <Column width={2}>Region:</Column>
              <Column>{this.recipe.region}</Column>
            </Row>
            <Row>
              <Column width={2}>Description:</Column>
              <Column>{this.recipe.description}</Column>
            </Row>
            <Row>
            <Column><Button.Success onClick={() => {
              console.log(userData.user_id)
              userData ? 
                recipeService.addRecipeIngredientsToCart(this.ingredients, this.recipe.recipe_id, userData.user_id)
               : Alert.info('Log in to add ingredients to cart')
            }}>Add ingredients to cart</Button.Success></Column> 
            <Column><Button.Light onClick={() => {window.open(`mailto:example@mail.com?subject=${this.emailSubject}&body=${this.emailBody}`)}}>Share</Button.Light></Column>
          </Row>
        </Card>
          <Card title='Ingredients'>
            <Row>
              <Column>Portions:</Column>
              <Column><Form.Input 
              type='number' 
              max='50'
              min='1'
              value={this.portions}
              onChange={(event) => (Number(event.currentTarget.value) <= 50 ? this.portions = Number(event.currentTarget.value) : '')} ></Form.Input></Column>
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
                <Column>{ingredient.amount * this.portions / 4}</Column>
                <Column>{ingredient.unit}</Column>
              </Row>
              ))}
              <Row>
                  <Column>
                    <button className='btn btndanger' onClick={()=> {

                      }}>Like recipe1
                    </button>
                  </Column>
              </Row>
          </Card>
          {userData.admin ? <Row>
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
            </Row> : <Row/>}
        </>
      )
    
  }
    else {

      return (
        <>
          <Card title={this.recipe.name}>
            <Row>
              <picture>
                <img src={this.recipe.picture_url} alt={this.recipe.name} />
              </picture>
            </Row>
            <Row>
              <Column width={2}>Region:</Column>
              <Column>{this.recipe.region}</Column>
            </Row>
            <Row>
              <Column width={2}>Description:</Column>
              <Column>{this.recipe.description}</Column>
            </Row>
          </Card>
          <Card title='Ingredients'>
            <Row>
              <Column>Portions:</Column>
              <Column><Form.Input 
              type='number' 
              max='50'
              min='1'
              value={this.portions}
              onChange={(event) => (Number(event.currentTarget.value) <= 50 ? this.portions = Number(event.currentTarget.value) : '')} ></Form.Input></Column>
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
                <Column>{ingredient.amount * this.portions / 4}</Column>
                <Column>{ingredient.unit}</Column>
              </Row>
              ))}
            <Row>
              <Column>
                <button className='btn btn-success' onClick={()=> {
                    Alert.danger('You have to log in to like a recipe');
                  }}>Like recipe
                </button>
                </Column>
            </Row>

          </Card>
          
        </>
      )
    }
  
  }

  async mounted() {
    //Gets spesific recipe and it´s ingredients, and pass them to 
     try {
      let recipe = await recipeService.get(this.props.match.params.id)
      this.recipe = recipe;
      let ingredients = await recipeService.getRecipeIngredients(this.props.match.params.id)
      this.ingredients = ingredients;
      this.emailSubject = 'Recipe for ' + this.recipe.name;
      this.emailBody = 'Description: %0D%0A' + this.recipe.description + '%0D%0A %0D%0A Ingredients:  %0D%0A' + this.ingredients.map(ing => `${ing.name + ' - ' + ing.amount + ' ' + ing.unit} %0D%0A`)
     } catch (error: any) {
      Alert.danger('Error getting recipe or ingredients: ' + error.message)
     }
      
  }
}

/**
 * Renders a page to edit a recipe
 */
export class RecipeEdit extends Component<{ match: { params: { id: number } } }> {
  recipe: Recipe = { recipe_id: 0, name: '', description: '', region: '', picture_url: '' };
  recipeIngredients: Ingredient[] = [];
  ingredientsToDelete: Ingredient[] = [];
  regions: Region[] = [];
  units: Unit[] = [];
  newIngredient: Ingredient = {ingredients_id: 0, name: '', amount: 0, unit: ''}
  newIngredients: Ingredient[] = [];
  newIngredientsToDelete: Ingredient[] = [];
  ingredients: IngredientName[] = [];
  searchBar : string = '';
  ingredientsToShow: IngredientName[] = [];


  render() {
    return (
      <>
        <Card title="Edit recipe">
          <Row>
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
                onChange={(event) => (this.recipe.region = event.currentTarget.value)}>

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
                  type='text'
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
              <Column><Form.Input
                type="number"
                max='1000'
                min='0'
                value={ingredient.amount}
                onChange={(event) => (ingredient.amount = Number(event.currentTarget.value))}
              /></Column>
              <Column>
                <Form.Select 
                  value={ingredient.unit} 
                  onChange={(event) => (ingredient.unit = event.currentTarget.value)} >
                
                  {this.units.map((unit) => (
                    <option key={unit.id} value={unit.unit}>
                    {unit.unit}
                    </option>
                  ))}
                </Form.Select></Column>
              <Column>
             {this.ingredientsToDelete.findIndex(ing => ing.ingredients_id == ingredient.ingredients_id) == -1 ? 
              <Button.Danger small onClick={() => {
                if(this.newIngredients.findIndex(ing => ing.ingredients_id == ingredient.ingredients_id) == -1){
                  this.ingredientsToDelete.push(ingredient)
                } else{
                  this.newIngredients.splice(this.newIngredients.indexOf(ingredient), 1); 
                  this.recipeIngredients.splice(this.recipeIngredients.indexOf(ingredient), 1);
                }
              }}>X</Button.Danger> : 
              <Button.Success small onClick={()=>{
                const index = this.ingredientsToDelete.indexOf(ingredient);
                  if (index > -1) { // only splice array when item is found
                this.ingredientsToDelete.splice(index, 1); // 2nd parameter means remove one item only
                }
              }}>Add</Button.Success>}</Column>
            </Row>
            ))}
            <h4>Add ingredient</h4>
            <Row>
              <Column>
              <Form.Input 
              type="search" 
              value={this.searchBar} 
              placeholder="Seacrh for ingredient"
              onChange={(event)=> { 
                  this.searchBar = event.currentTarget.value;
                  this.ingredientsToShow = [];
                  for(let i = 0; i < this.ingredients.length; i++){
                  const name = this.ingredients[i].name.toUpperCase();
                  if(name.indexOf(this.searchBar.toUpperCase()) > -1){
                    this.ingredientsToShow.push(this.ingredients[i]);
                  }
                }
              }}></Form.Input>
              </Column>
              <Column>
                <Form.Select 
                value={this.newIngredient.name} 
                onChange={(event) => (this.newIngredient.name = event.currentTarget.value)} >
              
                <option>Select Name</option>
                {this.ingredients.map((ingredient) => (
                  <option key={ingredient.ingredients_id} value={ingredient.name}>
                  {ingredient.name}
                  </option>
                ))}
                </Form.Select> 
              </Column>
              <Column><Form.Input
                type="number"
                max='1000'
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
                </Form.Select></Column>
              <Column>
                  <Button.Light small onClick={() => {
                    let duplicat = this.recipeIngredients.find(ingredient => ingredient.name == this.newIngredient.name);
                    
                    if(this.newIngredient.name == 'Select Name' || 
                    this.newIngredient.unit == 'Select Unit' || 
                    this.newIngredient.name == '' || 
                    this.newIngredient.unit == '' || 
                    this.newIngredient.amount > 1000 ||
                    this.newIngredient.amount < 0){
                      return Alert.danger('Unvalid value in new ingredient')
                    }else if(duplicat){
                      return Alert.danger('This ingredient is already in use')
                    } else{
                      let id = Number(this.ingredients.find(ing => ing.name == this.newIngredient.name)?.ingredients_id)
                      this.newIngredient.ingredients_id = id;
                      this.recipeIngredients.push(this.newIngredient);
                      this.newIngredients.push(this.newIngredient);
                      this.newIngredient = {ingredients_id: 0, name: '', amount: 0, unit: ''};
                    }
                  }}>Add</Button.Light>
              </Column>
            </Row>
        </Card>
        <Row>
          <Column>
            <Button.Success
              onClick={() => 
                {if(this.ingredientsToDelete.length > 0){
                  this.recipeIngredients = this.recipeIngredients.filter((ingredient) => !this.ingredientsToDelete.includes(ingredient))
                  recipeService.deleteRecipeIngredients(this.ingredientsToDelete, this.recipe.recipe_id)
                } 
                if(this.newIngredients.length > 0){
                  recipeService.addRecipeIngredient(this.newIngredients, this.recipe.recipe_id)
                  console.log(this.newIngredients);
                }
                 recipeService.updateRecipeIngredients(this.recipeIngredients, this.recipe.recipe_id)
                  recipeService.update(this.recipe).then(() => {
                  history.push('/recipes/' + this.recipe.recipe_id);
                })}
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
      let recipe = await recipeService.get(this.props.match.params.id)
      this.recipe = recipe;
      let recipeIngredients = await recipeService.getRecipeIngredients(this.props.match.params.id)
      this.recipeIngredients = recipeIngredients;
      let regions = await regionAndUnitService.getAllRegions()
      this.regions = regions;
      let units = await regionAndUnitService.getAllUnits()
      this.units = units;
      let ingredients = await recipeService.getAllIngredients(this.props.match.params.id)
      //@ts-ignore
      this.ingredients = ingredients;

     } catch (error: any) {
      Alert.danger('Error getting recipe or ingredients: ' + error.message)
     }
  }
}