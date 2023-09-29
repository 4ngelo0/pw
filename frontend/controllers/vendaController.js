function CRUD(dados, url) {
    $.ajax({
        dataType: 'JSON',
        type: 'POST',
        assync: true,
        url: url,
        data: dados,
        success: function(dados) {
            if (dados.mensagem != '') {
                Swal.fire({
                    icon: dados.type,
                    title: 'Sistema de Pedidos',
                    text: dados.mensagem
                })
                $('#modal-vendas').modal('hide')
            } else if (dados.type == 'view') {
                $('#NOME').val(dados.dados.NOME)
                $('#UNDVENDA').val(dados.dados.UNDVENDA)
                $('#VLRVENDA').val(dados.dados.VLRVENDA)
                $('#ID').val(dados.dados.ID)
            }
        }
    })
}

$(document).ready(function() {
    var contadorCampos = 1;

    $('#table-vendas').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            // "url": "api/models/vendascontroller.php?operacao=read",
            "url": "../../../pw/api/models/vendacontroller.php?operacao=read",
            "type": "POST"
        },
        "language": {
            "url": "assets/vendor/DataTables/pt-BR.json"
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [{
                "data": 'ID',
                "className": 'text-center'
            },
            {
                "data": 'NOME',
                "className": 'text-left'
            },
            {
                "data": 'ID',
                "orderable": false,
                "searchable": false,
                "className": 'text-center',
                "render": function(data, type, row, meta) {
                    return `
                    <button id="${data}" class="btn btn-info btn-sm btn-view">Visualizar</button>
                    <button id="${data}" class="btn btn-primary btn-sm btn-edit">Editar</button>
                    <button id="${data}" class="btn btn-danger btn-sm btn-delete">Excluir</button>
                    `
                }
            }
        ]
    })


    var contador = 1;
    // $('.add-int').click(function(e) {
    $(document).off('click', '.add-int').on('click', '.add-int', function(e) {
        e.preventDefault();
        contador++;
        var novoinput = `
        <select name="CLIENTE_ID" class="form-control col-1 mx-1" id="CLIENTE"></select>
        <input id="QUANT" class="form-control col-1 mx-1" type="text" name="QUANT">
        <input id="QUANT" class="form-control col-1 mx-1" type="text" name="QUANT">
        `

        $('.novos-campos').append(novoinput);
        feather.replace();
    });

    $('.btn-new').click(function(e) {
        e.preventDefault()
        $('.modal-title').empty()
        $('.modal-title').append('Cadastro de Venda')
        $('#form-vendas :input').val('')
        $('input').prop('disabled', false)
        $('.btn-save').attr('data-operation', 'create')
        $('#modal-vendas').modal('show')

        $.ajax({
            dataType: "JSON",
            type: "POST",
            async: true,
            url: '../../../pw/api/models/fPagamentocontroller.php',
            data: '&operacao=list',
            success: function(dados) {
                $('#FPAGAMENTO_ID').empty();
                for (const pagamento of dados) {
                    let option = `<option value="${pagamento.ID}">${pagamento.NOME}</option>`;
                    console.log(dados)
                    $('#FPAGAMENTO_ID').append(option);
                }
            }
        })

        $.ajax({
            dataType: "JSON",
            type: "POST",
            async: true,
            url: '../../../pw/api/models/atendentecontroller.php',
            data: '&operacao=list',
            success: function(dados) {
                $('#ATENDENTE_ID').empty();
                for (const tipo of dados) {
                    let option = `<option value="${tipo.ID}">${tipo.NOME}</option>`;
                    // console.log(dados)
                    $('#ATENDENTE_ID').append(option);
                }
            }
        })

        $.ajax({
            dataType: "JSON",
            type: "POST",
            async: true,
            url: '../../../pw/api/models/clientecontroller.php',
            data: '&operacao=list',
            success: function(dados) {
                $('#CLIENTE').empty();
                for (const tipo of dados) {
                    let option = `<option value="${tipo.ID}">${tipo.NOME}</option>`;
                    // console.log(dados)
                    $('#CLIENTE').append(option);
                }
            }
        })


    })

    $.ajax({
        dataType: "JSON",
        type: "POST",
        async: true,
        url: '../../../pw/api/models/produtocontroller.php',
        data: '&operacao=list',
        success: function(dados) {
            $('#PRODUTO').empty();
            for (const produto of dados) {
                let option = `<option value="${produto.ID}" data-valor="${produto.VLRVENDA}">${produto.NOME}</option>`;
                $('#PRODUTO').append(option);
            }
        }
    });


    $(document).ready(function() {

        // Função para calcular o subtotal

        // Função para calcular o subtotal e total com desconto
        function calcular() {
            var subtotal = 0;
            var total = 0;

            // Percorre todos os campos de quantidade e produtos
            $('.novos-campos').each(function() {
                var quantidade = parseFloat($(this).find('.quantidade-produto').val()) || 0;
                var valorProduto = parseFloat($(this).find('.produto-valor').val()) || 0;

                subtotal += quantidade * valorProduto;
            });

            // Obtém o valor do desconto (em porcentagem)
            var desconto = parseFloat($('#desconto').val()) || 0;

            // Calcula o total após aplicar o desconto
            total = subtotal - (subtotal * (desconto / 100));

            // Atualize os elementos HTML com os valores calculados
            $('#SUBTOTAL').val(subtotal.toFixed(2));
            $('#VLRTOTAL').val(total.toFixed(2));


        }
        $('.btn-verificar').click(function() {
            calcular()
        });


        // Função para clonar campos de produto
        $('.btn-add-produto').click(function() {
            contadorCampos++;
            var novoCampo = `
            <div class="form-group-novos-campos">
                        <div class="novos-campos">
                            <div class="row row-produtos mx-1">
                                <label for="PRODUTO">Produtos</label>
                                <select name="PRODUTO[]" class="form-control col-5 mx-1 produto-select" id="PRODUTO_${contadorCampos}"></select>
                                <label for="VALOR">Valor</label>
                                <input id="VALOR_PRODUTO_${contadorCampos}" class="form-control col-3 mx-1 produto-valor" type="text" name="VALOR" readonly>
                                <label for="QUANT">Quantidade</label>
                                <input id="QUANT" class="form-control col-3 mx-1 quantidade-produto" type="text" name="QUANT" >
                            </div>
            `;
            $('.novos-campos:last').after(novoCampo);

            // Recarrega a lista de produtos no novo campo
            carregarListaProdutos(`#PRODUTO_${contadorCampos}`);

            // Chama a função calcularSubtotal após adicionar um novo produto

        });


        // Função para carregar a lista de produtos em um campo de seleção
        function carregarListaProdutos(seletor) {
            $.ajax({
                dataType: "JSON",
                type: "POST",
                async: true,
                url: '../../../pw/api/models/produtocontroller.php',
                data: '&operacao=list',
                success: function(dados) {
                    var selectProduto = $(seletor);
                    selectProduto.empty();
                    for (const produto of dados) {
                        let option = `<option value="${produto.ID}" data-valor="${produto.VLRVENDA}">${produto.NOME}</option>`;
                        selectProduto.append(option);
                    }
                }
            });


        }

        // Quando o documento carrega, carregue a lista de produtos no primeiro campo
        carregarListaProdutos('#PRODUTO');

        // Manipula mudanças nos campos de seleção de produto
        $(document).on('change', '.produto-select', function() {
            var $selectedOption = $(this).find('option:selected');
            var valorProduto = $selectedOption.data('valor');
            $(this).closest('.novos-campos').find('.produto-valor').val(valorProduto);
        });
    });



    $('.btn-save').click(function(e) {
        e.preventDefault()

        let dados = $('#form-vendas').serialize()
        dados += `&operacao=${$('.btn-save').attr('data-operation')}`
        let url = '../../../pw/api/models/vendacontroller.php'
        CRUD(dados, url);
        $('#table-vendas').DataTable().ajax.reload();
    })

    //Função para visualizar os dados do Datatables
    $('#table-vendas').on('click', 'button.btn-view', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Visualização de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = '../../../pw/api/models/vendacontroller.php'
        CRUD(dados, url);
        $('.btn-save').hide();
        $('input').prop('disabled', true);
        $('#modal-vendas').modal('show');
    })


    //Função para editar os dados do Datatables
    $('#table-vendas').on('click', 'button.btn-edit', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Edição de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = '../../../pw/api/models/vendacontroller.php'
        CRUD(dados, url);
        $('.btn-save').attr('data-operation', 'update');
        $('.btn-save').show();
        $('input').prop('disabled', false)
        $('#modal-vendas').modal('show');
        $('#table-vendas').DataTable().ajax.reload();
    })

    //Função para excluir os dados do Datatables
    $('#table-vendas').on('click', 'button.btn-delete', function(e) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Deseja realmente excluir este registro?',
            showCancelButton: true,
            cancelButtonColor: 'Cancelar',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                let dados = `ID=${$(this).attr('id')}&operacao=delete`;
                let url = '../../../pw/api/models/vendacontroller.php';
                CRUD(dados, url);
                $('#table-vendas').DataTable().ajax.reload();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    icon: 'error',
                    title: 'Atenção',
                    text: 'Operação cancelada'
                })
            }
        })

    });
})