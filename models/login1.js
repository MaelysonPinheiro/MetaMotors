const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('./usuarios');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Tentativa de login:', { username, password });

  try {
    const user = await Usuario.findOne({ where: { username: username } });
    console.log('Usuário encontrado:', user);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        console.log('Usuário autenticado com sucesso:', user);
        res.cookie('userId', user.id);
        res.cookie('isLoggedIn', true);
        res.cookie('username', username);
        res.redirect('/account.html');  
      } else {
        console.log('Credenciais inválidas');
        res.status(401).json({ message: 'Credenciais inválidas' });
      }
    } else {
      console.log('Credenciais inválidas');
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ message: 'Erro na autenticação' });
  }
});




module.exports = router;
