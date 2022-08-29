import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import UserList from './components/UserList';
import './App.css';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

function App(){
return (
  <BrowserRouter>
    <Header />
       <main style={{ minHeight: "93vh"}}>
         <Routes>
            <Route path="/" element = { <UserList/>} exact/>
         </Routes>
        </main>
    <Footer />
  </BrowserRouter>
);
}

export default App;
