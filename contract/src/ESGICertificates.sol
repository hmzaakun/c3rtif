// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title ESGICertificates
 * @dev Version plus complète pour OpenZeppelin v5.x.
 */
contract ESGICertificates is ERC721URIStorage {
    // Compteur pour générer les IDs
    uint256 private _tokenIdCounter;

    // parentOf[tokenId] = 0 => c'est un NFT "Programme"
    // parentOf[tokenId] != 0 => c'est un NFT "Annuel"
    mapping(uint256 => uint256) private parentOf;

    // Listes globales
    uint256[] private _programTokens;
    uint256[] private _annualTokens;

    // Pour chaque programme => la liste de ses NFT annuels
    mapping(uint256 => uint256[]) private _annualChildrenOf;

    constructor() ERC721("ESGI Certificates", "ESGIC") {
        _tokenIdCounter = 0;
    }

    // =====================================================
    // ==================== CREATION =======================
    // =====================================================

    /**
     * @dev Crée un NFT "Programme" (parent = 0).
     * @param to L'adresse destinataire
     * @param ipfsURI Lien IPFS (ou autre) vers le JSON des métadonnées
     * @return tokenId l'ID du NFT "Programme" créé
     */
    function createProgramNFT(
        address to,
        string memory ipfsURI
    ) external returns (uint256) {
        _tokenIdCounter++;
        uint256 newId = _tokenIdCounter;

        _safeMint(to, newId);
        _setTokenURI(newId, ipfsURI);

        parentOf[newId] = 0; // Programme
        _programTokens.push(newId);

        return newId;
    }

    /**
     * @dev Crée un NFT "Annuel", lié à un NFT "Programme" existant.
     * @param to L'adresse destinataire
     * @param parentTokenId ID du Programme parent
     * @param ipfsURI Lien IPFS (ou autre) vers le JSON des métadonnées
     * @return tokenId l'ID du NFT "Annuel" créé
     */
    function createAnnualNFT(
        address to,
        uint256 parentTokenId,
        string memory ipfsURI
    ) external returns (uint256) {
        // Vérifie que le parent existe (revert si inexistant) :
        _requireOwned(parentTokenId);
        // Vérifie qu'il s'agit bien d'un programme (parentOf == 0)
        require(parentOf[parentTokenId] == 0, "Parent is not a Program NFT");

        _tokenIdCounter++;
        uint256 newId = _tokenIdCounter;

        _safeMint(to, newId);
        _setTokenURI(newId, ipfsURI);

        parentOf[newId] = parentTokenId; // Annuel
        _annualTokens.push(newId);

        // On ajoute cet ID d'annuel à la liste du parent
        _annualChildrenOf[parentTokenId].push(newId);

        return newId;
    }

    /**
     * @dev Mettre à jour la tokenURI d'un NFT.
     * @param tokenId l'ID du NFT
     * @param newURI Nouvelle URI (IPFS, etc.)
     */
    function updateTokenURI(uint256 tokenId, string memory newURI) external {
        _setTokenURI(tokenId, newURI);
    }

    // =====================================================
    // ===================== GETTERS =======================
    // =====================================================

    /**
     * @dev Renvoie l'ID courant (le dernier ID minté).
     *      Remplace "getTotalMinted".
     */
    function getLastID() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Liste de tous les IDs "Programme" (parent = 0).
     */
    function getAllProgram() external view returns (uint256[] memory) {
        return _programTokens;
    }

    /**
     * @dev Liste de tous les IDs "Annuel" (parent != 0).
     */
    function getAllAnnual() external view returns (uint256[] memory) {
        return _annualTokens;
    }

    /**
     * @dev Récupère le "Programme" (tokenURI) + tous les NFT "Annuel" qui y sont reliés
     *      Retourne l'URI du programme, la liste des annuels, et l'URI de chacun de ces annuels.
     */
    function getProgramWithAnnual(
        uint256 programId
    )
        external
        view
        returns (
            string memory programURI,
            uint256[] memory annualIds,
            string[] memory annualURIs
        )
    {
        // Vérifie qu'il existe
        _requireOwned(programId);
        // Vérifie que c'est bien un programme
        require(parentOf[programId] == 0, "Not a Program NFT");

        // 1) Récupère l'URI du programme
        programURI = tokenURI(programId);

        // 2) Récupère la liste des NFTs annuels
        annualIds = _annualChildrenOf[programId];
        annualURIs = new string[](annualIds.length);

        // 3) Pour chacun, on lit la tokenURI
        for (uint256 i = 0; i < annualIds.length; i++) {
            annualURIs[i] = tokenURI(annualIds[i]);
        }
        // On renvoie (programURI, annualIds, annualURIs)
    }

    /**
     * @dev Retourne le parent d'un tokenId.
     *      0 => c'est un Programme.
     *      sinon => c'est un Annuel, lié au Programme parentOf[tokenId].
     */
    function getParentOf(uint256 tokenId) external view returns (uint256) {
        // Avant on utilisait _exists(tokenId).
        // Maintenant on utilise _requireOwned (revert si inexistant).
        _requireOwned(tokenId);
        return parentOf[tokenId];
    }
}
