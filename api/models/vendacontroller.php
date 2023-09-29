<?php

// STATUS 1 = FINALIZADO
// STATUS 2 = CANCELADO

include('../conexao/conn.php');

$requestData = $_REQUEST;

date_default_timezone_set ('America/Sao_Paulo');
$dataLocal = date('Y-m-d H:i:s', time());


if($requestData['operacao'] == 'create'){
        try{
            
            // gerar a querie de insersao no banco de dados 
            $sql = "INSERT INTO VENDA (DATA, SUBTOTAL, DESCONTO, VLRTOTAL, STATUS, ATENDENTE_ID, FPAGAMENTO_ID, CLIENTE_ID) VALUES (?, ?, ?, ?, 1, ?, ?, ?)"; 
            // preparar a querie para gerar objetos de insersao no banco de dados
        
            $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
        
            // se existir requerir os valores
            $stmt->execute([
                $dataLocal,
                $requestData['SUBTOTAL'],
                $requestData['DESCONTO'],
                $requestData['VLRTOTAL'],
                $requestData['ATENDENTE_ID'],
                $requestData['FPAGAMENTO_ID'],
                $requestData['CLIENTE_ID'],
                
            ]);

// consulta do último registro salvo na tabela VENDA
$sql = $pdo->query('SELECT * FROM VENDA ORDER BY ID DESC LIMIT 1');

// atribuindo o resultado encontrado a uma variável 
$resultado = $sql->fetch(PDO::FETCH_ASSOC);
$ID = $resultado['ID']; $ATENDENTE_ID = $resultado['ATENDENTE_ID'];

// obter a quantidade de usuários que serão cadastrados, a partir do que foi enviado pelo formulário
$indice = count($_REQUEST['PRODUTO_ID']);

// laço de repetição para percorrer todos os usuários e cadastrar na tabela TRABALHOS_USUARIOS
for ($i = 0; $i < $indice; $i++) {
    // executar a inserção das informações dos usuários na tabela TRABALHOS_USUARIOS
    $stmt = $pdo->prepare('INSERT INTO ITENSVENDA (VENDA_ID, PRODUTO_ID, DATA, ATENDENTE_ID) VALUES (?, ?, ?, ?)');

    $stmt->execute(array(
        $ID,
        $_REQUEST['PRODUTO_ID'][$i],
        $dataLocal,
        $ATENDENTE_ID
    ));
}            
        
            // tranforma os dados em um array
            $dados = array(
                'type' => 'success',
                'mensagem' => 'Registro salvo com sucesso!'
            );
            // se nao existir mostrar erro
        }catch (PDOException $e){
            $dados = array(
                'type' => 'error',
                'mensagem' => 'Erro ao salvar o registro:' .$e
            );
        }
    

    echo json_encode($dados);


}

if($requestData['operacao'] == 'read'){
    $colunas = $requestData['columns']; //Obter as colunas vindas do resquest
    //Preparar o comando sql para obter os dados da categoria
    $sql = "SELECT * FROM VENDA WHERE 1=1 ";
    //Obter o total de registros cadastrados
    $resultado = $pdo->query($sql);
    $qtdeLinhas = $resultado->rowCount();
    //Verificando se há filtro determinado
    $filtro = $requestData['search']['value'];
    if( !empty( $filtro ) ){
        //Montar a expressão lógica que irá compor os filtros
        //Aqui você deverá determinar quais colunas farão parte do filtro
        $sql .= " AND (ID LIKE '$filtro%' ";
        $sql .= " OR NOME_RAZAO LIKE '$filtro%') ";
    }
    //Obter o total dos dados filtrados
    $resultado = $pdo->query($sql);
    $totalFiltrados = $resultado->rowCount();
    //Obter valores para ORDER BY      
    $colunaOrdem = $requestData['order'][0]['column']; //Obtém a posição da coluna na ordenação
    $ordem = $colunas[$colunaOrdem]['data']; //Obtém o nome da coluna para a ordenação
    $direcao = $requestData['order'][0]['dir']; //Obtém a direção da ordenação
    //Obter valores para o LIMIT
    $inicio = $requestData['start']; //Obtém o ínicio do limite
    $tamanho = $requestData['length']; //Obtém o tamanho do limite
    //Realizar o ORDER BY com LIMIT
    $sql .= " ORDER BY $ordem $direcao LIMIT $inicio, $tamanho ";
    $resultado = $pdo->query($sql);
    $resultData = array();
    while($row = $resultado->fetch(PDO::FETCH_ASSOC)){
        $resultData[] = array_map('utf8_encode', $row);
    }
    //Monta o objeto json para retornar ao DataTable
    $dados = array(
        "draw" => intval($requestData['draw']),
        "recordsTotal" => intval($qtdeLinhas),
        "recordsFiltered" => intval($totalFiltrados),
        "data" => $resultData
    );
    echo json_encode($dados);
}

if($requestData['operacao'] == 'update'){
    
    
    try{
  
        $sql = "UPDATE VENDA SET DATA = ?, SUBTOTAL = ?, DESCONTO = ?, VLRTOTAL = ?, ATENDENTE_ID = ?, FPAGAMENTO_ID = ? CLIENTE_ID = ? WHERE ID = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $dataLocal,
            $requestData['SUBTOTAL'],
            $requestData['DESCONTO'],
            $requestData['VLRTOTAL'],
            $requestData['ATENDENTE_ID'],
            $requestData['FPAGAMENTO_ID'],
            $requestData['CLIENTE_ID'],
            $requestData['ID']
        ]);
        
    
        // tranforma os dados em um array
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Atualizado com sucesso!'
        );
        // se nao existir mostrar erro
    }catch (PDOException $e){
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao atualizar:' .$e
        );
    }
    
    
    echo json_encode($dados);



}

if($requestData['operacao'] == 'delete'){
    
    try{

        $sql = "UPDATE VENDA SET STATUS = 2 WHERE ID = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['ID'],
        ]);
        
    
        // tranforma os dados em um array
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Atualizado com sucesso!'
        );
        // se nao existir mostrar erro
    }catch (PDOException $e){
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao atualizar:' .$e
        );
    }
    
    
    echo json_encode($dados);



}