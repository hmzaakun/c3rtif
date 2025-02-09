// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ESGICertificates.sol";

/**
 * @dev Tests Foundry pour le contrat ESGICertificates (version OpenZeppelin 5.x).
 * Vise un coverage de 100%.
 */
contract ESGICertificatesTest is Test {
    ESGICertificates internal cert;

    // Adresses arbitraires pour tests
    address internal alice = address(0xA1);
    address internal bob = address(0xB2);
    address internal eve = address(0xE7);

    function setUp() public {
        // Déploie le contrat
        cert = new ESGICertificates();
    }

    // ===============================
    // ========== TEST: init =========
    // ===============================

    function testInitialState() public {
        // Le compteur doit être 0
        assertEq(cert.getLastID(), 0);
        // Aucune Programme, aucune Annual
        uint256[] memory progs = cert.getAllProgram();
        uint256[] memory anns = cert.getAllAnnual();
        assertEq(progs.length, 0);
        assertEq(anns.length, 0);
    }

    // ===============================
    // ========== CREATE PROGRAM =====
    // ===============================

    function testCreateProgramNFT() public {
        // 1er programme
        uint256 progId = cert.createProgramNFT(alice, "ipfs://ProgMetadata");
        assertEq(progId, 1, "First minted NFT must be ID=1");
        assertEq(cert.getLastID(), 1);

        // getAllProgram => doit contenir [1]
        uint256[] memory progs = cert.getAllProgram();
        assertEq(progs.length, 1);
        assertEq(progs[0], 1);

        // Vérifier tokenURI
        string memory uri = cert.tokenURI(progId);
        assertEq(uri, "ipfs://ProgMetadata");
    }

    function testCreateMultiplePrograms() public {
        uint256 p1 = cert.createProgramNFT(alice, "ipfs://p1");
        uint256 p2 = cert.createProgramNFT(bob, "ipfs://p2");
        assertEq(p1, 1);
        assertEq(p2, 2);

        uint256[] memory progs = cert.getAllProgram();
        assertEq(progs.length, 2);
        assertEq(progs[0], 1);
        assertEq(progs[1], 2);
        assertEq(cert.getLastID(), 2);
    }

    // ===============================
    // ========== CREATE ANNUAL ======
    // ===============================

    function testCreateAnnualNFT() public {
        // Créer un programme
        uint256 progId = cert.createProgramNFT(alice, "ipfs://Prog");
        // Créer un annual
        uint256 annId = cert.createAnnualNFT(bob, progId, "ipfs://AnnY3");
        assertEq(annId, 2);
        assertEq(cert.getLastID(), 2);

        uint256[] memory anns = cert.getAllAnnual();
        assertEq(anns.length, 1);
        assertEq(anns[0], 2);

        // Check tokenURI
        string memory annURI = cert.tokenURI(annId);
        assertEq(annURI, "ipfs://AnnY3");

        // Parent
        uint256 parentId = cert.getParentOf(annId);
        assertEq(parentId, progId);

        // Vérifier getProgramWithAnnual
        (
            string memory pURI,
            uint256[] memory aIds,
            string[] memory aURIs
        ) = cert.getProgramWithAnnual(progId);
        assertEq(pURI, "ipfs://Prog");
        assertEq(aIds.length, 1);
        assertEq(aIds[0], annId);
        assertEq(aURIs[0], "ipfs://AnnY3");
    }

    function testCreateAnnualNFTRevertIfNoParent() public {
        // On appelle createAnnualNFT avec un parent inexistant => revert
        vm.expectRevert(); // On n’impose pas de signature précise
        cert.createAnnualNFT(alice, 999, "ipfs://AnnNoParent");
    }

    function testCreateAnnualNFTRevertIfParentIsAnnual() public {
        uint256 progId = cert.createProgramNFT(alice, "ipfs://Prog");
        uint256 annId = cert.createAnnualNFT(bob, progId, "ipfs://Ann");
        // Tenter de créer un autre annual dont le parent = annId => revert
        vm.expectRevert(bytes("Parent is not a Program NFT"));
        cert.createAnnualNFT(alice, annId, "ipfs://InvalidParent");
    }

    // ===============================
    // ========== GET PARENT  ========
    // ===============================

    function testGetParentOfRevertNonexistentToken() public {
        // getParentOf(999) => revert
        vm.expectRevert();
        cert.getParentOf(999);
    }

    // ===============================
    // ========== GET PROGRAM+ANNUAL =
    // ===============================

    function testGetProgramWithAnnualRevertIfNotExist() public {
        // programme inexistant => revert
        vm.expectRevert();
        cert.getProgramWithAnnual(10);
    }

    function testGetProgramWithAnnualRevertIfAnnual() public {
        uint256 progId = cert.createProgramNFT(alice, "ipfs://ProgX");
        uint256 annId = cert.createAnnualNFT(bob, progId, "ipfs://AnnY");

        // annId est un NFT annuel => revert "Not a Program NFT"
        vm.expectRevert(bytes("Not a Program NFT"));
        cert.getProgramWithAnnual(annId);
    }

    // ===============================
    // ========== UPDATE URI =========
    // ===============================

    function testUpdateTokenURI() public {
        uint256 progId = cert.createProgramNFT(alice, "ipfs://OldProg");
        // N'importe qui peut update => on se met en eve
        vm.prank(eve);
        cert.updateTokenURI(progId, "ipfs://NewProg");

        string memory newURI = cert.tokenURI(progId);
        assertEq(newURI, "ipfs://NewProg");
    }

    function testUpdateTokenURIRevertNonexistent() public {
        // La fonction updateTokenURI(999, ...) ne revert PAS en soi,
        // car _setTokenURI(999, ...) n'effectue aucun check.
        // C'est la lecture tokenURI(999) qui revert => "ERC721NonexistentToken(tokenId)".

        cert.updateTokenURI(999, "ipfs://Inexistant");
        // => pas de revert

        // Mais maintenant, si on lit tokenURI(999), ça revert
        vm.expectRevert();
        cert.tokenURI(999);
    }

    // ===============================
    // ========== FULL SCENARIO ======
    // ===============================

    function testFullFlow() public {
        // 1) Create 2 programs, 2 annuals
        uint256 p1 = cert.createProgramNFT(alice, "ipfs://P1");
        uint256 p2 = cert.createProgramNFT(bob, "ipfs://P2");
        uint256 a1 = cert.createAnnualNFT(eve, p1, "ipfs://A1");
        uint256 a2 = cert.createAnnualNFT(eve, p1, "ipfs://A2");

        // 2) Check getAllProgram / getAllAnnual
        uint256[] memory progs = cert.getAllProgram();
        uint256[] memory anns = cert.getAllAnnual();
        assertEq(progs.length, 2);
        assertEq(anns.length, 2);

        // 3) getLastID => 4
        assertEq(cert.getLastID(), 4);

        // 4) getProgramWithAnnual(p1) => doit renvoyer [a1, a2]
        (
            string memory p1URI,
            uint256[] memory aIDs,
            string[] memory aURIs
        ) = cert.getProgramWithAnnual(p1);
        assertEq(p1URI, "ipfs://P1");
        assertEq(aIDs.length, 2);
        assertEq(aIDs[0], a1);
        assertEq(aIDs[1], a2);
        assertEq(aURIs[0], "ipfs://A1");
        assertEq(aURIs[1], "ipfs://A2");
    }
}
