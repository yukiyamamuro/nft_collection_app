// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import { Base64 } from "../libraries/Base64.sol";

contract genNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: #db850d; font-family: serif; font-size: 25px; }</style><rect width='100%' height='100%' fill='#202c40' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  string[] firstWords = ["Power", "Energy", "Strength", "Force"];
  string[] secondWords = ["must be", "may be", "should be"];
  string[] thirdWords = ["decrease", "increase", "null", "full"];

  event NewPowerControllNFTMinted(address sender, uint256 tokenId);

  constructor() ERC721 ("PowerControllNFT", "POWERCONTROLL") {
    console.log("This is my NFT contract.");
  }

  function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
  }

  function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
	  console.log("rand seed: ", rand);
    rand = rand % firstWords.length;
	  console.log("rand first word: ", rand);
    return firstWords[rand];
  }

  function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
    rand = rand % secondWords.length;
    return secondWords[rand];
  }

  function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
    uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
    rand = rand % thirdWords.length;
    return thirdWords[rand];
  }

  function makeAPowerControllNFT() public {
    uint256 newItemId = _tokenIds.current();

    string memory first = pickRandomFirstWord(newItemId);
    string memory second = pickRandomSecondWord(newItemId);
    string memory third = pickRandomThirdWord(newItemId);

    string memory combinedWord = string(abi.encodePacked(first, ' ', second, ' ', third));
    string memory finalSvg = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));

    console.log("\n--------------------");
    console.log(finalSvg);
    console.log("--------------------\n");

    string memory json = Base64.encode(
      bytes(string(abi.encodePacked(
        '{"name": "',
        combinedWord,
        '", "description": "A highly acclaimed collection of PowerControll.", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(finalSvg)),
        '"}'
      )))
    );

    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    _safeMint(msg.sender, newItemId);
    _setTokenURI(
      newItemId,
      finalTokenUri
    );

    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

    _tokenIds.increment();
    emit NewPowerControllNFTMinted(msg.sender, newItemId);
  }
}