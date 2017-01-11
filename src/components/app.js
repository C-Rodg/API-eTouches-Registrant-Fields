import React from 'react';

import NavBar from './navbar';
import Container from './container';

const App = (props) => {
    return (
        <div className="app-root">
           <NavBar />
           <Container />
        </div>
    )
};

export default App;