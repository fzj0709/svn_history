package com.fzj.svn.bo;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.tmatesoft.svn.core.SVNException;
import org.tmatesoft.svn.core.SVNLogEntry;
import org.tmatesoft.svn.core.SVNLogEntryPath;
import org.tmatesoft.svn.core.SVNURL;
import org.tmatesoft.svn.core.auth.ISVNAuthenticationManager;
import org.tmatesoft.svn.core.internal.io.dav.DAVRepositoryFactory;
import org.tmatesoft.svn.core.internal.io.fs.FSRepositoryFactory;
import org.tmatesoft.svn.core.internal.io.svn.SVNRepositoryFactoryImpl;
import org.tmatesoft.svn.core.io.SVNRepository;
import org.tmatesoft.svn.core.io.SVNRepositoryFactory;
import org.tmatesoft.svn.core.wc.SVNWCUtil;

import com.fzj.svn.util.IniReader;

public class SvnBo {
	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
	public SvnBo() {
		
	}
	private static void setupLibrary() {
		DAVRepositoryFactory.setup();
		SVNRepositoryFactoryImpl.setup();
		FSRepositoryFactory.setup();
	}
	
	/**
	 * 查询svn提交的最近100条日志记录
	 * 
	 * @return
	 */
	public String getSvnHistoryInfo() {
		Logger log = LoggerFactory.getLogger(SvnBo.class);
		IniReader ini = null;
		String url = null;
		String name = null;
		String password = null;
		long startRevision = 0;
		long endRevision = 0;
		SVNRepository repository = null;
		ISVNAuthenticationManager authManager = null;
		LinkedList<SVNLogEntry> logEntries = null;
		JSONArray svnHistoryJSONArr = null;
		JSONObject svnHistoryJSONObj = null;
		JSONArray svnHistoryPathJSONArr = null;
		JSONObject svnHistoryPathJSONObj = null;
		SVNLogEntry logEntry = null;
		SVNLogEntryPath entryPath = null;
		try {
			ini = new IniReader();
			
			url = ini.getIniValue("svn_addr");
			name = ini.getIniValue("username");
			password = ini.getIniValue("password");
			url = new String(url.getBytes("ISO-8859-1"), "gbk");
			
			setupLibrary();
			
			repository = SVNRepositoryFactory.create(SVNURL
					.parseURIEncoded(url));
			
			authManager = SVNWCUtil.createDefaultAuthenticationManager(name, password.toCharArray());
	        repository.setAuthenticationManager(authManager);
	        //最近的一百条记录
			endRevision = repository.getLatestRevision();
			startRevision = endRevision - 100;
			
			logEntries = (LinkedList<SVNLogEntry>) repository.log(new String[] { "" }, null,
					startRevision, endRevision, true, true);
			Collections.reverse(logEntries);
			
			svnHistoryJSONArr = new JSONArray();
			
			for (Iterator entries = logEntries.iterator(); entries.hasNext();) {
				svnHistoryJSONObj = new JSONObject();
				logEntry = (SVNLogEntry) entries.next();
				log.debug("revision: " + logEntry.getRevision());
				log.debug("author: " + logEntry.getAuthor());
				log.debug("date: " + sdf.format(logEntry.getDate()));
				log.debug("log message: " + logEntry.getMessage());
				svnHistoryJSONObj.put("revision", logEntry.getRevision());
				svnHistoryJSONObj.put("author", logEntry.getAuthor());
				svnHistoryJSONObj.put("date", sdf.format(logEntry.getDate()));
				svnHistoryJSONObj.put("log_message", logEntry.getMessage());
		        if (logEntry.getChangedPaths().size() > 0) {
		                log.debug("changed paths:");
		                Set changedPathsSet = logEntry.getChangedPaths().keySet();
		                svnHistoryPathJSONArr = new JSONArray();
		                for (Iterator changedPaths = changedPathsSet.iterator(); changedPaths.hasNext();) {
		                	svnHistoryPathJSONObj = new JSONObject();
		                	entryPath = (SVNLogEntryPath) logEntry.getChangedPaths().get(changedPaths.next());
		                    log.debug(" "
		                            + entryPath.getType()
		                            + "	"
		                            + entryPath.getPath()
		                            + ((entryPath.getCopyPath() != null) ? " (from "
		                                    + entryPath.getCopyPath() + " revision "
		                                    + entryPath.getCopyRevision() + ")" : ""));
		                    svnHistoryPathJSONObj.put("action", entryPath.getType());
		                    svnHistoryPathJSONObj.put("path", entryPath.getPath());
		                    svnHistoryPathJSONObj.put("copy_path", entryPath.getCopyPath()==null?"":entryPath.getCopyPath());
		                    svnHistoryPathJSONObj.put("revision", entryPath.getCopyRevision());
		                    svnHistoryPathJSONArr.add(svnHistoryPathJSONObj);
		                    svnHistoryPathJSONObj = null;
		                }
		                svnHistoryJSONObj.put("changed_paths", svnHistoryPathJSONArr.toString());
		            	svnHistoryJSONArr.add(svnHistoryJSONObj);
		            }else{
		            	svnHistoryJSONObj.put("changed_paths","");
			            svnHistoryJSONArr.add(svnHistoryJSONObj);
		            }
		        svnHistoryJSONObj = null;
			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		} catch (SVNException e) {
			e.printStackTrace();
			return null;
		}
		return svnHistoryJSONArr.toString();
	}

	/**
	 * 导出编译文件
	 * @param data
	 * @return
	 */
	public String exportSvnHistoryInfo(String data){
		Logger log = LoggerFactory.getLogger(SvnBo.class);
		log.debug("执行方法为：public String exportSvnHistoryInfo(String data)");
		JSONArray svnHistoryDetailsInfoJsonArr = null;
		JSONObject svnHistoryDetailsInfoJsonObj = null;
		String path = null;
		IniReader ini = null;
		String project_path = null;
		String export_path = null;
		String is_dir =  null;
		String rep_dir = null;
		String update_dir = null;
		
		Calendar c = Calendar.getInstance();
		File outputDir = null;
		File output = null;
		File input = null;
		String filename = null;
		String dir = null;
		
		StringBuffer sb = new StringBuffer();
		try{
			ini = new IniReader();
			project_path = ini.getIniValue("project_path");
			export_path = ini.getIniValue("export_path");
			is_dir = ini.getIniValue("is_dir");
			rep_dir = ini.getIniValue("rep_dir");
			update_dir = ini.getIniValue("update_dir");
			export_path = new String(export_path.getBytes("ISO-8859-1"), "gbk");
			svnHistoryDetailsInfoJsonArr = JSONArray.fromObject(data);
			sb.append("生产地址文件替换目录：").append("\r\n")
			   .append(rep_dir).append("\r\n");
			for(int i=0;i<svnHistoryDetailsInfoJsonArr.size();i++){
				svnHistoryDetailsInfoJsonObj = svnHistoryDetailsInfoJsonArr.getJSONObject(i);
				path = svnHistoryDetailsInfoJsonObj.getString("path").replaceFirst("/", "").replaceFirst("/","");
				path = path.substring(path.indexOf("/"));
				filename = path.substring(path.lastIndexOf("/")+1);
				dir = path.substring(0, path.lastIndexOf("/"));
				if("Y".equals(is_dir)){
					if(path.indexOf("src")>-1){
						if(filename.endsWith(".java")){
							input = new File(project_path+"/"+dir.replace("src","WebRoot/WEB-INF/classes"));
							final String listFile = filename; 
							String[] filenames = input.list(new FilenameFilter() {
								public boolean accept(File dir, String name) {
									if(name.contains("$")){
										return name.substring(0,name.indexOf("$")).equals(listFile.substring(0,listFile.indexOf(".")));
									}
									return name.equals(listFile.replace("java", "class"));
								}
							});
							
							outputDir = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis()+"/"+dir.replace("src","WEB-INF/classes"));
							if(!outputDir.exists()) outputDir.mkdirs();
							for(String name :filenames){
								input = new File(project_path+"/"+dir.replace("src","WebRoot/WEB-INF/classes")+"/"+name);
								output = new File(outputDir.getAbsolutePath()+"/"+name);
								if(input.isDirectory()||output.isDirectory())continue;
								copy(input,output,log);	
								sb.append("\r\ncd "+rep_dir+dir.replace("src","WEB-INF/classes")+" \r\n")
								   .append("cp -p "+name+" "+name+update_dir.substring(update_dir.lastIndexOf("/")+1)+"\r\n")
								   .append("cp "+update_dir+"/"+name+" .\r\n")
								   .append("ls -lrt "+name+"*\r\n");
							}
							
						}else{
							input = new File(project_path+"/"+dir.replace("src","WebRoot/WEB-INF/classes")+"/"+filename);
							outputDir = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis()+"/"+dir.replace("src","WEB-INF/classes"));
							if(!outputDir.exists()) outputDir.mkdirs();
							output = new File(outputDir.getAbsolutePath()+"/"+filename);
							if(input.isDirectory()||output.isDirectory())continue;
							copy(input,output,log);
							sb.append("\r\ncd "+rep_dir+dir.replace("src","WEB-INF/classes")+" \r\n")
							   .append("cp -p "+filename+" "+filename+update_dir.substring(update_dir.lastIndexOf("/")+1)+"\r\n")
							   .append("cp "+update_dir+"/"+filename+" .\r\n")
							   .append("ls -lrt "+filename+"*\r\n");
						}
						
					}else{
						input = new File(project_path+"/"+dir+"/"+filename);
						outputDir = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis()+"/"+dir.replace("WebRoot",""));
						if(!outputDir.exists()) outputDir.mkdirs();
						output = new File(outputDir.getAbsolutePath()+"/"+filename);
						if(input.isDirectory()||output.isDirectory())continue;
						copy(input,output,log);
						sb.append("\r\ncd "+rep_dir+dir.replace("/WebRoot","")+" \r\n")
						   .append("cp -p "+filename+" "+filename+update_dir.substring(update_dir.lastIndexOf("/")+1)+"\r\n")
						   .append("cp "+update_dir+"/"+filename+" .\r\n")
						   .append("ls -lrt "+filename+"*\r\n");
					}
				}else{
					if(path.indexOf("src")>-1){
						if(filename.endsWith(".java")){
							input = new File(project_path+"/"+dir.replace("src","WebRoot/WEB-INF/classes"));
							final String listFile = filename; 
							String[] filenames = input.list(new FilenameFilter() {
								public boolean accept(File dir, String name) {
									if(name.contains("$")){
										return name.substring(0,name.indexOf("$")).equals(listFile.substring(0,listFile.indexOf(".")));
									}
									return name.equals(listFile.replace("java", "class"));
								}
							});
							
							outputDir = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis()+"/"+dir.replace("src","WEB-INF/classes"));
							if(!outputDir.exists()) outputDir.mkdirs();
							for(String name :filenames){
								input = new File(project_path+"/"+dir.replace("src","WebRoot/WEB-INF/classes")+"/"+name);
								output = new File(outputDir.getAbsolutePath()+"/"+name);
								if(input.isDirectory()||output.isDirectory())continue;
								copy(input,output,log);	
								sb.append("\r\ncd "+rep_dir+dir.replace("src","WEB-INF/classes")+" \r\n")
								   .append("cp -p "+name+" "+name+update_dir.substring(update_dir.lastIndexOf("/")+1)+"\r\n")
								   .append("cp "+update_dir+"/"+name+" .\r\n")
								   .append("ls -lrt "+name+"*\r\n");
							}
						}else{
							input = new File(project_path+"/"+dir.replace("src","WebRoot/WEB-INF/classes")+"/"+filename);
							outputDir = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis());
							if(!outputDir.exists()) outputDir.mkdirs();
							output = new File(outputDir.getAbsolutePath()+"/"+filename);
							if(input.isDirectory()||output.isDirectory())continue;
							copy(input,output,log);
							sb.append("\r\ncd "+rep_dir+dir.replace("src","WEB-INF/classes")+" \r\n")
							   .append("cp -p "+filename+" "+filename+update_dir.substring(update_dir.lastIndexOf("/")+1)+"\r\n")
							   .append("cp "+update_dir+"/"+filename+" .\r\n")
							   .append("ls -lrt "+filename+"*\r\n");
						}
					}else{
						input = new File(project_path+"/"+dir+"/"+filename);
						outputDir = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis());
						if(!outputDir.exists()) outputDir.mkdirs();
						output = new File(outputDir.getAbsolutePath()+"/"+filename);
						if(input.isDirectory()||output.isDirectory())continue;
						copy(input,output,log);
						sb.append("\r\ncd "+rep_dir+dir.replace("/WebRoot","")+" \r\n")
						   .append("cp -p "+filename+" "+filename+update_dir.substring(update_dir.lastIndexOf("/")+1)+"\r\n")
						   .append("cp "+update_dir+"/"+filename+" .\r\n")
						   .append("ls -lrt "+filename+"*\r\n");
					}
				}
			}
			output = new File(export_path+"/"+sdf.format(c.getTime())+"/"+c.getTimeInMillis()+"/生产备份说明.txt");
			write(output,sb.toString());
		}catch (Exception e) {
			e.printStackTrace();
		}finally{
			svnHistoryDetailsInfoJsonArr = null;
			svnHistoryDetailsInfoJsonObj = null;
			path = null;
			ini = null;
			project_path = null;
			export_path = null;
			is_dir =  null;
			c = null;
			outputDir = null;
			input = null;
			filename = null;
			dir = null;
		}
		return null;
	}
	
	public void copy(File input,File output,Logger log) throws Exception{
		log.debug("读取文件路径："+input.getAbsolutePath());
		log.debug("写入文件路径："+output.getAbsolutePath());
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		byte[] buf = new byte[1024];
		try {
			bis = new BufferedInputStream((new FileInputStream(input)));
			bos = new BufferedOutputStream((new FileOutputStream(output,true)));
			int len = 0;
			while((len=bis.read(buf))!=-1){
				bos.write(buf,0,len);
			}
			bos.flush();
			bos.close();
			bis.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}finally{
			buf = null;
			try {
				if(bos !=null)bos.close();
				if(bis!=null)bis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void copy(File input,File output) throws Exception{
		Logger log = LoggerFactory.getLogger(this.getClass());
		log.debug("读取文件路径："+input.getAbsolutePath());
		log.debug("写入文件路径："+output.getAbsolutePath());
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		byte[] buf = new byte[1024];
		try {
			bis = new BufferedInputStream((new FileInputStream(input)));
			bos = new BufferedOutputStream((new FileOutputStream(output,true)));
			int len = 0;
			while((len=bis.read(buf))!=-1){
				bos.write(buf,0,len);
			}
			bos.flush();
			bos.close();
			bis.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}finally{
			buf = null;
			try {
				if(bos !=null)bos.close();
				if(bis!=null)bis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public void write(File output,String str) throws Exception{
		BufferedWriter bw = null;
		try {
			bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(output,true)));
			bw.write(str);
			bw.flush();
			bw.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new Exception(e.getMessage());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}finally{
			try {
				if(bw !=null)bw.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
}
