const LIME = artifacts.require("LIME");
const TT = artifacts.require("TT");
const limeFarm = artifacts.require("LimeFarm");
const StratLock = artifacts.require("StratLock");
const ReferralStratStaking = artifacts.require("ReferralStratStaking");
const limeReferral = artifacts.require("LimeReferral");
const StratStaking = artifacts.require("StratStaking");

module.exports = async function(deployer) {
    await deployer.deploy(LIME);
    await deployer.deploy(TT);
    await deployer.deploy(LimeFarm, LIME.address);
    await deployer.deploy(StratLock, LimeFarm.address, LIME.address, TT.address);
    await deployer.deploy(ReferralStratStaking);
    await deployer.deploy(LimeReferral, LimeFarm.address, LIME.address);
    await deployer.deploy(StratStaking, LimeFarm.address, LIME.address, LIME.address);
};
