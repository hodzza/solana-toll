import React, { useState } from 'react'; // Import useState
import logo from './solana-logo.png';
import './App.css';
import { WalletProviderComponent } from './components/WalletProviderComponent.tsx';

function App() {
  const [email, setEmail] = useState('');
  const [telegramName, setTelegramName] = useState('');
  const [subscription, setSubscription] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [transactionCompleted, setTransactionCompleted] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'telegram') {
      setTelegramName(value);
    } else if (name === 'subscription') {
      setSubscription(value);
    }

    if (email && telegramName && subscription && transactionCompleted) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { email, telegramName, subscription });
  };

  const updateTransactionState = (completed) => {
    setTransactionCompleted(completed);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <h1>Sign Up for Solana MP Rug Tool</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telegram">Telegram Name</label>
            <input
              type="text"
              id="telegram"
              name="telegram"
              placeholder="Enter your Telegram name"
              value={telegramName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subscription">Subscription Type</label>
            <select
              id="subscription"
              name="subscription"
              value={subscription}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an option</option>
              <option value="1-month">1 Month Subscription</option>
              <option value="lifetime">Lifetime Subscription</option>
            </select>
          </div>
          <WalletProviderComponent updateButtonState={updateTransactionState} />
          <button
            type="submit"
            className="submit-button"
            disabled={isButtonDisabled}
          >
            Submit
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;