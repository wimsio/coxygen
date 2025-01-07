<?php 

    $curl = curl_init();

    $policyHexTokenName = $_GET["policyHexTokenName"];

    $url = "https://cardano-preprod.blockfrost.io/api/v0/assets/{$policyHexTokenName}/addresses";

    curl_setopt($curl, CURLOPT_URL, $url);
    
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'project_id: preprodh0Mr07iXe1BwHLeKBKn58TYqDej2JCZm',
      'Content-Type: application/json',
      'Accept: application/json'
    ));
    
    $result = trim(curl_exec($curl));
    
    if(!$result)
    {
       die("Connection Failure");
    }
    
    curl_close($curl);
    
    echo json_encode($result);

?>

