import { useEffect, useState } from 'react';
import Web3 from 'web3';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState(null);
  const [balance, setBalance] = useState(null);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  const contractAddress = '0xd9dfB2509FDfa5d78dD214338679ED2582f684fC';

  const abi = [
    {
      constant: true,
      inputs: [],
      name: 'manager',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'pickWinner',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getPlayers',
      outputs: [{ name: '', type: 'address[]' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'enter',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '', type: 'uint256' }],
      name: 'players',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  ];

  useEffect(() => {
    window.ethereum
      ? ethereum
          .request({ method: 'eth_requestAccounts' })
          .then(async (accounts) => {
            setAddress(accounts[0]);
            let w3 = new Web3(ethereum);
            setWeb3(w3);

            let lottery = new w3.eth.Contract(abi, contractAddress);
            setContract(lottery);
            const manager = await lottery.methods.manager().call();
            setManager(manager);
            const players = await lottery.methods.getPlayers().call();
            setPlayers(players);
            const balance = await w3.eth.getBalance(lottery.options.address);
            setBalance(balance);
          })
          .catch((err) => console.log(err))
      : console.log('Please install MetaMask');
  }, []);

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    });

    setMessage('You have been entered!');
  };

  const handleOnClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction success...');

    await contract.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage('The winner has been picked!');
  };

  return (
    <>
      {players && balance && (
        <div className={styles.container}>
          <h2>Lottery Contract</h2>
          <p>This contract is managed by {manager}.</p>
          <p>
            There are currently {players?.length} people entered, competing to win
            {Web3.utils.fromWei(Web3.utils.toBN(balance), 'ether')} ether!
          </p>
          <hr />
          <form onSubmit={handleOnSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of Ether to enter</label>
              <input value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <button>Enter</button>
          </form>
          <hr />
          <h4>Ready to pick up winner?</h4>
          <button onClick={handleOnClick}>Pick a winner!</button>
          <hr />
          <h1>{message}</h1>
        </div>
      )}
    </>
  );
}
