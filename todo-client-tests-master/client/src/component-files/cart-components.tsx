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

          <Button.Danger onClick={() => {
            this.CartItemsToShow.map((cartitem) => {
              cartService.deleteIngredientFromCart(cartitem.cart_id)
            })
            this.mounted()
          }}>Clear All</Button.Danger>

          {this.CartItemsToShow.map((cart: CartItem) => (
            //Maps all the different cart and renders them as links to their respective cart details
            <Row key={cart.cart_id}>
              <Column>
                {cart.ingredients}
              </Column>
              <Column><Button.Danger onClick={() => {

                cartService.deleteIngredientFromCart(cart.cart_id).then(() => {
                  this.mounted();
                })
              }}>X</Button.Danger></Column>
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

    } catch (error: any){
      Alert.danger('Error getting cart: ' + error.message)
    }
  }
}

