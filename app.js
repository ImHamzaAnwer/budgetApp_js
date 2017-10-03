var BudgetController = (function () {
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var data = {
		allItems: {
			inc: [],
			exp: [],
		},
		totals: {
			inc: 0,
			exp: 0
		}
	}

	return {
		addItem: function (type, des, val) {
			var newItem, ID;
			//create unique Id
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1
			} else {
				ID = 0
			}

			//create New Item
			if (type === "exp") {
				newItem = new Expense(ID, des, val);
			} else if (type == "inc") {
				newItem = new Income(ID, des, val);
			}

			//Push it in data structure 'var data'
			data.allItems[type].push(newItem)

			//return New Item
			return newItem;
		},

		test: function () {
			console.log(data);
		}

	}

})();

var UIController = (function () {
	var domStrings = {
		type: '.add__type',
		description: '.add__description',
		value: '.add__value',
		inputBtn: '.add__btn',
	}

	//get input fields values
	return {
		getDomStrings: function () {
			return domStrings;
		},

		getInput: function () {
			return {
				type: document.querySelector(domStrings.type).value,
				description: document.querySelector(domStrings.description).value,
				value: document.querySelector(domStrings.value).value
			};
		},

		addListItem: function (obj, type) {
			var html;
			if (type = 'exp') {
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if ('inc') {
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
		}
	};
})();

var AppController = (function (BudgetCont, UICont) {

	var setupEventListeners = function () {
		var DOM = UICont.getDomStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', contAddItems)

		document.addEventListener('keypress', function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				contAddItems();
			}
		})
	}

	function contAddItems() {

		var input, newItem;

		// get field input data
		input = UICont.getInput();

		//Add item to budget controller
		newItem = BudgetCont.addItem(input.type, input.description, input.value);
		//Add item to UI

		//Calculate the budget

		//Display the budget on UI
	}

	return {
		init: function () {
			console.log("App has started")
			setupEventListeners();
		}
	}



})(BudgetController, UIController)

AppController.init();
