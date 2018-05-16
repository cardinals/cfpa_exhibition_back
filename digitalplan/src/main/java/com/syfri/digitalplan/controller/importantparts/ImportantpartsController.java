package com.syfri.digitalplan.controller.importantparts;

import com.syfri.baseapi.model.ResultVO;
import com.syfri.baseapi.utils.EConstants;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.syfri.digitalplan.model.importantparts.ImportantpartsVO;
import com.syfri.digitalplan.service.importantparts.ImportantpartsService;
import com.syfri.baseapi.controller.BaseController;

@RestController
@RequestMapping("importantparts")
public class ImportantpartsController  extends BaseController<ImportantpartsVO>{

	@Autowired
	private ImportantpartsService importantpartsService;

	@Override
	public ImportantpartsService getBaseService() {
		return this.importantpartsService;
	}

	@ApiOperation(value="根据重点单位id获取建筑类重点部位详情集合",notes="列表信息")
	@ApiImplicitParam(name="zddwId",value="重点单位id")
	@GetMapping("/doFindJzlListByZddwId/{zddwId}")
	public @ResponseBody ResultVO doFindJzlListByZddwId(@PathVariable String zddwId){
		ResultVO resultVO = ResultVO.build();
		try{
			resultVO.setResult(importantpartsService.doFindJzlListByZddwId(zddwId));
		}catch(Exception e){
			logger.error("{}",e.getMessage());
			resultVO.setCode(EConstants.CODE.FAILURE);
		}
		return resultVO;
	}

	@ApiOperation(value="根据重点单位id获取装置类重点部位详情集合",notes="列表信息")
	@ApiImplicitParam(name="zddwId",value="重点单位id")
	@GetMapping("/doFindZzlListByZddwId/{zddwId}")
	public @ResponseBody ResultVO doFindZzlListByZddwId(@PathVariable String zddwId){
		ResultVO resultVO = ResultVO.build();
		try{
			resultVO.setResult(importantpartsService.doFindZzlListByZddwId(zddwId));
		}catch(Exception e){
			logger.error("{}",e.getMessage());
			resultVO.setCode(EConstants.CODE.FAILURE);
		}
		return resultVO;
	}

	@ApiOperation(value="根据重点单位id获取储罐类重点部位详情集合",notes="列表信息")
	@ApiImplicitParam(name="zddwId",value="重点单位id")
	@GetMapping("/doFindCglListByZddwId/{zddwId}")
	public @ResponseBody ResultVO doFindCglListByZddwId(@PathVariable String zddwId){
		ResultVO resultVO = ResultVO.build();
		try{
			resultVO.setResult(importantpartsService.doFindCglListByZddwId(zddwId));
		}catch(Exception e){
			logger.error("{}",e.getMessage());
			resultVO.setCode(EConstants.CODE.FAILURE);
		}
		return resultVO;
	}

}
