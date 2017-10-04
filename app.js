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

	var calculateTotal = function (type) {
		var sum = 0;
		data.allItems[type].forEach(function (curr) {
			sum = sum + curr.value;
		})

		data.totals[type] = sum;
	}

	var data = {
		allItems: {
			inc: [],
			exp: [],
		},
		totals: {
			inc: 0,
			exp: 0
		},
		budget: 0,
		percentage: -1
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

		deleteItem: function (type, id) {
			
		},

		test: function () {
			console.log(data);
		},

		calculateBudget: function () {
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate budget
			data.budget = data.totals.inc - data.totals.exp

			//calculate percentage
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
			} else {
				data.percentage = -1
			}
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		}
	}

})();

var UIController = (function () {
	var domStrings = {
		type: '.add__type',
		description: '.add__description',
		value: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
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
				value: parseFloat(document.querySelector(domStrings.value).value)
			};
		},

		clearFields: function () {
			var fields, fieldsArr;
			fields = document.querySelectorAll(domStrings.description + ", " + domStrings.value)
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (current, index, array) {
				current.value = ""
			});
			fieldsArr[0].focus();
		},

		addListItem: function (obj, type) {
			var html, newHTML, element;
			if (type === 'exp') {
				element = domStrings.expenseContainer
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if (type === 'inc') {
				element = domStrings.incomeContainer
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', obj.value);

			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		displayBudget: function (obj) {
			document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(domStrings.expenseLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + " %";
			} else {
				document.querySelector(domStrings.percentageLabel).textContent = "--";
			}
		}
	};
})();

var AppController = (function (BudgetCont, UICont) {

	var setupEventListeners = function () {
		var DOM = UICont.getDomStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', contAddItems);

		document.addEventListener('keypress', function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				contAddItems();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', contDeleteItems);
	}

	var updateBudget = function () {
		BudgetCont.calculateBudget();

		var budget = BudgetCont.getBudget();

		UICont.displayBudget(budget);
	}

	function contAddItems() {
		var input, newItem;

		// get field input data
		input = UICont.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//Add item to budget controller
			newItem = BudgetCont.addItem(input.type, input.description, input.value);

			//Add item to UI
			UICont.addListItem(newItem, input.type);
			//Calculate the budget

			UICont.clearFields();
			//Display the budget on UI

			updateBudget();
		}
	}

	function contDeleteItems(event) {
		var itemID, splitID, type, id;
		itemID = event.target.parentNode.parentNode.parentNode.parnetNode.id
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			id = splitID[1];
		}
	}

	return {
		init: function () {
			console.log("App has started")
			setupEventListeners();
			UICont.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			})
		}
	}



})(BudgetController, UIController)

AppController.init();
