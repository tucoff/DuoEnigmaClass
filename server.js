const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

const app = express();
const port = 3000;

// 1. Configurações do Servidor
// Permite que o frontend (hospedado no mesmo servidor) fale com o backend
app.use(cors()); 
// Permite receber JSONs grandes (com imagens)
app.use(express.json({ limit: '50mb' }));

// 2. Rota para a API (O "Backend")
// Esta é a rota que o index.html chama
app.post('/generate-enigmas', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("API Key não encontrada. Verifique seu arquivo .env");
        }

        // O 'payload' (corpo) enviado pelo frontend (HTML)
        const frontendPayload = req.body; 

        // 3. A chamada segura para a API do Google
        const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        // Usamos o fetch nativo do Node.js (disponível desde a v18)
        const response = await fetch(googleApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(frontendPayload) // Repassa o payload para o Google
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro da API do Google: ${errorText}`);
        }

        const data = await response.json();
        
        // 4. Envia a resposta do Google de volta para o Frontend
        res.json(data);

    } catch (error) {
        console.error('Erro no servidor:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 5. Rota para o HTML (O "Frontend")
// Serve o arquivo index.html quando você acessa o site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 6. Inicia o servidor
app.listen(port, () => {
    console.log(`🚀 Ferramenta Local Pronta!`);
    console.log(`Acesse http://localhost:${port} no seu navegador.`);
});

// --- Banco de Dados de Exemplos (Few-Shot Learning) ---
const examplesDatabase = [
    // --- NÍVEL 1: MUITO FÁCIL (Identificação) ---
    {
        difficulty: 1,
        titulo: "1ª Lei de Newton (Inércia)",
        enigma: "Eu sou uma lei muito famosa, talvez a mais famosa de todas as leis do movimento. O meu nome começa com a letra I e eu represento uma certa teimosia da natureza. Eu sou aquela regra que diz que as coisas gostam de ficar como estão. Se uma pedra está parada no chão, em repouso, ela quer continuar parada para sempre. Ela não vai sair andando sozinha por vontade própria. Por outro lado, se uma nave espacial está voando no espaço profundo, longe de tudo, em movimento uniforme, ela vai continuar voando para sempre, sem nunca parar e sem nunca fazer curvas. Ela segue em uma linha reta eternamente. O seu texto tem uma frase muito especial, um enunciado original traduzido que explica exatamente isso. Ele diz que 'todo corpo continua em seu estado', seja ele parado ou andando retinho. Para mudar essa situação, só existe um jeito: é preciso que algo externo aconteça. É preciso que ela seja forçada a mudar. É preciso que existam forças aplicadas sobre ela. Sem essa força resultante, nada muda. Eu sou a tendência de manter tudo igual. Procure pelo parágrafo que define a Lei da Inércia e o comportamento de todo corpo. Quem sou eu?",
        paragrafo_original: "A Primeira Lei de Newton é chamada de Lei da Inércia. Seu enunciado original encontra-se traduzido abaixo: “Todo corpo continua em seu estado de repouso ou de movimento uniforme em uma linha reta, a menos que seja forçado a mudar aquele estado por forças aplicadas sobre ele.” Essa lei diz que, ao menos que haja alguma força resultante não nula sobre um corpo, esse deverá manter-se em repouso ou se mover ao longo de uma linha reta com velocidade constante.",
        resposta: "Lei da Inércia (Primeira Lei de Newton)."
    },

    // --- NÍVEL 2: FÁCIL (Compreensão) ---
    {
        difficulty: 2,
        titulo: "Sistemas de Alianças",
        enigma: "Imagine um grande baile onde ninguém quer dançar sozinho, pois o salão está perigoso e cheio de armadilhas. Neste baile da morte, as nações decidiram dar as mãos e formar grupos, prometendo proteger umas às outras caso a música parasse e a briga começasse. O seu livro descreve exatamente como esse salão se dividiu no início da grande confusão. Não havia espaço para indecisos; o mundo se partiu em dois grandes times. De um lado do salão, vestindo as cores das Potências Centrais, formou-se um grupo liderado pela força industrial da Alemanha. Eles não estavam sós; trouxeram consigo a velha Áustria-Hungria, o vasto Império Turco-Otomano e, mais tarde, a pequena Bulgária. Eles formaram um trio poderoso, uma aliança tripla. Mas olhe para o outro lado do salão. Lá, três gigantes decidiram que precisavam se unir para conter o avanço dos primeiros. Eles formaram a Entente, um acordo cordial mas armado até os dentes. Vemos o gigante do leste, a Rússia, dando as mãos à republicana França e à senhora dos mares, a Inglaterra. Eu preciso que você encontre o parágrafo que nomeia esses dois times. Procure pelos nomes dos países e me diga como se chamavam esses dois grupos rivais que dividiram o mapa e o destino do mundo.",
        paragrafo_original: "Assim, no início, os países se dividiram em dois lados: Tríplice Aliança e Tríplice Entente. No primeiro grupo, também chamado de Potências Centrais, estavam a Alemanha, Áustria-Hungria, Império Turco-Otomano e Bulgária. Do outro lado estavam a Rússia, a França e a Inglaterra.",
        resposta: "Tríplice Aliança e Tríplice Entente."
    },
    {
        difficulty: 2,
        titulo: "2ª Lei de Newton (F=ma)",
        enigma: "Para me decifrar, você não precisa ser um matemático, mas precisa encontrar uma receita muito especial escrita no seu livro. Esta não é uma receita de bolo, mas a receita de como mover o mundo. Ela explica o segredo de como empurrar as coisas e fazê-las ganharem velocidade. O texto apresenta uma fórmula curta, elegante, com apenas três letras, mas que governa todos os carros, foguetes e bolas de futebol do planeta. Estou procurando a representação matemática da Segunda Lei. Nessa fórmula mágica, o resultado final é a Força Resultante, que nós medimos em homenagem ao próprio Isaac, usando Newtons. Mas essa força não aparece do nada; ela é o produto, a multiplicação de duas outras coisas. A primeira é a quantidade de matéria que um corpo tem, que chamamos de massa e pesamos em quilogramas. A segunda é a mudança rápida de velocidade, a aceleração, que medimos em metros por segundo ao quadrado. O enigma é simples: encontre a linha que mostra essa equação. Ela diz que 'F' é igual a 'm' vezes 'a'. É a regra que diz que para acelerar algo pesado (massa grande), você precisa de muita força. Localize essa expressão matemática e as definições de suas unidades no Sistema Internacional.",
        paragrafo_original: "Representamos a Segunda Lei matematicamente como: FR = m. a. Onde, FR: força resultante. A unidade no sistema internacional é o Newton (N). m: massa. A unidade no sistema internacional é o quilograma (kg). a: aceleração. A unidade no sistema SI é o metro por segundo ao quadrado (m/s²).",
        resposta: "A fórmula FR = m. a e suas definições."
    },

    // --- NÍVEL 3: MÉDIO (Aplicação) ---
    {
        difficulty: 3,
        titulo: "Guerra de Trincheiras",
        enigma: "Não estamos mais marchando. A época das grandes caminhadas e das batalhas rápidas em campos abertos acabou. Agora, a nossa realidade é estática, suja e subterrânea. Eu sou um soldado preso em uma cicatriz aberta na terra, uma longa vala cavada que corta a Europa de ponta a ponta. O seu livro descreve o meu pesadelo diário, uma fase do conflito onde o avanço parou e a resistência começou. Procure o trecho que descreve onde nós moramos agora. Não são casas, são buracos. Estamos cercados não por cercas brancas, mas por rolos infinitos de arame farpado que rasgam a pele e o uniforme. O inimigo não é apenas o soldado do outro lado com sua metralhadora; o inimigo está aqui dentro conosco. O texto fala de assassinos silenciosos que não usam fardas: a lama que suga nossas botas e apodrece nossos pés, o frio que congela nossos ossos durante a noite, e as doenças terríveis como o tifo. Ah, e não esqueça dos ratos, que correm por entre nós sem medo. Essa foi a fase mais cruel e longa da guerra, onde franceses e alemães ficaram encarando um ao outro através da 'terra de ninguém', sem conseguir avançar um metro sequer. Que nome o historiador dá para esse momento de buracos, terra e morte estática? Encontre a descrição desse inferno.",
        paragrafo_original: "Depois, franceses e alemães firmaram posições cavando trincheiras ao longo de toda a frente ocidental. Protegidos por arame farpado, os exércitos se enterravam nos buracos, onde a lama, o frio, os ratos e o tifo matavam tanto quanto as metralhadoras e canhões. Este momento do conflito é chamado de Guerra de Trincheiras.",
        resposta: "Guerra de Trincheiras."
    },
    {
        difficulty: 3,
        titulo: "3ª Lei de Newton (Ação e Reação)",
        enigma: "Vamos sair da teoria e ir para o estacionamento de um supermercado. Quero propor um experimento mental que prova que você não pode tocar o mundo sem que o mundo toque você de volta. Imagine que você colocou patins nos pés, daqueles com rodas bem lisas, que deslizam facilmente pelo chão. Diante de você está um carrinho de compras, mas ele não está vazio; está lotado, pesado, cheio de mantimentos. Sua missão é empurrar esse carrinho para frente. Você estende os braços, firma as mãos na barra e faz força. O que acontece? O senso comum diz que o carrinho vai para frente e você fica parado. Mas a Física, e a Terceira Lei de Newton, dizem algo diferente. O texto que você tem aí descreve exatamente essa cena cômica. Ele explica que, ao aplicar a força no carrinho, o carrinho devolve a força em você. Como você está sobre rodas e o atrito com o chão é muito fraco, algo surpreendente acontece com o seu corpo. Em vez de ficar firme, você é lançado na direção oposta. Você vai para trás. Encontre o exemplo prático no texto que usa patins e um carrinho de supermercado para ilustrar a inevitabilidade da reação. Leia para mim o que acontece 'em decorrência da fraca intensidade' do atrito. O que essa cena prova sobre as forças?",
        paragrafo_original: "Por exemplo: se estivermos usando patins e empurrarmos um carrinho de supermercado lotado de compras, seremos empurrados para trás, em decorrência da fraca intensidade da força de atrito entre as rodas dos patins e o piso.",
        resposta: "O exemplo dos patins e do carrinho, demonstrando a reação que empurra a pessoa para trás."
    },

    // --- NÍVEL 4: DIFÍCIL (Análise) ---
    {
        difficulty: 4,
        titulo: "Escalada do Conflito",
        enigma: "Este enigma é sobre como transformar uma faísca em um incêndio florestal. Fala sobre a terrível mecânica das alianças automáticas, onde ninguém podia escolher ficar de fora. Inicialmente, parecia uma briga regional, uma disputa de vizinhos: a Áustria estava zangada com a Sérvia. Poderia ter acabado ali, em uma semana de tensão localizada. Mas o texto narra uma sequência de eventos vertiginosa, um verdadeiro efeito dominó diplomático. Eu preciso que você rastreie essa cadeia de reações imprudentes. Veja como a Rússia, querendo mostrar força nos Balcãs, decide intervir para ajudar o irmão menor, a Sérvia. Mas esse movimento acorda o gigante industrial vizinho. A Alemanha, vendo a Rússia se mover, não espera: reage imediatamente e declara guerra ao czar. Mas a loucura não para por aí. Para atingir seus objetivos, a Alemanha atropela a neutralidade de pequenos países, invadindo Luxemburgo e ameaçando a Bélgica. E como em um jogo de xadrez mortal, o movimento alemão força a França, velha aliada dos russos, a entrar no tabuleiro, mobilizando suas tropas nas fronteiras. É uma cascata de decisões onde 'um acode o outro' e 'o outro ataca o amigo daquele'. Encontre o parágrafo longo que descreve essa semana fatídica, onde a guerra deixou de ser austro-sérvia e se tornou europeia. Quem reagiu a quem? Qual foi a sequência exata descrita no seu livro?",
        paragrafo_original: "Durante uma semana, os enfrentamentos permaneceram entre Áustria e Sérvia, mas a Rússia resolveu acudir esta última para reforçar sua posição nos Balcãs. A Alemanha, então, reage se posicionando a favor da Áustria, declarando guerra à Rússia. Além disso, invadiu Luxemburgo e emitiu um ultimato à Bélgica. Aliada dos russos, a França inicia a mobilização de tropas contra os alemães e são registrados atritos na fronteira entre os dois países.",
        resposta: "A sequência de declarações de guerra e mobilizações: Áustria-Sérvia > Rússia > Alemanha > França."
    },
    {
        difficulty: 4,
        titulo: "Conceito de Massa Inercial",
        enigma: "Muitas pessoas confundem quem eu sou. Acham que sou apenas um número na balança da farmácia, algo que diz se você engordou ou emagreceu. Mas na visão profunda de Isaac Newton, eu sou algo muito mais fundamental. Eu não sou o peso; eu sou a medida da inércia. Eu sou a definição de 'dificuldade'. Eu sou aquilo que resiste à mudança. O seu texto traz uma explicação sofisticada sobre o meu papel na Segunda Lei. Ele diz que eu sou a 'constante de proporcionalidade'. O que isso significa? Significa que eu sou o juiz que decide o quanto um empurrão vai ser eficaz. O enigma propõe um experimento comparativo: imagine que você aplica exatamente a mesma força em dois objetos diferentes. Um é leve, o outro é pesadíssimo. O que acontece? A matemática da natureza é implacável. O objeto que tiver mais de mim (maior massa) vai sofrer uma aceleração menor. Ele vai ser teimoso, lento para começar a andar. Já o objeto com menos massa vai disparar. O texto conclui algo belíssimo: ter muita massa significa 'resistir mais às variações de velocidade'. Encontre o parágrafo que explica essa relação inversa. Onde diz que, para a mesma força, quanto maior a massa, menor a aceleração? Encontre a definição física da minha resistência.",
        paragrafo_original: "Na 2ª Lei, a massa do objeto (m) é a constante de proporcionalidade da equação e é a medida da inércia de um corpo. Assim, se aplicarmos a mesma força a dois corpos com massas diferentes, o de maior massa sofrerá uma aceleração menor. Disso concluímos que aquele que tem maior massa resiste mais às variações de velocidade, logo tem maior inércia.",
        resposta: "A explicação de que a massa é a medida da inércia."
    },

    // --- NÍVEL 5: SUPER DIFÍCIL (Síntese) ---
    {
        difficulty: 5,
        titulo: "Consequências do Tratado de Versalhes",
        enigma: "Este é o paradoxo final da Grande Guerra: a paz que foi assinada não trouxe tranquilidade, mas sim a garantia de um novo apocalipse. Estamos em 1919, no Salão dos Espelhos. O documento sobre a mesa tem um nome elegante, batizado em homenagem a um palácio francês, mas o seu conteúdo é puro veneno diplomático. O texto que você procura revela a natureza punitiva deste acordo. Ele não foi negociado; foi imposto. Leia com atenção as linhas que detalham a humilhação sistemática de uma nação. Veja como a Alemanha foi desmembrada: tiraram-lhe as terras ultramarinas na África, amputaram partes do seu próprio solo europeu (como a Alsácia e Lorena) e algemaram suas forças armadas, proibindo-a de ter um exército real. E não bastasse isso, enviaram uma conta impagável, pesadas indenizações que quebrariam sua economia. Mas o verdadeiro enigma está na profecia sombria contida no final do parágrafo. Havia uma voz de razão, um líder do outro lado do Atlântico, o presidente Woodrow Wilson. Ele viu o que ninguém mais quis ver. Ele entendeu que aquela humilhação excessiva não traria paz, mas sim desejo de vingança. Ele previu o futuro. Encontre a frase onde esse presidente avisa que aquele tratado era tão humilhante que, 'em breve', causaria uma nova guerra. Encontre a semente da Segunda Guerra Mundial plantada nas cinzas da Primeira.",
        paragrafo_original: "Outra consequência da guerra foi o Tratado de Versalhes, assinado em 1919. Apesar do nome, ele foi imposto aos países derrotados. Pelo tratado, os alemães perderam suas colônias na África, parte do próprio território e foram obrigados a pagar pesadas indenizações de guerra aos vencedores. A Alsácia e Lorena passou para o controle francês. Cláusulas militares limitaram o exército alemão a 100 mil soldados... O presidente dos Estados Unidos, Woodrow Wilson, se opôs ao tratado, afirmando que este era humilhante ao povo alemão e que, em breve, uma nova guerra seria travada por causa dele.",
        resposta: "As sanções do Tratado de Versalhes e a previsão de Woodrow Wilson."
    },
    {
        difficulty: 5,
        titulo: "Natureza da Interação de Forças",
        enigma: "Chegamos ao enigma mais profundo da mecânica clássica, uma questão que confunde até estudantes universitários. É sobre a solidão das forças. A Terceira Lei diz que toda ação gera uma reação igual e contrária. Se eu puxo você com 10 Newtons, você me puxa com 10 Newtons. A pergunta filosófica é: se as forças são iguais e contrárias, por que elas não se cancelam? Por que o universo não trava em um equilíbrio estático eterno, com tudo somando zero? A resposta está escondida em uma regra fundamental sobre onde essas forças moram. O seu texto contém uma frase crucial, uma proibição absoluta da natureza. Ele explica que a interação exige necessariamente dois corpos distintos. A minha força atua em você; a sua força atua em mim. Nós nunca trocamos forças dentro de um mesmo objeto. O enigma pede que você encontre a sentença que resolve esse paradoxo. Procure a afirmação categórica que diz ser impossível que o par de ação e reação se forme no mesmo corpo. É essa regra que permite que o movimento exista. Se as forças atuassem no mesmo corpo, elas se anulariam e nada sairia do lugar. Mas como elas atuam em corpos diferentes, o jogo da dinâmica continua. Encontre a explicação sobre a 'mesma intensidade, mesma direção, porém sentidos opostos' e a regra vital sobre a separação dos corpos. Decifre o segredo do movimento.",
        paragrafo_original: "Essa lei permite-nos entender que, para que surja uma força, é necessário que dois corpos interajam, produzindo forças de ação e reação. Além disso, é impossível que um par de ação e reação forme-se no mesmo corpo. Outra informação contida no enunciado da Terceira Lei de Newton indica que os pares de ação e reação têm a mesma intensidade, mesma direção, porém sentidos opostos.",
        resposta: "A explicação de que o par ação-reação nunca atua no mesmo corpo."
    }
];