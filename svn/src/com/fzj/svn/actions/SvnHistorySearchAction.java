package com.fzj.svn.actions;


import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionError;
import org.apache.struts.action.ActionErrors;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fzj.svn.bo.SvnBo;

public class SvnHistorySearchAction extends Action {

	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		Logger log = LoggerFactory.getLogger(SvnHistorySearchAction.class);
		log.debug("进入Action执行:" + this.getClass().getName());
		ActionErrors errors = new ActionErrors();
		PrintWriter out = response.getWriter();
		SvnBo bo = new SvnBo();
		String msg = null;
		try {
			msg = bo.getSvnHistoryInfo();
		}catch (Exception e) {
			ActionError error = new ActionError(e.getMessage());
			errors.add(ActionErrors.GLOBAL_ERROR,error);
			error = null;
			e.printStackTrace();
		} finally {
			out.println(msg);
			out.flush();
			out.close();
			log.debug("清空日志线程池!");
			log = null;
			errors = null;
		}
		return null;
	}
}

