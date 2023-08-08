// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import { SignUpGatekeeper } from "./SignUpGatekeeper.sol";

contract TestMACI {
    struct PubKey {
        uint256 x;
        uint256 y;
    }
    uint256 internal constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;
    SignUpGatekeeper public signUpGatekeeper;

    constructor(SignUpGatekeeper _signUpGatekeeper) {
        signUpGatekeeper = _signUpGatekeeper;
    }

    function signUp(
        PubKey memory _pubKey,
        bytes memory _signUpGatekeeperData
    ) public {
        require(
            _pubKey.x < SNARK_SCALAR_FIELD && _pubKey.y < SNARK_SCALAR_FIELD,
            "MACI: _pubKey values should be less than the snark scalar field"
        );
        signUpGatekeeper.register(msg.sender, _signUpGatekeeperData);
    }
}
