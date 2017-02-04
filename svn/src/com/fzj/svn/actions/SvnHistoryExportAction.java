package com.fzj.svn.actions;


import java.io.IOException;

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

public class SvnHistoryExportAction extends Action {

	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		ActionErrors errors = new ActionErrors();
		SvnBo bo = new SvnBo();
		String svnHistoryDetailsInfoData = request.getParameter("svnHistoryDetailsInfoData");
		try {
			bo.exportSvnHistoryInfo(svnHistoryDetailsInfoData);
		}catch (Exception e) {
			ActionError error = new ActionError(e.getMessage());
			errors.add(ActionErrors.GLOBAL_ERROR,error);
			error = null;
			e.printStackTrace();
		} finally {
			errors = null;
		}
		return mapping.findForward("success");
	}
}

