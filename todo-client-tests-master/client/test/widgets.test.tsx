import * as React from 'react';
import { Alert, Card, Row, Column, Form, Button, PreviewCard,  BootstrapPreviewCard, NavBar} from '../src/widgets';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';


describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test');

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').simulate('click');

      expect(wrapper.matchesElement(<div></div>)).toEqual(true);

      done();
    });
  });


    test('Open 3 alert components', (done) => {

      //made 3 alerts
      const wrapper = shallow(
        <Alert></Alert>
      );

      Alert.danger('nummer1');
      Alert.danger('nummer2');
      Alert.danger('nummer3');



      //check if the three different buttons are here
      setTimeout(() => {
        expect(wrapper.containsMatchingElement(
            <div>
              <div>
                nummer1
                <button></button>
              </div>
            </div>
        )).toEqual(true)

        expect(wrapper.containsMatchingElement(
          <div>
            <div>
              nummer2
              <button></button>
            </div>
          </div>
      )).toEqual(true)

      expect(wrapper.containsMatchingElement(
        <div>
          <div>
            nummer3
            <button></button>
          </div>
        </div>
      )).toEqual(true)

        //take away a button by clicking it
      wrapper.find('button').at(2).simulate('click');

        //expect to find two buttons
      expect(wrapper.containsMatchingElement(
        <div>
          <div>
            nummer1
            <button></button>
          </div>
        </div>
      )).toEqual(true)

      expect(wrapper.containsMatchingElement(
        <div>
          <div>
            nummer3
            <button></button>
          </div>
        </div>
      )).toEqual(true)

    })
    done();
  });
});

describe('Row tests', () => {
  test('draws rows correctly', (done) => {

      const wrapper = shallow(<Row>test</Row>);

      expect(wrapper.containsMatchingElement(
          <div>test</div>
      )).toEqual(true)
      done();
  });
});

describe('Collumn tests', () => {
  test('Draws collum correctly', (done) => {

      const wrapper = shallow(<Column>test</Column>);

      expect(wrapper.containsMatchingElement(
          <div>
              <div>test</div>
          </div>
      )).toEqual(true)
      done();
  });

  test('Draws collum correctly right', (done) => {

      const wrapper = shallow(<Column right={true}>test</Column>);

      expect(wrapper.containsMatchingElement(
          <div>
              <div className='float-end'>test</div>
          </div>
      )).toEqual(true)
      done();
  });

  test('Draws collum width correctly', (done) => {

      const wrapper = shallow(<Column width={2}>test</Column>);

      expect(wrapper.containsMatchingElement(
          <div className='col-2'>
              <div>test</div>
          </div>
      )).toEqual(true)
      done();
  });
});

describe('Card tests', () => {

  test('Draws card correctly', (done) => {

      const wrapper = shallow(<Card title={"test"}>test2</Card>)

      expect(wrapper.matchesElement(
          <div className="card">
              <div className="card-body">
                  <h5 className="card-title">{"test"}</h5>
                  <div className="card-text">{"test2"}</div>
              </div>
          </div> 
      ));
      done();
  });
});

describe('Button tests', () => {


  test('ButtonDanger is drawn correctly', (done) => {

      // @ts-ignore: do not type check next line.
      const wrapper = shallow(<Button.Danger onClick={(event)=> console.log(event.currentTarget)}></Button.Danger>)
      expect(wrapper.matchesElement(
          <button onClick={(event) => console.log(event.currentTarget)} className={"btn btn-danger"}></button>
      ));
      done();
  });

  test('ButtonSuccess is drawn correctly', (done) => {

      // @ts-ignore: do not type check next line.
      const wrapper = shallow(<Button.Success onClick={(event)=> console.log(event.currentTarget)}></Button.Success>)
      expect(wrapper.matchesElement(
          <button onClick={(event) => console.log(event.currentTarget)} className={"btn btn-success"}></button>
      ));

      done();
  });

  
  test('ButtonLight is drawn correctly', (done) => {

      // @ts-ignore: do not type check next line.
      const wrapper = shallow(<Button.Light onClick={(event)=> console.log(event.currentTarget)}></Button.Light>)
      expect(wrapper.matchesElement(
          <button onClick={(event) => console.log(event.currentTarget)} className={"btn btn-light"}></button>
      ));

      done();
  });

  test('Button calls function on click-event', () => {
    let buttonClicked = false;

    const wrapper = shallow(<Button.Light onClick={() => (buttonClicked = true)}></Button.Light>);

    wrapper.find('button').simulate('click');

    expect(buttonClicked).toEqual(true);
  });

  test('Button is drawn correctly with small', () => {
    const wrapper = shallow(<Button.Success small onClick={() => {}}>liten</Button.Success>);

    expect(wrapper.matchesElement(
      <button
      type="button"
      className="btn btn-success"
      style={
         {
            padding: '5px 5px',
              fontSize: '16px',
              lineHeight: '0.7',  
          }
      }
      onClick={()=>{}}
    >
    liten
    </button>
    ));
  })

});

  describe('Form tests', () => {


      test('FormLabel is drawn correctly ', (done) => {
          
          // @ts-ignore: do not type check next line.
          const wrapper = shallow(<Form.Label>test</Form.Label>)

          expect(wrapper.matchesElement(
              <label className='col-form-label'>test</label>
          ))

          done();
      })

      test('FormInput is drawn correctly ', (done) => {
          
          // @ts-ignore: do not type check next line.
          const wrapper = shallow(<Form.Input></Form.Input>)

          expect(wrapper.matchesElement(
              <input className='form-controll'></input>
              ))  
              done();    
          })

      test('FormTextarea is drawn correctly ', (done) => {
          
          // @ts-ignore: do not type check next line.
          const wrapper = shallow(<Form.Textarea></Form.Textarea>)

          expect(wrapper.matchesElement(
              <input className='form-control'></input>
              ))      
              done();
          })


      test('FormCheckbox is drawn correctly ', (done) => {
          
          // @ts-ignore: do not type check next line.
          const wrapper = shallow(<Form.Checkbox></Form.Checkbox>);
          
          expect(wrapper.matchesElement(
              <input className='form-check-input'></input>
              ));
              done();   
          }); 
          
        test('FormSelect is drawn correctly', (done) => {

          const wrapper = shallow(<Form.Select value="testverdi" onChange={() => {console.log('test')}}>testverdi</Form.Select>);

          expect(wrapper.matchesElement(
            <select  className="custom-select" value="testverdi" onChange={() => {console.log('test')}}>
            testverdi
          </select>
          ));
          done();
        });
});

describe('PreviewCard tests', () => {

  test('PreviewCard is drawn correctly', (done) => {

    const wrapper = shallow(<PreviewCard name="Hei" url="Hei" id={1}></PreviewCard>)

    expect(wrapper.matchesElement(
      <div style={{ margin: '1rem' }}>
        <NavLink to={'recipes/' + 1}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <h2 style={{
                position: 'absolute',
                left: '0',
                top: '0',
                color: 'black',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '1rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '0.5rem',
              }}>
              Hei
            </h2>
            <img alt="Hei" src="Hei"
            style={{
            height: 'auto',
            width: '100%',
            objectFit: 'contain',
            boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 12px',
            borderRadius: '10px',
            maxWidth: '40vw',
            }}>
            </img>
          </div>
        </NavLink>
      </div>
    ));
    done();
  });

  test('BootstrapPreviewCard is drawn correctly', (done) => {
    const wrapper = shallow(<BootstrapPreviewCard></BootstrapPreviewCard>)

    expect(wrapper.matchesElement(
      <div className="card" style={{ width: '18rem;' }}>
        <img
          src="https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&quality=85&auto=format&fit=max&s=a52bbe202f57ac0f5ff7f47166906403"
          className="card-img-top"
          alt="..."
        ></img>
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </p>
          <a href="#" className="btn btn-primary">
            Go somewhere
          </a>
        </div>
      </div>
    ));
    done();
  });
});

describe('NavBar tests', ()=> {

  test('NavBarLink is drawn correctly', (done) => {

    const wrapper = shallow(<NavBar.Link to="Halla" left={true}>Halla</NavBar.Link>)

    expect(wrapper.matchesElement(
      <NavLink style={{ position: 'relative', left: '70vw' }}
      className="nav-link"
      activeClassName="active"
      to="Halla">Halla</NavLink>
    ));
    done();
  });  

  test('NavBar is drawn correctly', (done) => {

    const wrapper = shallow(<NavBar brand="Dette er en test"></NavBar>);

    expect(wrapper.matchesElement(
      <div
      className="navbar navbar-expand-sm navbar-dark bg-dark"
      style={{ padding: '5px', borderBottom: '1px solid gray' }}
    >
      <div className="container-fluid justify-content-start">
        <NavLink className="navbar-brand" activeClassName="active" exact to="/">
          <img src={"pizzaIcon"} alt="Food Junkies" />
        </NavLink>
        <div className="navbar-nav" style={{ width: '100%' }}>
        </div>
      </div>
    </div>
    ));
    done();
  });


});