import { FC, useEffect, useState } from "react"
import { ethers } from "ethers";
import { Box, Button, Stack, Typography } from "@mui/material";

import { Ethereum } from './types/Ethereum';
import genNFT from './utils/genNFT.json';

declare global {
  interface Window {
    ethereum: Ethereum;
  }
}

export const App: FC = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);

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
      } else {
        console.log("No authorized account found");
      }
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          '0xBfCFB60d094A85eDE5012b68304Dc43950Ac982E',
          genNFT.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAPowerControllNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();

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
        {currentAccount === "" ? (
          <Button
            sx={{
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            }}
          >
            Connect Your Wallet
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
        )}
      </Stack>
    </Box>
  )
}
