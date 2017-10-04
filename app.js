var BudgetController = (function () {
	var Expense = function (id, description, value, percentage) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = percentage
	}

	Expense.prototype.calculatePercentage = function (totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	}

	Expense.prototype.getPercentage = function () {
		return this.percentage;
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
			var ids, index;

			ids = data.allItems[type].map(function (current) {
				return current.id
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1)
			}
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

		calculatePercentages: function () {
			data.allItems.exp.forEach(function (cur) {
				cur.calculatePercentage(data.totals.inc);
			});
		},

		getPercentages: function () {
			var allPerc = data.allItems.exp.map(function (cur) {
				return cur.getPercentage();
			});

			return allPerc;
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
		expPercentage: ".item__percentage",
		dateLabel: '.budget__title--month'
	}
	var formatNumber = function (num, type) {
		var numSplit, int, dec, type;

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + "." + dec;
	}

	var nodeListForEach = function (list, callback) {
		for (var i = 0; i < list.length; i++) {
			callback(list[i], i)
		}
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
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		deleteListItem: function (selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		displayBudget: function (obj) {
			var type;
			obj.budget > 0 ? type = "inc" : type = "exp";

			document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
			document.querySelector(domStrings.expenseLabel).textContent = formatNumber(obj.totalExp, type);

			if (obj.percentage > 0) {
				document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + " %";
			} else {
				document.querySelector(domStrings.percentageLabel).textContent = "--";
			}
		},

		displayPercentages: function (percentages) {
			var fields = document.querySelectorAll(domStrings.expPercentage);

			nodeListForEach(fields, function (current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + " %";
				} else {
					current.textContent = "---";
				}
			})


		},

		displayMonth: function () {
			var now, year, months, month;
			now = new Date();
			year = now.getFullYear();

			months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			month = now.getMonth()
			document.querySelector(domStrings.dateLabel).textContent = months[month] + " " + year;
		},

		changedType: function () {
			var fields = document.querySelectorAll(
				domStrings.type + "," +
				domStrings.description + "," +
				domStrings.value
			);

			nodeListForEach(fields, function (cur) {
				cur.classList.toggle('red-focus')
			});
		},
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

		document.querySelector(DOM.type).addEventListener('change', UICont.changedType);
	}

	var updateBudget = function () {
		BudgetCont.calculateBudget();

		var budget = BudgetCont.getBudget();

		UICont.displayBudget(budget);
	}

	var updatePercentages = function () {
		//calculate percentages
		BudgetCont.calculatePercentages();
		//get perentages
		var percentages = BudgetCont.getPercentages();
		//percentage into UI
		UICont.displayPercentages(percentages);
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

			updatePercentages();
		}
	}

	function contDeleteItems(event) {
		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
		}

		//delete item from budget
		BudgetCont.deleteItem(type, ID);

		//delete item from budget UI
		UICont.deleteListItem(itemID);

		//update budget
		updateBudget();
		updatePercentages();
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
			UICont.displayMonth();
		}
	}



})(BudgetController, UIController)

AppController.init();
