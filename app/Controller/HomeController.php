<?php
App::uses('Sanitize','Utility');

 
class HomeController extends AppController
{
	// 不适用appController的判断
	public function beforeFilter(){	
		// 判断是否手机访问
		// 判断用户登陆状态
        //pr($_COOKIE);
      
    }

    public function index(){
    	/**
		 * 检测手机型号
		 */
		$agent = "";
		if(isset($_SERVER['HTTP_USER_AGENT'])){
			$agent = strtolower($_SERVER['HTTP_USER_AGENT']);
			if(strpos($agent, "iphone")){
				$agent = '<link rel="stylesheet" href="css/iphone.css">';
			}
			else if(strpos($agent, "android")){
				$agent = '<link rel="stylesheet" href="css/android.css">';
			}
			else if(strpos($agent, "android 4")){
				$agent = '<link rel="stylesheet" href="css/android4.css">';
			}
			$agent = '<link rel="stylesheet" href="css/iphone.css">';
		}
		$this->set("agent", $agent);
    	$this->render("index");
    }

    public function items(){
        $this->autoRender = false;
        $rt_obj = array();
        // 将所有的数据放到页面上
        $items = array();
		$categories = array();
		$companies	= array();
        $company = $this->Company->find("all", array(
            'conditions'=>array(
                'status !='=>-1
            )
        ));
		foreach($company as $c){
			$companies[] = $c['Company'];
		}
        $category	= $this->Category->find("all", array(
            'conditions'=>array(
                'status'=>0
            ),
            'order'=>'priority desc',
        ));
        foreach($category as $c){
            $i = $c['Category']['id'];
			$categories[] = $c['Category'];
			$tmp = $this->Item->find("all", array(
				'fields'=>array(
					'Item.id',
                    'Item.name', 
                    'Item.image', 
                    'Item.picurl', 
                    'Item.price', 
                    'Item.cost',
                    'Item.sale', 
                    'Item.priority',
                    'Item.weight',
                    'Item.detail',
                    'Item.status',
				),
				'conditions'=>array(
					'Item.status'=>1,
					'Item.category_id'=>$i
				),
				'order'=>'priority DESC, Item.id asc'
			));
			foreach($tmp as $t){
                if($t['Item']['price'] == ''){
                    $t['Item']['price'] = $t['Item']['cost'];
                }
				$items["item_$i"][] = $t['Item'];
			}
        }

        $week = date("w");
        if($week == 0){
            $week = 7;
        }   

        $times = $this->Time->find("all", array(
            'conditions'=>array(
                'week'=>$week,
                'status'=>1
            )  
        ));
        $date = date("Ymd", time());
        foreach($times as $t){
            $t['Time']['beg_time'] = strtotime("$date ".$t['Time']['beg_time'].":00");
            $t['Time']['end_time'] = strtotime("$date ".$t['Time']['end_time'].":00");
            $rt_obj['time'][] = $t['Time'];
        }

        $rt_obj['code'] = 0;
        $rt_obj['item'] = $items;
        $rt_obj['category'] = $categories;
		$rt_obj['company'] = $companies;
        $rt_obj['showGroupon'] = false;

        $tuan = $this->Tuan->query("select * from aplan_categories where actived=1 and status!=-1");
        if($tuan){
            $rt_obj['showGroupon'] = true;
            $rt_obj['groupon'] = array('name'=>$tuan[0]['aplan_categories']['name'], 'id'=>$tuan[0]['aplan_categories']['id']);
            $rows = $this->Tuan->query("select * from aplan_items where category_id =".$tuan[0]['aplan_categories']['id']." order by priority desc");
            foreach($rows as $row){
                $rt_obj['tuanItems'][] = $row['aplan_items'];
            }
        }
        echo json_encode($rt_obj);
    }


    function isMobile() { 
        if (isset ($_SERVER['HTTP_X_WAP_PROFILE']))
        {
            return true;
        } 
        if (isset ($_SERVER['HTTP_VIA']))
        { 
            return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;
        } 
        if (isset ($_SERVER['HTTP_USER_AGENT']))
        {
            $clientkeywords = array ('nokia','sony','ericsson','mot','samsung','htc','sgh','lg','sharp','sie-','philips','panasonic','alcatel','lenovo','iphone','ipod','blackberry','meizu','android','netfront','symbian','ucweb','windowsce','palm','operamini','operamobi','openwave','nexusone','cldc','midp','wap','mobile'); 
            if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))){
                return true;
            } 
        } 
        if (isset ($_SERVER['HTTP_ACCEPT']))
        { 
            if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))){
                return true;
            } 
        } 
        return false;
    }
}
 ?>