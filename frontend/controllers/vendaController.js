$(document).ready(function() {
    function CRUD(dados, url) {
        $.ajax({
            dataType: 'JSON',
            type: 'POST',
            async: true,
            url: url,
            data: dados,
            success: function(dados) {
                if (dados.mensagem != '') {
                    Swal.fire({
                        icon: dados.type,
                        title: 'Sistema de Pedidos',
                        text: dados.mensagem
                    })
                    $('#modal-vendas').modal('hide');
                } else if (dados.type == 'view') {
                    // Preencha os campos do modal com os dados recebidos
                    $('#ID').val(dados.dados.ID);
                    $('#DESCONTO').val(dados.dados.DESCONTO);
                    $('#SUBTOTAL').val(dados.dados.SUBTOTAL);
                    $('#VLRTOTAL').val(dados.dados.VLRTOTAL);
                    // Preencha os campos adicionais do modal com os dados necessários

                    // Carregue os dados dos atendentes
                    $.ajax({
                        dataType: 'JSON',
                        type: 'POST',
                        async: true,
                        url: '../../../pw/api/models/atendentecontroller.php?operacao=list',
                        success: function(atendenteDados) {
                            $('#ATENDENTE_ID').empty();
                            for (const atendente of atendenteDados) {
                                let option = `<option value="${atendente.ID}" ${dados.dados.ATENDENTE_ID == atendente.ID ? 'selected' : ''}>${atendente.NOME}</option>`;
                                $('#ATENDENTE_ID').append(option);
                            }
                        }
                    });

                    // Carregue os dados dos clientes
                    $.ajax({
                        dataType: 'JSON',
                        type: 'POST',
                        async: true,
                        url: '../../../pw/api/models/clientecontroller.php?operacao=list',
                        success: function(clienteDados) {
                            $('#CLIENTE').empty();
                            for (const cliente of clienteDados) {
                                let option = `<option value="${cliente.ID}" ${dados.dados.CLIENTE_ID == cliente.ID ? 'selected' : ''}>${cliente.NOME}</option>`;
                                $('#CLIENTE').append(option);
                            }
                        }
                    });

                    // Carregue os dados das formas de pagamento
                    $.ajax({
                        dataType: 'JSON',
                        type: 'POST',
                        async: true,
                        url: '../../../pw/api/models/fPagamentocontroller.php?operacao=list',
                        success: function(formaPagamentoDados) {
                            $('#FPAGAMENTO_ID').empty();
                            for (const formaPagamento of formaPagamentoDados) {
                                let option = `<option value="${formaPagamento.ID}" ${dados.dados.FPAGAMENTO_ID == formaPagamento.ID ? 'selected' : ''}>${formaPagamento.NOME}</option>`;
                                $('#FPAGAMENTO_ID').append(option);
                            }
                        }
                    });

                    // Resto do código para preencher os campos do modal e tratar eventos
                }
            }
        });
    }

    $('#table-vendas').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "../../../pw/api/models/vendacontroller.php?operacao=read",
            "type": "POST"
        },
        "language": {
            "url": "../../../pw/assets/vendor/DataTables/pt-BR.json"
        },
        "order": [
            [0, "desc"]
        ],
        "columns": [
            { "data": 'ID', "className": 'text-center' },
            { "data": 'DATA', "className": 'text-center' },
            { "data": 'SUBTOTAL', "className": 'text-center' },
            { "data": 'DESCONTO', "className": 'text-center' },
            { "data": 'VLRTOTAL', "className": 'text-center' },
            { "data": 'STATUS', "className": 'text-center' },
            { "data": 'ATENDENTE_NOME', "className": 'text-center' }, // Exibir o nome do atendente
            { "data": 'FPAGAMENTO_NOME', "className": 'text-center' }, // Exibir o nome da forma de pagamento
            { "data": 'CLIENTE_NOME', "className": 'text-center' }, // Exibir o nome do cliente
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
                    `;
                }
            }
        ]
    });


    $('.btn-new').click(function(e) {
        e.preventDefault()
        $('.modal-title').empty()
        $('.modal-title').append('Cadastro de Venda')
        $('#form-vendas :input').val('')
        $('input').prop('disabled', false)
        $('select').prop('disabled', false)
        $('.btn-save').attr('data-operation', 'create')
        $('#modal-vendas').modal('show')
        $('.btn-add-produto, .btn-verificar').show();

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
        function calcular() {
            var subtotal = 0;
            var total = 0;

            // Percorre todos os campos de quantidade e produtos
            $('.novos-campos').each(function() {
                var quantidade = parseFloat($(this).find('.quantidade-produto').val()) || 0;
                var valorProduto = parseFloat($(this).find('.produto-valor').val()) || 0;
                subtotal = quantidade * valorProduto;
            });

            // Obtém o valor do desconto (em porcentagem)
            var desconto = parseFloat($('#DESCONTO').val()) || 0;

            // Calcula o total após aplicar o desconto
            total = subtotal - (subtotal * (desconto / 100));

            // Atualize os elementos HTML com os valores calculados
            $('#SUBTOTAL').empty().val(subtotal.toFixed(2));
            $('#VLRTOTAL').empty().val(total.toFixed(2));


        }
        $('.btn-verificar').click(function() {
            calcular()
        });


        contadorCampos = 1;
        // Função para clonar campos de produto
        $('.btn-add-produto').click(function() {
            contadorCampos++;
            var novoCampo = `
            <div class="form-group-novos-campos">
                        <div class="novos-campos">
                            <div class="row row-produtos mx-1">
                                <label for="PRODUTO_ID[]">Produtos</label>
                                <select name="PRODUTO_ID[]" class="form-control col-12 mx-1 produto-select" id="PRODUTO_${contadorCampos}"></select>
                                <label for="VALOR">Valor</label>
                                <input id="VALOR_PRODUTO_${contadorCampos}" class="form-control col-4 mx-1 produto-valor" type="text" name="VALOR" readonly>
                                <label for="QUANT[]">Quantidade</label>
                                <input id="QUANT" class="form-control col-4 mx-1 quantidade-produto" type="text" name="QUANT[]" >
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
        $('select').prop('disabled', true);
        $('#modal-vendas').modal('show');
        $('.btn-add-produto, .btn-verificar').hide();
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
        $('input, select').prop('disabled', false)
        $('#SUBTOTAL, #VLRTOTAL').prop('disabled', true)
        $('.btn-add-produto, .btn-verificar').show();
        $('#modal-vendas').modal('show');
        $('#table-vendas').DataTable().ajax.reload();
    })

    //Função para excluir os dados do Datatables
    $('#table-vendas').on('click', 'button.btn-delete', function(e) {
        e.preventDefault();
        console.log('foi')
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Deseja realmente excluir esta venda?',
            showCancelButton: true,
            cancelButtonColor: 'Cancelar',
            confirmButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('foi 2')
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