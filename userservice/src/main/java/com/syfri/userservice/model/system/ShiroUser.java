package com.syfri.userservice.model.system;

import com.syfri.userservice.model.system.OrganizationVO;
import com.syfri.userservice.model.system.ResourceTree;

import java.io.Serializable;
import java.util.List;

/**
 * 自定义Shiro用户
 */
public class ShiroUser implements Serializable{

	private static final long serialVersionUID = 1L;

	/*用户id.*/
	private String userid;

	/*username.*/
	private String username;

	/*realname.*/
	private String realName;

	/*角色.*/
	private List<String> roles;

	/*权限.*/
	private List<String> permissions;

	/*菜单树.*/
	private List<ResourceTree> resourceTrees;

	/*组织机构*/
	private OrganizationVO organizationVO;

	/*统一社会信用代码*/
	private String unscid;

	/*用户类型*/
	private String deptid;

	public ShiroUser() {
	}

	public ShiroUser(String userid, String username, String realName) {
		this.userid = userid;
		this.username = username;
		this.realName = realName;
	}

	public ShiroUser(String userid, String username, String realName, String deptid) {
		this.userid = userid;
		this.username = username;
		this.realName = realName;
		this.deptid = deptid;
	}

	public OrganizationVO getOrganizationVO() {
		return organizationVO;
	}

	public void setOrganizationVO(OrganizationVO organizationVO) {
		this.organizationVO = organizationVO;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public List<String> getPermissions() {
		return permissions;
	}

	public void setPermissions(List<String> permissions) {
		this.permissions = permissions;
	}

	public List<ResourceTree> getResourceTrees() {
		return resourceTrees;
	}

	public void setResourceTrees(List<ResourceTree> resourceTrees) {
		this.resourceTrees = resourceTrees;
	}

	public String getUnscid() {
		return unscid;
	}

	public void setUnscid(String unscid) {
		this.unscid = unscid;
	}

	public String getDeptid() {
		return deptid;
	}

	public void setDeptid(String deptid) {
		this.deptid = deptid;
	}
}
