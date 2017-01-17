package com.fzj.svn.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServlet;

/**
 * 读取ini配置文件的信息
 * 
 * @author Wangshanfang 20081114
 */
public class IniReader extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private FileInputStream fileInput;
	private Properties propertise;
	private static String userHome;
	private static Logger log = LoggerFactory.getLogger(IniReader.class.getName());
	private static Calendar calendar = Calendar.getInstance();
	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
	/**
	 * 构造方法
	 * 
	 * @param path
	 *            配置文件的路径
	 * 修改：tianming 
	 * 日期：20130617
	 * 修改内容：将配置信息放到缓存中，这样每次读取配置信息就不用读文件了
	 */
	public IniReader() {
		ConcurrentHashMap<String,String> ini = null;
		CacheManager cm = CacheManager.getInstance();
		try {
		    ini = (ConcurrentHashMap<String,String>)cm.getCache().get("svn.ini");
		    if(ini==null)IniReader.reloadCacheIni("svn.ini");
		} catch (Exception e) {//如果缓存里没有ini的配置信息，重新加载
			IniReader.reloadCacheIni("svn.ini");
			//IniReader.reloadCacheIni("LOG.properties");
		}finally{
			cm = null;
		}
	}
	/**
	 * 刷新缓存配置文件信息
	 * 描述：
	 * 作者：tianming
	 * 日期：2013-6-17
	 * 修改人：tianming 
	 * 修改日期：20140523
	 * 修改日志：加载的配置文件不再从工程的WEB-INF读取，改成从【 用户主目录/cwht_dir/当前工程名 】目录加载配置文件
	 */
   public static void reloadCacheIni(String iniName){
		CacheManager cm = CacheManager.getInstance();
		Properties propertise;
		FileInputStream fileInput = null;
		File file = null;
		ConcurrentHashMap<String,String> ini = new ConcurrentHashMap<String,String>();
		try {
				int saveUrlIndex = IniReader.class.getResource("").toURI().getPath().lastIndexOf("WEB-INF");
				String path = IniReader.class.getResource("").toURI().getPath().substring(0,saveUrlIndex).replace("file:/", "");
				file = new File(path);
				if(path.indexOf("_WL_user")>-1){//针对weblogic需要向上层跳转两次才是工程的根目录
			    	file = file.getParentFile().getParentFile();
			    }
				String saveUrl = System.getProperty("user.home")+"/cwht_dir/"+file.getName()+"/"+iniName;
				System.out.println("加载配置文件："+saveUrl);
				fileInput = new FileInputStream(saveUrl);	
				propertise = new Properties();
				propertise.load(fileInput);
 
				if(propertise.containsKey("user.home") && !"".equals(propertise.getProperty("user.home"))){
					userHome = propertise.getProperty("user.home");
				}else{
					userHome = System.getProperty("user.home");
					ini.put("user.home", userHome);
				}
				
				Set<Object> keys = propertise.keySet();
				for(Object key : keys){
					ini.put((String)key,propertise.getProperty((String)key));
				}
				cm.putData(iniName,ini);
				ini = null;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (URISyntaxException e) {
			e.printStackTrace();
		}finally{
			cm = null;
			ini = null;
			propertise = null;
			file = null;
			if(fileInput!=null){
				try {
					fileInput.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	   
   }
   /**
    * 功能描述:取得指定文件的指定参数
    * @param filename
    * @param parm
    * @return
    * @author zhangjiqing
    * 2014-7-7
    */
   private String getValue(String iniName,String parm) {
	   String strValue="";
		CacheManager cm = CacheManager.getInstance();
		ConcurrentHashMap<String,String> ini = null;
		String sysUserHome = null;
		File basePath = null;
		try {
			sysUserHome = System.getProperty("user.home");
			
			ini = (ConcurrentHashMap<String,String>)cm.getCache().get(iniName);
			if(ini==null){
				IniReader.reloadCacheIni(iniName);
				ini = (ConcurrentHashMap<String,String>)cm.getCache().get(iniName);
			}
			strValue = ini.get(parm);
			if (strValue == null) {
				throw new Exception("键值不存在【"+iniName+":"+parm+"】!");
			}
			sysUserHome +="/cwht_dir";
			basePath = new File(sysUserHome);
			if(!basePath.exists()){
				basePath.mkdirs();
			}
			if(strValue.startsWith("~/")){
				strValue = strValue.replace("~",sysUserHome );
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			ini = null;
			cm = null;
			sysUserHome = null;
			basePath = null;
		}
		return strValue;
	   
   }
   
	/**
	 * 根据键值读取svn.ini对应数据
	 * 
	 * @param parm
	 * @return String类型
	 * @throws Exception
	 */
	public String getIniValue(String parm) {
		String strValue="";
		String iniName = "svn.ini";
		try {
			strValue = getValue(iniName, parm);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			iniName = null;
		}
		return strValue;
	}
	/**
	 * 取得LOG.properties的的值
	 * 
	 * @param parm
	 * @return String类型
	 * @throws Exception
	 */
	public String getLogPropertiesValue(String parm) {
		String strValue="";
		String iniName = "LOG.properties";
		try {
			strValue = getValue(iniName, parm);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			iniName = null;
		}
		return strValue;
	}
}
