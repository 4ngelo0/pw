<?php

include('../conexao/conn.php');

$requestData = $_REQUEST;

date_default_timezone_set ('America/Sao_Paulo');
$dataLocal = date('Y-m-d H:i:s', time());


if($requestData['operacao'] == 'create'){
   
        try{
            
            // gerar a querie de insersao no banco de dados 
            $sql = "INSERT INTO ITENSVENDA (VENDA_ID, ATENDENTE_ID, PRODUTO_ID, DATA) VALUES (?, ?, ?, ?)"; // colocar ? para deixar mais seguro
            // preparar a querie para gerar objetos de insersao no banco de dados
        
            $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
        
            // se existir requerir os valores
            $stmt->execute([
                $requestData['VENDA_ID'],
                $requestData['ATENDENTE_ID'],
                $requestData['PRODUTO_ID'],
                $dataLocal
            ]);
        
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
   
    // Obter o número de colunas vinda do front-end

    $colunas = $requestData['columns'];
    // Preparar o SQL de consulta ao banco de dados

    $sql = "SELECT * FROM ITENSVENDA WHERE 1=1";

    // Obter o total de registros cadastrados
    $resultado = $pdo->query($sql);
    $qtdeLinhas = $resultado->rowCount();

    // Verificando se existe algum filtro

    $filtro = $requestData['search']['value'];

    if(isset($filtro)){

      $sql .= " AND (ID LIKE '$filtro%' ";
      $sql .= " OR DATA LIKE '$filtro%' )";

    }

    // Obter o total de registros filtrados
    $resultado = $pdo->query($sql);
    $qtdeLinhas = $resultado->rowCount();

    // Obter os valores para gerar a ordernação
    $colunaOrdem = $requestData['order'][0]['column']; // Obtém a posição da coluna na ordenação

    $ordem = $colunas[$colunaOrdem]['data']; // Obter o DATA da primeira coluna
    $direcao = $requestData['order'][0]['dir']; // Obtem a direção das nossas colunas

    // Obter os valores para o limite
    $inicio = $requestData['start'];
    $tamanho = $requestData['lenght'];

    // Realizar uma ordenação com o limite imposto
    $sql = "ORDER BY $ordem $direcao LIMIT $inicio $tamanho";
    $resultado = $pdo->query($sql);
    $dados = array();
    while($row = $resultado->fetch(PDO::FETCH_ASSOC)){
        $dados[] = array_map(null, $row);
    }

    // Criar um objeto retorno do tipo DataTables
    $json_Data = array(
        "draw" =>intval($requestData['draw']),
        "recordsTotal" =>intval($qtdeLinhas),
        "recordsFiltered" =>intval($totalFiltrados),
        "data" => $dados
    );
 echo json_encode($json_Data);
}

if($requestData['operacao'] == 'update'){
    
    
    try{
  
        $sql = "UPDATE ITENSVENDA SET DATA = ?, ATENDENTE_ID = ?, PRODUTO_ID = ? WHERE VENDA_ID = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $dataLocal,
            $requestData['ATENDENTE_ID'],
            $requestData['PRODUTO_ID'],
            $requestData['VENDA_ID']
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

        
        // gerar a querie de insersao no banco de dados 
        $sql = "DELETE FROM ITENSVENDA WHERE VENDA_ID = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['VENDA_ID']
        ]);
    
        // tranforma os dados em um array
        $dados = array(
            'type' => 'success',
            'mensagem' => 'Excluido com sucesso!'
        );
        // se nao existir mostrar erro
    }catch (PDOException $e){
        $dados = array(
            'type' => 'error',
            'mensagem' => 'Erro ao excluir o registro:' .$e
        );
    
    }
    
    echo json_encode($dados);
}