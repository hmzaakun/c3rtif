// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ESGICertificates.sol";

/**
 * @dev Script Foundry pour déployer ESGICertificates sur notre chain locale.
 *
 * 1) vm.startBroadcast() => commence la diffusion de transactions
 * 2) new ESGICertificates() => déploie le contrat
 * 3) vm.stopBroadcast() => termine l'envoi
 */
contract DeployESGI is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("EWOQ_PRIVATE_KEY");

        // 2) Démarrer la diffusion de transactions
        vm.startBroadcast(deployerPrivateKey);

        // 3) Déployer le contrat
        ESGICertificates cert = new ESGICertificates();

        // 4) Arrêter la diffusion
        vm.stopBroadcast();

        // (Optionnel) On peut log l'adresse
        console.log("ESGICertificates deployed at:", address(cert));
    }
}
