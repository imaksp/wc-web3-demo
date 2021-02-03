// import logo from './logo.svg';
import "./App.css";
import Button from "react-bootstrap/Button";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h3>WalletConnect</h3>
        <div className="my-2">
          <Button>Connect Wallet</Button>
        </div>
      </header>
    </div>
  );
}

export default App;
