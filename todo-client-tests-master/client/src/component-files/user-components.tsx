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

export class UserLogin extends Component  {
    
    users : User[] = [];
    loggedIn : boolean = false;
    user: User = {user_id : 0, username : '', password : '', admin : false};
        
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
                <Column><Button.Danger onClick={()=> {
                    sessionStorage.clear();
                    location.reload();
                }}>Log out</Button.Danger></Column>
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
                                }}>Log in
                                </Button.Success> 
                                <Button.Light onClick={()=> history.push('/user/create')}>Create user</Button.Light>
                                
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

export class NewUser extends Component {
    users : User[] = [];
    user : User = {user_id : 0, username : '', password : '', admin : false};
    passwordCheck : string = '';

    render () {
        return (
            <>
            <Card title="Create new user">
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
                                Bekreft passord:
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
                                                await userService.create(this.user.password, this.user.username, this.user.admin) 
                                                 let u = await userService.get(this.user.username)
                                                 this.user = u       
                                                 sessionStorage.setItem('user', JSON.stringify(this.user));
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
                                
                            }}>Create user</Button.Success>
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
                Alert.danger('Could not fetch existing users from database')
            }
        
    }
}

