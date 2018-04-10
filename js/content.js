var myModule = (function() {
    /*--------MENU---------*/
    var btns = document.querySelectorAll('.js-drop-down');
    btns.forEach(function(node) {
        node.addEventListener('mouseover', function() {
            btns.forEach(function(node) {
                node.classList.remove('is-active')
            });
            node.classList.add('is-active');

        }, false);
        node.addEventListener('mouseout', function () {
            btns.forEach(function(node) {
                node.classList.remove('is-active')
            });
        })
    });

    /*------ACCORDION-------*/
    function Accordion (el, selectedIndex) {
        if (!el) {
            return;
        }
        this.el = el;
        this.accTrig = this.el.getElementsByClassName('js-accordion-trigger');
        this.accPanel = this.el.getElementsByClassName('js-accordion-panel');
        if (this.accTrig.length === 0 || this.accTrig.length !== this.accPanel.length) {
            return;
        }
        this._init(selectedIndex);
    }

    Accordion.prototype._init = function (selectedIndex) {
        this.accTrigLength = this.accTrig.length;
        this.expAcc = new Array(this.accTrigLength);
        this.multiSelectable = this.el.hasAttribute('aria-multiselectable');
        this.clickListener = this._clickEvent.bind(this);
        this.keydownListener = this._keydownEvent.bind(this);
        this.focusListener = this._focusEvent.bind(this);
        this.keys = {
            prev: 38,
            next: 40,
            space: 32
        };

        var initialSelectedIndex;
        for (var i = 0; i < this.accTrigLength; i++) {
            this.accTrig[i].index = i;
            this.accTrig[i].addEventListener('click', this.clickListener, false);
            this.accTrig[i].addEventListener('keydown', this.keydownListener, false);
            this.accTrig[i].addEventListener('focus', this.focusListener, false);
            if (this.accTrig[i].classList.contains('is-selected')) {
                this.expAcc[i] = true;
            }
        }

        if (!isNaN(selectedIndex)) {
            initialSelectedIndex = selectedIndex < this.accTrigLength ? selectedIndex : this.accTrigLength - 1;
            this.expAcc = new Array(this.accTrigLength);
            this.expAcc[initialSelectedIndex] = true;
        }
        else {
            initialSelectedIndex = this.expAcc.lastIndexOf(true);
            if (!this.multiSelectable) {
                this.expAcc = new Array(this.accTrigLength);
                this.expAcc[initialSelectedIndex] = true;
            }
        }

        this.setSelected(initialSelectedIndex);
        this.setExpanded();
        this.el.classList.add('is-activated');
    };

    Accordion.prototype._clickEvent = function (e) {
        e.preventDefault();
        this.setSelected(e.target.index, true);
        this.setExpanded(e.target.index, true);
    };

    Accordion.prototype._keydownEvent = function (e) {
        var targetIndex;
        switch (e.keyCode) {
            case this.keys.space:
            case this.keys.prev:
            case this.keys.next:
                e.preventDefault();
                break;
            default: return;
        }

        if (e.keyCode === this.keys.space) {
            this.setExpanded(e.target.index, true);
            return;
        }
        else if (e.keyCode === this.keys.prev && e.target.index > 0) {
            targetIndex = e.target.index - 1;
        }
        else if (e.keyCode === this.keys.next && e.target.index < this.accTrigLength - 1) {
            targetIndex = e.target.index + 1;
        }
        else {
            return;
        }
        this.setSelected(targetIndex, true);
    };

    Accordion.prototype._focusEvent = function () {
        if (this.accTrigLength === 1) {
            this.setSelected(0);
        }
    };

    Accordion.prototype.setSelected = function (index, userInvoked) {
        if (index === -1) {
            this.accTrig[0].setAttribute('tabindex', 0);
            return;
        }

        for (var i = 0; i < this.accTrigLength; i++) {
            if (i === index) {
                this.accTrig[i].classList.add('is-selected');
                this.accTrig[i].setAttribute('aria-selected', true);
                this.accTrig[i].setAttribute('tabindex', 0);
                if (userInvoked) {
                    this.accTrig[i].focus();
                }
            }
            else {
                this.accTrig[i].classList.remove('is-selected');
                this.accTrig[i].setAttribute('aria-selected', false);
                this.accTrig[i].setAttribute('tabindex', -1);
            }
        }
    };

    Accordion.prototype.setExpanded = function (index, userInvoked) {
        var i;
        if (userInvoked) {
            if (this.multiSelectable) {
                this.expAcc[index] = !this.expAcc[index];
            }
            else {
                for (i = 0; i < this.accTrigLength; i++) {
                    if (i === index) {
                        this.expAcc[i] = !this.expAcc[i];
                    }
                    else {
                        this.expAcc[i] = false;
                    }
                }
            }
        }

        for (i = 0; i < this.accTrigLength; i++) {
            if (this.expAcc[i]) {
                this.accTrig[i].setAttribute('aria-expanded', true);
                this.accTrig[i].classList.add('is-expanded');
                this.accPanel[i].setAttribute('aria-hidden', false);
                this.accPanel[i].classList.remove('is-hidden');
                this.accPanel[i].setAttribute('tabindex', 0);
            }
            else {
                this.accTrig[i].setAttribute('aria-expanded', false);
                this.accTrig[i].classList.remove('is-expanded');
                this.accPanel[i].setAttribute('aria-hidden', true);
                this.accPanel[i].classList.add('is-hidden');
                this.accPanel[i].setAttribute('tabindex', -1);
            }
        }
    };

    new Accordion(document.querySelector('.accordion'));

    /*--------TABLE---------*/

var table = {
    options:{
        data: {}
    },
    getJSON: function() {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET','https://webwork.s3.amazonaws.com/interview-tests/MOCK_DATA.json', false);
        xmlHttpRequest.setRequestHeader('Accept', '*/*');

        xmlHttpRequest.send();
        if(xmlHttpRequest.status === 200) {
            var json = xmlHttpRequest.responseText;
            this.options.data = JSON.parse(json);
        }
    },
    createTable: function() {
        var table = document.createElement('table');
        var titleRow = document.createElement('tr');
        for(var key in this.options.data[0]) {
            var title = document.createElement('th');
            title.innerHTML = key;
            titleRow.appendChild(title);
        }
        document.querySelector('.js-content').appendChild(table);
        table.appendChild(titleRow);
    },
    createRow: function() {
        for(var key in this.options.data) {
            var node = this.options.data[key];
            var newRow = document.createElement('tr');

            for(var key in node) {
                var newColl = document.createElement('td');
                newColl.innerHTML = node[key];
                newRow.appendChild(newColl);
            }
            document.querySelector('table').appendChild(newRow);
        }
    },
    _init: function(){
        this.getJSON();
        this.createTable();
        this.createRow();
    }
};

document.addEventListener('DOMContentLoaded', function(){
    table._init()

}, false);
}());


