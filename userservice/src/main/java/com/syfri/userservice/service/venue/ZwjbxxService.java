package com.syfri.userservice.service.venue;

import com.github.pagehelper.PageInfo;
import com.syfri.baseapi.service.BaseService;
import com.syfri.userservice.model.venue.ZwjbxxVO;
import org.apache.poi.hssf.record.formula.functions.T;

public interface ZwjbxxService  extends BaseService<ZwjbxxVO>{
    public PageInfo<ZwjbxxVO> doSearchQyPage(ZwjbxxVO vo);
}