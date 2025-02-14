# C3rtif 🎓

This document describes the **ESGI Certificates** project, a blockchain-based application for managing academic certificates and annual participations (NFTs) via a **custom Avalanche Subnet**.

## Project Description 🚀

This application allows administrators to create and manage academic certificates as **NFTs**:

- **Program NFT**: Represents a global diploma or academic program (e.g., "Master in Blockchain").
- **Annual NFT**: Associated with a specific year and linked to a program.

### Key Features

#### Administrators

1. **Create** a new program (NFT).
2. **Create** an annual NFT linked to an existing program.
3. **Update** the tokenURI to refresh the NFT metadata (e.g., via IPFS).

#### Users

- **View** all programs and their NFTs.
- **Explore** the annual NFTs associated with a program.

---

## Technologies Used 🛠️

### Smart Contracts

- **Solidity**
- **Foundry**: Testing and local deployment

### Front-End

- **Next.js**
- **TypeScript**
- **WAGMI**: Wallet connection and smart contract interaction

### Off-Chain Storage

- **Pinata / IPFS** (optional) for metadata hosting

---

## Deployment and Installation 🏁

### Prerequisites

1. Install **Node.js** and **npm**
2. Install **Foundry**

### Installation

```bash
git clone https://github.com/hmzaakun/c3rtif.git
cd c3rtif/front
npm install
```

### Compilation & Testing

```bash
cd /c3rtif/contract
forge install
forge test
```

### Smart Contract Deployment

```bash
cd /c3rtif/contract
forge script script/DeployESGI.s.sol:DeployESGI --fork-url <YOUR_RPC> --broadcast
```

> Modify the script if needed.

### Front-End Configuration

In `.env.local`, add:

```env
NEXT_PUBLIC_PINATA_JWT=... YOUR PINATA JWT ...
NEXT_PUBLIC_GATEWAY_URL=... YOUR PINATA GATEWAY URL ...
NEXT_PUBLIC_ADDRESS=... YOUR CONTRACT ADDRESS ...
```

### Running the Application

```bash
cd /c3rtif/front
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Running the Blockchain Installation from script

```bash
chmod +x ./L1creationImport.sh
./L1creationImport.sh
```

Then your chain is ready.

running this command to see the details of the chain :

```bash
avalanche blockchain describe esgi
```

---

## Usage 👩‍💻

### Admin Panel

- **Create a Program**: Fill in the required fields and mint the NFT.
- **Create an Annual NFT**: Link to a program and provide annual data.
- **Update an NFT**: Modify the tokenURI to refresh metadata.

### NFT Viewing

- **View All Programs**: List of programs with their metadata.
- **View All Annual NFTs**: Explore each annual NFT.
- **Program Details**: Display a program and its linked NFTs.

---

## License 📄

[MIT License](LICENSE) – Enjoy your experience and the Avalanche blockchain!
