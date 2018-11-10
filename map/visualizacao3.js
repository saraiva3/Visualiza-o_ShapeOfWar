let tipoConflito = document.querySelector('#information-type-opt1').checked;
let tipoRelacionamento = document.querySelector('#information-type-opt2').checked;

document.querySelector('#information-type-opt1').addEventListener('change', function(e) {
  if (e.target.checked){
    carregaConflitos();
  }
}, false);

document.querySelector('#information-type-opt2').addEventListener('change', function(e) {
  if (e.target.checked){
    carregaRelacionamentos();
  }
}, false);

let edgesBrasil = [];

let linhaDoTempoBrasil = [];
let linhaDoTempoBrasilInimigos = [];
let linhaDoTempoBrasilAliados = [];
let linhaDoTempoMundo = [];

let colConflitosMundo = ['World'];
let colConflitosBrasil = ['Brazil'];
let colRelacionamentosMundo = ['World'];
let colRelacionamentosBrasil = ['Brazil'];
let colYears = ['Year'];

let chart;

window.onload = inicia();

function inicia(){

  // Seleção dos relacionamentos do Brasil
  for (let i = 0; i < edges.length; i++){
    if (edges[i].SourceID == 'Brazil'
        || edges[i].TargetID == 'Brazil'){
      edgesBrasil.push(edges[i]);
    }
  }

  // Criação de vetores para armazenar os dados dos conflitos do Brasil e do
  // mundo no formato que poderão ser utilizados para criar as visualizações
  for (let i = 1501; i < 2018; i++){
    linhaDoTempoBrasil.push({
      'ano': i,
      'relacionamentos': 0,
      'aliados': [],
      'inimigos': [],
      'conflitos': []
    });
    linhaDoTempoMundo.push({
      'ano': i,
      'relacionamentos': 0,
      'aliados': [],
      'inimigos': [],
      'conflitos': []
    });
  }

  let iAliados = 0;
  let iInimigos = 0;

  let novoConflito;

  // Preenche o vetor dos relacionamentos do Brasil de acordo com a data dos
  // conflitos e tipo de relacionamento (aliança ou inimizade)
  for (let i = 0; i < edgesBrasil.length; i++){
    for (let j = 0; j < linhaDoTempoBrasil.length; j++){
      if (Number(edgesBrasil[i].year_start) <= linhaDoTempoBrasil[j].ano
            && (Number(edgesBrasil[i].year_end) + 1) >= linhaDoTempoBrasil[j].ano){
        linhaDoTempoBrasil[j].relacionamentos += 1;
        novoConflito = true;
        for (let k = 0; k < linhaDoTempoBrasil[j].conflitos.length; k++){
          if (linhaDoTempoBrasil[j].conflitos[k] == edgesBrasil[i].conflict_name){
            novoConflito = false;
          }
        }
        if (novoConflito){
          linhaDoTempoBrasil[j].conflitos.push(edgesBrasil[i].conflict_name);
        }
        if (edgesBrasil[i].relation == '+'){
          if (edgesBrasil[i].SourceID == 'Brazil'){
            linhaDoTempoBrasil[j].aliados.push(edgesBrasil[i].TargetID);
          } else {
            linhaDoTempoBrasil[j].aliados.push(edgesBrasil[i].SourceID);
          }
        } else {
          if (edgesBrasil[i].SourceID == 'Brazil'){
            linhaDoTempoBrasil[j].inimigos.push(edgesBrasil[i].TargetID);
          } else {
            linhaDoTempoBrasil[j].inimigos.push(edgesBrasil[i].SourceID);
          }
        }
      }
    }
  }

  // Preenche o vetor dos relacionamentos do mundo de acordo com a data dos conflitos
  for (let i = 0; i < edges.length; i++){
    for (let j = 0; j < linhaDoTempoMundo.length; j++){
      if (Number(edges[i].year_start) <= linhaDoTempoMundo[j].ano
            && Number(edges[i].year_end) >= linhaDoTempoMundo[j].ano){
        linhaDoTempoMundo[j].relacionamentos += 1;
        novoConflito = true;
        for (let k = 0; k < linhaDoTempoMundo[j].conflitos.length; k++){
          if (linhaDoTempoMundo[j].conflitos[k] == edges[i].conflict_name){
            novoConflito = false;
          }
        }
        if (novoConflito){
          linhaDoTempoMundo[j].conflitos.push(edges[i].conflict_name);
        }
        if (edges[i].relation == '+'){
          linhaDoTempoMundo[j].aliados.push(edges[i].TargetID);
          linhaDoTempoMundo[j].aliados.push(edges[i].SourceID);
        } else {
          linhaDoTempoMundo[j].inimigos.push(edges[i].TargetID);
          linhaDoTempoMundo[j].inimigos.push(edges[i].SourceID);
        }
      }
    }
  }

  // Converte o ano para utilizá-lo no eixo x
  for (let i = 0; i < linhaDoTempoBrasil.length; i++){
    let stringAno = linhaDoTempoBrasil[i].ano + '-01-01';
    colYears.push(Date.parse(stringAno));
  }

  if (tipoRelacionamento){
    carregaRelacionamentos();
  } else {
    carregaConflitos();
  }

}

function carregaConflitos(){
  // Cria o vetor com os números de conflitos do Brasil em formato que
  // pode ser usado para criar as visualizações
  for (let i = 0; i < linhaDoTempoBrasil.length; i++){
    colConflitosBrasil.push(linhaDoTempoBrasil[i].conflitos.length);
  }

  // Cria o vetor com os números de conflitos do Mundo em formato que
  // pode ser usado para criar as visualizações
  for (let i = 0; i < linhaDoTempoMundo.length; i++){
    colConflitosMundo.push(linhaDoTempoMundo[i].conflitos.length);
  }

  desenhaConflitos();
}

function carregaRelacionamentos(){
  // Cria o vetor com os números de relacionamentos do Brasil em formato que
  // pode ser usado para criar as visualizações
  for (let i = 0; i < linhaDoTempoBrasil.length; i++){
    colRelacionamentosBrasil.push(linhaDoTempoBrasil[i].relacionamentos);
  }

  // Cria o vetor com os números de relacionamentos no mundo em formato que
  // pode ser usado para criar as visualizações
  for (let i = 0; i < linhaDoTempoMundo.length; i++){
    colRelacionamentosMundo.push(linhaDoTempoMundo[i].relacionamentos);
  }

  desenhaRelacionamentos();
}

function desenhaRelacionamentos(){
  // Desenha da visualização
  chart = c3.generate({
    // Define onde a visualização será desenhada
    bindto: '#visualizacao3',
    // Define os dados da visualização
    data: {
      columns: [
        colYears,
        colRelacionamentosMundo,
        colRelacionamentosBrasil
      ],
      x: 'Year',
      type: 'line'
    },
    // Define o tamanho dos pontos
    point: {
      r: 1.2,
    },
    // Habilita o zoom
    zoom: {
        enabled: true,
        type: 'scroll',
    },
    // Define as cores
    color: {
      pattern: ['#2166ac', '#ef8a62']
    },
    // Define alguns parâmetros da série
    axis : {
      x: {
        type : 'timeseries',
        tick: {
          format: function (x) { return x.getFullYear(); },
          //count: 30,
          // Define quais valores devem ser exibidos no eixo x
          // Neste caso, foram escolhidos (manualmente) os pontos nos queis
          // o Brasil tem algum relacionamento com outro país
          values: [
            '1500-01-01',
            '1611-01-01',
            '1821-01-01',
            '1834-01-01',
            '1863-01-01',
            '1898-01-01',
            '1913-01-01',
            '1938-01-01',
            '1964-01-01',
            '2018-01-01'
          ]
        },
        label: {
          text: 'Year',
          position: 'outer-right'
        },
        padding: {
          left: 0
        }
      },
      y: {
        label: {
          text: 'Amount of Relations',
          position: 'outer-middle'
        },
        padding: {
          top: 0,
          bottom: 0
        }
      }
    }
  });
}

function desenhaConflitos(){
  // Desenha da visualização
  chart = c3.generate({
    // Define onde a visualização será desenhada
    bindto: '#visualizacao3',
    // Define os dados da visualização
    data: {
      columns: [
        colYears,
        colConflitosMundo,
        colConflitosBrasil
      ],
      x: 'Year',
      type: 'line'
    },
    // Define as cores
    color: {
      pattern: ['#2166ac', '#ef8a62']
    },
    // Define o tamanho dos pontos
    point: {
      r: 1.2,
    },
    // Habilita o zoom
    zoom: {
        enabled: true,
        type: 'scroll',
    },
    // Define alguns parâmetros da série
    axis : {
      x: {
        type : 'timeseries',
        tick: {
          format: function (x) { return x.getFullYear(); },
          //count: 30,
          // Define quais valores devem ser exibidos no eixo x
          // Neste caso, foram escolhidos (manualmente) os pontos nos queis
          // o Brasil tem algum relacionamento com outro país
          values: [
            '1500-01-01',
            '1611-01-01',
            '1821-01-01',
            '1834-01-01',
            '1863-01-01',
            '1898-01-01',
            '1913-01-01',
            '1938-01-01',
            '1964-01-01',
            '2018-01-01'
          ]
        },
        label: {
          text: 'Year',
          position: 'outer-right'
        },
        padding: {
          left: 0
        }
      },
      y: {
        tick: {
          format: d3.format("d")
        },
        label: {
          text: 'Amount of Conflicts',
          position: 'outer-middle'
        },
        padding: {
          top: 0,
          bottom: 0
        }
      }
    }
  });
}
