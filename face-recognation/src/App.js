import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/navigation';
import FaceRecognation from './components/facerecognation/facerecognation';
import Signin from './components/signin/signin';
import Register from './components/register/register';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/imagelinkform/imagelinkform';
import Rank from './components/rank/rank';
import './app.css';
import 'tachyons'

const particlesOption = {
  particles: {
    number: {
      value: 300,
      density:{
        enable: true,
        value_area: 800
}}}};

const app = new Clarifai.app({
  apiKey: '5ccf2f3f0a874285810e70551f671892'
 });
const initialState =  {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entires: 0,
    joiend: '',
    
  }
};

class app extends Component {
  constructor(){
    super();
    this.state = initialState;
  }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entires: data.entires,
      joined: data.joined
    }});
  };

 

  calculateFaceLocation = (data) => {
   const calarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   return{
     leftCol: calarifaiFace.left_col * width,
     topRow: calarifaiFace.top_row * height, 
     rightCol: width - (calarifaiFace.right_col * width),
     bottomRow: height - (calarifaiFace.bottom_row * height)
   };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  };
   onInputChange = (event) => {
     this.setState({input: event.target.value});
   };

   onButtonSubmit = () => {
     this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
       this.state.input
       )
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id : this.state.user.id
          })
        })
            .then(response => response.json())
            .then(count => {
            this.setState(Object.assign(this.state.user, {entires: count}));
      })
      .catch(console.log)
    }
      this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
    };

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    }
    else if(route === 'home'){
    this.setState({isSignedIn: true});
    }
    this.setState({route: route })
  }  
  render() {
    return (
      <div className="app">
        <Particles  
           className='particles'
           params={particlesOption} />
        <Navigation isSignedIn={this.state.isSignedIn}  onRouteChange= {this.onRouteChange}/>
       {this.state.route === 'home' 
        ? <div>
          <Logo />
          <Rank name={this.state.user.name} entires={this.state.user.entires} />
          <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognation box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        :(
          this.state.route === 'signin'
          ?<Signin onRouteChange={this.onRouteChange}  loadUser ={this.loadUser }/>
          :<Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        )
        }
      </div>
    );
  }
}
export default app;
