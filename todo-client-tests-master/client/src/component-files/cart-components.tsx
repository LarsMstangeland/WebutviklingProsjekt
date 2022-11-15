import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { createHashHistory } from 'history';
import cartService, {CartItem} from '../service-files/cart-service';
import { NavLink } from 'react-router-dom';

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
          <Row>
            <Column><Form.Input 
            onChange={(event) => {
              this.searchBar = event.currentTarget.value;
              this.CartItemsToShow = [];
              for(let i = 0; i < this.cart.length; i++){
                const name = this.cart[i].ingredients.toUpperCase();
                if(name.indexOf(this.searchBar.toUpperCase()) > -1){
                  this.CartItemsToShow.push(this.cart[i]);
                }
              }
            }} 
            value={this.searchBar}
            type='search'
            placeholder='Search for cart'
            ></Form.Input></Column>
          </Row>
          
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
      console.log(cart)
      console.log(userData.user_id)
      this.CartItemsToShow = cart;

      console.log(this.CartItemsToShow)

    } catch (error: any){
      Alert.danger('Error getting cart: ' + error.message)
    }
  }
}
