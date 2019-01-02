const D = require('globals');
let buffG = cc.Class({
    name: 'buffG',
    properties: {
        name: '',
        initPoolCount: 0,
        probability: 0.5,
        prefab: {
            default: null,
            type: cc.Prefab
        }
    }
});

cc.Class({
    extends: cc.Component,
    properties: {
        buffG: {
            default: [],
            type: buffG
        }
    },
    onLoad() {
        this.eState = D.commonInfo.gameState.start;
        D.common.batchInitObjPool(this, this.buffG);
    },
    createHeroBuff(emInfo) {
        let theEnemy = emInfo.getComponent('enemy');
        for (let i = 0; i < this.buffG.length; i++) {
            if (theEnemy.buffType == this.buffG[i].name) {
                if (Math.random() <= this.buffG[i].probability) { //概率生成
                    this.getNewBuff(this.buffG[i], emInfo)
                }
            }
        }
    },
    getNewBuff(BuffInfo, emInfo) {
        let poolName = BuffInfo.name + 'Pool',
            newNode = D.common.genNewNode(this[poolName], BuffInfo.prefab, this.node),
            emPos = emInfo.getPosition(),
            newPos = cc.p(emPos.x, emPos.y);
        newNode.setPosition(newPos);
        newNode.getComponent('buff').poolName = poolName;
    },
    //重新开始
    resumeAction() {
        this.enabled = true;
        this.eState = D.commonInfo.gameState.start;
    },
    //暂停
    pauseAction() {
        this.enabled = false;
        this.eState = D.commonInfo.gameState.pause;
    },
    buffDied(nodeinfo) {
        //回收节点
        let poolName = nodeinfo.getComponent('buff').poolName;
        D.common.backObjPool(this, poolName, nodeinfo);
    }
})