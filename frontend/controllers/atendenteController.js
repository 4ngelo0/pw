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
                $('#LOGIN').val(dados.dados.LOGIN)
                $('#SENHA').val(dados.dados.SENHA)
                $('#ID').val(dados.dados.ID)
            }
        }
    })
}


$(document).ready(function() {

    $('.btn-login').click(function(e) {
        e.preventDefault()
        let dados = $('#form-login').serialize()
        dados += `&operacao=login`
        let url = '../../../SistemaPedidos/api/models/atendentecontroller.php'
        $.ajax({
            dataType: 'JSON',
            type: 'POST',
            assync: true,
            url: url,
            data: dados,
            success: function(dados) {
                if (dados.type === 'success') {
                    $(location).attr('href', 'sistema.html')
                    console.log(dados.mensagem)
                } else {
                    Swal.fire({
                        icon: dados.type,
                        title: 'SysPed',
                        text: dados.mensagem
                    })
                }
            }
        })
    })

    $('#SAIR').click(function(e) {
        console.log('aa');
        e.preventDefault();
        dados = `&operacao=logout`
        let url = '../../../SistemaPedidos/api/models/atendentecontroller.php'
        $.ajax({
            dataType: 'JSON',
            type: 'POST',
            assync: true,
            url: url,
            data: dados,
            success: function(dados) {
                if (dados.type === 'error') {
                    $(location).attr('href', 'index.html')
                    console.log(dados.mensagem)
                } else {
                    Swal.fire({
                        icon: dados.type,
                        title: 'SysPed',
                        text: dados.mensagem
                    })
                }
            }
        })
    })


    $('#table-atendente').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "../../../SistemaPedidos/api/models/atendentecontroller.php?operacao=read",
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


    $('.btn-new').click(function(e) {
        e.preventDefault()
        $('.modal-title').empty()
        $('.modal-title').append('Cadastro de atendente')
        $('#form-atendente :input').val('')
        $('input').prop('disabled', false)
        $('.btn-save').attr('data-operation', 'create')
        $('#modal-atendente').modal('show')

        function viewAtendente(dados, url) {
            $.ajax({
                dataType: "JSON",
                type: "POST",
                async: true,
                url: url,
                data: dados,
                success: function(dados) {
                    $('#ID').empty();
                    for (const tipo of dados) {
                        let option = `<option value="${tipo.ID}">${tipo.NOME}</option>`;
                        console.log(dados)
                        $('#ID').append(option);
                    }
                }
            });
        }

        let url = '../../../SistemaPedidos/api/models/acessocontroller.php'
        dados = `&operacao=list`
        viewAtendente(dados, url);

    })
    $('.btn-save').click(function(e) {
        e.preventDefault()

        let dados = $('#form-atendente').serialize()
        dados += `&operacao=${$('.btn-save').attr('data-operation')}`
        let url = '../../../SistemaPedidos/api/models/atendentecontroller.php'
        CRUD(dados, url);
        $('#table-atendente').DataTable().ajax.reload();
    })

    //Função para visualizar os dados do Datatables
    $('#table-atendente').on('click', 'button.btn-view', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Visualização de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = '../../../SistemaPedidos/api/models/atendentecontroller.php'
        CRUD(dados, url);

        function viewAtendente(dados2, url2) {
            $.ajax({
                dataType: "JSON",
                type: "POST",
                async: true,
                url: url2,
                data: dados2,
                success: function(dados) {
                    $('#ID').empty();
                    for (const tipo of dados) {
                        let option = `<option value="${tipo.ID}">${tipo.NOME}</option>`;
                        console.log(dados)
                        $('#ID').append(option);
                    }
                }
            });
        }

        let url2 = '../../../SistemaPedidos/api/models/acessocontroller.php'
        dados2 = `&operacao=list`
        viewAtendente(dados2, url2);

        $('.btn-save').hide();
        $('input').prop('disabled', true);
        $('#modal-atendente').modal('show');
    })

    //Função para editar os dados do Datatables
    $('#table-atendente').on('click', 'button.btn-edit', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Edição de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = '../../../SistemaPedidos/api/models/atendentecontroller.php'
        CRUD(dados, url);
        $('.btn-save').attr('data-operation', 'update');
        $('.btn-save').show();
        $('input').prop('disabled', false)
        $('#modal-atendente').modal('show');
        $('#table-atendente').DataTable().ajax.reload();
    })

    //Função para excluir os dados do Datatables
    $('#table-atendente').on('click', 'button.btn-delete', function(e) {
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
                let url = '../../../SistemaPedidos/api/models/atendentecontroller.php';
                CRUD(dados, url);
                $('#table-atendente').DataTable().ajax.reload();
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