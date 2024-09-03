import { Banco } from "../src/banco";

describe("Testes da classe Banco", () => {
  let conta: Banco;
  let contaDestino: Banco;

  const nomeConta = "Banco do Teste";
  const nomeContaDestino = "Banco de Destino";

  beforeEach(() => {
    conta = new Banco(nomeConta, 1000);
    contaDestino = new Banco(nomeContaDestino);
  });

  // #region Obter
  describe("Obter", () => {
    test("Saldo", () => {
      expect(conta.obterSaldo()).toBe(1000);
    });

    test("Nome", () => {
      expect(conta.obterNome()).toBe(nomeConta);
    });

    test("Total Depositado", () => {
      conta.depositar(100);
      expect(conta.obterTotalDepositado()).toBe(100);
      conta.depositar(200);
      expect(conta.obterTotalDepositado()).toBe(300);
    });
  });
  // #endregion

  // #region Depósito
  describe("Depósito", () => {
    test("Valor válido", () => {
      conta.depositar(100);
      expect(conta.obterSaldo()).toBe(1100);
    });

    test("Histórico", () => {
      const valor = 100;

      conta.depositar(100);
      expect(conta.obterHistorico()).toContainEqual({
        tipo: "Depósito",
        valor,
      });
    });
  });
  // #endregion

  // #region Saque
  describe("Saque", () => {
    test("Saldo SUFICIENTE", () => {
      conta.sacar(100);
      expect(conta.obterSaldo()).toBe(900);
    });

    test("Saldo INSUFICIENTE", () => {
      expect(() => conta.sacar(1100)).toThrow();
    });

    test("Histórico", () => {
      const valor = 100;

      conta.sacar(100);
      expect(conta.obterHistorico()).toContainEqual({
        tipo: "Saque",
        valor,
      });
    });
  });
  // #endregion

  // #region Transferência
  describe("Tranferência", () => {
    test("Saldo SUFICIENTE", () => {
      conta.transferir(100, contaDestino);

      expect(conta.obterSaldo()).toBe(900);
      expect(contaDestino.obterSaldo()).toBe(100);
    });

    test("Saldo INSUFICIENTE", () => {
      expect(() => conta.transferir(1100, contaDestino)).toThrow();
    });

    test("Histórico", () => {
      const valor = 100;

      conta.transferir(100, contaDestino);
      expect(conta.obterHistorico()).toContainEqual({
        tipo: "Saque",
        valor,
      });
      expect(conta.obterHistorico()).toContainEqual({
        tipo: "Transferência",
        valor,
        destino: contaDestino.obterNome(),
      });
    });
  });
  // #endregion

  // #region Limite de Saque
  describe("Limite de Saque", () => {
    test("Definir limite", () => {
      conta.definirLimiteDeSaque(200);

      expect(conta.obterLimiteDeSaque()).toBe(200);
    });

    test("Valor MAIOR que o limite de saque", () => {
      conta.definirLimiteDeSaque(200);

      expect(() => conta.verificarLimiteDeSaque(300)).toThrow();
    });

    test("Valor MENOR que o limite de saque", () => {
      conta.definirLimiteDeSaque(200);

      expect(conta.verificarLimiteDeSaque(100)).toBeTruthy();
    });

    test("Valor IGUAL o limite de saque", () => {
      conta.definirLimiteDeSaque(200);

      expect(conta.verificarLimiteDeSaque(200)).toBeTruthy();
    });
  });
  // #endregion

  describe("Juros", () => {
    test("Aplicar", () => {
      expect(conta.aplicarJuros(20)).toBe(1200);
    });

    test("Histórico", () => {
      const taxa = 20;
      const saldoComJuros = conta.obterSaldo() * (taxa / 100);

      conta.aplicarJuros(taxa);

      expect(conta.obterHistorico()).toContainEqual({
        tipo: "Juros",
        valor: saldoComJuros,
      });
    });
  });

  describe("Pagar Conta", () => {
    test("Pagar", () => {
      expect(conta.pagarConta(100, "Conta de energia")).toBe(900);
    });

    test("Histórico", () => {
      const valor = 100;
      const descricao = "Conta de Energia";

      conta.pagarConta(valor, descricao);

      expect(conta.obterHistorico()).toContainEqual({
        tipo: "Pagamento",
        valor: valor,
        descricao,
      });
    });
  });
});
