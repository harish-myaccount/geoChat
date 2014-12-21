package com.geoc.app.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.geoc.app.model.ConnectedUser;
import com.geoc.app.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService usrsevice;
	
	@RequestMapping(value="/nearby",method = RequestMethod.POST )
	@ResponseBody
	public GeoResults<ConnectedUser> getUsers(HttpServletRequest request,@RequestBody ConnectedUser user){
		String unique = request.getHeader("X-FORWARDED-FOR");
		if(unique==null){
			unique = request.getRemoteAddr();
		}
		user.setIpRoute(unique);
		user.setIsChatting(false);
		user.setLocation(new Point(user.getCoOrd().get("longitude"), user.getCoOrd().get("latitude")));
		usrsevice.saveUser(user);
		return usrsevice.getUsersNearBy(user);
	}
	

}
