async function connectWallet() {
  if (window.ethereum) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') { // 0xaa36a7 = 11155111 (Sepolia)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (error) {
        alert("Please switch to the Sepolia Test Network in MetaMask");
        return;
      }
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    alert("Please install MetaMask!");
  }
}

let web3;
let contract;
const contractAddress = "0x24b6001529FBc47df7A903603F4cD39caB932D8A"; // from Remix
const abi = fetch("./abi.json").then(res => res.json());

async function connectMetaMask() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    document.getElementById("account").innerText = `Connected: ${accounts[0]}`;

    contract = new web3.eth.Contract(await abi, contractAddress);
    document.getElementById("status").innerText = "Connected to Sepolia network ✅";
  } else {
    alert("Please install MetaMask!");
  }
}

async function buyTicket() {
  const accounts = await web3.eth.getAccounts();
  const metadataURI = document.getElementById("metadataURI").value;
  if (!metadataURI) {
    alert("Enter metadata URI from IPFS!");
    return;
  }

  const price = web3.utils.toWei("0.01", "ether");
  await contract.methods.buyTicket(metadataURI).send({
    from: accounts[0],
    value: price
  });

  document.getElementById("status").innerText = "🎟️ Ticket purchased successfully!";
}

document.getElementById("connectButton").addEventListener("click", connectMetaMask);
document.getElementById("buyTicketButton").addEventListener("click", buyTicket);
