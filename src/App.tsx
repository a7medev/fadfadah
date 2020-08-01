import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Navigation from './components/Navbar';
import SafeArea from './components/SafeArea';

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
    
      <Switch>
        <SafeArea paddingTop="10px">
          <Route path="/" component={Home} exact />
          <Route path="/about" component={About} />
        </SafeArea>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
