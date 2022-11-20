import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import userService, {User, LikedRecipe} from '../service-files/user-service';
import cartService, {CartItem} from '../service-files/cart-service';
import recipeService, {Ingredient, IngredientName, Recipe} from '../service-files/recipe-service';
import utilityService, {Region, Unit, Type} from '../service-files/utility-service';
import { createHashHistory } from 'history';
import bcrypt from 'bcryptjs';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

//using this variable to check its value and then location.reload when true to make the user-info appear after creating new user
let created : boolean = false;

//@ts-ignore This is the userdata that gets added to sessionstorage if you log in. Ts-ignore because it can be empty
const userData = JSON.parse(sessionStorage.getItem('user')); 

//function to hash password. To be done before adding password to database
export async function generateHash(password:string){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}
 
//function to compare entered password to the saved hashed password in the database
export async function compareHash(password : string, hashed : string){
    return bcrypt.compareSync(password, hashed);
}

export class UserLogin extends Component  {
    likedRecipes : LikedRecipe[] = [];
    users : User[] = [];
    loggedIn : boolean = false;
    user: User = {user_id : 0, username : '', password : '', admin : false};
    cart:CartItem[] = [];
    CartItemsToShow:CartItem[] = [];
    ingredients: Ingredient[] = [];
    newIngredient: IngredientName = {name: '', ingredients_id: 0}
    recipe: Recipe = {
        recipe_id: 0,
        name: '',
        description: '',
        region: '',
        picture_url: '',
        type: ''
      };

    render() {
        // if userdata exists the page that renders is the one with your information
        if(userData) {
            return ( 
                <>
            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column', marginLeft: '1vw'}}>
                <div style={{width: '45vw', margin: '1vw'}}>
                <Card title="Your user information">
                    <Row>
                        <Column>Brukernavn: </Column>
                        <Column>{userData.username}</Column>
                    </Row>
                    <Row>
                        <Column>Access type: </Column>
                        <Column>{userData.admin ? 'Admin' : 'User'}</Column>
                    </Row>
                    <br/>
                    <Row>
                        <Column>
                        Your liked recipes:
                        </Column>
                    </Row>
                    {this.likedRecipes.length > 0 ? this.likedRecipes.map((recipe) => (
                        <Row key={recipe.recipe_id}><NavLink to={"/recipes/" + recipe.recipe_id}><Column>{recipe.name}</Column></NavLink></Row>
                    )) : 'You have no liked recipes'}
                    <br/>
                    <Row>
                        <Column><Button.Danger onClick={()=> {
                            sessionStorage.clear();
                            location.reload();
                        }}>Log out</Button.Danger></Column>
                    </Row>
                </Card>
            </div>
            {userData.admin ? (<div style={{width: '45vw', margin: '1vw'}}>
                <Card title='Add ingredients'>
                    <Row>
                        <Column><Form.Input 
                        placeholder='Ingredient'
                        type='text' 
                        value={this.newIngredient.name} 
                        onChange={(event) => {this.newIngredient.name = event.currentTarget.value}}></Form.Input></Column>
                        <Column><Button.Light onClick={() => {
                            let name = this.newIngredient.name.toLowerCase()
                            if(this.ingredients.find(ing => ing.name == name)){
                                Alert.danger('This ingredient is already available')
                            } else{
                                recipeService.createIngredient(this.newIngredient);
                                this.newIngredient = {name: '', ingredients_id: 0};
                                this.mounted();
                            }
                            }}>Add</Button.Light></Column>
                        <Column>
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
                </Button.Success></Column>
                    </Row>
                </Card>
            </div>) : (<></>)}
            </div>
            <div style={{position: 'absolute', top: '5vh', left: '50vw', width: '45vw', marginTop: '2vw'}}>
                <Card title="Your Cart">
                    <br/>
                    {this.CartItemsToShow.map((cart: CartItem) => (
                    //Maps all the different cart and renders them as links to their respective cart details
                        <Row key={cart.cart_id}>
                            <Column>{cart.ingredients.charAt(0).toUpperCase() + cart.ingredients.slice(1)}</Column>
                            <Column><Button.Danger small onClick={() => {
                                cartService.deleteIngredientFromCart(cart.cart_id).then(() => {
                                this.mounted();
                                })
                            }}>X</Button.Danger></Column>
                        </Row>))
                    }
                    <br/>
                    <Button.Danger onClick={() => {
                        this.CartItemsToShow.map((cartitem) => {
                        cartService.deleteIngredientFromCart(cartitem.cart_id)
                        })
                        this.mounted()
                    }}>Clear All</Button.Danger>
                </Card>
            </div>
            
            </>
            )
        }
        //if userdata does not exist, the page that renders is a login-page
        else{ 

            if(created == true){
                created = false;
                location.reload();
            }
            return (
                <> 
                      <div
            style={{
            top : '30vh',
              width: '100%',
              display: 'flex',
              position : 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          > 
                    <Card title="Log in">
              
                        <Row>
                            <Column>
                                Brukernavn: 
                                <Form.Input 
                                type="text" 
                                value={this.user.username} 
                                onChange={(event)=>{
                                    this.user.username = event.currentTarget.value;
                                }}></Form.Input>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                Passord:
                                <Form.Input 
                                type="password" 
                                value={this.user.password} 
                                onChange={(event)=>{
                                    this.user.password = event.currentTarget.value;
                                }}></Form.Input>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <Button.Success onClick={async ()=>{
                                if(this.users.find(u => u.username == this.user.username)){
                                    let hashPass = this.users.find(u => u.username == this.user.username)?.password                                    
                                    //@ts-ignore because hashpass can be undefined if the username typed in is not already a user
                                    let hashCheck = await compareHash(this.user.password, hashPass);
                                    if(hashCheck){
                                        //if the password is correct, pushes the info on a user to the sessionstorage.
                                        //we decided to use the sessionstorage instead of creating unique apis for each user so that you cant type in the correct url and be taken to the page for a user, without actually logging in
                                        let loggedInUser = this.users.find(u => u.username == this.user.username)
                                        let userData = JSON.stringify(loggedInUser)
                                        sessionStorage.setItem('user', userData)
                                        //location.reload so that the page is drawn again, and the userinfo is portrayed instead of the login page                                        location.reload(); 
                                        location.reload();
                                    } 
                                    else Alert.danger('Wrong username or password. Try again')
                                }
                                else{
                                    Alert.danger('Wrong username or password. Try again')
                                }
                                
                                }}>Log in
                                </Button.Success> {' '}
                                <Button.Light onClick={()=> history.push('/user/create')}>Create user</Button.Light>
                            </Column> 
                        </Row>
                    </Card>
                    </div>
                </>
            )
        }
    }

    async mounted() {
        try{
            let users = await userService.getAll()
            this.users = users 

            if(userData){
                let likedRecipes = await userService.getLikedRecipes(userData.user_id)
                this.likedRecipes = likedRecipes
                let ingredients = await recipeService.getIngredients();
                //@ts-ignore
                this.ingredients = ingredients;

                try{
                    let cart = await cartService.get(userData.user_id);
                    this.cart = cart;
                    this.CartItemsToShow = cart;
              
                  } catch (error: any){
                    Alert.danger('Error getting cart: ' + error.message)
                  }
            }
        }
        catch{
            Alert.danger('Could not fetch existing users from database')
        }

        

    }
}

export class NewUser extends Component {
    users : User[] = [];
    user : User = {user_id : 0, username : '', password : '', admin : false};
    passwordCheck : string = '';

    render () {
        return (
            <>
            <div
            style={{
            top : '30vh',
              width: '100%',
              display: 'flex',
              position : 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          > 
            <Card title="Create new user">
            <Row>
                            <Column>
                                Username: 
                                <Form.Input 
                                type="text" 
                                value={this.user.username} 
                                onChange={(event)=>{
                                    this.user.username = event.currentTarget.value;
                                }}></Form.Input>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                Password:
                                <Form.Input 
                                type="password" 
                                value={this.user.password} 
                                onChange={(event)=>{
                                    this.user.password = event.currentTarget.value;
                                }}></Form.Input>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                Confirm password:
                                <Form.Input 
                                type="password" 
                                value={this.passwordCheck} 
                                onChange={(event)=>{
                                    this.passwordCheck = event.currentTarget.value;
                                }}></Form.Input>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                            Admin: {' '}
                            <Form.Checkbox checked={this.user.admin} onChange={()=> {
                                this.user.admin == false ? this.user.admin = true : this.user.admin = false;
                            }
                            }></Form.Checkbox>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                            <Button.Success onClick={async ()=>{
                                if(!this.users.find(u => u.username == this.user.username)){
                                    if(this.user.password == this.passwordCheck){
                                        if(this.user.password != ''){
                                            if(this.user.username != ''){
                                                let hashPassword : string = await generateHash(this.user.password)
                                                await userService.create(hashPassword, this.user.username, this.user.admin) 
                                                 let u = await userService.get(this.user.username)
                                                 this.user = u       
                                                 sessionStorage.setItem('user', JSON.stringify(this.user));

                                                 // sets created to be true and then pushes to the UserLogin component. The UserLogin component will then be refreshed with the if-sentence on line 153
                                                 created = true;
                                                 history.push('/user/login')                                  
    
                                            }
                                            else{
                                                Alert.danger("Username can't be null")
                                            }
                                        }
                                        else{
                                            Alert.danger('Password cant be null')
                                        }
                                    } 
                                    else {
                                        Alert.danger("Passwords don't match")
                                    }

                                }
                                else {
                                    Alert.danger('Username already exists. Try another one')
                                }
                                
                            }}>Create user</Button.Success>{' '}
                            <Button.Danger onClick={()=> history.push('/user/login')}>Cancel</Button.Danger>
                            </Column>
                        </Row>
            </Card> 
            </div>
            </>
        )

    }

        async mounted() {
            try{
                let users = await userService.getAll()
                this.users = users 
            }
            catch{
                Alert.danger('Could not fetch existing users from database')
            }
        
    }
}

