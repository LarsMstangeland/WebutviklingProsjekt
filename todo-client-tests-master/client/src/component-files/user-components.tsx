import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, Card, Row, Column, Form, Button } from '../widgets';
import { NavLink } from 'react-router-dom';
import userService, {User} from '../service-files/user-service';
import regionAndUnitService, {Region, Unit} from '../service-files/regionAndUnit-service';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
// const user : User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};


export class UserLogin extends Component {
    users : User[] = [];
    loggedIn : boolean = false;
    user: User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};
    loggedInUser : User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};
     


    render() {
        if(this.loggedIn){

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
                                    let loggedInUser = this.users.filter(u => u.username == this.user.username).find( pw => pw.password == this.user.password);
                                    console.log(loggedInUser);
                                    if(loggedInUser)
                                        userService.get(loggedInUser.user_id)
                                        .then(()=>{
                                            history.push('/users/' + loggedInUser?.user_id);
                                            // this.loggedInUser == loggedInUser;
                                            // this.loggedIn == true
                                        })
                                    // console.log(this.users.filter(u => u.username == this.user.username).find( pw => pw.password == this.user.password))
                                    // this.users.filter(u => u.username == this.user.username).find( pw => pw.password == this.user.password) ?
                                    // history.push('/user_profile')
                                    //  :
                                    // Alert.danger('Wrong username or password. Try again')
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
            Alert.danger('Could not fetch existing users')
        }
    }
}

export class UserProfile extends Component <{ match: { params: { id: number } } }>{
    user : User = {user_id : 0, username : '', cart_id : 0, password : '', admin : false};

    render() {
        return(
            <>
            <Card title="Your user information">
            <Row>
                <Column>
                Brukernavn: {this.user.username}
                </Column>
            </Row>
            <Row>
                <Column>
                {this.user.admin ? 'Du er admin' : 'Du er ikke admin'}
                </Column>
            </Row>
            <Row>
                <Column></Column>
            </Row>

            </Card>
            </>
        )
    }

    async mounted() {
        try{
            let user = await userService.get(this.props.match.params.id)
            this.user = user
        }
        catch {
            Alert.danger('Could not fetch your user at the moment')
        }
    }
}