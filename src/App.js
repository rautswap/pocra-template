import logo from './logo.svg';
import './App.css';
import Header from './Coponents/Header';
import MainContent from './Coponents/MainContent';
import Sidebar from './Coponents/Sidebar';
import Footer from './Coponents/Footer';
function App() {
  return (
    <div class="wrapper">
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
