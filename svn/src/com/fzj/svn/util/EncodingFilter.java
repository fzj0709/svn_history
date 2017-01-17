package com.fzj.svn.util;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/**
 * 
 * 
 * 功能描述：字符编码过滤器
 * @author dhcc chenzhoujin
 * @date Aug 29, 2008
 * @see
 * @修改日志：
 *
 */
public class EncodingFilter implements Filter {
	protected String encoding;
	protected FilterConfig filterConfig;

	public EncodingFilter() {
		encoding = null;
		filterConfig = null;
	}

	public void destroy() {
		encoding = null;
		filterConfig = null;
	}

	public void doFilter(ServletRequest servletrequest,
			ServletResponse servletresponse, FilterChain filterchain)
			throws IOException, ServletException {
		servletrequest.setCharacterEncoding(encoding); 
		servletresponse.setContentType("text/html;charset="+encoding);
		filterchain.doFilter(servletrequest, servletresponse);
	}

	public void init(FilterConfig filterconfig) throws ServletException {
		filterConfig = filterconfig;
		encoding = filterconfig.getInitParameter("encoding");
	}

	protected String selectEncoding(ServletRequest servletrequest) {
		return encoding;
	}
	
}