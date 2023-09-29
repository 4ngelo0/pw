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
                $('#modal-produto').modal('hide')
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

    $('#table-produto').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "api/models/produtocontroller.php?operacao=read",
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
        $('.modal-title').append('Cadastro de Forma de Pagamento')
        $('#form-produto :input').val('')
        $('input').prop('disabled', false)
        $('.btn-save').attr('data-operation', 'create')
        $('#modal-produto').modal('show')
    })
    $('.btn-save').click(function(e) {
        e.preventDefault()

        let dados = $('#form-produto').serialize()
        dados += `&operacao=${$('.btn-save').attr('data-operation')}`
        let url = 'api/models/produtocontroller.php'
        CRUD(dados, url);
        $('#table-produto').DataTable().ajax.reload();
    })

    //Função para visualizar os dados do Datatables
    $('#table-produto').on('click', 'button.btn-view', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Visualização de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = 'api/models/produtocontroller.php'
        CRUD(dados, url);
        $('.btn-save').hide();
        $('input').prop('disabled', true);
        $('#modal-produto').modal('show');
    })


    //Função para editar os dados do Datatables
    $('#table-produto').on('click', 'button.btn-edit', function(e) {
        e.preventDefault();
        $('.modal-title').empty();
        $('.modal-title').append('Edição de registros');

        let dados = `ID=${$(this).attr('id')}&operacao=view`
        let url = 'api/models/produtocontroller.php'
        CRUD(dados, url);
        $('.btn-save').attr('data-operation', 'update');
        $('.btn-save').show();
        $('input').prop('disabled', false)
        $('#modal-produto').modal('show');
        $('#table-produto').DataTable().ajax.reload();
    })

    //Função para excluir os dados do Datatables
    $('#table-produto').on('click', 'button.btn-delete', function(e) {
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
                let url = 'api/models/produtocontroller.php';
                CRUD(dados, url);
                $('#table-produto').DataTable().ajax.reload();
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