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
			cm.refreshAll();//���ز�������Ϣ
			System.out.println("���ػ�����Ϣ�ɹ�");
		} catch(Exception e) {
			System.out.println("--------------���ػ���ʧ��-------------");
		}finally {
			
		}
	}

}
