// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ESGICertificates.sol";

/**
 * @dev Test Foundry pour le contrat ESGICertificates
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
    // ===== TEST: init state =======
    // ===============================
    function testInitialState() public {
        // getLastID() = 0
        assertEq(cert.getLastID(), 0);

        // getAllProgram() => ([], [])
        (uint256[] memory progs, string[] memory pURIs) = cert.getAllProgram();
        assertEq(progs.length, 0);
        assertEq(pURIs.length, 0);

        // getAllAnnual() => ([], [])
        (uint256[] memory anns, string[] memory aURIs) = cert.getAllAnnual();
        assertEq(anns.length, 0);
        assertEq(aURIs.length, 0);
    }

    // ===============================
    // ===== TEST: createProgramNFT ==
    // ===============================
    function testCreateProgramNFT() public {
        // createProgramNFT
        uint256 progId = cert.createProgramNFT(alice, "ipfs://prog1");
        assertEq(progId, 1);
        assertEq(cert.getLastID(), 1);

        // getAllProgram
        (uint256[] memory pIds, string[] memory pURIs) = cert.getAllProgram();
        assertEq(pIds.length, 1);
        assertEq(pIds[0], 1);
        assertEq(pURIs[0], "ipfs://prog1");

        // tokenURI => "ipfs://prog1"
        string memory uri = cert.tokenURI(progId);
        assertEq(uri, "ipfs://prog1");
    }

    function testCreateMultiplePrograms() public {
        uint256 p1 = cert.createProgramNFT(alice, "ipfs://p1");
        uint256 p2 = cert.createProgramNFT(bob, "ipfs://p2");
        assertEq(p1, 1);
        assertEq(p2, 2);

        (uint256[] memory ids, string[] memory uris) = cert.getAllProgram();
        assertEq(ids.length, 2);
        assertEq(ids[0], 1);
        assertEq(ids[1], 2);

        // Check lastID = 2
        assertEq(cert.getLastID(), 2);

        // tokenURI(1), tokenURI(2)
        assertEq(cert.tokenURI(1), "ipfs://p1");
        assertEq(cert.tokenURI(2), "ipfs://p2");
    }

    // ===============================
    // ===== TEST: createAnnualNFT ===
    // ===============================
    function testCreateAnnualNFT() public {
        // D'abord un programme
        uint256 progId = cert.createProgramNFT(alice, "ipfs://progA");
        // Ensuite un NFT annuel
        uint256 annId = cert.createAnnualNFT(bob, progId, "ipfs://annYear3");
        // ID = 2
        assertEq(annId, 2);
        assertEq(cert.getLastID(), 2);

        // getAllAnnual => ( [2], ["ipfs://annYear3"] )
        (uint256[] memory allAnn, string[] memory annURIs) = cert
            .getAllAnnual();
        assertEq(allAnn.length, 1);
        assertEq(allAnn[0], 2);
        assertEq(annURIs[0], "ipfs://annYear3");

        // getParentOf(2) => 1
        uint256 parent = cert.getParentOf(annId);
        assertEq(parent, progId);

        // getProgramWithAnnual(1) => "ipfs://progA", [2], ["ipfs://annYear3"]
        (
            string memory pURI,
            uint256[] memory annualIds,
            string[] memory annualURIs
        ) = cert.getProgramWithAnnual(progId);

        assertEq(pURI, "ipfs://progA");
        assertEq(annualIds.length, 1);
        assertEq(annualIds[0], 2);
        assertEq(annualURIs[0], "ipfs://annYear3");
    }

    function testCreateAnnualNFTRevertIfNoParent() public {
        // parentTokenId=999 inexistant => revert
        vm.expectRevert();
        cert.createAnnualNFT(alice, 999, "ipfs://annNoParent");
    }

    function testCreateAnnualNFTRevertIfParentIsAnnual() public {
        uint256 progId = cert.createProgramNFT(alice, "ipfs://progZ");
        uint256 annId = cert.createAnnualNFT(bob, progId, "ipfs://annXYZ");

        // Tenter de créer un NFT "Annuel" dont le parent = annId => revert
        vm.expectRevert(bytes("Parent is not a Program NFT"));
        cert.createAnnualNFT(eve, annId, "ipfs://annInvalidParent");
    }

    // ===============================
    // ===== TEST: getParentOf  ======
    // ===============================
    function testGetParentOfRevertNonexistent() public {
        // getParentOf(999) => revert => NonExistent
        vm.expectRevert();
        cert.getParentOf(999);
    }

    // ===============================
    // ===== TEST: getProgramWithAnnual
    // ===============================
    function testGetProgramWithAnnualRevertIfNoProg() public {
        // inexistant => revert
        vm.expectRevert();
        cert.getProgramWithAnnual(999);
    }

    function testGetProgramWithAnnualRevertIfAnn() public {
        // Créer un programme => ID=1
        uint256 progId = cert.createProgramNFT(alice, "ipfs://ProgX");
        // Créer un annuel => ID=2
        uint256 annId = cert.createAnnualNFT(bob, progId, "ipfs://AnnX");

        // Passer annId =2 => revert "Not a Program NFT"
        vm.expectRevert(bytes("Not a Program NFT"));
        cert.getProgramWithAnnual(annId);
    }

    // ===============================
    // ===== TEST: updateTokenURI  ===
    // ===============================
    function testUpdateTokenURI() public {
        uint256 progId = cert.createProgramNFT(alice, "ipfs://oldProg");
        // n'importe qui peut update
        vm.prank(eve);
        cert.updateTokenURI(progId, "ipfs://newProgURI");

        // Lecture => "ipfs://newProgURI"
        string memory newURI = cert.tokenURI(progId);
        assertEq(newURI, "ipfs://newProgURI");
    }

    function testUpdateTokenURIRevertNonexistent() public {
        // updateTokenURI(999, ...) ne revert pas directement
        // Mais si on lit ensuite tokenURI(999), => revert
        cert.updateTokenURI(999, "ipfs://fake");

        vm.expectRevert();
        cert.tokenURI(999);
    }

    // ===============================
    // ===== TEST: scenario complet =
    // ===============================
    function testFullFlow() public {
        // 1) 2 programmes
        uint256 p1 = cert.createProgramNFT(alice, "ipfs://p1");
        uint256 p2 = cert.createProgramNFT(bob, "ipfs://p2");
        assertEq(cert.getLastID(), 2);

        // 2) 2 annuals liés à p1
        uint256 a1 = cert.createAnnualNFT(eve, p1, "ipfs://a1");
        uint256 a2 = cert.createAnnualNFT(eve, p1, "ipfs://a2");
        assertEq(cert.getLastID(), 4);

        // 3) getAllProgram => ( [1,2], ["ipfs://p1", "ipfs://p2"] )
        (uint256[] memory prIds, string[] memory prUris) = cert.getAllProgram();
        assertEq(prIds.length, 2);
        assertEq(prIds[0], p1);
        assertEq(prIds[1], p2);
        assertEq(prUris[0], "ipfs://p1");
        assertEq(prUris[1], "ipfs://p2");

        // 4) getAllAnnual => ( [3,4], ["ipfs://a1","ipfs://a2"] )
        (uint256[] memory annIds, string[] memory annUris) = cert
            .getAllAnnual();
        assertEq(annIds.length, 2);
        assertEq(annIds[0], a1);
        assertEq(annIds[1], a2);
        assertEq(annUris[0], "ipfs://a1");
        assertEq(annUris[1], "ipfs://a2");

        // 5) getProgramWithAnnual(p1)
        (
            string memory pURI,
            uint256[] memory childIds,
            string[] memory childUris
        ) = cert.getProgramWithAnnual(p1);

        assertEq(pURI, "ipfs://p1");
        assertEq(childIds.length, 2);
        assertEq(childIds[0], a1);
        assertEq(childIds[1], a2);
        assertEq(childUris[0], "ipfs://a1");
        assertEq(childUris[1], "ipfs://a2");
    }
}
