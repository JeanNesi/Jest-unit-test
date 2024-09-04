import { GerenciadorDeTarefas, ITarefa } from "../src/tarefas";

describe("Testes da classe Gerenciador de Tarefas", () => {
  let tarefas: GerenciadorDeTarefas;

  const tarefaValida: ITarefa = {
    id: 1,
    data: new Date().toISOString(),
    descricao: "Fazer trabalho de testes",
    prioridade: 5,
    concluida: false,
    tags: ["Teste"],
  };

  beforeEach(() => {
    tarefas = new GerenciadorDeTarefas();
    tarefas.adicionarTarefa(structuredClone(tarefaValida));
  });

  describe("Adicionar tarefa", () => {
    test("Tarefa válida: Com descrição válida", () => {
      const novaTarefa: ITarefa = { ...tarefaValida, id: 1 };
      tarefas.adicionarTarefa(novaTarefa);

      expect(tarefas.listarTarefas()).toContainEqual(novaTarefa);
    });

    test("Tarefa inválida: Com descrição menor ou igual a 3 caracteres", () => {
      const tarefaInvalida: ITarefa = {
        ...tarefaValida,
        descricao: "Tet",
        id: 2,
      };
      expect(() => tarefas.adicionarTarefa(tarefaInvalida)).toThrow();
    });
  });

  test("Remover tarefa", () => {
    tarefas.removerTarefa(1);
    expect(tarefas.listarTarefas()).toEqual([]);
  });

  test("Atualizar tarefa", () => {
    const tarefa = tarefas.buscarTarefaPorId(1);

    if (!tarefa) return;

    const updatedTarefa: ITarefa = {
      ...tarefa,
      prioridade: 10,
      data: new Date().toISOString(),
      descricao: "Nova tarefa",
    };

    tarefas.atualizarTarefa(1, updatedTarefa);

    expect(tarefas.buscarTarefaPorId(1)).toEqual(updatedTarefa);
  });

  test("Contar tarefas", () => {
    expect(tarefas.contarTarefas()).toEqual(1);
  });

  test("Marcar tarefa como concluida", () => {
    tarefas.marcarTarefaComoConcluida(1);
    expect(tarefas.listarTarefasConcluidas()).toEqual([
      { ...tarefaValida, concluida: true },
    ]);
  });

  test("Remover tarefas concluidas", () => {
    tarefas.marcarTarefaComoConcluida(1);
    tarefas.removerTarefasConcluidas();
    expect(tarefas.listarTarefas()).toEqual([]);
  });

  describe("Listagem", () => {
    test("Listar tarefas", () => {
      expect(tarefas.listarTarefas()).toEqual([tarefaValida]);
    });

    test("Listar tarefas concluidas", () => {
      expect(tarefas.listarTarefasConcluidas()).toEqual([]);
    });

    test("Listar tarefas pendentes", () => {
      expect(tarefas.listarTarefasPendentes()).toEqual([tarefaValida]);
    });

    test("Listar tarefas por prioridade", () => {
      console.log(tarefas.listarTarefasPorPrioridade(5));
      expect(tarefas.listarTarefasPorPrioridade(5)).toEqual([tarefaValida]);
    });
  });

  describe("Busca", () => {
    test("Buscar tarefas por data", () => {
      expect(tarefas.buscarTarefasPorData(tarefaValida.data)).toEqual([
        tarefaValida,
      ]);
    });

    test("Buscar tarefa por descricao", () => {
      expect(
        tarefas.buscarTarefaPorDescricao("Fazer trabalho de testes")
      ).toEqual([tarefaValida]);
      expect(tarefas.buscarTarefaPorDescricao("Teste")).toEqual([]);
    });

    test("Buscar tarefa por id", () => {
      expect(tarefas.buscarTarefaPorId(1)).toEqual(tarefaValida);
      expect(tarefas.buscarTarefaPorId(10)).toBeUndefined();
    });
  });

  describe("Tags", () => {
    test("Adicionar tag a tarefa", () => {
      const novaTarefa = { ...tarefaValida, id: 5, tags: undefined };
      tarefas.adicionarTarefa(novaTarefa);
      tarefas.adicionarTagATarefa(5, "QA");

      expect(tarefas.buscarTarefaPorId(5)).toEqual(novaTarefa);
    });

    test("Remover tag da tarefa", () => {
      tarefas.adicionarTagATarefa(1, "QA");
      expect(tarefas.buscarTarefaPorId(1)).toEqual({
        ...tarefaValida,
        tags: ["Teste", "QA"],
      });

      tarefas.removerTagDaTarefa(1, "QA");
      expect(tarefas.buscarTarefaPorId(1)).toEqual({
        ...tarefaValida,
        tags: ["Teste"],
      });
    });

    test("Listar tarefas por tag", () => {
      expect(tarefas.listarTarefasPorTag("Teste")).toEqual([tarefaValida]);
    });
  });

  test("Contar tarefas por prioridade", () => {
    expect(tarefas.contarTarefasPorPrioridade(5)).toEqual(1);
  });

  test("Ordenar tarefas por prioridade", () => {
    const tarefaValida2 = { ...tarefaValida, prioridade: 10 };
    tarefas.adicionarTarefa({ ...tarefaValida, ...tarefaValida2 });

    tarefas.ordenarTarefasPorPrioridade();
    expect(tarefas.listarTarefas()).toEqual([tarefaValida, tarefaValida2]);
  });

  test("Atualizar prioridade", () => {
    tarefas.atualizarPrioridade(1, 10);
    expect(tarefas.buscarTarefaPorId(1)).toEqual({
      ...tarefaValida,
      prioridade: 10,
    });
  });

  test("Marcar todas como concluidas", () => {
    tarefas.marcarTodasComoConcluidas();
    expect(tarefas.listarTarefasConcluidas()).toEqual([
      { ...tarefaValida, concluida: true },
    ]);
  });

  test("Reabrir tarefa", () => {
    tarefas.reabrirTarefa(1);
    expect(tarefas.listarTarefasConcluidas()).toEqual([]);
  });

  test("Ordenar tarefas por data", () => {
    const tarefaValida2 = { ...tarefaValida, data: new Date().toISOString() };
    tarefas.adicionarTarefa({ ...tarefaValida, ...tarefaValida2 });
    tarefas.ordenarTarefasPorData();
    expect(tarefas.listarTarefas()).toEqual([tarefaValida, tarefaValida2]);
  });
});
