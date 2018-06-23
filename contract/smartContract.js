"use strict";

var RedPocket = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.value = obj.value;
		this.author = obj.author;
	}
};

RedPocket.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var RedPocketList = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new RedPocket(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "counter");
};

RedPocketList.prototype = {
    init: function () {
        // todo
        this.counter = 0;
        this.ownerAddress = Blockchain.transaction.from;
    },
    _getNextCounter:function(){
        return this.counter +1;
    },
    //保存红包
    save: function (value) {
        value = value.trim();

        if (value.length > 128 ){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;

        var rp = new RedPocket();
        rp.author = from;
        rp.value = value;
        this.repo.put(this.counter, rp);

        this.counter = this._getNextCounter();
        return 'success';
    },

    getAll: function (key) {
        var list = [];
        for(var i=0;i<this.counter;i++){
            list.push(this.repo.get(i));
        }
        return list;
    }
};
module.exports = RedPocketList;
