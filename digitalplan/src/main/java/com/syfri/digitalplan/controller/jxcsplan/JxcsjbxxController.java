package com.syfri.digitalplan.controller.jxcsplan;

import com.syfri.baseapi.model.ResultVO;
import com.syfri.baseapi.utils.EConstants;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.syfri.digitalplan.model.jxcsplan.JxcsjbxxVO;
import com.syfri.digitalplan.service.jxcsplan.JxcsjbxxService;
import com.syfri.baseapi.controller.BaseController;

import java.util.List;

@RestController
@RequestMapping("jxcsjbxx")
public class JxcsjbxxController  extends BaseController<JxcsjbxxVO>{

	@Autowired
	private JxcsjbxxService jxcsjbxxService;

	@Override
	public JxcsjbxxService getBaseService() {
		return this.jxcsjbxxService;
	}

	@ApiOperation(value="根据vo更新",notes="删除")
	@ApiImplicitParam(name="vo",value="九小场所")
	@PostMapping("/doDeleteByVOList")
	public @ResponseBody
	ResultVO doDeleteByVOList(@RequestBody List<JxcsjbxxVO> jxcsjbxxVOList){
		ResultVO resultVO = ResultVO.build();
		try{
			resultVO.setResult(jxcsjbxxService.doDeleteByVOList(jxcsjbxxVOList));
		}catch(Exception e){
			logger.error("{}",e.getMessage());
			resultVO.setCode(EConstants.CODE.FAILURE);
		}
		return resultVO;
	}

}