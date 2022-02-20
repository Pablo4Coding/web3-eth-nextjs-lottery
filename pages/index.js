import { useEffect, useState } from 'react';
import Web3 from 'web3';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [manager, setManager] = useState(null);

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
          })
          .catch((err) => console.log(err))
      : console.log('Please install MetaMask');
  }, []);

  return (
    <div className={styles.container}>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
    </div>
  );
}
