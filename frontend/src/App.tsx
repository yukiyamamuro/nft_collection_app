import { FC, useEffect, useState } from "react"
import { ethers } from "ethers";
import { Alert, Box, Button, Link, Snackbar, Stack, Typography } from "@mui/material";

import { Ethereum } from './types/Ethereum';
import genNFT from './utils/genNFT.json';

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

export const App: FC = () => {
  const CONTRACT_ADDRESS = '0xeec41c5Ff246Dae09CED08d6AF82D935C0b89eCf'
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);

  const [waitMining, setWaitMining] = useState(false);
  const [mintSuccessAlert, setMintSuccessAlert] = useState(false);
  const [mintFailAlert, setMintFailAlert] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      const accounts = await ethereum.request!({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setupEventListener();
      } else {
        console.log("No authorized account found");
      }
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request!({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);

      setCurrentAccount(accounts[0]);
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setWaitMining(true);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          genNFT.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAPowerControllNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();

        setWaitMining(false);
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          genNFT.abi,
          signer
        );
        connectedContract.on("NewPowerControllNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setMintSuccessAlert(true)
        });
        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setMintFailAlert(true)
      console.log(error);
    }
  };

  return (
    <Box
      margin={7}
      display="flex"
      justifyContent="center"
      color="#FFFFFF"
    >
      <Stack spacing={4}>
        <Typography
          variant='h2'
        >
          My NFT Collection
        </Typography>
        <Typography textAlign='center'>
          あなただけの特別な NFT を Mint しよう💫
        </Typography>
        <Typography textAlign='center'>
          MetamaskのRinkebyと接続することでNFTをMintできるようになります
        </Typography>
        {currentAccount === "" ? (
          <Button
            onClick={connectWallet}
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            }}
          >
            Connect Your Wallet
          </Button>
          ) : mintButton({waitMining,askContractToMintNft})
        }
        <Box padding={35}/>
        <Button
          href="https://testnets.opensea.io/account"
          sx={{
            background: '-webkit-linear-gradient(left, #60c657 30%, #35aee2 90%)'
          }}
        >
          OpenSeaで確認する
        </Button>
      </Stack>
      <Snackbar open={mintSuccessAlert} autoHideDuration={6000} onClose={() => setMintSuccessAlert(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          あなたのウォレットに NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。
        </Alert>
      </Snackbar>
      <Snackbar open={mintFailAlert} autoHideDuration={6000} onClose={() => setMintFailAlert(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          なんらかの理由でMintに失敗しました。
        </Alert>
      </Snackbar>
    </Box>
  )
}

type ButtonProps ={
  waitMining: boolean;
  askContractToMintNft: () => Promise<void>;
}
const mintButton: FC<ButtonProps> = ({ waitMining, askContractToMintNft }) => {
  console.log(waitMining)
  return (
    <>
      {
        waitMining ? (
          <Button>
            waiting....
          </Button>
        ) : (
          <Button
            sx={{
              background: '#FE6B8B',
            }}
            onClick={askContractToMintNft}
          >
            Mint NFT
          </Button>
        )
      }
    </>
  )
}