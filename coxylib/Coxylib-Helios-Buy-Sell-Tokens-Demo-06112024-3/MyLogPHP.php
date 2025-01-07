<?php
/**
 * MyLogPHP 1.2.5
 *
 * MyLogPHP is a single PHP class to easily keep log files in CSV format.
 *
 * @package    MyLogPHP
 * @subpackage Common
 * @author     Lawrence Lagerlof <llagerlof@gmail.com>
 * @copyright  2014 Lawrence Lagerlof
 * @link       http://github.com/llagerlof/MyLogPHP
 * @license    http://opensource.org/licenses/BSD-3-Clause New BSD License
 */

class MyLogPHP_ {

	/**
	 * Name of the file where the message logs will be appended.
	 * @access private
	 */
	private $LOGFILENAME;

	/**
	 * Define the separator for the fields. Default is comma (,).
	 * @access private
	 */
	private $SEPARATOR;
	
	/**
	 * define a flag to turn on logging and turn off logging
	 * @access private
	 */
	private $LOGOFF;

	/**
	 * The first line of the log file.
	 * @access private
	 */
	private $HEADERS;

	/* @const Default tag. */
	const DEFAULT_TAG = '--';

	/**
	 * Constructor
	 * @param string $logfilename Path and name of the file log.
	 * @param string $separator Character used for separate the field values.
	 */
	function __construct($logfilename = './_MyLogPHP-1.2.log.csv', $separator = ',', $logoff='false') {

		$this->LOGFILENAME = $logfilename;
		$this->SEPARATOR = $separator;
		$this->HEADERS =
			'DATETIME' . $this->SEPARATOR . 
			'ERRORLEVEL' . $this->SEPARATOR .
			'TAG' . $this->SEPARATOR .
			'VALUE' . $this->SEPARATOR .
			'LINE' . $this->SEPARATOR .
			'FILE';
		$this->LOGOFF = $logoff;
	}

	/**
	 * Private method that will write the text messages into the log file.
	 * 
	 * @param string $errorlevel There are 4 possible levels: INFO, WARNING, DEBUG, ERROR
	 * @param string $value The value that will be recorded on log file.
	 * @param string $tag Any possible tag to help the developer to find specific log messages.
	 */
	private function log($errorlevel = 'INFO', $value = '', $tag) {

		if(trim($this->LOGOFF) == trim('false'))
		{
						
			$datetime = @date("Y-m-d H:i:s");
			if (!file_exists($this->LOGFILENAME)) {
				$headers = $this->HEADERS . "\n";
			}
	
			$fd = fopen($this->LOGFILENAME, "a");
	
			if (@$headers) {
				fwrite($fd, $headers);
			}
	
			$debugBacktrace = debug_backtrace();
			$line = $debugBacktrace[1]['line'];
			$file = $debugBacktrace[1]['file'];
	
			$value = preg_replace('/\s+/', ' ', trim($value));
			
			if(empty($value))
			{
				$value = ' *** ERROR_EMPTY_VALUE *** ';
			}
			$entry = array($datetime,$errorlevel,$tag,$value,$line,$file);
	
			fputcsv($fd, $entry, $this->SEPARATOR);
			
			//also display
			print '<br> <br> Date: '.$datetime.' Error Level: '.$errorlevel.' Title: '.$tag. ' Value: '.$value.' Line no: '.$line.' File: '.$file.'';

			fclose($fd);
		}
		else
		{
		  //leave this blank so that no logging to file takes plages
		}
	}

	/**
	 * Function to write non INFOrmation messages that will be written into $LOGFILENAME.
	 * 
	 * @param string $value
	 * @param string $tag 
	 */
	function info($value = '', $tag = self::DEFAULT_TAG) {

		self::log('INFO', $value, $tag);
	}
	function trace($value = '', $tag = self::DEFAULT_TAG) {

		self::log('TRACE', $value, $tag);
	}

	/**
	 * Function to write WARNING messages that will be written into $LOGFILENAME.
	 *
	 * Warning messages are for non-fatal errors, so, the script will work properly even
	 * if WARNING errors appears, but this is a thing that you must ponderate about.
	 * 
	 * @param string $value
	 * @param string $tag 
	 */
	function warning($value = '', $tag = self::DEFAULT_TAG) {

		self::log('WARNING', $value, $tag);
	}

	/**
	 * Function to write ERROR messages that will be written into $LOGFILENAME.
	 *
	 * These messages are for fatal errors. Your script will NOT work properly if an ERROR happens, right?
	 * 
	 * @param string $value
	 * @param string $tag 
	 */
	function error($value = '', $tag = self::DEFAULT_TAG) {

		self::log('ERROR', $value, $tag);
	}

	/**
	 * Function to write DEBUG messages that will be written into $LOGFILENAME.
	 *
	 * DEBUG messages are for variable values and other technical issues.
	 * 
	 * @param string $value
	 * @param string $tag 
	 */
	function debug($value = '', $tag = self::DEFAULT_TAG) {

		self::log('DEBUG', $value, $tag);
	}
	
	 public function __destruct() {
        //
    }
}
?>