import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { createHashHistory } from 'history';
import cartService, {CartItem} from '../service-files/cart-service';
import { NavLink } from 'react-router-dom';
import recipeService from 'src/service-files/recipe-service';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
//@ts-ignore
const userData = JSON.parse(sessionStorage.getItem('user'));

/**
 * Renders cart list.
 */
export class CartContent extends Component {
  //Array to store all cart
  cart:CartItem[] = [];
  CartItemsToShow:CartItem[] = [];
  searchBar: string = '';

  render() {
    return (
      <>
        <Card title="Your Cart">
          {this.CartItemsToShow.map((cart: CartItem) => (
            //Maps all the different cart and renders them as links to their respective cart details
            <Row key={cart.cart_id}>
              <Column>
                {cart.ingredients}
              </Column>
            </Row>))}
        </Card>
      </>
    );
  }

  async mounted() {
    //Gets all cart and pass them to cart array
    try{
      let cart = await cartService.get(userData.user_id);
      this.cart = cart;
      this.CartItemsToShow = cart;
      let ingredients = await cartService.getAllIngredients()
      //@ts-ignore
      this.ingredients = ingredients;

      console.log(this.CartItemsToShow)

    } catch (error: any){
      Alert.danger('Error getting cart: ' + error.message)
    }
  }
}

