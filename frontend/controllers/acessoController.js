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
                $('#modal-acesso').modal('hide')
            } else if (dados.type == 'view') {
                $('#NOME').val(dados.dados.NOME)
                $('#LOGIN').val(dados.dados.LOGIN)
                $('#SENHA').val(dados.dados.SENHA)
                $('#ID').val(dados.dados.ID)
                $('#ID_ACESSO').val(dados.dados.ID_ACESSO)
            }
        }
    })
}

$(document).ready(function() {

    $('#table-acesso').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/acessocontroller.php?operacao=read",
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
        $('.modal-title').append('Cadastro de acesso')
        $('#form-acesso :input').val('')
        $('input').prop('disabled', false)
        $('.btn-save').attr('data-operation', 'create')
        $('#modal-acesso').modal('show')
    })
    $('.btn-save').click(function(e) {
        e.preventDefault()

        let dados = $('#form-acesso').serialize()
        dados += `&operacao=${$('.btn-save').attr('data-operation')}`
        let url = 'api/models/acessocontroller.php'
        CRUD(dados, url);
        $('#table-acesso').DataTable().ajax.reload();
    })

    //Função para visualizar os dados do Datatables
    $('#table-acesso').on('click', 'button.btn-view', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Visualização de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = 'api/models/acessocontroller.php'
        CRUD(dados, url);
        $('.btn-save').hide();
        $('input').prop('disabled', true);
        $('#modal-acesso').modal('show');
    })

    //Função para editar os dados do Datatables
    $('#table-acesso').on('click', 'button.btn-edit', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Edição de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = 'api/models/acessocontroller.php'
        CRUD(dados, url);
        $('.btn-save').attr('data-operation', 'update');
        $('.btn-save').show();
        $('input').prop('disabled', false)
        $('#modal-acesso').modal('show');
        $('#table-acesso').DataTable().ajax.reload();
    })

    //Função para excluir os dados do Datatables
    $('#table-acesso').on('click', 'button.btn-delete', function(e) {
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
                let url = 'api/models/acessocontroller.php';
                CRUD(dados, url);
                $('#table-acesso').DataTable().ajax.reload();
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