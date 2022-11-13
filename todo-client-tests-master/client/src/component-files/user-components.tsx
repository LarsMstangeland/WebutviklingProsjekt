import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import userService, {User} from '../service-files/user-service';
import regionAndUnitService, {Region, Unit} from '../service-files/regionAndUnit-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student



export class UserLogin extends Component {
    users : User[] = [];
    user: User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};


    render() {
        return (
            <>
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
                            type="text" 
                            value={this.user.password} 
                            onChange={(event)=>{
                                this.user.password = event.currentTarget.value;
                            }}></Form.Input>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Button.Success onClick={()=>{
                                this.users.filter(u => u.username == this.user.username).find( pw => pw.password == this.user.password) ?
                                Alert.success('Login was a success!') :
                                Alert.danger('Wrong username or password. Try again')
                            }}>Log in</Button.Success>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Form.Checkbox checked={false} onChange={()=>{}}></Form.Checkbox>
                        </Column>
                    </Row>


                </Card>

            </>
        )
    }

    async mounted() {
        try{
            let users = await userService.getAll()
            this.users = users 
        }
        catch{
            Alert.danger('Could not fetch existing users')
        }
    }
}

export class UserProfile extends Component {

}