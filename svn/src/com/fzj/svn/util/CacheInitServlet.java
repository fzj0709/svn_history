package com.fzj.svn.util;


import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;


public class CacheInitServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5005230202791884211L;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		try {
			CacheManager cm = CacheManager.getInstance();
			cm.refreshAll();//加载参数表信息
			System.out.println("加载缓存信息成功");
		} catch(Exception e) {
			System.out.println("--------------加载缓存失败-------------");
		}finally {
			
		}
	}

}
