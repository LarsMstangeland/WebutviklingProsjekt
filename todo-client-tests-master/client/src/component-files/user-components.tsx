import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import userService, {User} from '../service-files/user-service';
import regionAndUnitService, {Region, Unit} from '../service-files/regionAndUnit-service';
import { createHashHistory } from 'history';
import bcrypt from 'bcryptjs';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
// const user : User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};
// export const loggedIn : boolean = false;
//@ts-ignore
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
                                <Button.Success onClick={async ()=>{
                                    console.log(generateHash('vetleek'))
                                if(this.users.find(u => u.username == this.user.username)){
                                    let hashPass = this.users.find(u => u.username == this.user.username)?.password                                    
                                    //@ts-ignore because hashpass can be undefined if the username typed in is not already an user
                                    let hashCheck = await compareHash(this.user.password, hashPass);
                                    if(hashCheck){
                                        let loggedInUser = this.users.find(u => u.username == this.user.username)
                                        let userData = JSON.stringify(loggedInUser)
                                        sessionStorage.setItem('user', userData)
                                        location.reload();
                                    } 
                                    else Alert.danger('Wrong username or password. Try again')
                                }
                                else{
                                    Alert.danger('Username does not exist')
                                }
                                
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

