<?php

include_once('./MyLogPHP.php');

$log = new MyLogPHP_(__FILE__.'_log.txt','|','true');

$log->trace("started" ,"...started" ); 

$key = $_GET["key"];

$log->trace($key ,"key" ); 

$value = $_GET["value"];

$log->trace($value ,"value" ); 

$filename = './env/config.ini';

$log->trace($filename ,"filename" ); 

if(isset($key) && isset($value))
{
    
     $found_ = trim(getValue($key,$filename,$log));
     
     $log->trace($found_ ,"found_" ); 
     
          
     if(strcmp($found_,"none")==0)
     {
         $line = $key."<||>".$value."\n";
         
         $log->trace($line ,"line" ); 
    
        try {
    
            if (is_writable($filename)) {
        
            if (!$fp = fopen($filename, 'a')) {
                 echo "Cannot open file ($filename)";
                 exit;
            }
        
            if (fwrite($fp, $line) === FALSE) {
                echo "Cannot write to file ($filename)";
                exit;
            }
        
            fclose($fp);
            
            } else {
             echo "The file $filename is not writable";
            }
            
            $log->trace("daved" ,"saved" ); 
            
            echo "saved";
        }
        catch(Exception $e) 
        {
           $log->trace($e->getMessage() ,"e" ); 
           
           echo $e->getMessage(); 
        } 
     }
     else
     {
         $log->trace("already saved" ,"saved?" ); 
         
         echo "already saved";
     }

}
elseif(isset($key) && !isset($value))
{
   
    $found = getValue($key,$filename,$log);
    
    echo $found;
}

function getValue($key,$filename,$log)
{
    $handle = fopen($filename, "r");

    $dataValue_ = "none";

    try
    {
    
        if($handle) 
        {
            while (($line = fgets($handle)) !== false)
            {
                if(strcmp(trim($line),"")!=0)
                {
                    $key_ = explode("<||>", $line)[0];
                
                    $log->trace($key_?$key_:"" ,"key_" ); 
                    
                    $value_ = explode("<||>",$line)[1];
                    
                    $log->trace($value_?$value_:"" ,"value_" ); 
                    
                    if(strcmp($key_,$key)==0)
                    {
                        $dataValue_ = $value_;
                        
                        $log->trace($dataValue_?$dataValue_:"" ,"dataValue_" ); 
                        
                        break;
                    }  
                }

            }
        }
        
        $sendData_ = str_replace("\n", "", $dataValue_);
        
        $log->trace($sendData_?$sendData_:"" ,"sendData_" ); 
        
        fclose($handle);
        
        return $sendData_;
    
    }
    catch(Exception $e) 
    {
       $log->trace($e ,"e" ); 
       
       return $e->getMessage(); 
    }
}

?>