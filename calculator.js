// Classe principal que controla toda a calculadora
class Calculator {
  constructor(displayElement, historyElement, currentOpElement) {
    // Guarda onde vai mostrar os números, histórico e operação
    this.displayEl = displayElement;
    this.historyEl = historyElement;
    this.currentOpEl = currentOpElement;

    // Inicializa os valores
    this.reset();
    this.memory = 0;     // valor guardado na memória
    this.history = [];   // lista de operações feitas
  }

  // Reseta a calculadora
  reset() {
    this.currentValue = "0";  // número atual
    this.previousValue = null; // número anterior
    this.operator = null;      // operação atual (+, -, etc.)
    this.updateDisplay();
  }

  // Adiciona número no display
  appendNumber(num) {
    // Evita colocar dois pontos decimais
    if (num === "." && this.currentValue.includes(".")) return;

    // Se está no "0", substitui pelo número digitado
    if (this.currentValue === "0" && num !== ".") this.currentValue = num;
    else this.currentValue = this.currentValue + num;

    this.updateDisplay();
  }

  // Apaga o último número digitado
  deleteLast() {
    if (this.currentValue.length === 1) this.currentValue = "0";
    else this.currentValue = this.currentValue.slice(0, -1);
    this.updateDisplay();
  }

  // Troca o sinal do número (positivo/negativo)
  toggleSign() {
    if (this.currentValue === "0") return;
    this.currentValue = (parseFloat(this.currentValue) * -1).toString();
    this.updateDisplay();
  }

  // Quando o usuário escolhe um operador (+, -, *, /, %)
  chooseOperator(op) {
    if (this.operator !== null) this.compute(); // se já tinha uma operação, resolve ela
    this.operator = op;
    this.previousValue = this.currentValue; // guarda o número atual
    this.currentValue = "0"; // zera para digitar o próximo número
    this.updateCurrentOp();
  }

  // Faz o cálculo com base no operador
  compute() {
    if (this.operator == null || this.previousValue == null) return;
    const a = parseFloat(this.previousValue);
    const b = parseFloat(this.currentValue);
    let result;

    // Aqui é onde realmente fazemos as contas
    switch (this.operator) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": result = b === 0 ? "Erro" : a / b; break; // evita dividir por 0
      case "%": result = a % b; break;
      default: return;
    }

    // Salva no histórico
    this._pushHistory(`${this.previousValue} ${this.operator} ${this.currentValue} = ${result}`);

    // Atualiza valores para o próximo cálculo
    this.currentValue = String(result);
    this.previousValue = null;
    this.operator = null;

    this.updateDisplay();
    this.updateCurrentOp();
  }

  // Transforma o número em porcentagem
  percent() {
    this.currentValue = (parseFloat(this.currentValue) / 100).toString();
    this.updateDisplay();
  }

  // Funções de memória (igual calculadora real)
  memoryAdd() { this.memory += parseFloat(this.currentValue || 0); }
  memorySub() { this.memory -= parseFloat(this.currentValue || 0); }
  memoryRecall() { this.currentValue = String(this.memory); this.updateDisplay(); }
  memoryClear() { this.memory = 0; }

  // Adiciona no histórico
  _pushHistory(entry) {
    this.history.unshift(entry); // adiciona no começo da lista
    if (this.history.length > 20) this.history.pop(); // só guarda 20 últimos
    this.renderHistory();
  }

  // Mostra o histórico na tela
  renderHistory() {
    this.historyEl.innerHTML = this.history.map(h => `<div>• ${h}</div>`).join("");
  }

  // Atualiza a tela principal
  updateDisplay() {
    this.displayEl.textContent = this.currentValue;
  }

  // Atualiza a informação da operação atual (ex: "7 +")
  updateCurrentOp() {
    this.currentOpEl.textContent = this.operator ? `${this.previousValue} ${this.operator}` : "—";
  }
}

/* ============================
   INICIALIZAÇÃO DA CALCULADORA
   ============================ */

// Pega os elementos do HTML
const displayEl = document.getElementById("display");
const historyEl = document.getElementById("history");
const currentOpEl = document.getElementById("currentOp");

// Cria a calculadora
const calc = new Calculator(displayEl, historyEl, currentOpEl);

// Eventos para os botões de números
document.querySelectorAll("[data-number]").forEach(btn => {
  btn.addEventListener("click", () => calc.appendNumber(btn.dataset.number));
});

// Eventos para os botões de ação (C, +, -, =, etc.)
document.querySelectorAll("button[data-action]").forEach(btn => {
  btn.addEventListener("click", () => handleAction(btn.dataset.action));
});

// Função que decide o que cada botão faz
function handleAction(action) {
  switch (action) {
    case "clear": calc.reset(); break;
    case "back": calc.deleteLast(); break;
    case "toggle-sign": calc.toggleSign(); break;
    case "+": case "-": case "*": case "/": case "%": calc.chooseOperator(action); break;
    case "=": calc.compute(); break;
    case "percent": calc.percent(); break;
    case "mplus": calc.memoryAdd(); break;
    case "mminus": calc.memorySub(); break;
    case "mr": calc.memoryRecall(); break;
    case "mc": calc.memoryClear(); break;
  }
}

// Também funciona com o teclado do computador
window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") calc.appendNumber(e.key);
  else if (["+", "-", "*", "/", "%"].includes(e.key)) calc.chooseOperator(e.key);
  else if (e.key === "Enter") calc.compute();
  else if (e.key === "Backspace") calc.deleteLast();
  else if (e.key === "Escape") calc.reset();
});
