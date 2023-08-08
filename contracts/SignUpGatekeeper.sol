// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import { TestMACI } from "./TestMACI.sol";

abstract contract SignUpGatekeeper {
    function setMaciInstance(TestMACI _maci) public virtual {}

    function register(address _user, bytes memory _data) public virtual {}
}
