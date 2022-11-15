import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import userService, {User} from '../service-files/user-service';
import regionAndUnitService, {Region, Unit} from '../service-files/regionAndUnit-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
// const user : User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};
// export const loggedIn : boolean = false;
//@ts-ignore
const userData = JSON.parse(sessionStorage.getItem('user'));

export class UserLogin extends Component <{match: {params: {id: number}}}> {
    users : User[] = [];
    user: User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};
        
    render() {
        //@ts-ignore
        if(userData != null) {
            return (
                <>
            <Card title="Your user information">
            <Row>
                <Column>
                {/*@ts-ignore*/}
                Brukernavn: {userData.username}
                </Column>
            </Row>
            <Row>
                <Column>
                 {/*@ts-ignore*/}
                {userData.admin ? 'Du er admin' : 'Du er ikke admin'}
                </Column>
            </Row>
            <Row>
                <Column></Column>
            </Row>

            </Card>
                </>
            )
        }
        else{
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
                                type="password" 
                                value={this.user.password} 
                                onChange={(event)=>{
                                    this.user.password = event.currentTarget.value;
                                }}></Form.Input>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <Button.Success onClick={()=>{
                                    let loggedInUser = this.users.filter(u => u.username == this.user.username).find( pw => pw.password == this.user.password);
                                    if(loggedInUser){
                                        let userData = JSON.stringify(loggedInUser)
                                        sessionStorage.setItem('user', userData)
                                        location.reload();
                                    } 
                                    else Alert.danger('Wrong username or password. Try again')
                                }}>Log in</Button.Success>
                            </Column>
                        </Row>
    
    
                    </Card>
    
                </>
            )

        }

        
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

