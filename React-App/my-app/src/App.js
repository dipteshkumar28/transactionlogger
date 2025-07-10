import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = '0x8CC45d88Dfd40BEd524F2b1cfC30d0757A14CaeA';
const ABI = [
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "logTransaction",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];
 
function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [events, setEvents] = useState([]);
  const [filterAddress, setFilterAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask");

      const prov = new ethers.providers.Web3Provider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const signer = prov.getSigner();
      const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setProvider(prov);
      setContract(c);
    };
    init();
  }, []);

  useEffect(() => {
    if (!contract) return;

    const listener = (from, to, amount) => {
      setEvents((prev) => [{ from, to, amount: amount.toString() }, ...prev]);
    };

    contract.on("logTransaction", listener);
    return () => contract.off("logTransaction", listener);
  }, [contract]);

  const sendMockTx = async () => {
    const to = prompt("Enter recipient address:");
    const amt = prompt("Enter amount:");
    if (!ethers.utils.isAddress(to)) return alert("Invalid address");
    await contract.transfer(to, ethers.utils.parseEther(amt));
  };

  const filteredEvents = events.filter(e =>
    filterAddress === "" ||
    e.from.toLowerCase().includes(filterAddress.toLowerCase()) ||
    e.to.toLowerCase().includes(filterAddress.toLowerCase())
  );

  return (
    <div className="App">
      <h1>📦Transaction Logger</h1>
      <button onClick={sendMockTx}>Send Mock Transfer</button>

      <input
        placeholder="Filter by address"
        value={filterAddress}
        onChange={(e) => setFilterAddress(e.target.value)}
        style={{ marginTop: 10, padding: 6, marginLeft: 10, width: "300px" }}
      />

      <ul>
        {filteredEvents.map((e, idx) => (
          <li key={idx}>
            <b>From:</b> {e.from} <br />
            <b>To:</b> {e.to} <br />
            <b>Amount:</b> {e.amount}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App;
