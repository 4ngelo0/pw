$(document).ready(function() {

    // Função para validar a sessão
    function validarSessao() {
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            url: 'api/models/atendentecontroller.php?operacao=validate',
            success: function(dados) {
                if (dados.tipo === 'error') {
                    // Redirecionar para index.html apenas se não estiver autenticado
                    window.location.href = 'index.html';
                } else {
                    Swal.fire({
                        icon: dados.type,
                        title: 'SysPed',
                        text: dados.mensagem
                    })
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Erro na requisição: " + textStatus, errorThrown);
            }
        });
    }
    // Chamar a função de validação de sessão quando a página é carregada
    validarSessao();

})