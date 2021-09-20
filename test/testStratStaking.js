const helper = require("./../helpers/index.js");

const LIME = artifacts.require("LIME");
const TT = artifacts.require("TT");
const LimeFarm = artifacts.require("LimeFarm");
const StratLock = artifacts.require("StratLock");
const ReferralStratStaking = artifacts.require("ReferralStratStaking");
const LimeReferral = artifacts.require("LimeReferral");
const StratStaking = artifacts.require("StratStaking");

contract('Test Strat Staking', (accounts) => {
    it('Mint 1000 tokens to Account 0', async () => {
        const LIMEInst = await LIME.deployed();
        await LIMEInst.mint(accounts[0], 1000);
        const balance = await LIMEInst.balanceOf(accounts[0]);
        assert.equal(balance, 1000, "Error");
    });
    it('Mint 1000 tokens to Account 2', async () => {
        const LIMEInst = await LIME.deployed();
        await LIMEInst.mint(accounts[2], 1000);
        const balance = await LIMEInst.balanceOf(accounts[2]);
        assert.equal(balance, 1000, "Error");
    });
    /*it('Mint 100 tokens to Staking', async () => {
        const stratStaking = await StratStaking.deployed();
        const LIMEInst = await LIME.deployed();
        await LIMEInst.mint(stratStaking.address, 100);
        const balance = await LIMEInst.balanceOf(stratStaking.address);
        assert.equal(balance, 100, "Error");
    });*/
    it('Transfer ownership to LimeFarm', async () => {
        const LIMEInst = await LIME.deployed();
        await LIMEInst.transferOwnership(LimeFarm.address);
        const owner = await LIMEInst.owner();
        assert.equal(owner, LimeFarm.address, "Error");
    });
    it('Increase Allowance for Referral', async () => {
        const ALLOWANCE = 999999999999;
        const LIMEInst = await LIME.deployed();
        const LimeReferralInst = await LimeReferral.deployed();
        await LIMEInst.increaseAllowance(LimeReferralInst.address, ALLOWANCE);
        const allowance = await LIMEInst.allowance(accounts[0], LimeReferralInst.address);
        assert.equal(ALLOWANCE, allowance, "Error");
    });
    it('Increase Allowance for Referral Account 2', async () => {
        const ALLOWANCE = 999999999999;
        const LIMEInst = await LIME.deployed();
        const LimeReferralInst = await LimeReferral.deployed();
        await LIMEInst.increaseAllowance(LimeReferralInst.address, ALLOWANCE, {from: accounts[2]});
        const allowance = await LIMEInst.allowance(accounts[2], LimeReferralInst.address);
        assert.equal(ALLOWANCE, allowance, "Error");
    });
    it('Add StratStaking', async () => {
        const stratLockInst = await StratStaking.deployed();
        const LimeFarmInst = await LimeFarm.deployed();
        const LIMEInst = await LIME.deployed(); 

        await LimeFarmInst.add(0, LIMEInst.address, false, stratLockInst.address);
        await LimeFarmInst.add(1, LIMEInst.address, false, stratLockInst.address);
        const poolLength = await LimeFarmInst.poolLength();
        assert.equal(poolLength, 2, "Error");
    });
    it('Set up Referal', async () => {
        const LimeReferral = await LimeReferral.deployed();
        const referralStratLockInst = await ReferralStratStaking.deployed();
        await LimeReferral.setStrategy(0, referralStratLockInst.address);
        await LimeReferral.setTreasure(accounts[1]);
    });
    it('Deposit', async () => {
        const stratStaking = await StratStaking.deployed();
        const LimeReferral = await LimeReferral.deployed();
        await LimeReferral.deposit(accounts[2], 0, 100);
        await helper.advanceTimeAndBlock(6000);
        
        console.log((await LimeReferral.stakedWantTokens(0, accounts[0])).toString())
        console.log((await stratStaking.wantLockedTotal()).toString())
    });
    it('Transfer Rewards to Staking', async () => {
        const stratStaking = await StratStaking.deployed();
        const LimeReferral = await LimeReferral.deployed();
        const LIMEInst = await LIME.deployed();
        await LIMEInst.transfer(stratStaking.address, 100);
        await helper.advanceTimeAndBlock(6000);
        
        console.log((await LimeReferral.stakedWantTokens(0, accounts[0])).toString())
        console.log((await stratStaking.wantLockedTotal()).toString())
    });
    it('Deposit', async () => {
        const stratStaking = await StratStaking.deployed();
        const LimeReferral = await LimeReferral.deployed();
        await LimeReferral.deposit(accounts[4], 0, 100, {from: accounts[2]});
        await helper.advanceTimeAndBlock(6000);
        
        console.log((await LimeReferral.stakedWantTokens(0, accounts[0])).toString())
        console.log((await stratStaking.wantLockedTotal()).toString())
        console.log((await LimeReferral.stakedWantTokens(0, accounts[2])).toString())
    });
    it('Withdraw', async () => {
        const stratStaking = await StratStaking.deployed();
        const LIMEInst = await LIME.deployed();
        const LimeReferral = await LimeReferral.deployed();
        await LimeReferral.withdraw(0, 100, {from: accounts[2]});
        console.log((await LimeReferral.stakedWantTokens(0, accounts[0])).toString())
        console.log((await stratStaking.wantLockedTotal()).toString())
        console.log((await LimeReferral.stakedWantTokens(0, accounts[2])).toString())
    });
    /*it('Deposit Account 2', async () => {
        const LimeReferral = await LimeReferral.deployed();
        const LIMEInst = await LIME.deployed();
        await LimeReferral.deposit('0x0000000000000000000000000000000000000000', 0, 100, {from: accounts[2]});
        console.log(await LIMEInst.balanceOf(accounts[2]))
        console.log((await LimeReferral.stakedWantTokens(0, accounts[0])).toString())
    });
    /*it('Transfer Reward to Staking', async () => {
        const LIMEInst = await LIME.deployed();
        await LIMEInst.mint(accounts[2], 1000);
        const balance = await LIMEInst.balanceOf(accounts[2]);
        assert.equal(balance, 1000, "Error");
    });
    it('Deposit Account 2', async () => {
        const LimeReferral = await LimeReferral.deployed();
        const LIMEInst = await TT.deployed();
        await LimeReferral.deposit('0x0000000000000000000000000000000000000000', 0, 100, {from: accounts[2]});
        console.log(await LIMEInst.balanceOf(accounts[2]))
        console.log(await LimeReferral.pendingLIME(0, accounts[2]))
    });*/
    ('Withdraw', async () => {
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
