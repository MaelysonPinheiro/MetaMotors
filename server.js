const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Cadastro = require('./models/cadastro');
const loginRouter = require('./models/login1');
const path = require('path');
const Contato = require('./models/contato'); 
const cookieParser = require('cookie-parser');
const Usuario = require('./models/usuarios'); 
const Carro = require('./models/carro')
const Pedido = require('./models/pedido');
const Comentario = require('./models/comentario');
const Saldo = require('./models/saldo');

// Configuração da sessão
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

function checkAuth(req, res, next) {
    if (!req.cookies.isLoggedIn) {
        return res.status(401).send('Usuário não autenticado');
    }
    next();
}

app.get('/index', checkAuth,(req, res) => {
    const isLoggedIn = req.cookies.isLoggedIn;
    const username = req.cookies.username;

    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register', (req,res) =>{
    res.render('register');
});

app.get('/login', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Usuario.create({ username, password: hashedPassword });

        res.redirect('/login');
    } catch (err) {
        res.send('Erro ao cadastrar: ' + err);
    }
});

app.get('/account', checkAuth, (req, res) => {
    const isLoggedIn = req.cookies.isLoggedIn;
    const username = req.cookies.username;
    
    // Renderizar a página de conta do usuário
    res.render('account', { username: username });
});



app.post('/enviar-contato', (req, res) => {
    const { nome, email, carroInteresse } = req.body;

    Contato.create({
        nome,
        email,
        carro_interesse: carroInteresse
    })
    .then(() => {
        res.status(200).send({ message: 'Em breve entraremos em contato' });
    })
    .catch(err => {
        res.status(500).send({ message: 'Erro ao enviar formulário de contato' });
    });
});

app.delete('/delete-account', (req, res) => {
    try {
        // Verifique se o usuário está autenticado antes de permitir a exclusão
        if (!req.cookies.isLoggedIn) {
            return res.status(401).send({ message: 'Usuário não autenticado' });
        }

        // Obtenha o ID do usuário autenticado
        const userId = req.cookies.userId;

        // Exclua o usuário do banco de dados
        Usuario.destroy({
            where: {
                id: userId
            }
        })
        .then(() => {
            // Limpe os cookies de autenticação após a exclusão do usuário
            res.clearCookie('isLoggedIn');
            res.clearCookie('userId');
            res.clearCookie('username');

            res.status(200).send({ message: 'Conta excluída com sucesso' });
        })
        .catch(err => {
            console.error('Erro ao excluir conta:', err);
            res.status(500).send({ message: 'Erro ao excluir conta' });
        });
    } catch (error) {
        console.error('Erro ao processar a exclusão da conta:', error);
        res.status(500).send({ message: 'Erro ao processar a exclusão da conta' });
    }
});


app.post('/update-username', (req, res) => {
    const userId = req.cookies.userId; // ou qualquer outra forma de identificar o usuário
    const newUsername = req.body.newUsername;

    // Atualize o nome de usuário no banco de dados
    Usuario.update({ username: newUsername }, { where: { id: userId } })
        .then(() => {
            res.status(200).send({ message: 'Nome de usuário atualizado com sucesso' });
        })
        .catch(err => {
            console.error('Erro ao atualizar nome de usuário:', err);
            res.status(500).send({ message: 'Erro ao atualizar nome de usuário' });
        });
});

app.post('/update-password', (req, res) => {
    const userId = req.cookies.userId; // ou qualquer outra forma de identificar o usuário
    const newPassword = req.body.newPassword;

    // Atualize a senha no banco de dados
    Usuario.update({ password: newPassword }, { where: { id: userId } })
        .then(() => {
            res.status(200).send({ message: 'Senha atualizada com sucesso' });
        })
        .catch(err => {
            console.error('Erro ao atualizar senha:', err);
            res.status(500).send({ message: 'Erro ao atualizar senha' });
        });
});


app.post('/like', async (req, res) => {
    try {
        const carName = req.body.carName;

        // Insira o nome do carro na tabela carros
        await Carro.create({ nome: carName });

        res.status(200).send('Carro curtido com sucesso!');
    } catch (error) {
        console.error('Erro ao curtir o carro:', error);
        res.status(500).send('Erro ao curtir o carro. Por favor, tente novamente mais tarde.');
    }
});

// Rota para recuperar os nomes dos carros favoritos
app.get('/carros', async (req, res) => {
    try {
        // Consultar todos os registros na tabela carros e retornar apenas os nomes
        const carros = await Carro.findAll({ attributes: ['nome'] });

        // Extrair os nomes dos carros e enviá-los como resposta
        const nomesCarros = carros.map(carro => carro.nome);
        res.json({ carros: nomesCarros });
    } catch (error) {
        console.error('Erro ao recuperar nomes de carros:', error);
        res.status(500).json({ message: 'Erro ao recuperar nomes de carros' });
    }
});

app.post('/salvar-pedido', async (req, res) => {
    try {
        const { numeroPedido } = req.body;
        await Pedido.create({ numero: numeroPedido });
        res.status(200).send('Número do pedido salvo com sucesso no banco de dados.');
    } catch (error) {
        console.error('Erro ao salvar número do pedido no banco de dados:', error);
        res.status(500).send('Erro ao salvar número do pedido no banco de dados.');
    }
});

app.get('/pedido-recente', async (req, res) => {
    try {
        const pedido = await Pedido.findAll();
        if (pedido) {
            const numeroPedido = pedido.numero;
            res.status(200).json({ numeroPedido: numeroPedido });
        } else {
            res.status(404).json({ message: 'Nenhum pedido encontrado' });
        }
    } catch (error) {
        console.error('Erro ao recuperar pedido mais recente:', error);
        res.status(500).json({ message: 'Erro ao recuperar pedido mais recente' });
    }
});

app.post('/adicionar-comentario', async (req, res) => {
    try {
        const { comentario, avaliacao } = req.body;
        await Comentario.create({ comentario, avaliacao });
        res.status(200).send('Comentário adicionado com sucesso.');
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).send('Erro ao adicionar comentário.');
    }
});

// Rota para obter todos os comentários
app.get('/comentarios', async (req, res) => {
    try {
        const comentarios = await Comentario.findAll();
        res.status(200).json(comentarios);
    } catch (error) {
        console.error('Erro ao obter comentários:', error);
        res.status(500).send('Erro ao obter comentários.');
    }
});

app.get('/account/balance', async (req, res) => {
    try {
        const userId = req.cookies.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        const saldo = await Saldo.findOne({ where: { user_id: userId } });
        if (saldo) {
            res.status(200).json({ balance: parseFloat(saldo.balance) });
        } else {
            res.status(404).json({ message: 'Saldo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter saldo:', error);
        res.status(500).json({ message: 'Erro ao obter saldo' });
    }
});

app.post('/account/deposit', async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { amount, paymentMethod } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        let saldo = await Saldo.findOne({ where: { user_id: userId } });
        if (saldo) {
            saldo.balance += parseFloat(amount);
            await saldo.save();
        } else {
            saldo = await Saldo.create({ user_id: userId, balance: amount });
        }

        // Aqui você pode adicionar lógica para lidar com o método de pagamento, se necessário

        res.status(200).json({ success: true, message: 'Saldo adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar saldo:', error);
        res.status(500).json({ success: false, message: 'Erro ao adicionar saldo' });
    }
});

app.use(loginRouter);

const port = 8000;
app.listen(port , ()=>{
    console.log('Servidor iniciado na porta 8000');
});
