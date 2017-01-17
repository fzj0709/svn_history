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
 * ��ȡini�����ļ�����Ϣ
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
	 * ���췽��
	 * 
	 * @param path
	 *            �����ļ���·��
	 * �޸ģ�tianming 
	 * ���ڣ�20130617
	 * �޸����ݣ���������Ϣ�ŵ������У�����ÿ�ζ�ȡ������Ϣ�Ͳ��ö��ļ���
	 */
	public IniReader() {
		ConcurrentHashMap<String,String> ini = null;
		CacheManager cm = CacheManager.getInstance();
		try {
		    ini = (ConcurrentHashMap<String,String>)cm.getCache().get("svn.ini");
		    if(ini==null)IniReader.reloadCacheIni("svn.ini");
		} catch (Exception e) {//���������û��ini��������Ϣ�����¼���
			IniReader.reloadCacheIni("svn.ini");
			//IniReader.reloadCacheIni("LOG.properties");
		}finally{
			cm = null;
		}
	}
	/**
	 * ˢ�»��������ļ���Ϣ
	 * ������
	 * ���ߣ�tianming
	 * ���ڣ�2013-6-17
	 * �޸��ˣ�tianming 
	 * �޸����ڣ�20140523
	 * �޸���־�����ص������ļ����ٴӹ��̵�WEB-INF��ȡ���ĳɴӡ� �û���Ŀ¼/cwht_dir/��ǰ������ ��Ŀ¼���������ļ�
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
				if(path.indexOf("_WL_user")>-1){//���weblogic��Ҫ���ϲ���ת���β��ǹ��̵ĸ�Ŀ¼
			    	file = file.getParentFile().getParentFile();
			    }
				String saveUrl = System.getProperty("user.home")+"/cwht_dir/"+file.getName()+"/"+iniName;
				System.out.println("���������ļ���"+saveUrl);
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
    * ��������:ȡ��ָ���ļ���ָ������
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
				throw new Exception("��ֵ�����ڡ�"+iniName+":"+parm+"��!");
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
	 * ���ݼ�ֵ��ȡsvn.ini��Ӧ����
	 * 
	 * @param parm
	 * @return String����
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
	 * ȡ��LOG.properties�ĵ�ֵ
	 * 
	 * @param parm
	 * @return String����
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
