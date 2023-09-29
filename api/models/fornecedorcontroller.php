<?php

include('../conexao/conn.php');

$requestData = $_REQUEST;

if($requestData['operacao'] == 'create'){
    if(empty($_REQUEST['NOME']) || empty($_REQUEST['TELEFONE']) || empty($_REQUEST['CELULAR']) || empty($_REQUEST['EMAIL'])){
        $dados = array(
            "type" => 'error',
            "mensagem" => 'Existe(m) campo(s) obrigatório(s) não preenchido(s).'
        );
    }
    else { 
        try{
            
            // gerar a querie de insersao no banco de dados 
            $sql = "INSERT INTO FORNECEDOR (NOME, TELEFONE, CELULAR, EMAIL) VALUES (?, ?, ?, ?)"; // colocar ? para deixar mais seguro
            // preparar a querie para gerar objetos de insersao no banco de dados
        
            $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
        
            // se existir requerir os valores
            $stmt->execute([
                $requestData['NOME'],
                $requestData['TELEFONE'],
                $requestData['CELULAR'],
                $requestData['EMAIL']
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
    }

    echo json_encode($dados);


}

if($requestData['operacao'] == 'read'){
   
    // Obter o número de colunas vinda do front-end

    $colunas = $requestData['columns'];
    // Preparar o SQL de consulta ao banco de dados

    $sql = "SELECT * FROM FORNECEDOR WHERE 1=1";

    // Obter o total de registros cadastrados
    $resultado = $pdo->query($sql);
    $qtdeLinhas = $resultado->rowCount();

    // Verificando se existe algum filtro

    $filtro = $requestData['search']['value'];

    if(isset($filtro)){

      $sql .= " AND (ID LIKE '$filtro%' ";
      $sql .= " OR NOME LIKE '$filtro%' )";

    }

    // Obter o total de registros filtrados
    $resultado = $pdo->query($sql);
    $qtdeLinhas = $resultado->rowCount();

    // Obter os valores para gerar a ordernação
    $colunaOrdem = $requestData['order'][0]['column']; // Obtém a posição da coluna na ordenação

    $ordem = $colunas[$colunaOrdem]['data']; // Obter o nome da primeira coluna
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
    
    if(empty($_REQUEST['NOME'])  || empty($_REQUEST['TELEFONE']) || empty($_REQUEST['CELULAR']) || empty($_REQUEST['EMAIL'])){
        $dados = array(
            "type" => 'error',
            "mensagem" => 'Existe(m) campo(s) obrigatório(s) não preenchido(s).'
        );
    }
    else {    
    try{
  
        $sql = "UPDATE FORNECEDOR SET NOME = ?, TELEFONE = ?, CELULAR = ?, EMAIL = ? WHERE ID = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['NOME'],
            $requestData['TELEFONE'],
            $requestData['CELULAR'],
            $requestData['EMAIL'],
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
    }
    
    echo json_encode($dados);



}

if($requestData['operacao'] == 'delete'){
    
    try{

        
        // gerar a querie de insersao no banco de dados 
        $sql = "DELETE FROM FORNECEDOR WHERE ID = ?";
        // preparar a querie para gerar objetos de insersao no banco de dados
    
        $stmt = $pdo->prepare($sql); // atribuindo para ver se existe
    
        // se existir requerir os valores
        $stmt->execute([
            $requestData['ID']
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