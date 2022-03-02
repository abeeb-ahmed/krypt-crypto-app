require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/j4CuS0Wo8raTdW9E6t7_nrwMguuikOw4",
      accounts: [
        "c37788aed42e415350c7ab5d3adb20b0c3c9e66c1791203856aff673db0ac3d8",
      ],
    },
  },
};
