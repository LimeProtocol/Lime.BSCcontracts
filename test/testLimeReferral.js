const helper = require("./../helpers/index.js");

const LIME = artifacts.require("LIME");
const TT = artifacts.require("TT");
const LimeFarm = artifacts.require("LimeFarm");
const StratLock = artifacts.require("StratLock");
const ReferralStratLock = artifacts.require("ReferralStratLock");
const LimeReferral = artifacts.require("LimeReferral");

contract('Contracts', (accounts) => {
    it('Mint 1000 tokens to Account 0', async () => {
        const LIMEInst = await TT.deployed();
        await LIMEInst.mint(accounts[0], 1000);
        const balance = await LIMEInst.balanceOf(accounts[0]);
        assert.equal(balance, 1000, "Error");
    });
    it('Mint 1000 tokens to Account 2', async () => {
        const LIMEInst = await TT.deployed();
        await LIMEInst.mint(accounts[2], 1000);
        const balance = await LIMEInst.balanceOf(accounts[2]);
        assert.equal(balance, 1000, "Error");
    });
    it('Transfer ownership to LimeFarm', async () => {
        const LIMEInst = await LIME.deployed();
        await LIMEInst.transferOwnership(LimeFarm.address);
        const owner = await LIMEInst.owner();
        assert.equal(owner, LimeFarm.address, "Error");
    });
    it('Increase Allowance for Referral', async () => {
        const ALLOWANCE = 999999999999;
        const LIMEInst = await TT.deployed();
        const LimeReferralInst = await LimeReferral.deployed();
        await LIMEInst.increaseAllowance(LimeReferralInst.address, ALLOWANCE);
        const allowance = await LIMEInst.allowance(accounts[0], LimeReferralInst.address);
        assert.equal(ALLOWANCE, allowance, "Error");
    });
    it('Increase Allowance for Referral Account 2', async () => {
        const ALLOWANCE = 999999999999;
        const LIMEInst = await TT.deployed();
        const LimeReferralInst = await LimeReferral.deployed();
        await LIMEInst.increaseAllowance(LimeReferralInst.address, ALLOWANCE, {from: accounts[2]});
        const allowance = await LIMEInst.allowance(accounts[2], LimeReferralInst.address);
        assert.equal(ALLOWANCE, allowance, "Error");
    });
    it('Add StratLock', async () => {
        const stratLockInst = await StratLock.deployed();
        const LimeFarmInst = await LimeFarm.deployed();
        const LIMEInst = await TT.deployed(); 

        await LimeFarmInst.add(1, LIMEInst.address, false, stratLockInst.address);
        const poolLength = await LimeFarmInst.poolLength();
        assert.equal(poolLength, 1, "Error");
    });
    it('Set up Referal', async () => {
        const LimeReferral = await LimeReferral.deployed();
        const referralStratLockInst = await ReferralStratLock.deployed();
        await LimeReferral.setStrategy(0, referralStratLockInst.address);
        await LimeReferral.setTreasure(accounts[1]);
    });
    it('Deposit', async () => {
        const LimeReferral = await LimeReferral.deployed();
        await LimeReferral.deposit(accounts[2], 0, 100);
        await helper.advanceTimeAndBlock(6000);
        console.log((await LimeReferral.pendingLIME(0, accounts[0])).toString())
    });
    it('Deposit Account 2', async () => {
        const LimeReferral = await LimeReferral.deployed();
        const LIMEInst = await TT.deployed();
        await LimeReferral.deposit('0x0000000000000000000000000000000000000000', 0, 100, {from: accounts[2]});
        console.log(await LIMEInst.balanceOf(accounts[2]))
        console.log(await LimeReferral.pendingLIME(0, accounts[2]))
    });
    it('Withdraw', async () => {
        const ttInst = await TT.deployed();
        const LIMEInst = await LIME.deployed();
        const LimeReferral = await LimeReferral.deployed();
        console.log((await LimeReferral.pendingLIME(0, accounts[0])).toString())
        await debug(LimeReferral.withdraw(0, 100));
        const treasurebalance = await LIMEInst.balanceOf(accounts[2]);
        console.log(treasurebalance.toString())
        const balance = await ttInst.balanceOf(accounts[0]);
        assert.equal(balance, 1001, "Error");
    });

});
