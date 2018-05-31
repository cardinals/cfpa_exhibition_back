package com.syfri.userservice.service;

import com.syfri.baseapi.service.BaseService;
import com.syfri.userservice.model.ImgUploadVO;

import java.util.List;

public interface ImgUploadService extends BaseService<ImgUploadVO>{
    /**
     * @Description: 获取所有图片类型
     * @Param: []
     * @Return: java.util.List<com.syfri.userservice.model.ImgUploadVO>
     * @Author: dongbo
     * @Modified By:
     * @Date: 2018/5/17 11:04
     */
    List<ImgUploadVO> doFindAll();

    /**
     * @Description: 查询图片名称是否已存在
     * @Param: [vo]
     * @Return: java.util.List<com.syfri.userservice.model.ImgUploadVO>
     * @Author: dongbo
     * @Modified By:
     * @Date: 2018/5/21 10:27
     */
    List<ImgUploadVO> doSearchListByPicName(ImgUploadVO vo);

    /**
     * @Description: 查询已存的图片类型
     * @Param: [vo]
     * @Return: java.util.List<com.syfri.userservice.model.ImgUploadVO>
     * @Author: dongbo
     * @Modified By:
     * @Date: 2018/5/28 11:03
     */
    List<ImgUploadVO> doSearchSavedListByVO();

    /**
     * @Description: 查询手动输入的类型是否存在
     * @Param: [vo]
     * @Return: java.util.List<com.syfri.userservice.model.ImgUploadVO>
     * @Author: dongbo
     * @Modified By:
     * @Date: 2018/5/31 15:43
     */
    List<ImgUploadVO> doSearchListByInputPicType(ImgUploadVO vo);
}