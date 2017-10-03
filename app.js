var BudgetController = (function () {
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
    }
  };
})();

var AppController = (function (BudgetCont, UICont) {

  var DOM = UICont.getDomStrings();


  function contAddItems() {
    UICont.getInput();
    console.log(UICont.getInput());
  }


  document.querySelector(DOM.inputBtn).addEventListener('click', contAddItems)

  document.addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      contAddItems();
    }
  })


})(BudgetController, UIController)