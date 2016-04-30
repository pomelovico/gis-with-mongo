<?php
/***************************************************************************************************
ShapeFile - PHP Class to read an ESRI Shapefile and its associated DBF
	Author			: Gaspare Sganga
	Version			: 1.0
	License			: MIT
	Documentation	: http://gasparesganga.com/labs/php-shapefile
****************************************************************************************************/

// =================================================================================================
// Subsitute for PHP dBase functions
if (!function_exists('dbase_open')) require_once(dirname(__FILE__).'/dbase_functions.php');
// =================================================================================================

class ShapeFile {
	
	// getShapeType return type
	const FORMAT_INT		= 0;
	const FORMAT_STR		= 1;
	// Geometry format
	const GEOMETRY_ARRAY	= 0;
	const GEOMETRY_WKT		= 1;
	
	private static $error_messages = array(
		'FILE_SHP'					=> array(11,	"Impossible to open SHP file: check if the file exists and is readable"),
		'FILE_DBF'					=> array(12,	"Impossible to open DBF file: check if the file exists and is readable"),
		'FILE_SHP_READ'				=> array(13,	"Unable to read SHP file"),
		'FILE_DBF_READ'				=> array(14,	"Unable to read DBF file"),
		'SHAPE_TYPE_NOT_SUPPORTED'	=> array(21,	"Shape Type not supported"),
		'WRONG_RECORD_TYPE'			=> array(22,	"Wrong Record's Shape Type"),
		'POLYGON_AREA_TOO_SMALL'	=> array(31,	"Polygon Area too small: can't determine vertex orientation")
	);
	private static $binary_data_lengths = array(
		'd'		=> 8,/*双精度*/
		'V'		=> 4,/*长整型，位序为big*/
		'N'		=> 4 /*长整型，位序为little*/
	);
	private static $shape_types = array( 
		0		=> 'Null',
		1		=> 'Point',
		8		=> 'MultiPoint',
		3		=> 'PolyLine',
		5		=> 'Polygon'
	);
	
	private $shp;
	private $dbf;
	private $file_size;
	private $shape_type;
	private $bbox;
	
	
	public function __construct($shp_file, $dbf_file = '')//构造函数
	{
		if ($dbf_file == '') $dbf_file = substr($shp_file, 0, -3).'dbf';
        try{
            if (!(is_readable($shp_file) && is_file($shp_file)))
                throw new Exception("SHP_FAIL_OPEN",8004);
                    /*$this->Error('FILE_SHP');*/
            if (!(is_readable($dbf_file) && is_file($dbf_file)))
                throw new Exception("DBF_FAIL_OPEN",8005);
                    /*$this->Error('FILE_DBF');*/

            $this->shp = fopen($shp_file, 'rb');/*打开shp文件*/
            if (!$this->shp) throw new Exception("SHP_FAIL_READ",8006)/*$this->Error('FILE_SHP_READ')*/;
            $this->dbf = dbase_open($dbf_file, 0);/*打开dbf文件*/
            if ($this->dbf === false) throw new Exception("DBF_FAIL_READ",8007)/*$this->Error('FILE_DBF_READ')*/;
        } catch(Exception $e){
            TriggerError($e);
        }
		
		$this->file_size = filesize($shp_file);/*记录文件大小*/
		/*读取shp文件头信息*/
		$this->LoadHeader();
	}
	
	public function __destruct()
	{
		if ($this->shp) fclose($this->shp);
		if ($this->dbf) dbase_close($this->dbf);
	}
	
	
	public function getShapeType($format = self::FORMAT_INT)
	{
		if ($format == self::FORMAT_STR) {
			return self::$shape_types[$this->shape_type];
		} else {
			return $this->shape_type;
		}
	}
	
	public function getBoundingBox()
	{
		return $this->bbox;
	}
	
	
	public function getRecord($geometry_format = self::GEOMETRY_ARRAY)
	{
		$shps = array();
		$dbfs = array();
		while(!(ftell($this->shp) >= $this->file_size)){
			$record_number	= $this->ReadData('N');
			$content_length	= $this->ReadData('N');
			$shape_type		= $this->ReadData('V');
            try{
                if ($shape_type != 0 && $shape_type != $this->shape_type)
                    throw new Exception('WRONG_RECORD_TYPE',8008);
                /*$this->Error('WRONG_RECORD_TYPE', $shape_type)*/;
            }catch (Exception $e){
                TriggerError($e);
            }

			switch ($shape_type) {
				case 0:
					$shp = null;
					break;
				case 1:
					$shp = $this->ReadPoint();
					break;
				case 8:
					$shp = $this->ReadMultiPoint();
					break;
				case 3:
					$shp = $this->ReadPolyLine();
					break;
				case 5:
					$shp = $this->ReadPolygon();
					break;
			}
			if ($geometry_format == self::GEOMETRY_WKT) $shp = $this->WKT($shp);
			$shps[] = $shp;
			$dbfs[] = dbase_get_record_with_names($this->dbf, $record_number);
	/*		return array(
				'shp'	=> $shp,
				'dbf'	=> dbase_get_record_with_names($this->dbf, $record_number)
			);
			return array(
				'shp'	=> $shp
			);*/
		}
		// if (ftell($this->shp) >= $this->file_size) return false;
		// return $shps;
		return array(
				'shp'	=> $shps,
				'dbf'	=> $dbfs
			);
	}
	
	
	/******************** PRIVATE ********************/
	/*根据类型读取数据*/
	private function ReadData($type)
	{
		/*从类的内部访问const或者static变量或者方法,那么就必须使用自引用的self
		fread(file,length)
		*/
		$data = fread($this->shp, self::$binary_data_lengths[$type]);
		if (!$data) return null;
		/*
		 unpack() 函数从二进制字符串对数据进行解包，
		unpack(format,data);
		current() 函数返回数组中的当前元素的值
		*/
		return current(unpack($type, $data));
	}
	
	private function ReadBoundingBox()
	{
		return array(
			$this->ReadData('d'),
			$this->ReadData('d'),
			$this->ReadData('d'),
			$this->ReadData('d')
		);
	}

	/*读取头文件，共100个字节，第32位置开始的4个字节是shape类型，
	后面64个字节是属性bbox的八个值（每个值8Byte），及边界值，双精度型*/
	private function LoadHeader()
	{
		/*fseek() 函数在打开的文件中定位。
		该函数把文件指针从当前位置向前或向后移动到新的位置，
		新位置从文件头开始以字节数度量。
		成功则返回 0；否则返回 -1。
		fseek(file,offset,whence);whence可选值，默认为SEEK_SET， 设定位置等于 offset 字节
		*/
        try{
            fseek($this->shp, 32, SEEK_SET);
            $this->shape_type	= $this->ReadData('V');
            if (!isset(self::$shape_types[$this->shape_type]))
                throw new Exception('SHP_TYPE_NOT_SUPPORTED',8009);
            /*$this->Error('SHAPE_TYPE_NOT_SUPPORTED', $this->shape_type)*/
            $this->bbox = $this->ReadBoundingBox();
            /*游标定位在主文件实体信息位置*/
            fseek($this->shp, 100, SEEK_SET);
        }catch (Exception $e){
            TriggerError($e);
        }

	}
	
	
	private function ReadPoint()
	{
		$x = $this->ReadData('d');
		$y = $this->ReadData('d');
		return array(
			abs($x) > 180 ? round($x/111233, 4) : round($x,4) ,
			abs($y) > 180 ? round($y/111233,4) : round($y,4)
		);
	}
	
	private function ReadMultiPoint()
	{
		// Header
		$ret = array(
			'bbox'	=> $this->ReadBoundingBox(),
			'type'  => 'MultiPoint',
			'numpoints'		=> $this->ReadData('V'),
			'points'		=> array()
		);
		// Points
		for ($i=0; $i<$ret['numpoints']; $i++) {
			$ret['points'][] = $this->ReadPoint();
		}
		return $ret;
	}
	
	private function ReadPolyLine()
	{
		// Header
		$ret = array(
			'bbox'	=> $this->ReadBoundingBox(),
			'type'  => "LineString",
			'coordinates'	=> array()
		);
		$numparts = $this->ReadData('V');/*构成当前线目标的子线段个数*/
		$tot_points = $this->ReadData('V');
		// Parts
		$parts_first_index = array();
		for ($i=0; $i<$numparts; $i++) {
			$parts_first_index[$i]	= $this->ReadData('V');
		}
		// Points
		$part = 0;
		for ($i=0; $i<$tot_points; $i++) {
			if (isset($parts_first_index[$part + 1]) && $parts_first_index[$part + 1] == $i) $part++;
			$ret['coordinates'][$part][] = $this->ReadPoint();
		}
/*		for ($i=0; $i<$ret['numparts']; $i++) {
			$ret['coordinates'][$i]['numpoints'] = count($ret['coordinates'][$i]['points']);
		}*/
		return $ret;
	}
	
	private function ReadPolygon()
	{
		// Read as Polyline
		$data = $this->ReadPolyLine();
		// Rings
		$i		= -1;
		$parts	= array();
		foreach ($data['coordinates'] as $rawpart) {
/*			if ($this->IsClockwise($rawpart['points'])) {
				$i++;
				$parts[$i] = array(
					'numrings'	=> 0,
					'rings'		=> array()
				);
			}*/
			$i++;
			$parts[$i] = $rawpart;
		}
		$numparts = count($parts);
/*		for ($i=0; $i<$numparts; $i++) {
			$parts[$i]['numrings'] = count($parts[$i]['rings']);
		}*/
		$numparts = count($parts);
		return array(
			'bbox'	=> $data['bbox'],
			'type'  => 'Polygon',
			'coordinates'	=> $parts
		);
	}
	
	private function IsClockwise($points, $exp = 1)
	{
		$num_points = count($points);
		if ($num_points < 2) return true;
		
		$num_points--;
		$tot = 0;
		for ($i=0; $i<$num_points; $i++) {
			$tot += ($exp * $points[$i][0] * $points[$i+1][1]) - ($exp * $points[$i][1] * $points[$i+1][0]);
		}
		$tot += ($exp * $points[$num_points][0] * $points[0][1]) - ($exp * $points[$num_points][1] * $points[0][0]);
		try{
            if ($tot == 0) {
                if ($exp >= 1000000000)
                    throw new Exception('POLYGON_AREA_TOO_SMALL',8010);
                return $this->IsClockwise($points, $exp * 1000);
            }
        }catch (Exception $e){
            TriggerError($e);
        }

		
		return $tot < 0; 
	}
	
	
	
	private function WKT($data)
	{
		if (!$data) return null;
		switch ($this->shape_type) {
			case 1:
				return 'POINT('.$data[0].' '.$data[1].')';
			
			case 8:
				return 'MULTIPOINT'.$this->ImplodePoints($data['points']);
			
			case 3:
				if ($data['numparts'] > 1) {
					return 'MULTILINESTRING('.$this->ImplodeParts($data['parts']).')';
				} else {
					return 'LINESTRING'.$this->ImplodeParts($data['parts']);
				}
			
			case 5:
				$wkt = array();
				foreach ($data['parts'] as $part) {
					$wkt[] = '('.$this->ImplodeParts($part['rings']).')';
				}
				if ($data['numparts'] > 1) {
					return 'MULTIPOLYGON('.implode(', ', $wkt).')';
				} else {
					return 'POLYGON'.implode(', ', $wkt);
				}
		}
	}
	
	private function ImplodeParts($parts)
	{
		$wkt = array();
		foreach ($parts as $part) {
			$wkt[] = $this->ImplodePoints($part['points']);
		}
		return implode(', ', $wkt);
	}
	
	private function ImplodePoints($points)
	{
		$wkt = array();
		foreach ($points as $point) {
			$wkt[] = $point[0].' '.$point[1];
		}
		return '('.implode(', ', $wkt).')';
	}
	
}