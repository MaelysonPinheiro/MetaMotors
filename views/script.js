
// FORMULARIO CONTATO

function validarFormulario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const carroInteresse = document.getElementById('carroInteresse').value;
    const dataNascimento = document.getElementById('dataNascimento').value;

    if (nome.trim() === '' || email.trim() === '' || cpf.trim() === '' || carroInteresse.trim() === '' || dataNascimento.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
        alert('CPF inválido. Formato esperado: 123.456.789-01');
        return;
    }

    if (new Date(dataNascimento) >= new Date()) {
        alert('Data de nascimento inválida.');
        return;
    }

    alert('Formulário enviado com sucesso!');
}


document.addEventListener('DOMContentLoaded', () => {
    const cookies = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');
    prev[name] = value;
    return prev;
    }, {});

    console.log('Cookies:', cookies);

    const accountDiv = document.getElementById('account');
    accountDiv.innerHTML = ''; // Limpa o conteúdo atual

    if (cookies.isLoggedIn === 'true') {
        const username = cookies.username;

        const accountLink = document.createElement('a');
        accountLink.href = 'account.html';
        accountLink.textContent = 'My Account - ' + username;

        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Logout';
        logoutButton.style.padding = '10px 20px';
        logoutButton.style.margin = '1em';
        logoutButton.style.backgroundColor = '#007BFF';
        logoutButton.style.color = '#ffffff';
        logoutButton.style.border = 'none';
        logoutButton.style.borderRadius = '5px';
        logoutButton.style.cursor = 'pointer';
        logoutButton.style.transition = 'background-color 0.3s ease';

        logoutButton.addEventListener('mouseover', () => {
            logoutButton.style.backgroundColor = '#0056b3';
        });

        logoutButton.addEventListener('mouseout', () => {
            logoutButton.style.backgroundColor = '#007BFF';
        });

        logoutButton.addEventListener('mousedown', () => {
            logoutButton.style.backgroundColor = '#004599';
        });

        logoutButton.addEventListener('mouseup', () => {
            logoutButton.style.backgroundColor = '#0056b3';
        });

        logoutButton.addEventListener('click', () => {
            document.cookie = 'isLoggedIn=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            location.reload();
        });

        accountDiv.appendChild(accountLink);
        accountDiv.appendChild(document.createTextNode(' | '));
        accountDiv.appendChild(logoutButton);

    } else {
        accountDiv.innerHTML = '<a href="/login">LOGIN</a>';
    }
});


//product.html

document.addEventListener("DOMContentLoaded", function () {
    const marcaSelect = document.getElementById("marcaSelect");

if (marcaSelect) {
    marcaSelect.addEventListener("change", function () {
        const selectedMarca = marcaSelect.value;
        updateProductDisplay(selectedMarca);
    });
}

function updateProductDisplay(selectedMarca) {
    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(function (produto) {
        produto.style.display = "none";

    if (
        selectedMarca === "todos" ||
        produto.classList.contains(selectedMarca)
    ) {
        produto.style.display = "block";
    }
    });
}
});

function showInfo(index) {
    console.log("showInfo foi chamado com o índice:", index);
    const info = document.getElementById(`info-${index}`);
    if (info) {
        info.style.display = "block";
    }
}
function hideInfo(index) {
    const info = document.getElementById(`info-${index}`);
    if (info) {
        info.style.display = "none";
    }
}

function showCart() {
    const cart = document.getElementById("carrinho");
    if (cart.style.display === "none" || cart.style.display === "") {
        cart.style.display = "block";
    } else {
        cart.style.display = "none";
    }
}
let itemCount = 0;
let total = 0;

let carNameInCheckout = '';
let totalAmountInCheckout = 0;


function addToCart(carName, item) {
    carNameInCheckout = carName;
    const carrinho = document.getElementById("items");
    const priceElement = document.getElementById(`price-${item.split(" ")[1]}`);
    const price = parseInt(priceElement.getAttribute("data-price"));
    const li = document.createElement("li");
    const span = document.createElement("span");
    totalAmountInCheckout += price;

    span.textContent = carName;
    li.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.onclick = function () {
        removeItem(price);
        carrinho.removeChild(li);
    };
    li.appendChild(deleteBtn);

    carrinho.appendChild(li);

    itemCount++;
    document.getElementById("cartCount").textContent = itemCount;

    total += price;
    document.getElementById("total").textContent = total;
}

function removeItem(price) {
    itemCount--;
    document.getElementById("cartCount").textContent = itemCount;

    total -= price;
    document.getElementById("total").textContent = total;

    totalAmountInCheckout -= price;
}


function resetCart() {
    const carrinho = document.getElementById("items");
    carrinho.innerHTML = "";
    itemCount = 0;
    document.getElementById("cartCount").textContent = itemCount;
    total = 0;
    document.getElementById("total").textContent = total;
}

function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'block';

    document.getElementById('checkoutCarName').textContent = carNameInCheckout;
    document.getElementById('checkoutTotalAmount').textContent = totalAmountInCheckout.toFixed(2);
}

function hideCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
}

function finalizePurchase() {
    const cep = document.getElementById('cep').value;
    const paymentMethod = document.getElementById('payment').value;

    if (cep.trim() === '') {
        alert('Por favor, preencha o campo CEP.');
        return;
    }

    if (paymentMethod.trim() === '') {
        alert('Por favor, selecione um método de pagamento.');
        return;
    }

    const randomPedido = Math.floor(Math.random() * 1000000) + 1; // Gerando um número de pedido aleatório

    // Exibir a caixa de confirmação do pedido com o número de pedido aleatório
    exibirConfirmacaoPedido(randomPedido);
    hideCheckoutModal();
    resetCart();

    savePedidoToDatabase(randomPedido);
}

function savePedidoToDatabase(numeroPedido) {
    fetch('/salvar-pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numeroPedido: numeroPedido })
    })
    .then(response => {
        if (response.ok) {
            console.log('Número do pedido salvo com sucesso no banco de dados.');
        } else {
            console.error('Falha ao salvar número do pedido no banco de dados.');
        }
    })
    .catch(error => console.error('Erro ao enviar número do pedido para o servidor:', error));
}

function exibirConfirmacaoPedido(numeroPedido) {
    document.getElementById('numero-pedido').textContent = numeroPedido;
    document.getElementById('pedido-processado').style.display = 'block';

}



function showPurchaseStatusModal(message) {
    const modal = document.getElementById('purchaseStatusModal');
    const statusMessage = document.getElementById('purchaseStatusMessage');
    statusMessage.textContent = message;
    modal.style.display = 'block';
}

function hidePurchaseStatusModal() {
    const modal = document.getElementById('purchaseStatusModal');
    modal.style.display = 'none';
}

function resetCart() {
    const carrinho = document.getElementById('items');
    carrinho.innerHTML = "";
    itemCount = 0;
    document.getElementById('cartCount').textContent = itemCount;
    total = 0;
    document.getElementById('total').textContent = total;
}



async function validarFormulario() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const carroInteresse = document.getElementById('carroInteresse').value;

    // Adicione aqui suas regras de validação. Por exemplo:
    if (!nome || !email || !carroInteresse) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const response = await fetch('/enviar-contato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            email,
            carroInteresse
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert(data.message);
        window.location.href = '/contact.html';
    } else {
        alert(data.message);
    }
}



document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente carregado e analisado");

    // Adicionar Saldo
    const adicionarSaldoBtn = document.getElementById('adicionarSaldoBtn');
    const modal = document.getElementById('modalAdicionarSaldo');
    const form = document.getElementById('adicionarSaldoForm');
    const saldoAtual = document.getElementById('saldoAtual');

    console.log("adicionarSaldoBtn:", adicionarSaldoBtn);
    console.log("modal:", modal);
    console.log("form:", form);
    console.log("saldoAtual:", saldoAtual);

    if (adicionarSaldoBtn) {
        adicionarSaldoBtn.addEventListener('click', function() {
            console.log("Botão de adicionar saldo clicado");
            modal.style.display = 'block';
        });
    } else {
        console.log("Botão de adicionar saldo não encontrado");
    }

    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log("Botão de fechar clicado");
            modal.style.display = 'none';
        });
    } else {
        console.log("Botão de fechar não encontrado");
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const valorAdicionado = parseFloat(document.getElementById('saldoInput').value);

            // Enviar solicitação POST para adicionar saldo
            fetch('/account/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: valorAdicionado, paymentMethod: 'cartao' })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const novoSaldo = data.novoSaldo;
                    saldoAtual.textContent = 'Saldo Atual: $' + novoSaldo.toFixed(2);
                    modal.style.display = 'none';
                    console.log("Saldo atualizado com sucesso");
                } else {
                    console.error("Erro ao adicionar saldo:", data.message);
                }
            })
            .catch(error => {
                console.error("Erro ao adicionar saldo:", error);
            });
        });
    } else {
        console.log("Formulário não encontrado");
    }
});

//excluir conta

document.addEventListener('DOMContentLoaded', () => {
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    deleteAccountBtn.addEventListener('click', () => {
        fetch('/delete-account', {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Se a exclusão da conta for bem-sucedida, redirecione para a página index
                window.location.href = '/index';
            } else {
                // Se houver algum problema, exiba uma mensagem de erro
                console.error('Erro ao excluir conta');
                alert('Erro ao excluir conta. Por favor, tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao excluir conta:', error);
            alert('Erro ao excluir conta. Por favor, tente novamente mais tarde.');
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const updateUsernameForm = document.getElementById('updateUsernameForm');
    const updatePasswordForm = document.getElementById('updatePasswordForm');

    if (updateUsernameForm) {
        updateUsernameForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(updateUsernameForm);
            const newUsername = formData.get('newUsername');

            try {
                const response = await fetch('/update-username', {
                    method: 'POST',
                    body: JSON.stringify({ newUsername }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Nome de usuário atualizado com sucesso!');
                } else {
                    const errorMessage = await response.text();
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Erro ao atualizar nome de usuário:', error);
                alert('Erro ao atualizar nome de usuário. Por favor, tente novamente mais tarde.');
            }
        });
    }

    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(updatePasswordForm);
            const newPassword = formData.get('newPassword');

            try {
                const response = await fetch('/update-password', {
                    method: 'POST',
                    body: JSON.stringify({ newPassword }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Senha atualizada com sucesso!');
                } else {
                    const errorMessage = await response.text();
                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Erro ao atualizar senha:', error);
                alert('Erro ao atualizar senha. Por favor, tente novamente mais tarde.');
            }
        });
    }
});

const likeButtons = document.querySelectorAll('.like-btn');

// Adicionando evento de clique para cada botão de curtir
likeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const carName = button.dataset.car; // Obtém o nome do carro do atributo data-car
        const action = button.classList.contains('liked') ? 'unlike' : 'like'; // Verifica se o botão foi curtido ou não

        // Faça uma solicitação POST para o servidor
        fetch('/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ carName: carName, action: action }) // Envie o nome do carro e a ação para o servidor
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('Erro ao curtir/descurtir o carro.');
        })
        .then(message => {
            alert(message); // Exibe a mensagem de retorno do servidor
            // Atualiza a aparência do botão com base na ação realizada
            if (action === 'like') {
                button.classList.add('liked');
            } else {
                button.classList.remove('liked');
            }
        })
        .catch(error => console.error('Erro ao curtir/descurtir o carro:', error));
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const favoritosDiv = document.getElementById('favoritos');

    // Fazer requisição AJAX para recuperar os nomes dos carros
    fetch('/carros')
        .then(response => response.json())
        .then(data => {
            const carros = data.carros;

            // Limpar a div favoritos
            favoritosDiv.innerHTML = '';

            // Adicionar os nomes dos carros à div favoritos
            carros.forEach(nome => {
                const carroDiv = document.createElement('div');
                carroDiv.textContent = nome;
                favoritosDiv.appendChild(carroDiv);
            });
        })
        .catch(error => console.error('Erro ao recuperar carros favoritos:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    fetch('/pedido-recente')
        .then(response => response.json())
        .then(data => {
            if (data.numeroPedido) {
                document.getElementById('pedido-numero').textContent = `Número do Pedido: ${data.numeroPedido}`;
                document.getElementById('pedido-status').textContent = 'Status: Em Processamento';
                // Calcula e exibe a data estimada de entrega
                const dataEntrega = new Date();
                dataEntrega.setDate(dataEntrega.getDate() + 5);
                document.getElementById('pedido-status').textContent += `, Estimativa de Entrega: ${dataEntrega.toLocaleDateString()}`;
            } else {
                document.getElementById('pedido-numero').textContent = 'Nenhum pedido encontrado.';
            }
        })
        .catch(error => console.error('Erro ao recuperar pedido recente:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    const comentarioForm = document.getElementById('comentarioForm');
    const comentarioInput = document.getElementById('comentario');
    const avaliacaoInput = document.getElementById('avaliacao');
    const comentariosList = document.getElementById('comentariosList');

    if (comentarioForm && comentarioInput && avaliacaoInput) {
        comentarioForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const comentario = comentarioInput.value;
            const avaliacao = avaliacaoInput.value;

            const response = await fetch('/adicionar-comentario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({comentario, avaliacao })
            });

            if (response.ok) {
                alert('Comentário adicionado com sucesso.');
                comentarioForm.reset();
                carregarComentarios();
            } else {
                alert('Erro ao adicionar comentário.');
            }
        });

        const carregarComentarios = async () => {
            const response = await fetch('/comentarios');
            const comentarios = await response.json();
            comentariosList.innerHTML = '';
            comentarios.forEach(comentario => {
                const div = document.createElement('div');
                div.innerHTML = `<p>${comentario.comentario}</p><p>Avaliação: ${comentario.avaliacao}`;
                comentariosList.appendChild(div);
            });
        };

        // Carregar comentários quando a página é carregada
        window.onload = () => {
            carregarComentarios();
        };
    } else {
        console.error('Elementos do formulário de comentário não encontrados.');
    }
});



